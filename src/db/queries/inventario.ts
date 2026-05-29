import { getDatabase } from '../database';
import {
  EntradaInventario,
  ProcesamientoInventario,
  BalanceInventario,
} from '@/types/inventario';

export async function registrarEntrada(
  jornadaId: number,
  numGavetas: number,
  pesoTotalKg: number,
  proveedor?: string,
  notas?: string
): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO entradas_inventario (jornada_id, num_gavetas, peso_total_kg, proveedor, notas) VALUES (?, ?, ?, ?, ?)',
    jornadaId, numGavetas, pesoTotalKg, proveedor ?? null, notas ?? null
  );
  return result.lastInsertRowId;
}

export async function registrarProcesamiento(
  jornadaId: number,
  datos: {
    entrada_id?: number;
    pechuga_kg: number;
    filete_kg: number;
    menudencia_unidades: number;
    recortes_kg: number;
    recortes_unidades: number;
    pollo_entero_kg: number;
  }
): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO procesamiento_inventario
      (jornada_id, entrada_id, pechuga_kg, filete_kg, menudencia_unidades, recortes_kg, recortes_unidades, pollo_entero_kg)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    jornadaId,
    datos.entrada_id ?? null,
    datos.pechuga_kg,
    datos.filete_kg,
    datos.menudencia_unidades,
    datos.recortes_kg,
    datos.recortes_unidades,
    datos.pollo_entero_kg
  );
  return result.lastInsertRowId;
}

export async function getEntradasJornada(jornadaId: number): Promise<EntradaInventario[]> {
  const db = await getDatabase();
  return db.getAllAsync<EntradaInventario>(
    'SELECT * FROM entradas_inventario WHERE jornada_id = ? ORDER BY hora DESC',
    jornadaId
  );
}

export async function getProcesamiento(jornadaId: number): Promise<ProcesamientoInventario | null> {
  const db = await getDatabase();
  const p = await db.getFirstAsync<ProcesamientoInventario>(
    'SELECT * FROM procesamiento_inventario WHERE jornada_id = ? ORDER BY registrado_en DESC LIMIT 1',
    jornadaId
  );
  return p ?? null;
}

export async function getBalanceInventario(jornadaId: number): Promise<BalanceInventario> {
  const db = await getDatabase();

  const entradas = await db.getFirstAsync<{ peso_total: number }>(
    'SELECT COALESCE(SUM(peso_total_kg), 0) as peso_total FROM entradas_inventario WHERE jornada_id = ?',
    jornadaId
  );

  const proc = await db.getFirstAsync<{
    pechuga: number; filete: number; menudencia: number; recortes: number; pollo_entero: number;
  }>(
    `SELECT
      COALESCE(SUM(pechuga_kg), 0) as pechuga,
      COALESCE(SUM(filete_kg), 0) as filete,
      COALESCE(SUM(menudencia_unidades), 0) as menudencia,
      COALESCE(SUM(recortes_kg), 0) as recortes,
      COALESCE(SUM(pollo_entero_kg), 0) as pollo_entero
    FROM procesamiento_inventario WHERE jornada_id = ?`,
    jornadaId
  );

  const desp = await db.getFirstAsync<{
    pechuga: number; filete: number; menudencia: number; recortes: number; pollo_entero: number;
  }>(
    `SELECT
      COALESCE(SUM(CASE WHEN tipo_producto='pechuga' THEN cantidad ELSE 0 END), 0) as pechuga,
      COALESCE(SUM(CASE WHEN tipo_producto='filete' THEN cantidad ELSE 0 END), 0) as filete,
      COALESCE(SUM(CASE WHEN tipo_producto='menudencia' THEN cantidad ELSE 0 END), 0) as menudencia,
      COALESCE(SUM(CASE WHEN tipo_producto='recortes' THEN cantidad ELSE 0 END), 0) as recortes,
      COALESCE(SUM(CASE WHEN tipo_producto='pollo_entero' THEN cantidad ELSE 0 END), 0) as pollo_entero
    FROM despachos WHERE jornada_id = ?`,
    jornadaId
  );

  const devoluciones = await db.getFirstAsync<{
    pechuga: number; filete: number; menudencia: number; recortes: number; pollo_entero: number;
  }>(
    `SELECT
      COALESCE(SUM(CASE WHEN d.tipo_producto='pechuga' THEN dev.cantidad ELSE 0 END), 0) as pechuga,
      COALESCE(SUM(CASE WHEN d.tipo_producto='filete' THEN dev.cantidad ELSE 0 END), 0) as filete,
      COALESCE(SUM(CASE WHEN d.tipo_producto='menudencia' THEN dev.cantidad ELSE 0 END), 0) as menudencia,
      COALESCE(SUM(CASE WHEN d.tipo_producto='recortes' THEN dev.cantidad ELSE 0 END), 0) as recortes,
      COALESCE(SUM(CASE WHEN d.tipo_producto='pollo_entero' THEN dev.cantidad ELSE 0 END), 0) as pollo_entero
    FROM devoluciones_despacho dev
    JOIN despachos d ON d.id = dev.despacho_id
    WHERE dev.jornada_id = ?`,
    jornadaId
  );

  const p = proc ?? { pechuga: 0, filete: 0, menudencia: 0, recortes: 0, pollo_entero: 0 };
  const d = desp ?? { pechuga: 0, filete: 0, menudencia: 0, recortes: 0, pollo_entero: 0 };
  const dev = devoluciones ?? { pechuga: 0, filete: 0, menudencia: 0, recortes: 0, pollo_entero: 0 };

  return {
    pechuga_disponible: p.pechuga - d.pechuga + dev.pechuga,
    filete_disponible: p.filete - d.filete + dev.filete,
    menudencia_disponible: p.menudencia - d.menudencia + dev.menudencia,
    recortes_disponible: p.recortes - d.recortes + dev.recortes,
    pollo_entero_disponible: p.pollo_entero - d.pollo_entero + dev.pollo_entero,
    peso_entrada_total: entradas?.peso_total ?? 0,
  };
}
