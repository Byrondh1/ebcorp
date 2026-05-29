import { getDatabase } from '../database';
import { PagoCredito, ResumenCredito } from '@/types/creditos';

export async function getClientesConDeuda(): Promise<ResumenCredito[]> {
  const db = await getDatabase();
  return db.getAllAsync<ResumenCredito>(
    `SELECT
      c.id as cliente_id,
      c.nombre as cliente_nombre,
      COALESCE(SUM(v.saldo_pendiente), 0) as saldo_total,
      MAX(v.registrada_en) as ultima_compra
     FROM clientes c
     JOIN ventas v ON v.cliente_id = c.id
     WHERE v.saldo_pendiente > 0 AND c.activo = 1
     GROUP BY c.id, c.nombre
     ORDER BY saldo_total DESC`
  );
}

export async function getSaldoCliente(clienteId: number): Promise<number> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ saldo: number }>(
    'SELECT COALESCE(SUM(saldo_pendiente), 0) as saldo FROM ventas WHERE cliente_id = ? AND saldo_pendiente > 0',
    clienteId
  );
  return row?.saldo ?? 0;
}

export async function registrarPago(data: {
  cliente_id: number;
  monto: number;
  metodo: 'efectivo' | 'transferencia';
  registrado_por: number;
  jornada_id: number;
  notas?: string;
}): Promise<void> {
  const db = await getDatabase();

  await db.withTransactionAsync(async () => {
    // Distribuir el pago contra las ventas pendientes (más antigua primero)
    const ventasPendientes = await db.getAllAsync<{ id: number; saldo_pendiente: number }>(
      "SELECT id, saldo_pendiente FROM ventas WHERE cliente_id = ? AND saldo_pendiente > 0 ORDER BY registrada_en ASC",
      data.cliente_id
    );

    let montoRestante = data.monto;
    for (const venta of ventasPendientes) {
      if (montoRestante <= 0) break;
      const pagar = Math.min(montoRestante, venta.saldo_pendiente);
      const nuevoSaldo = venta.saldo_pendiente - pagar;
      const nuevoEstado = nuevoSaldo <= 0 ? 'pagada' : 'parcial';
      await db.runAsync(
        'UPDATE ventas SET saldo_pendiente=?, monto_pagado=monto_pagado+?, estado=? WHERE id=?',
        nuevoSaldo, pagar, nuevoEstado, venta.id
      );
      montoRestante -= pagar;
    }

    await db.runAsync(
      `INSERT INTO pagos_credito (cliente_id, monto, metodo, registrado_por, jornada_id, notas)
       VALUES (?, ?, ?, ?, ?, ?)`,
      data.cliente_id, data.monto, data.metodo, data.registrado_por,
      data.jornada_id, data.notas ?? null
    );

    await db.runAsync(
      `INSERT INTO caja_movimientos
        (jornada_id, tipo, metodo, monto, concepto, referencia_tipo, registrado_por)
       VALUES (?, 'ingreso', ?, ?, ?, 'pago_credito', ?)`,
      data.jornada_id, data.metodo, data.monto,
      `Abono crédito cliente #${data.cliente_id}`, data.registrado_por
    );
  });
}

export async function getHistorialPagos(clienteId: number): Promise<PagoCredito[]> {
  const db = await getDatabase();
  return db.getAllAsync<PagoCredito>(
    'SELECT * FROM pagos_credito WHERE cliente_id = ? ORDER BY registrado_en DESC',
    clienteId
  );
}
