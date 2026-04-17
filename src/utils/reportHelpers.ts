import { getDatabase } from '@/db/database';

export interface ReporteDiario {
  fecha: string;
  total_ventas: number;
  total_efectivo: number;
  total_transferencias: number;
  total_credito: number;
  num_clientes: number;
  ventas_por_cliente: {
    cliente_nombre: string;
    subtotal: number;
    monto_pagado: number;
    saldo_pendiente: number;
  }[];
}

export interface ReporteInventario {
  fecha: string;
  peso_entrada: number;
  pechuga_procesada: number;
  filete_procesado: number;
  menudencia_procesada: number;
  recortes_procesados: number;
  pollo_entero_procesado: number;
}

export interface ReporteSemanal {
  semana_inicio: string;
  semana_fin: string;
  total_ventas: number;
  total_cobrado: number;
  total_credito: number;
  num_jornadas: number;
}

export async function getReporteDiario(jornadaId: number): Promise<ReporteDiario | null> {
  const db = await getDatabase();

  const jornada = await db.getFirstAsync<{ fecha: string }>(
    'SELECT fecha FROM jornadas WHERE id = ?', jornadaId
  );
  if (!jornada) return null;

  const resumen = await db.getFirstAsync<{
    total: number; efectivo: number; transferencia: number; credito: number; clientes: number;
  }>(
    `SELECT
      COALESCE(SUM(subtotal), 0) as total,
      COALESCE(SUM(CASE WHEN metodo_pago='efectivo' THEN monto_pagado ELSE 0 END), 0) as efectivo,
      COALESCE(SUM(CASE WHEN metodo_pago='transferencia' THEN monto_pagado ELSE 0 END), 0) as transferencia,
      COALESCE(SUM(saldo_pendiente), 0) as credito,
      COUNT(DISTINCT cliente_id) as clientes
     FROM ventas WHERE jornada_id = ?`,
    jornadaId
  );

  const porCliente = await db.getAllAsync<{
    cliente_nombre: string; subtotal: number; monto_pagado: number; saldo_pendiente: number;
  }>(
    `SELECT c.nombre as cliente_nombre,
       SUM(v.subtotal) as subtotal,
       SUM(v.monto_pagado) as monto_pagado,
       SUM(v.saldo_pendiente) as saldo_pendiente
     FROM ventas v
     JOIN clientes c ON c.id = v.cliente_id
     WHERE v.jornada_id = ?
     GROUP BY v.cliente_id, c.nombre
     ORDER BY subtotal DESC`,
    jornadaId
  );

  return {
    fecha: jornada.fecha,
    total_ventas: resumen?.total ?? 0,
    total_efectivo: resumen?.efectivo ?? 0,
    total_transferencias: resumen?.transferencia ?? 0,
    total_credito: resumen?.credito ?? 0,
    num_clientes: resumen?.clientes ?? 0,
    ventas_por_cliente: porCliente,
  };
}

export async function getReporteInventario(jornadaId: number): Promise<ReporteInventario | null> {
  const db = await getDatabase();

  const jornada = await db.getFirstAsync<{ fecha: string }>(
    'SELECT fecha FROM jornadas WHERE id = ?', jornadaId
  );
  if (!jornada) return null;

  const entrada = await db.getFirstAsync<{ peso: number }>(
    'SELECT COALESCE(SUM(peso_total_kg), 0) as peso FROM entradas_inventario WHERE jornada_id = ?',
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

  return {
    fecha: jornada.fecha,
    peso_entrada: entrada?.peso ?? 0,
    pechuga_procesada: proc?.pechuga ?? 0,
    filete_procesado: proc?.filete ?? 0,
    menudencia_procesada: proc?.menudencia ?? 0,
    recortes_procesados: proc?.recortes ?? 0,
    pollo_entero_procesado: proc?.pollo_entero ?? 0,
  };
}

export async function getReporteSemanal(fechaInicio: string, fechaFin: string): Promise<{
  por_dia: { fecha: string; total: number; cobrado: number }[];
  totales: { total: number; cobrado: number; credito: number };
}> {
  const db = await getDatabase();

  const porDia = await db.getAllAsync<{ fecha: string; total: number; cobrado: number }>(
    `SELECT j.fecha,
       COALESCE(SUM(v.subtotal), 0) as total,
       COALESCE(SUM(v.monto_pagado), 0) as cobrado
     FROM jornadas j
     LEFT JOIN ventas v ON v.jornada_id = j.id
     WHERE j.fecha BETWEEN ? AND ?
     GROUP BY j.fecha
     ORDER BY j.fecha`,
    fechaInicio, fechaFin
  );

  const totales = await db.getFirstAsync<{ total: number; cobrado: number; credito: number }>(
    `SELECT
       COALESCE(SUM(v.subtotal), 0) as total,
       COALESCE(SUM(v.monto_pagado), 0) as cobrado,
       COALESCE(SUM(v.saldo_pendiente), 0) as credito
     FROM ventas v
     JOIN jornadas j ON j.id = v.jornada_id
     WHERE j.fecha BETWEEN ? AND ?`,
    fechaInicio, fechaFin
  );

  return {
    por_dia: porDia,
    totales: totales ?? { total: 0, cobrado: 0, credito: 0 },
  };
}
