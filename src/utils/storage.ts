/**
 * CAPA DE PERSISTENCIA LOCAL
 * Abstrae AsyncStorage para leer y escribir transacciones.
 * Centraliza la serialización/deserialización JSON y el manejo de errores.
 *
 * Si en el futuro se migra a SQLite o una API remota,
 * solo este archivo necesita cambiar.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Transaction } from '../types/finance';

/** Clave única de AsyncStorage para la lista de transacciones */
const STORAGE_KEY = '@ebcorp/transactions_v1';

/**
 * Lee todas las transacciones guardadas en el dispositivo.
 * Devuelve un array vacío si no hay datos o si ocurre un error.
 */
export async function loadTransactions(): Promise<Transaction[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    // Validación mínima: debe ser un array
    if (!Array.isArray(parsed)) return [];
    return parsed as Transaction[];
  } catch (error) {
    console.error('[Storage] Error loading transactions:', error);
    return [];
  }
}

/**
 * Persiste el array completo de transacciones en AsyncStorage.
 * Sobrescribe cualquier dato previo con el estado actual.
 *
 * @throws Propaga el error para que el llamador pueda manejarlo si lo necesita
 */
export async function saveTransactions(transactions: Transaction[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('[Storage] Error saving transactions:', error);
    throw error;
  }
}

/**
 * Elimina todos los datos guardados (útil para testing o reset de la app).
 */
export async function clearTransactions(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('[Storage] Error clearing transactions:', error);
  }
}
