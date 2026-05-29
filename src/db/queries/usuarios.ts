import * as Crypto from 'expo-crypto';
import { getDatabase } from '../database';
import { Usuario } from '@/types/auth';

async function hashPin(pin: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, pin);
}

export async function crearUsuario(
  nombre: string,
  pin: string,
  rol: 'admin' | 'vendedor'
): Promise<number> {
  const db = await getDatabase();
  const pinHash = await hashPin(pin);
  const result = await db.runAsync(
    'INSERT INTO usuarios (nombre, pin_hash, rol) VALUES (?, ?, ?)',
    nombre, pinHash, rol
  );
  return result.lastInsertRowId;
}

export async function verificarPin(pin: string): Promise<Usuario | null> {
  const db = await getDatabase();
  const pinHash = await hashPin(pin);
  const usuario = await db.getFirstAsync<Usuario>(
    'SELECT id, nombre, rol, activo, creado_en FROM usuarios WHERE pin_hash = ? AND activo = 1',
    pinHash
  );
  return usuario ?? null;
}

export async function getUsuarios(): Promise<Usuario[]> {
  const db = await getDatabase();
  return db.getAllAsync<Usuario>(
    'SELECT id, nombre, rol, activo, creado_en FROM usuarios WHERE activo = 1 ORDER BY nombre'
  );
}

export async function getVendedores(): Promise<Usuario[]> {
  const db = await getDatabase();
  return db.getAllAsync<Usuario>(
    "SELECT id, nombre, rol, activo, creado_en FROM usuarios WHERE rol = 'vendedor' AND activo = 1 ORDER BY nombre"
  );
}
