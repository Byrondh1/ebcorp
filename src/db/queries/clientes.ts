import { getDatabase } from '../database';
import { Cliente, PrecioCliente, ClienteConSaldo } from '@/types/clientes';
import { TipoProducto } from '@/constants/productos';

export async function crearCliente(data: {
  nombre: string;
  telefono?: string;
  direccion?: string;
  vendedor_id?: number;
  notas?: string;
}): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO clientes (nombre, telefono, direccion, vendedor_id, notas) VALUES (?, ?, ?, ?, ?)',
    data.nombre, data.telefono ?? null, data.direccion ?? null,
    data.vendedor_id ?? null, data.notas ?? null
  );
  return result.lastInsertRowId;
}

export async function getClientes(): Promise<ClienteConSaldo[]> {
  const db = await getDatabase();
  return db.getAllAsync<ClienteConSaldo>(
    `SELECT c.*,
      COALESCE((
        SELECT SUM(v.saldo_pendiente)
        FROM ventas v
        WHERE v.cliente_id = c.id AND v.saldo_pendiente > 0
      ), 0) as saldo_pendiente
     FROM clientes c
     WHERE c.activo = 1
     ORDER BY c.nombre`
  );
}

export async function getCliente(id: number): Promise<ClienteConSaldo | null> {
  const db = await getDatabase();
  const c = await db.getFirstAsync<ClienteConSaldo>(
    `SELECT c.*,
      COALESCE((
        SELECT SUM(v.saldo_pendiente)
        FROM ventas v
        WHERE v.cliente_id = c.id AND v.saldo_pendiente > 0
      ), 0) as saldo_pendiente
     FROM clientes c WHERE c.id = ?`,
    id
  );
  return c ?? null;
}

export async function actualizarCliente(
  id: number,
  data: { nombre: string; telefono?: string; direccion?: string; notas?: string }
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE clientes SET nombre=?, telefono=?, direccion=?, notas=? WHERE id=?',
    data.nombre, data.telefono ?? null, data.direccion ?? null, data.notas ?? null, id
  );
}

export async function getPreciosCliente(clienteId: number): Promise<PrecioCliente[]> {
  const db = await getDatabase();
  return db.getAllAsync<PrecioCliente>(
    'SELECT * FROM precios_cliente WHERE cliente_id = ? ORDER BY tipo_producto',
    clienteId
  );
}

export async function upsertPrecioCliente(
  clienteId: number,
  tipoProducto: TipoProducto,
  precioKg: number
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO precios_cliente (cliente_id, tipo_producto, precio_kg)
     VALUES (?, ?, ?)
     ON CONFLICT(cliente_id, tipo_producto) DO UPDATE SET precio_kg=excluded.precio_kg, vigente_desde=date('now')`,
    clienteId, tipoProducto, precioKg
  );
}

export async function getPrecioProducto(
  clienteId: number,
  tipoProducto: TipoProducto
): Promise<number | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ precio_kg: number }>(
    'SELECT precio_kg FROM precios_cliente WHERE cliente_id = ? AND tipo_producto = ?',
    clienteId, tipoProducto
  );
  return row?.precio_kg ?? null;
}
