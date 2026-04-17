import { getDatabase } from '../database';
import { Jornada } from '@/types/jornada';
import { todayISO } from '@/utils/formatters';

export async function getJornadaHoy(): Promise<Jornada | null> {
  const db = await getDatabase();
  const hoy = todayISO();
  const j = await db.getFirstAsync<Jornada>(
    'SELECT * FROM jornadas WHERE fecha = ?',
    hoy
  );
  return j ?? null;
}

export async function abrirJornada(usuarioId: number): Promise<Jornada> {
  const db = await getDatabase();
  const hoy = todayISO();
  const result = await db.runAsync(
    "INSERT INTO jornadas (fecha, abierta_por) VALUES (?, ?)",
    hoy, usuarioId
  );
  const j = await db.getFirstAsync<Jornada>(
    'SELECT * FROM jornadas WHERE id = ?',
    result.lastInsertRowId
  );
  return j!;
}

export async function cerrarJornada(jornadaId: number, usuarioId: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    "UPDATE jornadas SET estado='cerrada', cerrada_por=?, hora_cierre=datetime('now') WHERE id=?",
    usuarioId, jornadaId
  );
}

export async function getJornadas(limite = 30): Promise<Jornada[]> {
  const db = await getDatabase();
  return db.getAllAsync<Jornada>(
    'SELECT * FROM jornadas ORDER BY fecha DESC LIMIT ?',
    limite
  );
}

export async function getJornadaPorFecha(fecha: string): Promise<Jornada | null> {
  const db = await getDatabase();
  const j = await db.getFirstAsync<Jornada>(
    'SELECT * FROM jornadas WHERE fecha = ?',
    fecha
  );
  return j ?? null;
}
