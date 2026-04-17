import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Stack } from 'expo-router';
import { useJornadaStore } from '@/stores/jornadaStore';
import { useInventarioStore } from '@/stores/inventarioStore';
import { useAuthStore } from '@/stores/authStore';
import { registrarEntrada } from '@/db/queries/inventario';
import { FormField } from '@/components/shared/FormField';
import { Colores } from '@/constants/colores';
import { parsearNumero, esNumeroValido } from '@/utils/validators';

export default function NuevaEntradaScreen() {
  const { jornadaActual } = useJornadaStore();
  const { refrescar } = useInventarioStore();
  const usuario = useAuthStore((s) => s.usuario);

  const [gavetas, setGavetas] = useState('');
  const [pesoKg, setPesoKg] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [notas, setNotas] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<{ gavetas?: string; peso?: string }>({});

  async function handleGuardar() {
    const nuevosErrores: typeof errores = {};
    if (!gavetas || parseInt(gavetas) < 1) {
      nuevosErrores.gavetas = 'Ingresa el número de gavetas';
    }
    if (!esNumeroValido(pesoKg)) {
      nuevosErrores.peso = 'Ingresa el peso total en kg';
    }
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    if (!jornadaActual) return;
    setGuardando(true);
    try {
      await registrarEntrada(
        jornadaActual.id,
        parseInt(gavetas),
        parsearNumero(pesoKg),
        proveedor.trim() || undefined,
        notas.trim() || undefined
      );
      await refrescar(jornadaActual.id);
      router.back();
    } catch (e) {
      Alert.alert('Error', 'No se pudo registrar la entrada');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <SafeAreaView style={estilos.contenedor}>
      <Stack.Screen options={{ title: 'Nueva Entrada' }} />
      <ScrollView contentContainerStyle={estilos.scroll} keyboardShouldPersistTaps="handled">
        <View style={estilos.formulario}>
          <Text style={estilos.descripcion}>
            Registra las gavetas de pollo que llegaron hoy con su peso total al ingreso.
          </Text>

          <FormField
            label="Número de gavetas"
            value={gavetas}
            onChangeText={(t) => { setGavetas(t); setErrores((e) => ({ ...e, gavetas: undefined })); }}
            keyboardType="number-pad"
            placeholder="Ej: 12"
            error={errores.gavetas}
          />
          <FormField
            label="Peso total (kg)"
            value={pesoKg}
            onChangeText={(t) => { setPesoKg(t); setErrores((e) => ({ ...e, peso: undefined })); }}
            keyboardType="decimal-pad"
            placeholder="Ej: 250.5"
            error={errores.peso}
          />
          <FormField
            label="Proveedor (opcional)"
            value={proveedor}
            onChangeText={setProveedor}
            placeholder="Nombre del proveedor"
          />
          <FormField
            label="Notas (opcional)"
            value={notas}
            onChangeText={setNotas}
            placeholder="Observaciones"
            multiline
            numberOfLines={3}
            style={{ minHeight: 80, textAlignVertical: 'top' }}
          />

          {gavetas && pesoKg && esNumeroValido(pesoKg) && (
            <View style={estilos.resumen}>
              <Text style={estilos.resumenTitulo}>Resumen</Text>
              <Text style={estilos.resumenTexto}>
                {gavetas} gavetas · {parsearNumero(pesoKg)} kg total
              </Text>
              <Text style={estilos.resumenTexto}>
                Promedio: {(parsearNumero(pesoKg) / parseInt(gavetas || '1')).toFixed(1)} kg/gaveta
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={estilos.pie}>
        <TouchableOpacity style={estilos.btnCancelar} onPress={() => router.back()}>
          <Text style={estilos.txtCancelar}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.btnGuardar, guardando && { opacity: 0.7 }]}
          onPress={handleGuardar}
          disabled={guardando}
        >
          {guardando ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={estilos.txtGuardar}>Registrar Entrada</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colores.fondo },
  scroll: { padding: 16, paddingBottom: 8 },
  descripcion: {
    fontSize: 14,
    color: Colores.textoS,
    marginBottom: 20,
    lineHeight: 20,
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 10,
  },
  formulario: { gap: 0 },
  resumen: {
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
  },
  resumenTitulo: { fontSize: 13, fontWeight: '700', color: '#065F46', marginBottom: 4 },
  resumenTexto: { fontSize: 14, color: '#047857', marginTop: 2 },
  pie: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colores.borde,
    backgroundColor: Colores.superficie,
  },
  btnCancelar: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colores.borde,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  txtCancelar: { fontSize: 15, fontWeight: '600', color: Colores.textoS },
  btnGuardar: {
    flex: 2,
    backgroundColor: Colores.primario,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  txtGuardar: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
