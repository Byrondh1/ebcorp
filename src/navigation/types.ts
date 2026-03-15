/**
 * TIPOS DE NAVEGACIÓN
 * Define el stack de navegación tipado para react-navigation.
 * Permite que TypeScript valide los nombres de rutas y sus parámetros.
 */

export type RootStackParamList = {
  /** Dashboard principal */
  Home: undefined;
  /** Formulario de nueva transacción */
  AddTransaction: undefined;
  /** Lista completa de transacciones con filtros */
  Transactions: undefined;
};
