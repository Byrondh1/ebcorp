import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { getPreciosCliente, upsertPrecioCliente, getCliente } from '@/db/queries/clientes';
import { PrecioCliente } from '@/types/clientes';
import { LISTA_PRODUCTOS, TipoProducto } from '@/constants/productos';
import { Colores } from '@/constants/colores';
import { formatCurrency } from '@/utils/formatters';
import { parsearNumero } from '@/utils/validators';
import { FormField } from '@/components/shared/FormField';
import { Ionicons } from '@expo/vector-icons';

export default function PreciosClienteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clienteId = parseInt(id);

  const [clienteNombre, setClienteNombre] = useState('');
  const [precios, setPrecios] = useState<Record<TipoProducto, string>>({
    pechuga: '', filete: '', menudencia: '', recortes: '', pollo_entero: '',
  });
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const [cliente, preciosDB] = await Promise.all([
        getCliente(clienteId),
        getPreciosCliente(clienteId),
      ]);
      if (cliente) setClienteNombre(cliente.nombre);
      const mapa: Record<string, string> = {};
      preciosDB.forEach((p) => {
        mapa[p.tipo_producto] = p.precio_kg.toString();
      });
      setPrecios((prev) => ({ ...prev, ...mapa }));
      setCargando(false);
    }
    cargar();
  }, [clienteId]);

  async function handleGuardar() {
    setGuardando(true);
    try {
      for (const prod of LISTA_PRODUCTOS) {
        const valor = precios[prod.id];
        if (valor && parsearNumero(valor) > 0) {
          await upsertPrecioCliente(clienteId, prod.id, parsearNumero(valor));
        }
      }
      Alert.alert('Guardado', 'Precios actualizados correctamente', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert('Error', 'No se pudieron guardar los precios');
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return (
      <SafeAreaView style={estilos.contenedor}>
        <ActivityIndicator color={Colores.primario} style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={estilos.contenedor}>
      <Stack.Screen options={{ title: `Precios — ${clienteNombre}` }} />
      <ScrollView contentContainerStyle={estilos.scroll} keyboardShouldPersistTaps="handled">
        <Text style={estilos.descripcion}>
          Configura el precio por kilogramo (o por unidad) para cada tipo de producto.
          Deja en blanco los que no aplican.
        </Text>
        {LISTA_PRODUCTOS.map((prod) => (
          <View key={prod.id} style={estilos.productoRow}>
            <View style={[estilos.productoIcono, { backgroundColor: prod.color + '20' }]}>
              <Ionicons name={prod.icono as any} size={20} color={prod.color} />
            </View>
            <View style={estilos.productoInfo}>
              <Text style={estilos.productoNombre}>{prod.label}</Text>
              <Text style={estilos.productoUnidad}>precio por {prod.unidad}</Text>
            </View>
            <View style={estilos.precioInput}>
              <FormField
                label=""
                value={precios[prod.id]}
                onChangeText={(t) => setPrecios((p) => ({ ...p, [prod.id]: t }))}
                keyboardType="decimal-pad"
                placeholder="0.00"
                style={estilos.inputPrecio}
              />
            </View>
          </View>
        ))}
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
            <Text style={estilos.txtGuardar}>Guardar Precios</Text>
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
    lineHeight: 20,
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  productoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colores.superficie,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  productoIcono: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productoInfo: { flex: 1 },
  productoNombre: { fontSize: 15, fontWeight: '700', color: Colores.textoP },
  productoUnidad: { fontSize: 11, color: Colores.textoS },
  precioInput: { width: 100 },
  inputPrecio: { textAlign: 'right' },
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
