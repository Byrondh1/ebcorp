/**
 * COMPONENTE: BalanceCard
 * Tarjeta hero del Dashboard que muestra el saldo total, ingresos y egresos
 * del período activo. Usa LinearGradient para un diseño moderno.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { FinancialSummary } from '../types/finance';
import { formatCurrency, formatMonthYear } from '../utils/formatters';
import type { MonthFilter } from '../types/finance';

const { width } = Dimensions.get('window');

interface BalanceCardProps {
  summary: FinancialSummary;
  filter: MonthFilter;
}

export function BalanceCard({ summary, filter }: BalanceCardProps): React.JSX.Element {
  const isPositive = summary.balance >= 0;

  return (
    <LinearGradient
      colors={isPositive ? ['#1a1a2e', '#16213e', '#0f3460'] : ['#2d1b1b', '#3d1a1a', '#5c1a1a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* Header: período activo */}
      <Text style={styles.period}>
        {formatMonthYear(filter.month, filter.year)}
      </Text>

      {/* Saldo principal */}
      <Text style={styles.balanceLabel}>Saldo Total</Text>
      <Text style={[styles.balanceAmount, !isPositive && styles.negativeBalance]}>
        {formatCurrency(summary.balance)}
      </Text>

      {/* Separador */}
      <View style={styles.divider} />

      {/* Resumen inferior: Ingresos vs Egresos */}
      <View style={styles.summaryRow}>
        {/* Ingresos */}
        <View style={styles.summaryItem}>
          <View style={[styles.iconContainer, styles.incomeIcon]}>
            <Ionicons name="arrow-down" size={16} color="#10B981" />
          </View>
          <View>
            <Text style={styles.summaryLabel}>Ingresos</Text>
            <Text style={[styles.summaryAmount, styles.incomeText]}>
              {formatCurrency(summary.totalIncome)}
            </Text>
          </View>
        </View>

        {/* Divider vertical */}
        <View style={styles.verticalDivider} />

        {/* Egresos */}
        <View style={styles.summaryItem}>
          <View style={[styles.iconContainer, styles.expenseIcon]}>
            <Ionicons name="arrow-up" size={16} color="#EF4444" />
          </View>
          <View>
            <Text style={styles.summaryLabel}>Egresos</Text>
            <Text style={[styles.summaryAmount, styles.expenseText]}>
              {formatCurrency(summary.totalExpenses)}
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 24,
    padding: 24,
    // Sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  period: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 4,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  negativeBalance: {
    color: '#FCA5A5',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  incomeIcon: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  expenseIcon: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginBottom: 2,
  },
  summaryAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  incomeText: {
    color: '#6EE7B7',
  },
  expenseText: {
    color: '#FCA5A5',
  },
  verticalDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 16,
  },
});
