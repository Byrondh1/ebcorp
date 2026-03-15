/**
 * PANTALLA: TransactionListScreen
 * Vista completa de todas las transacciones con filtro activo.
 * Permite buscar por descripción y filtrar por tipo.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeFinanceContext } from '../context/FinanceContext';
import { TransactionItem } from '../components/TransactionItem';
import { FilterBar } from '../components/FilterBar';
import { EmptyState } from '../components/EmptyState';
import type { Transaction, TransactionType } from '../types/finance';
import type { RootStackParamList } from '../navigation/types';

type TransactionListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Transactions'>;

interface TransactionListScreenProps {
  navigation: TransactionListNavigationProp;
}

type TypeFilter = TransactionType | 'all';

export function TransactionListScreen({ navigation }: TransactionListScreenProps): React.JSX.Element {
  const { filteredTransactions, activeFilter, setFilter, deleteTransaction } =
    useSafeFinanceContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  // Filtrado combinado: búsqueda + tipo
  const displayTransactions = useMemo(() => {
    let result = filteredTransactions;

    if (typeFilter !== 'all') {
      result = result.filter((tx) => tx.type === typeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.description.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q),
      );
    }

    return result;
  }, [filteredTransactions, typeFilter, searchQuery]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={22} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Todas las transacciones</Text>
        <View style={styles.placeholder} />
      </View>

      {/* ── Filtro de mes ── */}
      <FilterBar filter={activeFilter} onFilterChange={setFilter} />

      {/* ── Barra de búsqueda ── */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={16} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar transacciones..."
          placeholderTextColor="#9CA3AF"
          clearButtonMode="while-editing"
        />
      </View>

      {/* ── Filtros rápidos de tipo ── */}
      <View style={styles.typeFilterContainer}>
        {(['all', 'income', 'expense'] as TypeFilter[]).map((t) => {
          const labels: Record<TypeFilter, string> = {
            all: 'Todos',
            income: 'Ingresos',
            expense: 'Egresos',
          };
          const isActive = typeFilter === t;
          return (
            <TouchableOpacity
              key={t}
              style={[styles.typeChip, isActive && styles.typeChipActive]}
              onPress={() => setTypeFilter(t)}
            >
              <Text style={[styles.typeChipText, isActive && styles.typeChipTextActive]}>
                {labels[t]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Lista ── */}
      <FlatList
        data={displayTransactions}
        keyExtractor={(item: Transaction) => item.id}
        renderItem={({ item }) => (
          <TransactionItem transaction={item} onDelete={deleteTransaction} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            message={searchQuery ? 'Sin resultados' : 'Sin movimientos este mes'}
            subtitle={
              searchQuery
                ? 'Intenta con otro término de búsqueda'
                : 'Agrega transacciones desde el Dashboard'
            }
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  placeholder: { width: 40 },
  // ── Búsqueda ─────────────────────────────────
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  // ── Filtros de tipo ───────────────────────────
  typeFilterContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 12,
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  typeChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  typeChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  typeChipTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 24,
  },
});
