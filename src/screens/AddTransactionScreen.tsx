/**
 * PANTALLA: AddTransactionScreen
 * Formulario para registrar una nueva transacción.
 *
 * Campos:
 *  1. Tipo: Ingreso / Egreso (toggle)
 *  2. Monto (input numérico)
 *  3. Categoría (CategoryPicker horizontal)
 *  4. Descripción (opcional)
 *  5. Fecha (DatePicker nativo via TextInput controlado)
 *
 * Validaciones:
 *  - Monto > 0
 *  - Categoría seleccionada
 *  - Fecha válida (formato YYYY-MM-DD)
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeFinanceContext } from '../context/FinanceContext';
import { CategoryPicker } from '../components/CategoryPicker';
import { todayISO } from '../utils/formatters';
import type { CategoryId, TransactionType } from '../types/finance';
import type { RootStackParamList } from '../navigation/types';

type AddTransactionNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddTransaction'>;

interface AddTransactionScreenProps {
  navigation: AddTransactionNavigationProp;
}

export function AddTransactionScreen({ navigation }: AddTransactionScreenProps): React.JSX.Element {
  const { addTransaction } = useSafeFinanceContext();

  // ── Estado del formulario ──────────────────
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(todayISO());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Cambiar tipo limpia la categoría (evita categoría incoherente) ──
  const handleTypeChange = useCallback((newType: TransactionType) => {
    setType(newType);
    setCategory(null);
  }, []);

  // ── Validar y guardar ──────────────────────
  const handleSave = useCallback(async () => {
    const parsedAmount = parseFloat(amount.replace(',', '.'));

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido mayor a cero.');
      return;
    }
    if (!category) {
      Alert.alert('Error', 'Selecciona una categoría.');
      return;
    }
    // Validación simple de fecha ISO
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      Alert.alert('Error', 'Ingresa la fecha en formato AAAA-MM-DD.');
      return;
    }

    try {
      setIsSubmitting(true);
      await addTransaction({
        amount: parsedAmount,
        category,
        type,
        description: description.trim(),
        date,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la transacción. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  }, [amount, category, type, description, date, addTransaction, navigation]);

  const isIncome = type === 'income';
  const accentColor = isIncome ? '#059669' : '#DC2626';

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nueva Transacción</Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSubmitting}
            style={[styles.saveButton, { backgroundColor: accentColor }]}
          >
            <Text style={styles.saveButtonText}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Toggle Ingreso / Egreso ── */}
          <View style={styles.typeToggleContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                !isIncome && styles.typeButtonActive,
                !isIncome && styles.expenseActive,
              ]}
              onPress={() => handleTypeChange('expense')}
            >
              <Ionicons
                name="arrow-up-circle"
                size={20}
                color={!isIncome ? '#FFFFFF' : '#9CA3AF'}
              />
              <Text style={[styles.typeButtonText, !isIncome && styles.typeButtonTextActive]}>
                Egreso
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                isIncome && styles.typeButtonActive,
                isIncome && styles.incomeActive,
              ]}
              onPress={() => handleTypeChange('income')}
            >
              <Ionicons
                name="arrow-down-circle"
                size={20}
                color={isIncome ? '#FFFFFF' : '#9CA3AF'}
              />
              <Text style={[styles.typeButtonText, isIncome && styles.typeButtonTextActive]}>
                Ingreso
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── Campo: Monto ── */}
          <View style={styles.field}>
            <Text style={styles.label}>Monto</Text>
            <View style={[styles.amountInputContainer, { borderColor: accentColor + '40' }]}>
              <Text style={[styles.currencySymbol, { color: accentColor }]}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#D1D5DB"
                maxLength={12}
              />
            </View>
          </View>

          {/* ── Campo: Categoría ── */}
          <View style={styles.field}>
            <CategoryPicker
              selectedCategory={category}
              transactionType={type}
              onSelect={setCategory}
            />
          </View>

          {/* ── Campo: Descripción ── */}
          <View style={styles.field}>
            <Text style={styles.label}>Descripción (opcional)</Text>
            <TextInput
              style={styles.textInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Ej: Almuerzo con equipo"
              placeholderTextColor="#D1D5DB"
              maxLength={120}
              returnKeyType="done"
            />
          </View>

          {/* ── Campo: Fecha ── */}
          <View style={styles.field}>
            <Text style={styles.label}>Fecha</Text>
            <View style={styles.dateInputContainer}>
              <Ionicons name="calendar-outline" size={18} color="#9CA3AF" style={styles.dateIcon} />
              <TextInput
                style={styles.dateInput}
                value={date}
                onChangeText={setDate}
                placeholder="AAAA-MM-DD"
                placeholderTextColor="#D1D5DB"
                keyboardType="numbers-and-punctuation"
                maxLength={10}
              />
            </View>
            <Text style={styles.fieldHint}>Formato: AAAA-MM-DD (ej: 2026-03-15)</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // ── Header ──────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  saveButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  // ── Scroll ──────────────────────────────────
  scrollView: { flex: 1 },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  // ── Toggle de tipo ───────────────────────────
  typeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 4,
    gap: 4,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  typeButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  incomeActive: { backgroundColor: '#059669' },
  expenseActive: { backgroundColor: '#DC2626' },
  typeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  // ── Campos del formulario ────────────────────
  field: {
    gap: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  fieldHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 6,
  },
  // Monto
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    paddingVertical: 14,
  },
  // Descripción
  textInput: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#FAFAFA',
  },
  // Fecha
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: '#FAFAFA',
  },
  dateIcon: {
    marginRight: 10,
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 14,
  },
});
