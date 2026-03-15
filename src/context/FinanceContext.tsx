/**
 * FINANCE CONTEXT
 * Envuelve el árbol de componentes y expone el estado financiero global
 * a través de React Context API.
 *
 * Patrón usado:
 *  - Context solo para distribución del valor (no para lógica)
 *  - La lógica vive en useFinance (separación de responsabilidades)
 *  - useSafeFinanceContext lanza si se usa fuera del Provider (fail-fast)
 */

import React, { createContext, useContext, type ReactNode } from 'react';
import { useFinance, type UseFinanceReturn } from '../hooks/useFinance';

// ─────────────────────────────────────────────
// Creación del Context
// ─────────────────────────────────────────────

/**
 * El contexto se inicializa como undefined para detectar en tiempo de desarrollo
 * si un componente accede al contexto fuera del Provider.
 */
const FinanceContext = createContext<UseFinanceReturn | undefined>(undefined);

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────

interface FinanceProviderProps {
  children: ReactNode;
}

/**
 * Provider global que debe envolver la aplicación en App.tsx.
 * Instancia useFinance una sola vez y distribuye su valor al árbol.
 *
 * @example
 * ```tsx
 * <FinanceProvider>
 *   <NavigationContainer>...</NavigationContainer>
 * </FinanceProvider>
 * ```
 */
export function FinanceProvider({ children }: FinanceProviderProps): React.JSX.Element {
  const financeValue = useFinance();

  return (
    <FinanceContext.Provider value={financeValue}>
      {children}
    </FinanceContext.Provider>
  );
}

// ─────────────────────────────────────────────
// Hook de Consumo
// ─────────────────────────────────────────────

/**
 * Hook seguro para consumir el FinanceContext.
 * Lanza un error descriptivo si se usa fuera del FinanceProvider,
 * lo que facilita el debugging durante el desarrollo.
 *
 * @example
 * ```tsx
 * const { summary, filteredTransactions } = useSafeFinanceContext();
 * ```
 */
export function useSafeFinanceContext(): UseFinanceReturn {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error(
      '[useSafeFinanceContext] Debe usarse dentro de <FinanceProvider>. ' +
        'Asegúrate de envolver tu aplicación con <FinanceProvider>.',
    );
  }
  return context;
}
