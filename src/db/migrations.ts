import { getDatabase } from './database';

const MIGRATIONS: { version: number; sql: string[] }[] = [
  {
    version: 1,
    sql: [
      `CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        version INTEGER NOT NULL UNIQUE,
        aplicada_en TEXT NOT NULL DEFAULT (datetime('now'))
      )`,

      `CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        pin_hash TEXT NOT NULL,
        rol TEXT NOT NULL CHECK(rol IN ('admin','vendedor')),
        activo INTEGER NOT NULL DEFAULT 1,
        creado_en TEXT NOT NULL DEFAULT (datetime('now'))
      )`,

      `CREATE TABLE IF NOT EXISTS jornadas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha TEXT NOT NULL UNIQUE,
        estado TEXT NOT NULL DEFAULT 'abierta' CHECK(estado IN ('abierta','cerrada')),
        abierta_por INTEGER NOT NULL REFERENCES usuarios(id),
        cerrada_por INTEGER REFERENCES usuarios(id),
        hora_apertura TEXT NOT NULL DEFAULT (datetime('now')),
        hora_cierre TEXT,
        notas TEXT,
        creado_en TEXT NOT NULL DEFAULT (datetime('now'))
      )`,

      `CREATE TABLE IF NOT EXISTS entradas_inventario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        jornada_id INTEGER NOT NULL REFERENCES jornadas(id),
        num_gavetas INTEGER NOT NULL,
        peso_total_kg REAL NOT NULL,
        proveedor TEXT,
        hora TEXT NOT NULL DEFAULT (datetime('now')),
        notas TEXT
      )`,

      `CREATE TABLE IF NOT EXISTS procesamiento_inventario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        jornada_id INTEGER NOT NULL REFERENCES jornadas(id),
        entrada_id INTEGER REFERENCES entradas_inventario(id),
        pechuga_kg REAL NOT NULL DEFAULT 0,
        filete_kg REAL NOT NULL DEFAULT 0,
        menudencia_unidades INTEGER NOT NULL DEFAULT 0,
        recortes_kg REAL NOT NULL DEFAULT 0,
        recortes_unidades INTEGER NOT NULL DEFAULT 0,
        pollo_entero_kg REAL NOT NULL DEFAULT 0,
        registrado_en TEXT NOT NULL DEFAULT (datetime('now'))
      )`,

      `CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        telefono TEXT,
        direccion TEXT,
        vendedor_id INTEGER REFERENCES usuarios(id),
        activo INTEGER NOT NULL DEFAULT 1,
        notas TEXT,
        creado_en TEXT NOT NULL DEFAULT (datetime('now'))
      )`,

      `CREATE TABLE IF NOT EXISTS precios_cliente (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL REFERENCES clientes(id),
        tipo_producto TEXT NOT NULL CHECK(tipo_producto IN ('pechuga','filete','menudencia','recortes','pollo_entero')),
        precio_kg REAL NOT NULL,
        vigente_desde TEXT NOT NULL DEFAULT (date('now')),
        UNIQUE(cliente_id, tipo_producto)
      )`,

      `CREATE TABLE IF NOT EXISTS despachos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        jornada_id INTEGER NOT NULL REFERENCES jornadas(id),
        vendedor_id INTEGER NOT NULL REFERENCES usuarios(id),
        tipo_producto TEXT NOT NULL CHECK(tipo_producto IN ('pechuga','filete','menudencia','recortes','pollo_entero')),
        cantidad REAL NOT NULL,
        unidad TEXT NOT NULL DEFAULT 'kg' CHECK(unidad IN ('kg','unidades')),
        confirmado INTEGER NOT NULL DEFAULT 0,
        confirmado_en TEXT,
        creado_en TEXT NOT NULL DEFAULT (datetime('now'))
      )`,

      `CREATE TABLE IF NOT EXISTS devoluciones_despacho (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        despacho_id INTEGER NOT NULL REFERENCES despachos(id),
        jornada_id INTEGER NOT NULL REFERENCES jornadas(id),
        cantidad REAL NOT NULL,
        motivo TEXT,
        registrado_en TEXT NOT NULL DEFAULT (datetime('now'))
      )`,

      `CREATE TABLE IF NOT EXISTS ventas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        jornada_id INTEGER NOT NULL REFERENCES jornadas(id),
        cliente_id INTEGER NOT NULL REFERENCES clientes(id),
        vendedor_id INTEGER NOT NULL REFERENCES usuarios(id),
        metodo_pago TEXT NOT NULL CHECK(metodo_pago IN ('efectivo','transferencia','credito')),
        subtotal REAL NOT NULL,
        monto_pagado REAL NOT NULL DEFAULT 0,
        saldo_pendiente REAL NOT NULL DEFAULT 0,
        estado TEXT NOT NULL DEFAULT 'pendiente' CHECK(estado IN ('pagada','credito','parcial')),
        notas TEXT,
        registrada_en TEXT NOT NULL DEFAULT (datetime('now'))
      )`,

      `CREATE TABLE IF NOT EXISTS venta_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        venta_id INTEGER NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
        tipo_producto TEXT NOT NULL CHECK(tipo_producto IN ('pechuga','filete','menudencia','recortes','pollo_entero')),
        cantidad REAL NOT NULL,
        unidad TEXT NOT NULL DEFAULT 'kg',
        precio_unitario REAL NOT NULL,
        subtotal REAL NOT NULL
      )`,

      `CREATE TABLE IF NOT EXISTS pagos_credito (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL REFERENCES clientes(id),
        venta_id INTEGER REFERENCES ventas(id),
        monto REAL NOT NULL,
        metodo TEXT NOT NULL CHECK(metodo IN ('efectivo','transferencia')),
        registrado_por INTEGER NOT NULL REFERENCES usuarios(id),
        jornada_id INTEGER NOT NULL REFERENCES jornadas(id),
        notas TEXT,
        registrado_en TEXT NOT NULL DEFAULT (datetime('now'))
      )`,

      `CREATE TABLE IF NOT EXISTS caja_movimientos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        jornada_id INTEGER NOT NULL REFERENCES jornadas(id),
        tipo TEXT NOT NULL CHECK(tipo IN ('ingreso','egreso','ajuste')),
        metodo TEXT NOT NULL CHECK(metodo IN ('efectivo','transferencia')),
        monto REAL NOT NULL,
        concepto TEXT NOT NULL,
        referencia_id INTEGER,
        referencia_tipo TEXT,
        registrado_por INTEGER NOT NULL REFERENCES usuarios(id),
        registrado_en TEXT NOT NULL DEFAULT (datetime('now'))
      )`,

      `CREATE TABLE IF NOT EXISTS cierres_caja (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        jornada_id INTEGER NOT NULL UNIQUE REFERENCES jornadas(id),
        efectivo_esperado REAL NOT NULL,
        efectivo_contado REAL NOT NULL,
        transferencias_total REAL NOT NULL,
        diferencia REAL NOT NULL,
        cerrado_por INTEGER NOT NULL REFERENCES usuarios(id),
        notas TEXT,
        cerrado_en TEXT NOT NULL DEFAULT (datetime('now'))
      )`,

      `CREATE INDEX IF NOT EXISTS idx_jornadas_fecha ON jornadas(fecha)`,
      `CREATE INDEX IF NOT EXISTS idx_ventas_jornada ON ventas(jornada_id)`,
      `CREATE INDEX IF NOT EXISTS idx_ventas_cliente ON ventas(cliente_id)`,
      `CREATE INDEX IF NOT EXISTS idx_venta_items_venta ON venta_items(venta_id)`,
      `CREATE INDEX IF NOT EXISTS idx_despachos_jornada ON despachos(jornada_id)`,
      `CREATE INDEX IF NOT EXISTS idx_despachos_vendedor ON despachos(vendedor_id)`,
      `CREATE INDEX IF NOT EXISTS idx_pagos_credito_cliente ON pagos_credito(cliente_id)`,
      `CREATE INDEX IF NOT EXISTS idx_caja_mov_jornada ON caja_movimientos(jornada_id)`,
      `CREATE INDEX IF NOT EXISTS idx_precios_cliente ON precios_cliente(cliente_id)`,
    ],
  },
];

export async function runMigrations(): Promise<void> {
  const db = await getDatabase();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version INTEGER NOT NULL UNIQUE,
      aplicada_en TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  const applied = await db.getAllAsync<{ version: number }>(
    'SELECT version FROM migrations ORDER BY version ASC'
  );
  const appliedVersions = new Set(applied.map((r) => r.version));

  for (const migration of MIGRATIONS) {
    if (appliedVersions.has(migration.version)) continue;

    await db.withTransactionAsync(async () => {
      for (const sql of migration.sql) {
        await db.execAsync(sql);
      }
      await db.runAsync(
        'INSERT INTO migrations (version) VALUES (?)',
        migration.version
      );
    });
  }
}

export async function hayUsuarios(): Promise<boolean> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM usuarios WHERE activo = 1'
  );
  return (result?.count ?? 0) > 0;
}
