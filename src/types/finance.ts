/**
 * ESQUEMA DE DATOS CENTRAL
 * Todas las interfaces TypeScript de la aplicación de finanzas personales.
 * Este archivo es la fuente de verdad para los tipos del dominio.
 */

// ─────────────────────────────────────────────
// Enumeraciones
// ─────────────────────────────────────────────

/** Tipo de movimiento financiero */
export type TransactionType = 'income' | 'expense';

/** Categorías disponibles para clasificar transacciones */
export type CategoryId =
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'health'
  | 'education'
  | 'shopping'
  | 'utilities'
  | 'rent'
  | 'other';

// ─────────────────────────────────────────────
// Entidades del Dominio
// ─────────────────────────────────────────────

/**
 * Entidad principal: representa un movimiento financiero (ingreso o egreso).
 * Cada transacción es inmutable una vez guardada (se edita creando una nueva).
 */
export interface Transaction {
  /** Identificador único (UUID generado en creación) */
  id: string;
  /** Monto en moneda local — siempre positivo; el tipo define si suma o resta */
  amount: number;
  /** Categoría semántica para agrupar y filtrar */
  category: CategoryId;
  /** Tipo: ingreso o egreso */
  type: TransactionType;
  /** Descripción libre opcional */
  description: string;
  /** Fecha ISO 8601 de la transacción (no necesariamente "hoy") */
  date: string;
  /** Timestamp de creación del registro para ordenamiento interno */
  createdAt: string;
}

/**
 * Datos necesarios para crear una nueva transacción.
 * Omite los campos generados automáticamente (id, createdAt).
 */
export type NewTransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

// ─────────────────────────────────────────────
// Derivados y Vistas
// ─────────────────────────────────────────────

/** Resumen financiero calculado a partir de la lista de transacciones */
export interface FinancialSummary {
  /** Saldo neto: ingresos - egresos */
  balance: number;
  /** Suma de todos los ingresos */
  totalIncome: number;
  /** Suma de todos los egresos */
  totalExpenses: number;
}

/** Parámetros para el filtro de mes/año en la vista de transacciones */
export interface MonthFilter {
  /** Mes seleccionado (1-12) */
  month: number;
  /** Año seleccionado (ej: 2026) */
  year: number;
}

/** Metadata de una categoría para renderizado en UI */
export interface CategoryMeta {
  id: CategoryId;
  label: string;
  /** Nombre del icono de @expo/vector-icons (Ionicons) */
  icon: string;
  /** Color hexadecimal asociado a la categoría */
  color: string;
  /** Tipo de transacción al que pertenece normalmente */
  defaultType: TransactionType;
}

// ─────────────────────────────────────────────
// Contrato del Context / Hook
// ─────────────────────────────────────────────

/** Estado global de la aplicación de finanzas */
export interface FinanceState {
  /** Lista completa de transacciones (fuente de verdad) */
  transactions: Transaction[];
  /** Filtro activo de mes/año */
  activeFilter: MonthFilter;
  /** Indica si los datos están cargando desde AsyncStorage */
  isLoading: boolean;
}

/** Acciones disponibles para mutar el estado global */
export interface FinanceActions {
  addTransaction: (input: NewTransactionInput) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setFilter: (filter: MonthFilter) => void;
}

/** Tipo unificado del contexto exportado al árbol de componentes */
export type FinanceContextValue = FinanceState & FinanceActions & {
  /** Resumen calculado para el filtro activo */
  summary: FinancialSummary;
  /** Transacciones filtradas por el mes/año activo */
  filteredTransactions: Transaction[];
};
