/**
 * UTILIDADES DE FORMATEO
 * Funciones puras para formatear moneda, fechas y texto en la UI.
 * No tienen side-effects ni dependencias externas pesadas.
 */

import { MONTH_NAMES } from '../constants/categories';

// ─────────────────────────────────────────────
// Moneda
// ─────────────────────────────────────────────

/**
 * Formatea un número como moneda local.
 * @example formatCurrency(1234.5) → "$1,234.50"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formatea el saldo mostrando signo explícito para valores positivos.
 * @example formatBalance(500) → "+$500.00"
 * @example formatBalance(-200) → "-$200.00"
 */
export function formatBalance(amount: number): string {
  const formatted = formatCurrency(Math.abs(amount));
  if (amount > 0) return `+${formatted}`;
  if (amount < 0) return `-${formatted}`;
  return formatted;
}

// ─────────────────────────────────────────────
// Fechas
// ─────────────────────────────────────────────

/**
 * Formatea una fecha ISO a formato legible corto.
 * @example formatDate("2026-03-15") → "15 Mar 2026"
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate + 'T00:00:00');
  const day = date.getDate().toString().padStart(2, '0');
  const month = MONTH_NAMES[date.getMonth()].substring(0, 3);
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Formatea una fecha ISO a formato "Mes Año" para headers.
 * @example formatMonthYear("2026-03-15") → "Marzo 2026"
 */
export function formatMonthYear(month: number, year: number): string {
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

/**
 * Devuelve la fecha de hoy en formato ISO (YYYY-MM-DD).
 */
export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Extrae el mes (1-12) y el año de una fecha ISO string.
 */
export function extractMonthYear(isoDate: string): { month: number; year: number } {
  const date = new Date(isoDate + 'T00:00:00');
  return { month: date.getMonth() + 1, year: date.getFullYear() };
}
