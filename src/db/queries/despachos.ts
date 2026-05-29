import { getDatabase } from '../database';
import { Despacho, DevolucionDespacho } from '@/types/despacho';
import { TipoProducto, UnidadProducto } from '@/constants/productos';

export async function crearDespacho(data: {
  jornada_id: number;
  vendedor_id: number;
  tipo_producto: TipoProducto;
  cantidad: number;
  unidad: UnidadProducto;
}): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO despachos (jornada_id, vendedor_id, tipo_producto, cantidad, unidad) VALUES (?, ?, ?, ?, ?)',
    data.jornada_id, data.vendedor_id, data.tipo_producto, data.cantidad, data.unidad
  );
  return result.lastInsertRowId;
}

export async function confirmarDespacho(despachoId: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    "UPDATE despachos SET confirmado=1, confirmado_en=datetime('now') WHERE id=?",
    despachoId
  );
}

export async function registrarDevolucion(data: {
  despacho_id: number;
  jornada_id: number;
  cantidad: number;
  motivo?: string;
}): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT INTO devoluciones_despacho (despacho_id, jornada_id, cantidad, motivo) VALUES (?, ?, ?, ?)',
    data.despacho_id, data.jornada_id, data.cantidad, data.motivo ?? null
  );
}

export async function getDespachosDia(jornadaId: number, vendedorId?: number): Promise<Despacho[]> {
  const db = await getDatabase();
  if (vendedorId) {
    return db.getAllAsync<Despacho>(
      `SELECT d.*, u.nombre as vendedor_nombre
       FROM despachos d
       JOIN usuarios u ON u.id = d.vendedor_id
       WHERE d.jornada_id = ? AND d.vendedor_id = ?
       ORDER BY d.creado_en DESC`,
      jornadaId, vendedorId
    );
  }
  return db.getAllAsync<Despacho>(
    `SELECT d.*, u.nombre as vendedor_nombre
     FROM despachos d
     JOIN usuarios u ON u.id = d.vendedor_id
     WHERE d.jornada_id = ?
     ORDER BY d.creado_en DESC`,
    jornadaId
  );
}

export async function getDespacho(id: number): Promise<Despacho | null> {
  const db = await getDatabase();
  const d = await db.getFirstAsync<Despacho>(
    `SELECT d.*, u.nombre as vendedor_nombre
     FROM despachos d
     JOIN usuarios u ON u.id = d.vendedor_id
     WHERE d.id = ?`,
    id
  );
  return d ?? null;
}

export async function getDevoluciones(despachoId: number): Promise<DevolucionDespacho[]> {
  const db = await getDatabase();
  return db.getAllAsync<DevolucionDespacho>(
    'SELECT * FROM devoluciones_despacho WHERE despacho_id = ? ORDER BY registrado_en DESC',
    despachoId
  );
}
