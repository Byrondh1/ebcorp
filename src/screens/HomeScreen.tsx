/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║              PANTALLA: HomeScreen (Dashboard)            ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * Pantalla principal de la aplicación.
 * Composición:
 *  ┌─────────────────────────────────┐
 *  │  Header (saludo + avatar)       │
 *  │  BalanceCard (saldo del período)│
 *  │  FilterBar (navegación meses)   │
 *  │  Lista de transacciones         │
 *  │  FAB (botón flotante + nuevo)   │
 *  └─────────────────────────────────┘
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeFinanceContext } from '../context/FinanceContext';
import { BalanceCard } from '../components/BalanceCard';
import { FilterBar } from '../components/FilterBar';
import { TransactionItem } from '../components/TransactionItem';
import { EmptyState } from '../components/EmptyState';
import type { RootStackParamList } from '../navigation/types';
import type { Transaction } from '../types/finance';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export function HomeScreen({ navigation }: HomeScreenProps): React.JSX.Element {
  const {
    summary,
    filteredTransactions,
    activeFilter,
    isLoading,
    deleteTransaction,
    setFilter,
  } = useSafeFinanceContext();

  // Callback estable para evitar re-renders innecesarios de TransactionItem
  const handleDelete = useCallback(
    (id: string) => {
      deleteTransaction(id);
    },
    [deleteTransaction],
  );

  const renderItem = useCallback(
    ({ item }: { item: Transaction }) => (
      <TransactionItem transaction={item} onDelete={handleDelete} />
    ),
    [handleDelete],
  );

  const keyExtractor = useCallback((item: Transaction) => item.id, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Cargando tus finanzas...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <FlatList
        data={filteredTransactions}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* ── Header ── */}
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>¡Buen día!</Text>
                <Text style={styles.subtitle}>Resumen financiero</Text>
              </View>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => navigation.navigate('Transactions')}
              >
                <Ionicons name="list" size={22} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* ── Balance Card ── */}
            <BalanceCard summary={summary} filter={activeFilter} />

            {/* ── Filtro de meses ── */}
            <FilterBar filter={activeFilter} onFilterChange={setFilter} />

            {/* ── Título de sección ── */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Transacciones</Text>
              <Text style={styles.transactionCount}>
                {filteredTransactions.length} movimientos
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <EmptyState
            message="Sin movimientos este mes"
            subtitle="Toca el botón + para agregar tu primer ingreso o gasto"
          />
        }
      />

      {/* ── FAB: Agregar transacción ── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransaction')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 100, // espacio para el FAB
  },
  // ── Header ──────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  // ── Sección de transacciones ─────────────────
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  transactionCount: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  // ── FAB ─────────────────────────────────────
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 32 : 24,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
});
