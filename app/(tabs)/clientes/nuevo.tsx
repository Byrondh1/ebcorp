import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { crearCliente } from '@/db/queries/clientes';
import { getVendedores } from '@/db/queries/usuarios';
import { FormField } from '@/components/shared/FormField';
import { Colores } from '@/constants/colores';
import { Usuario } from '@/types/auth';

export default function NuevoClienteScreen() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [notas, setNotas] = useState('');
  const [vendedorId, setVendedorId] = useState<number | undefined>();
  const [vendedores, setVendedores] = useState<Usuario[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [errNombre, setErrNombre] = useState('');

  useEffect(() => {
    getVendedores().then(setVendedores);
  }, []);

  async function handleGuardar() {
    if (!nombre.trim()) {
      setErrNombre('El nombre es obligatorio');
      return;
    }
    setGuardando(true);
    try {
      const id = await crearCliente({
        nombre: nombre.trim(),
        telefono: telefono.trim() || undefined,
        direccion: direccion.trim() || undefined,
        vendedor_id: vendedorId,
        notas: notas.trim() || undefined,
      });
      router.replace(`/(tabs)/clientes/${id}`);
    } catch (e) {
      Alert.alert('Error', 'No se pudo crear el cliente');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <SafeAreaView style={estilos.contenedor}>
      <Stack.Screen options={{ title: 'Nuevo Cliente' }} />
      <ScrollView contentContainerStyle={estilos.scroll} keyboardShouldPersistTaps="handled">
        <View style={estilos.formulario}>
          <FormField
            label="Nombre *"
            value={nombre}
            onChangeText={(t) => { setNombre(t); setErrNombre(''); }}
            placeholder="Nombre del cliente"
            autoCapitalize="words"
            error={errNombre}
          />
          <FormField
            label="Teléfono (opcional)"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
            placeholder="Número de contacto"
          />
          <FormField
            label="Dirección (opcional)"
            value={direccion}
            onChangeText={setDireccion}
            placeholder="Dirección de entrega"
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

          {vendedores.length > 0 && (
            <View style={estilos.vendedorSec}>
              <Text style={estilos.vendedorLabel}>Vendedor asignado</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                <View style={estilos.vendedoresRow}>
                  <TouchableOpacity
                    style={[estilos.chipVendedor, !vendedorId && estilos.chipActivo]}
                    onPress={() => setVendedorId(undefined)}
                  >
                    <Text style={[estilos.chipTxt, !vendedorId && estilos.chipTxtActivo]}>
                      Sin asignar
                    </Text>
                  </TouchableOpacity>
                  {vendedores.map((v) => (
                    <TouchableOpacity
                      key={v.id}
                      style={[estilos.chipVendedor, vendedorId === v.id && estilos.chipActivo]}
                      onPress={() => setVendedorId(v.id)}
                    >
                      <Text style={[estilos.chipTxt, vendedorId === v.id && estilos.chipTxtActivo]}>
                        {v.nombre}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
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
            <Text style={estilos.txtGuardar}>Crear Cliente</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colores.fondo },
  scroll: { padding: 16, paddingBottom: 8 },
  formulario: {},
  vendedorSec: { marginBottom: 16 },
  vendedorLabel: { fontSize: 13, fontWeight: '600', color: Colores.textoS },
  vendedoresRow: { flexDirection: 'row', gap: 8 },
  chipVendedor: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colores.borde,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colores.superficie,
  },
  chipActivo: { backgroundColor: Colores.primario, borderColor: Colores.primario },
  chipTxt: { fontSize: 14, color: Colores.textoS },
  chipTxtActivo: { color: '#fff', fontWeight: '700' },
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
