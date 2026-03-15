/**
 * COMPONENTE: FilterBar
 * Barra de filtrado horizontal para navegar entre meses.
 * Permite ir al mes anterior/siguiente y muestra el período activo.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { MonthFilter } from '../types/finance';
import { formatMonthYear } from '../utils/formatters';

interface FilterBarProps {
  filter: MonthFilter;
  onFilterChange: (filter: MonthFilter) => void;
}

/**
 * Navega al mes anterior, ajustando el año si es necesario.
 */
function getPrevMonth(filter: MonthFilter): MonthFilter {
  if (filter.month === 1) {
    return { month: 12, year: filter.year - 1 };
  }
  return { month: filter.month - 1, year: filter.year };
}

/**
 * Navega al mes siguiente, ajustando el año si es necesario.
 */
function getNextMonth(filter: MonthFilter): MonthFilter {
  if (filter.month === 12) {
    return { month: 1, year: filter.year + 1 };
  }
  return { month: filter.month + 1, year: filter.year };
}

export function FilterBar({ filter, onFilterChange }: FilterBarProps): React.JSX.Element {
  const today = new Date();
  const isCurrentMonth =
    filter.month === today.getMonth() + 1 && filter.year === today.getFullYear();

  return (
    <View style={styles.container}>
      {/* Botón Anterior */}
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={() => onFilterChange(getPrevMonth(filter))}
      >
        <Ionicons name="chevron-back" size={20} color="#4B5563" />
      </TouchableOpacity>

      {/* Período actual */}
      <View style={styles.periodContainer}>
        <Text style={styles.periodText}>
          {formatMonthYear(filter.month, filter.year)}
        </Text>
        {isCurrentMonth && (
          <View style={styles.currentBadge}>
            <Text style={styles.currentBadgeText}>Actual</Text>
          </View>
        )}
      </View>

      {/* Botón Siguiente */}
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={() => onFilterChange(getNextMonth(filter))}
      >
        <Ionicons name="chevron-forward" size={20} color="#4B5563" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 8,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  periodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  periodText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  currentBadge: {
    backgroundColor: '#DBEAFE',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  currentBadgeText: {
    color: '#1D4ED8',
    fontSize: 11,
    fontWeight: '600',
  },
});
