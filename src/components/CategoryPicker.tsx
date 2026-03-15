/**
 * COMPONENTE: CategoryPicker
 * Grid de selección de categorías para el formulario de nueva transacción.
 * Muestra las categorías disponibles según el tipo (income/expense).
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants/categories';
import type { CategoryId, TransactionType } from '../types/finance';

interface CategoryPickerProps {
  selectedCategory: CategoryId | null;
  transactionType: TransactionType;
  onSelect: (categoryId: CategoryId) => void;
}

export function CategoryPicker({
  selectedCategory,
  transactionType,
  onSelect,
}: CategoryPickerProps): React.JSX.Element {
  const categories = transactionType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <View>
      <Text style={styles.label}>Categoría</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                isSelected && { backgroundColor: cat.color, borderColor: cat.color },
              ]}
              onPress={() => onSelect(cat.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={cat.icon as any}
                size={16}
                color={isSelected ? '#FFFFFF' : cat.color}
              />
              <Text
                style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  scrollContent: {
    paddingRight: 8,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  chipLabelSelected: {
    color: '#FFFFFF',
  },
});
