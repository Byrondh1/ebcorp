/**
 * CATÁLOGO DE CATEGORÍAS
 * Define todas las categorías disponibles con su metadata visual.
 * Sirve como lookup table para iconos, colores y etiquetas en la UI.
 */

import type { CategoryId, CategoryMeta } from '../types/finance';

/** Mapa de categorías indexado por CategoryId para O(1) lookup */
export const CATEGORIES: Record<CategoryId, CategoryMeta> = {
  // ── Ingresos ─────────────────────────────────
  salary: {
    id: 'salary',
    label: 'Salario',
    icon: 'briefcase',
    color: '#10B981',
    defaultType: 'income',
  },
  freelance: {
    id: 'freelance',
    label: 'Freelance',
    icon: 'laptop',
    color: '#3B82F6',
    defaultType: 'income',
  },
  investment: {
    id: 'investment',
    label: 'Inversión',
    icon: 'trending-up',
    color: '#8B5CF6',
    defaultType: 'income',
  },
  // ── Egresos ──────────────────────────────────
  food: {
    id: 'food',
    label: 'Comida',
    icon: 'restaurant',
    color: '#F59E0B',
    defaultType: 'expense',
  },
  transport: {
    id: 'transport',
    label: 'Transporte',
    icon: 'car',
    color: '#6366F1',
    defaultType: 'expense',
  },
  entertainment: {
    id: 'entertainment',
    label: 'Entretenimiento',
    icon: 'game-controller',
    color: '#EC4899',
    defaultType: 'expense',
  },
  health: {
    id: 'health',
    label: 'Salud',
    icon: 'medkit',
    color: '#EF4444',
    defaultType: 'expense',
  },
  education: {
    id: 'education',
    label: 'Educación',
    icon: 'school',
    color: '#0EA5E9',
    defaultType: 'expense',
  },
  shopping: {
    id: 'shopping',
    label: 'Compras',
    icon: 'cart',
    color: '#F97316',
    defaultType: 'expense',
  },
  utilities: {
    id: 'utilities',
    label: 'Servicios',
    icon: 'flash',
    color: '#EAB308',
    defaultType: 'expense',
  },
  rent: {
    id: 'rent',
    label: 'Renta',
    icon: 'home',
    color: '#14B8A6',
    defaultType: 'expense',
  },
  other: {
    id: 'other',
    label: 'Otro',
    icon: 'ellipsis-horizontal',
    color: '#6B7280',
    defaultType: 'expense',
  },
};

/** Lista ordenada de categorías de ingresos */
export const INCOME_CATEGORIES: CategoryMeta[] = Object.values(CATEGORIES).filter(
  (c) => c.defaultType === 'income',
);

/** Lista ordenada de categorías de egresos */
export const EXPENSE_CATEGORIES: CategoryMeta[] = Object.values(CATEGORIES).filter(
  (c) => c.defaultType === 'expense',
);

/** Todas las categorías como array (para selects/pickers) */
export const ALL_CATEGORIES: CategoryMeta[] = Object.values(CATEGORIES);

/** Nombres cortos de meses en español */
export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
