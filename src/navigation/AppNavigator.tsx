/**
 * NAVEGACIÓN PRINCIPAL
 * Configura el Stack Navigator de la aplicación.
 * Todas las pantallas están tipadas con RootStackParamList.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { AddTransactionScreen } from '../screens/AddTransactionScreen';
import { TransactionListScreen } from '../screens/TransactionListScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,         // Cada pantalla gestiona su propio header
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#F9FAFB' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="AddTransaction"
          component={AddTransactionScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="Transactions" component={TransactionListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
