/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║              HOOK: useFinance                            ║
 * ║  Lógica de negocio central de la aplicación de finanzas ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * Responsabilidades:
 *  1. Cargar transacciones desde AsyncStorage al montar.
 *  2. Proveer acciones: agregar y eliminar transacciones.
 *  3. Calcular resumen financiero (balance, ingresos, egresos).
 *  4. Gestionar el filtro activo de mes/año.
 *  5. Sincronizar cambios de vuelta a AsyncStorage.
 *
 * Diseño:
 *  - Solo useReducer + useEffect: sin librerías externas de estado.
 *  - Las funciones de utilidad (cálculos, storage) son importadas
 *    desde sus módulos respectivos → máxima testeabilidad.
 *  - El hook es CONSUMIDO por FinanceContext; los componentes
 *    no lo llaman directamente.
 */

import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { generateId, calculateSummary, filterByMonth, sortByDateDesc } from '../utils/calculations';
import { loadTransactions, saveTransactions } from '../utils/storage';
import { todayISO, extractMonthYear } from '../utils/formatters';
import type {
  FinancialSummary,
  FinanceState,
  MonthFilter,
  NewTransactionInput,
  Transaction,
} from '../types/finance';

// ─────────────────────────────────────────────
// Estado y Reducer
// ─────────────────────────────────────────────

type FinanceAction =
  | { type: 'LOAD_SUCCESS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_FILTER'; payload: MonthFilter };

function getInitialFilter(): MonthFilter {
  const { month, year } = extractMonthYear(todayISO());
  return { month, year };
}

const initialState: FinanceState = {
  transactions: [],
  activeFilter: getInitialFilter(),
  isLoading: true,
};

/**
 * Reducer puro: gestiona todas las transiciones de estado.
 * Al ser puro es trivialmente testeable sin mocks.
 */
function financeReducer(state: FinanceState, action: FinanceAction): FinanceState {
  switch (action.type) {
    case 'LOAD_SUCCESS':
      return {
        ...state,
        transactions: action.payload,
        isLoading: false,
      };

    case 'ADD_TRANSACTION':
      return {
        ...state,
        // Nuevas transacciones van al inicio de la lista
        transactions: [action.payload, ...state.transactions],
      };

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((tx) => tx.id !== action.payload),
      };

    case 'SET_FILTER':
      return {
        ...state,
        activeFilter: action.payload,
      };

    default:
      return state;
  }
}

// ─────────────────────────────────────────────
// Tipo de retorno del hook
// ─────────────────────────────────────────────

export interface UseFinanceReturn extends FinanceState {
  /** Resumen calculado para el filtro activo */
  summary: FinancialSummary;
  /** Transacciones filtradas por mes/año, ordenadas desc */
  filteredTransactions: Transaction[];
  /** Añade una nueva transacción y persiste */
  addTransaction: (input: NewTransactionInput) => Promise<void>;
  /** Elimina una transacción por id y persiste */
  deleteTransaction: (id: string) => Promise<void>;
  /** Cambia el filtro de mes/año activo */
  setFilter: (filter: MonthFilter) => void;
}

// ─────────────────────────────────────────────
// Hook Principal
// ─────────────────────────────────────────────

/**
 * Hook de lógica de negocio para la aplicación de finanzas.
 *
 * @returns Estado financiero + acciones + derivados calculados
 *
 * @example
 * ```tsx
 * const { summary, filteredTransactions, addTransaction } = useFinance();
 * ```
 */
export function useFinance(): UseFinanceReturn {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  // ── Efecto de carga inicial desde AsyncStorage ──────────
  useEffect(() => {
    let isMounted = true;

    (async () => {
      const stored = await loadTransactions();
      if (isMounted) {
        dispatch({ type: 'LOAD_SUCCESS', payload: stored });
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // ── Persistencia reactiva: guarda cuando cambian las transacciones ──
  // Se ejecuta DESPUÉS del primer render (cuando isLoading deja de ser true)
  useEffect(() => {
    if (!state.isLoading) {
      saveTransactions(state.transactions).catch((err) =>
        console.error('[useFinance] Error persisting transactions:', err),
      );
    }
  }, [state.transactions, state.isLoading]);

  // ── Acciones ────────────────────────────────────────────

  /**
   * Crea una nueva transacción con ID y timestamp generados,
   * la añade al estado y la persiste en AsyncStorage.
   */
  const addTransaction = useCallback(async (input: NewTransactionInput): Promise<void> => {
    const newTransaction: Transaction = {
      ...input,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    // La persistencia ocurre en el useEffect de arriba (reactivo a state.transactions)
  }, []);

  /**
   * Elimina una transacción por su ID.
   * La persistencia ocurre reactivamente.
   */
  const deleteTransaction = useCallback(async (id: string): Promise<void> => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  }, []);

  /**
   * Actualiza el filtro de mes/año para la vista activa.
   */
  const setFilter = useCallback((filter: MonthFilter): void => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);

  // ── Valores Derivados (memoizados) ──────────────────────

  /**
   * Transacciones del mes/año activo, ordenadas de más reciente a más antigua.
   * Se recalcula solo cuando cambian las transacciones o el filtro.
   */
  const filteredTransactions = useMemo(
    () => sortByDateDesc(filterByMonth(state.transactions, state.activeFilter)),
    [state.transactions, state.activeFilter],
  );

  /**
   * Resumen financiero (balance, ingresos, egresos) para el período activo.
   * Se recalcula solo cuando cambian las transacciones filtradas.
   */
  const summary = useMemo(
    () => calculateSummary(filteredTransactions),
    [filteredTransactions],
  );

  return {
    // Estado
    ...state,
    // Derivados
    summary,
    filteredTransactions,
    // Acciones
    addTransaction,
    deleteTransaction,
    setFilter,
  };
}
