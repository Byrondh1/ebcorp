import { getDatabase } from '../database';
import { Venta, VentaItem, NuevaVentaInput } from '@/types/ventas';

export async function registrarVenta(input: NuevaVentaInput): Promise<number> {
  const db = await getDatabase();
  const subtotal = input.items.reduce((s, i) => s + i.subtotal, 0);
  const saldo = subtotal - input.monto_pagado;
  const estado = saldo <= 0 ? 'pagada' : input.monto_pagado > 0 ? 'parcial' : 'credito';

  let ventaId = 0;
  await db.withTransactionAsync(async () => {
    const result = await db.runAsync(
      `INSERT INTO ventas
        (jornada_id, cliente_id, vendedor_id, metodo_pago, subtotal, monto_pagado, saldo_pendiente, estado, notas)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      input.jornada_id, input.cliente_id, input.vendedor_id,
      input.metodo_pago, subtotal, input.monto_pagado, Math.max(0, saldo),
      estado, input.notas ?? null
    );
    ventaId = result.lastInsertRowId;

    for (const item of input.items) {
      await db.runAsync(
        `INSERT INTO venta_items (venta_id, tipo_producto, cantidad, unidad, precio_unitario, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        ventaId, item.tipo_producto, item.cantidad, item.unidad,
        item.precio_unitario, item.subtotal
      );
    }

    if (input.monto_pagado > 0 && input.metodo_pago !== 'credito') {
      await db.runAsync(
        `INSERT INTO caja_movimientos
          (jornada_id, tipo, metodo, monto, concepto, referencia_id, referencia_tipo, registrado_por)
         VALUES (?, 'ingreso', ?, ?, ?, ?, 'venta', ?)`,
        input.jornada_id, input.metodo_pago, input.monto_pagado,
        `Venta cliente #${input.cliente_id}`, ventaId, input.vendedor_id
      );
    }
  });

  return ventaId;
}

export async function getVentasDia(jornadaId: number): Promise<Venta[]> {
  const db = await getDatabase();
  return db.getAllAsync<Venta>(
    `SELECT v.*, c.nombre as cliente_nombre
     FROM ventas v
     JOIN clientes c ON c.id = v.cliente_id
     WHERE v.jornada_id = ?
     ORDER BY v.registrada_en DESC`,
    jornadaId
  );
}

export async function getVentasCliente(clienteId: number, limite = 20): Promise<Venta[]> {
  const db = await getDatabase();
  return db.getAllAsync<Venta>(
    `SELECT v.*, c.nombre as cliente_nombre
     FROM ventas v
     JOIN clientes c ON c.id = v.cliente_id
     WHERE v.cliente_id = ?
     ORDER BY v.registrada_en DESC
     LIMIT ?`,
    clienteId, limite
  );
}

export async function getItemsVenta(ventaId: number): Promise<VentaItem[]> {
  const db = await getDatabase();
  return db.getAllAsync<VentaItem>(
    'SELECT * FROM venta_items WHERE venta_id = ? ORDER BY id',
    ventaId
  );
}

export async function getResumenVentasDia(jornadaId: number): Promise<{
  total: number; efectivo: number; transferencia: number; credito: number;
}> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{
    total: number; efectivo: number; transferencia: number; credito: number;
  }>(
    `SELECT
      COALESCE(SUM(subtotal), 0) as total,
      COALESCE(SUM(CASE WHEN metodo_pago='efectivo' THEN monto_pagado ELSE 0 END), 0) as efectivo,
      COALESCE(SUM(CASE WHEN metodo_pago='transferencia' THEN monto_pagado ELSE 0 END), 0) as transferencia,
      COALESCE(SUM(saldo_pendiente), 0) as credito
     FROM ventas WHERE jornada_id = ?`,
    jornadaId
  );
  return row ?? { total: 0, efectivo: 0, transferencia: 0, credito: 0 };
}
