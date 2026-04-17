import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Alert, ActivityIndicator, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getPreciosCliente, getCliente } from '@/db/queries/clientes';
import { registrarVenta } from '@/db/queries/ventas';
import { useJornadaStore } from '@/stores/jornadaStore';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { LISTA_PRODUCTOS, TipoProducto } from '@/constants/productos';
import { MetodoPago, VentaItem } from '@/types/ventas';
import { Colores } from '@/constants/colores';
import { formatCurrency, formatKg } from '@/utils/formatters';
import { parsearNumero } from '@/utils/validators';
import { PrecioCliente } from '@/types/clientes';

interface ItemForm {
  tipo_producto: TipoProducto;
  cantidad: string;
  precio_unitario: string;
}

const METODOS: { key: MetodoPago; label: string; color: string }[] = [
  { key: 'efectivo', label: 'Efectivo', color: Colores.exito },
  { key: 'transferencia', label: 'Transferencia', color: Colores.transferencia },
  { key: 'credito', label: 'Crédito', color: Colores.advertencia },
];

export default function NuevaVentaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clienteId = parseInt(id);
  const { jornadaActual } = useJornadaStore();
  const usuario = useAuthStore((s) => s.usuario);
  const { mostrarToast } = useUIStore();

  const [clienteNombre, setClienteNombre] = useState('');
  const [precios, setPrecios] = useState<PrecioCliente[]>([]);
  const [items, setItems] = useState<ItemForm[]>([
    { tipo_producto: 'pechuga', cantidad: '', precio_unitario: '' },
  ]);
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo');
  const [montoPagado, setMontoPagado] = useState('');
  const [notas, setNotas] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const [cliente, preciosDB] = await Promise.all([
        getCliente(clienteId),
        getPreciosCliente(clienteId),
      ]);
      if (cliente) setClienteNombre(cliente.nombre);
      setPrecios(preciosDB);
      setCargando(false);
    }
    cargar();
  }, [clienteId]);

  function getPrecioProducto(tipo: TipoProducto): number {
    return precios.find((p) => p.tipo_producto === tipo)?.precio_kg ?? 0;
  }

  function actualizarItem(idx: number, campo: keyof ItemForm, valor: string) {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const actualizado = { ...item, [campo]: valor };
        if (campo === 'tipo_producto') {
          actualizado.precio_unitario = getPrecioProducto(valor as TipoProducto).toString();
        }
        return actualizado;
      })
    );
  }

  function agregarItem() {
    setItems((prev) => [
      ...prev,
      { tipo_producto: 'pechuga', cantidad: '', precio_unitario: getPrecioProducto('pechuga').toString() },
    ]);
  }

  function quitarItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function calcularSubtotal(item: ItemForm): number {
    const cant = parsearNumero(item.cantidad);
    const precio = parsearNumero(item.precio_unitario);
    return cant * precio;
  }

  const totalVenta = items.reduce((s, i) => s + calcularSubtotal(i), 0);

  const montoPagadoNum =
    metodoPago === 'credito' ? parsearNumero(montoPagado) : totalVenta;

  async function handleConfirmar() {
    if (!jornadaActual || !usuario) return;

    const itemsValidos = items.filter(
      (i) => parsearNumero(i.cantidad) > 0 && parsearNumero(i.precio_unitario) > 0
    );

    if (itemsValidos.length === 0) {
      Alert.alert('Error', 'Agrega al menos un producto con cantidad y precio');
      return;
    }

    if (metodoPago === 'credito' && montoPagadoNum > totalVenta) {
      Alert.alert('Error', 'El monto pagado no puede superar el total');
      return;
    }

    setGuardando(true);
    try {
      const ventaItems = itemsValidos.map((i) => ({
        tipo_producto: i.tipo_producto,
        cantidad: parsearNumero(i.cantidad),
        unidad: LISTA_PRODUCTOS.find((p) => p.id === i.tipo_producto)?.unidad ?? 'kg',
        precio_unitario: parsearNumero(i.precio_unitario),
        subtotal: calcularSubtotal(i),
      }));

      await registrarVenta({
        jornada_id: jornadaActual.id,
        cliente_id: clienteId,
        vendedor_id: usuario.id,
        metodo_pago: metodoPago,
        monto_pagado: montoPagadoNum,
        notas: notas.trim() || undefined,
        items: ventaItems,
      });

      mostrarToast('Venta registrada exitosamente', 'exito');
      router.back();
    } catch (e) {
      Alert.alert('Error', 'No se pudo registrar la venta');
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
      <Stack.Screen options={{ title: `Venta — ${clienteNombre}` }} />
      <ScrollView contentContainerStyle={estilos.scroll} keyboardShouldPersistTaps="handled">
        {/* Items */}
        <Text style={estilos.seccion}>Productos</Text>
        {items.map((item, idx) => (
          <View key={idx} style={estilos.itemCard}>
            <View style={estilos.itemHeader}>
              <Text style={estilos.itemNum}>#{idx + 1}</Text>
              {items.length > 1 && (
                <TouchableOpacity onPress={() => quitarItem(idx)}>
                  <Ionicons name="trash-outline" size={18} color={Colores.peligro} />
                </TouchableOpacity>
              )}
            </View>

            {/* Selector tipo producto */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
              <View style={estilos.chipRow}>
                {LISTA_PRODUCTOS.map((prod) => (
                  <TouchableOpacity
                    key={prod.id}
                    style={[
                      estilos.chip,
                      item.tipo_producto === prod.id && { backgroundColor: prod.color, borderColor: prod.color },
                    ]}
                    onPress={() => actualizarItem(idx, 'tipo_producto', prod.id)}
                  >
                    <Text style={[
                      estilos.chipTxt,
                      item.tipo_producto === prod.id && { color: '#fff' },
                    ]}>
                      {prod.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={estilos.inputsRow}>
              <View style={estilos.inputGroup}>
                <Text style={estilos.inputLabel}>Cantidad (kg/und)</Text>
                <TextInput
                  style={estilos.input}
                  value={item.cantidad}
                  onChangeText={(v) => actualizarItem(idx, 'cantidad', v)}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor={Colores.textoD}
                />
              </View>
              <View style={estilos.inputGroup}>
                <Text style={estilos.inputLabel}>Precio unitario</Text>
                <TextInput
                  style={estilos.input}
                  value={item.precio_unitario}
                  onChangeText={(v) => actualizarItem(idx, 'precio_unitario', v)}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor={Colores.textoD}
                />
              </View>
            </View>

            {parsearNumero(item.cantidad) > 0 && parsearNumero(item.precio_unitario) > 0 && (
              <Text style={estilos.itemSubtotal}>
                Subtotal: {formatCurrency(calcularSubtotal(item))}
              </Text>
            )}
          </View>
        ))}

        <TouchableOpacity style={estilos.btnAgregar} onPress={agregarItem}>
          <Ionicons name="add-circle-outline" size={18} color={Colores.secundario} />
          <Text style={estilos.txtAgregar}>Agregar producto</Text>
        </TouchableOpacity>

        {/* Total */}
        <View style={estilos.totalCard}>
          <Text style={estilos.totalLabel}>Total</Text>
          <Text style={estilos.totalMonto}>{formatCurrency(totalVenta)}</Text>
        </View>

        {/* Método de pago */}
        <Text style={estilos.seccion}>Método de pago</Text>
        <View style={estilos.metodosRow}>
          {METODOS.map((m) => (
            <TouchableOpacity
              key={m.key}
              style={[
                estilos.metodoChip,
                metodoPago === m.key && { backgroundColor: m.color, borderColor: m.color },
              ]}
              onPress={() => setMetodoPago(m.key)}
            >
              <Text style={[
                estilos.metodoCipTxt,
                metodoPago === m.key && { color: '#fff' },
              ]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Monto pagado (solo si crédito) */}
        {metodoPago === 'credito' && (
          <View style={estilos.montoPagadoSec}>
            <Text style={estilos.seccion}>Monto pagado hoy (puede ser 0)</Text>
            <TextInput
              style={estilos.inputMonto}
              value={montoPagado}
              onChangeText={setMontoPagado}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={Colores.textoD}
            />
            <Text style={estilos.montoCreditoInfo}>
              Quedará en crédito: {formatCurrency(totalVenta - parsearNumero(montoPagado))}
            </Text>
          </View>
        )}

        {/* Notas */}
        <TextInput
          style={estilos.notasInput}
          value={notas}
          onChangeText={setNotas}
          placeholder="Notas adicionales (opcional)"
          placeholderTextColor={Colores.textoD}
          multiline
          numberOfLines={2}
        />
      </ScrollView>

      <View style={estilos.pie}>
        <TouchableOpacity style={estilos.btnCancelar} onPress={() => router.back()}>
          <Text style={estilos.txtCancelar}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.btnConfirmar, guardando && { opacity: 0.7 }]}
          onPress={handleConfirmar}
          disabled={guardando}
        >
          {guardando ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={estilos.txtConfirmar}>
              Confirmar {formatCurrency(totalVenta)}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colores.fondo },
  scroll: { padding: 16, paddingBottom: 8 },
  seccion: { fontSize: 15, fontWeight: '700', color: Colores.textoP, marginBottom: 10, marginTop: 4 },
  itemCard: {
    backgroundColor: Colores.superficie,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  itemNum: { fontSize: 13, fontWeight: '700', color: Colores.textoS },
  chipRow: { flexDirection: 'row', gap: 8 },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colores.borde,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colores.fondo,
  },
  chipTxt: { fontSize: 13, color: Colores.textoS, fontWeight: '600' },
  inputsRow: { flexDirection: 'row', gap: 12 },
  inputGroup: { flex: 1 },
  inputLabel: { fontSize: 11, fontWeight: '600', color: Colores.textoS, marginBottom: 4 },
  input: {
    backgroundColor: Colores.fondo,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colores.borde,
    padding: 10,
    fontSize: 16,
    color: Colores.textoP,
  },
  itemSubtotal: { fontSize: 14, fontWeight: '700', color: Colores.exito, marginTop: 8, textAlign: 'right' },
  btnAgregar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colores.secundario,
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  txtAgregar: { color: Colores.secundario, fontSize: 14, fontWeight: '600' },
  totalCard: {
    backgroundColor: Colores.primario,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#fff' },
  totalMonto: { fontSize: 24, fontWeight: '800', color: '#fff' },
  metodosRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  metodoChip: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colores.borde,
    padding: 12,
    alignItems: 'center',
    backgroundColor: Colores.superficie,
  },
  metodoCipTxt: { fontSize: 13, fontWeight: '700', color: Colores.textoS },
  montoPagadoSec: { marginBottom: 16 },
  inputMonto: {
    backgroundColor: Colores.superficie,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colores.borde,
    padding: 14,
    fontSize: 18,
    color: Colores.textoP,
    fontWeight: '700',
  },
  montoCreditoInfo: { fontSize: 13, color: Colores.advertencia, fontWeight: '600', marginTop: 6 },
  notasInput: {
    backgroundColor: Colores.superficie,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colores.borde,
    padding: 12,
    fontSize: 14,
    color: Colores.textoP,
    marginBottom: 16,
    minHeight: 60,
    textAlignVertical: 'top',
  },
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
  btnConfirmar: {
    flex: 2,
    backgroundColor: Colores.exito,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  txtConfirmar: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
