/**
 * COMPONENTE: TransactionItem
 * Ítem de lista que representa una sola transacción.
 * Muestra: icono de categoría, descripción, fecha, monto y tipo.
 * Soporta swipe-to-delete mediante long press.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES } from '../constants/categories';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { Transaction } from '../types/finance';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

export function TransactionItem({
  transaction,
  onDelete,
}: TransactionItemProps): React.JSX.Element {
  const category = CATEGORIES[transaction.category];
  const isIncome = transaction.type === 'income';

  const handleLongPress = () => {
    Alert.alert(
      'Eliminar transacción',
      `¿Deseas eliminar esta transacción de ${formatCurrency(transaction.amount)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDelete(transaction.id),
        },
      ],
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
    >
      {/* Icono de categoría */}
      <View style={[styles.iconWrapper, { backgroundColor: category.color + '20' }]}>
        <Ionicons
          name={category.icon as any}
          size={22}
          color={category.color}
        />
      </View>

      {/* Info central */}
      <View style={styles.info}>
        <Text style={styles.categoryLabel} numberOfLines={1}>
          {category.label}
        </Text>
        {transaction.description ? (
          <Text style={styles.description} numberOfLines={1}>
            {transaction.description}
          </Text>
        ) : null}
        <Text style={styles.date}>{formatDate(transaction.date)}</Text>
      </View>

      {/* Monto */}
      <View style={styles.amountContainer}>
        <Text style={[styles.amount, isIncome ? styles.incomeText : styles.expenseText]}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </Text>
        <View style={[styles.typeBadge, isIncome ? styles.incomeBadge : styles.expenseBadge]}>
          <Text style={[styles.typeLabel, isIncome ? styles.incomeLabel : styles.expenseLabel]}>
            {isIncome ? 'Ingreso' : 'Egreso'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 16,
    padding: 14,
    // Sombra sutil
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  categoryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  incomeText: {
    color: '#059669',
  },
  expenseText: {
    color: '#DC2626',
  },
  typeBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  incomeBadge: {
    backgroundColor: '#D1FAE5',
  },
  expenseBadge: {
    backgroundColor: '#FEE2E2',
  },
  typeLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  incomeLabel: {
    color: '#065F46',
  },
  expenseLabel: {
    color: '#991B1B',
  },
});
