import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { crearDespacho } from '@/db/queries/despachos';
import { getVendedores } from '@/db/queries/usuarios';
import { useJornadaStore } from '@/stores/jornadaStore';
import { useInventarioStore } from '@/stores/inventarioStore';
import { FormField } from '@/components/shared/FormField';
import { LISTA_PRODUCTOS, TipoProducto } from '@/constants/productos';
import { Colores } from '@/constants/colores';
import { parsearNumero, esNumeroValido } from '@/utils/validators';
import { formatKg, formatUnidades } from '@/utils/formatters';
import { Usuario } from '@/types/auth';

export default function NuevoDespachoScreen() {
  const { jornadaActual } = useJornadaStore();
  const { balance, refrescar } = useInventarioStore();

  const [vendedorId, setVendedorId] = useState<number | null>(null);
  const [tipoProducto, setTipoProducto] = useState<TipoProducto>('pechuga');
  const [cantidad, setCantidad] = useState('');
  const [vendedores, setVendedores] = useState<Usuario[]>([]);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    getVendedores().then(setVendedores);
  }, []);

  function getDisponible(tipo: TipoProducto): number {
    if (!balance) return 0;
    switch (tipo) {
      case 'pechuga': return balance.pechuga_disponible;
      case 'filete': return balance.filete_disponible;
      case 'menudencia': return balance.menudencia_disponible;
      case 'recortes': return balance.recortes_disponible;
      case 'pollo_entero': return balance.pollo_entero_disponible;
    }
  }

  function getDisponibleTexto(tipo: TipoProducto): string {
    const prod = LISTA_PRODUCTOS.find((p) => p.id === tipo)!;
    const disp = getDisponible(tipo);
    return prod.unidad === 'kg' ? formatKg(disp) : formatUnidades(disp);
  }

  async function handleGuardar() {
    if (!vendedorId) {
      Alert.alert('Error', 'Selecciona un vendedor');
      return;
    }
    if (!esNumeroValido(cantidad)) {
      Alert.alert('Error', 'Ingresa una cantidad válida');
      return;
    }
    const cant = parsearNumero(cantidad);
    const disponible = getDisponible(tipoProducto);
    if (cant > disponible) {
      Alert.alert(
        'Inventario insuficiente',
        `Solo hay ${getDisponibleTexto(tipoProducto)} disponibles de ${LISTA_PRODUCTOS.find((p) => p.id === tipoProducto)?.label}`
      );
      return;
    }

    if (!jornadaActual) return;
    const prod = LISTA_PRODUCTOS.find((p) => p.id === tipoProducto)!;

    setGuardando(true);
    try {
      await crearDespacho({
        jornada_id: jornadaActual.id,
        vendedor_id: vendedorId,
        tipo_producto: tipoProducto,
        cantidad: cant,
        unidad: prod.unidad,
      });
      await refrescar(jornadaActual.id);
      router.back();
    } catch (e) {
      Alert.alert('Error', 'No se pudo crear el despacho');
    } finally {
      setGuardando(false);
    }
  }

  const prodActual = LISTA_PRODUCTOS.find((p) => p.id === tipoProducto)!;

  return (
    <SafeAreaView style={estilos.contenedor}>
      <Stack.Screen options={{ title: 'Nuevo Despacho' }} />
      <ScrollView contentContainerStyle={estilos.scroll} keyboardShouldPersistTaps="handled">
        {/* Selector vendedor */}
        <Text style={estilos.seccion}>Vendedor</Text>
        {vendedores.length === 0 ? (
          <Text style={estilos.sinVendedores}>
            No hay vendedores registrados. Crea un usuario vendedor primero.
          </Text>
        ) : (
          <View style={estilos.vendedoresGrid}>
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
        )}

        {/* Selector tipo producto */}
        <Text style={estilos.seccion}>Tipo de producto</Text>
        {LISTA_PRODUCTOS.map((prod) => {
          const disp = getDisponible(prod.id);
          const activo = tipoProducto === prod.id;
          return (
            <TouchableOpacity
              key={prod.id}
              style={[estilos.productoRow, activo && { borderColor: prod.color, borderWidth: 2 }]}
              onPress={() => setTipoProducto(prod.id)}
            >
              <View style={[estilos.prodIcono, { backgroundColor: prod.color + '20' }]}>
                <Ionicons name={prod.icono as any} size={20} color={prod.color} />
              </View>
              <View style={estilos.prodInfo}>
                <Text style={estilos.prodNombre}>{prod.label}</Text>
                <Text style={[estilos.prodDisp, disp < 5 && { color: Colores.peligro }]}>
                  Disponible: {prod.unidad === 'kg' ? formatKg(disp) : formatUnidades(disp)}
                </Text>
              </View>
              {activo && <Ionicons name="checkmark-circle" size={22} color={prod.color} />}
            </TouchableOpacity>
          );
        })}

        {/* Cantidad */}
        <Text style={estilos.seccion}>
          Cantidad ({prodActual.unidad === 'kg' ? 'kg' : 'unidades'})
        </Text>
        <FormField
          label={`Cantidad en ${prodActual.unidad}`}
          value={cantidad}
          onChangeText={setCantidad}
          keyboardType="decimal-pad"
          placeholder={prodActual.unidad === 'kg' ? '0.00' : '0'}
        />
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
            <Text style={estilos.txtGuardar}>Crear Despacho</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colores.fondo },
  scroll: { padding: 16, paddingBottom: 8 },
  seccion: { fontSize: 15, fontWeight: '700', color: Colores.textoP, marginBottom: 10, marginTop: 8 },
  sinVendedores: { fontSize: 14, color: Colores.textoS, padding: 8, marginBottom: 16 },
  vendedoresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  chipVendedor: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colores.borde,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colores.superficie,
  },
  chipActivo: { backgroundColor: Colores.primario, borderColor: Colores.primario },
  chipTxt: { fontSize: 14, color: Colores.textoS, fontWeight: '600' },
  chipTxtActivo: { color: '#fff' },
  productoRow: {
    backgroundColor: Colores.superficie,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colores.borde,
  },
  prodIcono: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  prodInfo: { flex: 1 },
  prodNombre: { fontSize: 15, fontWeight: '700', color: Colores.textoP },
  prodDisp: { fontSize: 12, color: Colores.textoS, marginTop: 2 },
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
