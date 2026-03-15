/**
 * UTILIDADES DE CÁLCULO FINANCIERO
 * Funciones puras que operan sobre arrays de Transaction.
 * Son deterministas y testeables en aislamiento.
 */

import type { FinancialSummary, MonthFilter, Transaction } from '../types/finance';

/**
 * Filtra transacciones por mes y año.
 * La comparación se hace sobre la propiedad `date` de la transacción.
 */
export function filterByMonth(
  transactions: Transaction[],
  filter: MonthFilter,
): Transaction[] {
  return transactions.filter((tx) => {
    const [year, month] = tx.date.split('-').map(Number);
    return year === filter.year && month === filter.month;
  });
}

/**
 * Calcula el resumen financiero (balance, ingresos, egresos)
 * a partir de un array de transacciones.
 *
 * @param transactions - Lista de transacciones a resumir (puede ser el conjunto filtrado)
 * @returns FinancialSummary con totales calculados
 */
export function calculateSummary(transactions: Transaction[]): FinancialSummary {
  const { totalIncome, totalExpenses } = transactions.reduce(
    (acc, tx) => {
      if (tx.type === 'income') {
        acc.totalIncome += tx.amount;
      } else {
        acc.totalExpenses += tx.amount;
      }
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0 },
  );

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
  };
}

/**
 * Ordena transacciones de más reciente a más antigua.
 * Devuelve un nuevo array (no muta el original).
 */
export function sortByDateDesc(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

/**
 * Genera un UUID v4 simple compatible con todos los entornos RN/Expo.
 */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
