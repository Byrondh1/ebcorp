import { getDatabase } from '../database';
import { CajaMovimiento, TotalesCaja, CierreCaja } from '@/types/caja';

export async function registrarMovimiento(data: {
  jornada_id: number;
  tipo: 'ingreso' | 'egreso' | 'ajuste';
  metodo: 'efectivo' | 'transferencia';
  monto: number;
  concepto: string;
  referencia_id?: number;
  referencia_tipo?: string;
  registrado_por: number;
}): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO caja_movimientos
      (jornada_id, tipo, metodo, monto, concepto, referencia_id, referencia_tipo, registrado_por)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    data.jornada_id, data.tipo, data.metodo, data.monto, data.concepto,
    data.referencia_id ?? null, data.referencia_tipo ?? null, data.registrado_por
  );
  return result.lastInsertRowId;
}

export async function getTotalesCaja(jornadaId: number): Promise<TotalesCaja> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ efectivo: number; transferencia: number }>(
    `SELECT
      COALESCE(SUM(CASE WHEN metodo='efectivo' AND tipo='ingreso' THEN monto
                        WHEN metodo='efectivo' AND tipo='egreso' THEN -monto
                        WHEN metodo='efectivo' AND tipo='ajuste' THEN monto
                        ELSE 0 END), 0) as efectivo,
      COALESCE(SUM(CASE WHEN metodo='transferencia' AND tipo='ingreso' THEN monto
                        WHEN metodo='transferencia' AND tipo='egreso' THEN -monto
                        WHEN metodo='transferencia' AND tipo='ajuste' THEN monto
                        ELSE 0 END), 0) as transferencia
    FROM caja_movimientos WHERE jornada_id = ?`,
    jornadaId
  );
  const efectivo = row?.efectivo ?? 0;
  const transferencias = row?.transferencia ?? 0;
  return {
    efectivo_total: efectivo,
    transferencias_total: transferencias,
    total_general: efectivo + transferencias,
  };
}

export async function getMovimientosDia(jornadaId: number): Promise<CajaMovimiento[]> {
  const db = await getDatabase();
  return db.getAllAsync<CajaMovimiento>(
    'SELECT * FROM caja_movimientos WHERE jornada_id = ? ORDER BY registrado_en DESC',
    jornadaId
  );
}

export async function realizarCierre(data: {
  jornada_id: number;
  efectivo_esperado: number;
  efectivo_contado: number;
  transferencias_total: number;
  cerrado_por: number;
  notas?: string;
}): Promise<number> {
  const db = await getDatabase();
  const diferencia = data.efectivo_contado - data.efectivo_esperado;
  const result = await db.runAsync(
    `INSERT OR REPLACE INTO cierres_caja
      (jornada_id, efectivo_esperado, efectivo_contado, transferencias_total, diferencia, cerrado_por, notas)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    data.jornada_id, data.efectivo_esperado, data.efectivo_contado,
    data.transferencias_total, diferencia, data.cerrado_por, data.notas ?? null
  );
  return result.lastInsertRowId;
}

export async function getCierreCaja(jornadaId: number): Promise<CierreCaja | null> {
  const db = await getDatabase();
  const c = await db.getFirstAsync<CierreCaja>(
    'SELECT * FROM cierres_caja WHERE jornada_id = ?',
    jornadaId
  );
  return c ?? null;
}
