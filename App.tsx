/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║         EBCORP — App de Finanzas Personales              ║
 * ║         Punto de entrada principal de la aplicación      ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * Árbol de providers:
 *  <GestureHandlerRootView>   ← Requerido por react-native-gesture-handler
 *    <FinanceProvider>        ← Estado global de finanzas (Context + useFinance)
 *      <AppNavigator>         ← Navegación tipada (react-navigation)
 *    </FinanceProvider>
 *  </GestureHandlerRootView>
 */

import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FinanceProvider } from './src/context/FinanceContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FinanceProvider>
        <AppNavigator />
      </FinanceProvider>
    </GestureHandlerRootView>
  );
}
