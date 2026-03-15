/**
 * COMPONENTE: EmptyState
 * Pantalla vacía ilustrativa cuando no hay transacciones en el período.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  message?: string;
  subtitle?: string;
}

export function EmptyState({
  message = 'Sin transacciones',
  subtitle = 'Toca + para registrar tu primer movimiento',
}: EmptyStateProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="wallet-outline" size={56} color="#9CA3AF" />
      </View>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});
