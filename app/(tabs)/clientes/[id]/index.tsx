import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getCliente } from '@/db/queries/clientes';
import { getVentasCliente } from '@/db/queries/ventas';
import { ClienteConSaldo } from '@/types/clientes';
import { Venta } from '@/types/ventas';
import { Colores } from '@/constants/colores';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useJornadaStore } from '@/stores/jornadaStore';
import { StatusBadge } from '@/components/shared/StatusBadge';

const METODO_COLOR: Record<string, any> = {
  efectivo: 'exito',
  transferencia: 'info',
  credito: 'advertencia',
};

const ESTADO_COLOR: Record<string, any> = {
  pagada: 'exito',
  parcial: 'advertencia',
  credito: 'peligro',
};

export default function ClienteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clienteId = parseInt(id);
  const { jornadaActual } = useJornadaStore();

  const [cliente, setCliente] = useState<ClienteConSaldo | null>(null);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const [c, v] = await Promise.all([
        getCliente(clienteId),
        getVentasCliente(clienteId),
      ]);
      setCliente(c);
      setVentas(v);
    } finally {
      setCargando(false);
    }
  }, [clienteId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  if (cargando) {
    return (
      <SafeAreaView style={estilos.contenedor}>
        <ActivityIndicator color={Colores.primario} style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  if (!cliente) return null;

  return (
    <SafeAreaView style={estilos.contenedor}>
      <Stack.Screen options={{ title: cliente.nombre }} />
      <ScrollView contentContainerStyle={estilos.scroll} showsVerticalScrollIndicator={false}>
        {/* Header cliente */}
        <View style={estilos.headerCard}>
          <View style={estilos.avatar}>
            <Text style={estilos.avatarLetra}>{cliente.nombre[0].toUpperCase()}</Text>
          </View>
          <Text style={estilos.clienteNombre}>{cliente.nombre}</Text>
          {cliente.telefono && (
            <Text style={estilos.clienteTel}>{cliente.telefono}</Text>
          )}
          {cliente.saldo_pendiente > 0 && (
            <View style={estilos.deudaCard}>
              <Text style={estilos.deudaLabel}>Saldo pendiente</Text>
              <Text style={estilos.deudaMonto}>{formatCurrency(cliente.saldo_pendiente)}</Text>
            </View>
          )}
        </View>

        {/* Acciones */}
        <View style={estilos.accionesRow}>
          {jornadaActual?.estado === 'abierta' && (
            <TouchableOpacity
              style={estilos.btnAccion}
              onPress={() => router.push(`/(tabs)/clientes/${clienteId}/venta`)}
            >
              <Ionicons name="add-circle-outline" size={20} color="#fff" />
              <Text style={estilos.txtBtnAccion}>Nueva Venta</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[estilos.btnAccion, { backgroundColor: Colores.acento }]}
            onPress={() => router.push(`/(tabs)/clientes/${clienteId}/precios`)}
          >
            <Ionicons name="pricetag-outline" size={20} color="#fff" />
            <Text style={estilos.txtBtnAccion}>Precios</Text>
          </TouchableOpacity>
        </View>

        {/* Historial ventas */}
        <Text style={estilos.seccionTitulo}>Historial de compras</Text>
        {ventas.length === 0 ? (
          <Text style={estilos.sinVentas}>Sin compras registradas</Text>
        ) : (
          ventas.map((v) => (
            <View key={v.id} style={estilos.ventaCard}>
              <View style={estilos.ventaHeader}>
                <Text style={estilos.ventaFecha}>{formatDate(v.registrada_en.split('T')[0])}</Text>
                <StatusBadge
                  texto={v.estado === 'pagada' ? 'Pagada' : v.estado === 'parcial' ? 'Parcial' : 'Crédito'}
                  estado={ESTADO_COLOR[v.estado]}
                />
              </View>
              <View style={estilos.ventaDetalle}>
                <Text style={estilos.ventaMonto}>{formatCurrency(v.subtotal)}</Text>
                <StatusBadge
                  texto={v.metodo_pago === 'efectivo' ? 'Efectivo' : v.metodo_pago === 'transferencia' ? 'Transferencia' : 'Crédito'}
                  estado={METODO_COLOR[v.metodo_pago]}
                />
              </View>
              {v.saldo_pendiente > 0 && (
                <Text style={estilos.ventaSaldo}>
                  Pendiente: {formatCurrency(v.saldo_pendiente)}
                </Text>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colores.fondo },
  scroll: { padding: 16, paddingBottom: 32 },
  headerCard: {
    backgroundColor: Colores.superficie,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colores.primario + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarLetra: { fontSize: 28, fontWeight: '800', color: Colores.primario },
  clienteNombre: { fontSize: 22, fontWeight: '800', color: Colores.textoP, marginBottom: 4 },
  clienteTel: { fontSize: 14, color: Colores.textoS, marginBottom: 12 },
  deudaCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  deudaLabel: { fontSize: 12, color: Colores.peligro, fontWeight: '600' },
  deudaMonto: { fontSize: 20, fontWeight: '800', color: Colores.peligro },
  accionesRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  btnAccion: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colores.primario,
    borderRadius: 12,
    padding: 14,
  },
  txtBtnAccion: { color: '#fff', fontSize: 14, fontWeight: '700' },
  seccionTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: Colores.textoP,
    marginBottom: 12,
  },
  sinVentas: { fontSize: 14, color: Colores.textoS, textAlign: 'center', padding: 20 },
  ventaCard: {
    backgroundColor: Colores.superficie,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  ventaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  ventaFecha: { fontSize: 13, color: Colores.textoS },
  ventaDetalle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ventaMonto: { fontSize: 18, fontWeight: '800', color: Colores.textoP },
  ventaSaldo: { fontSize: 13, color: Colores.peligro, fontWeight: '600', marginTop: 6 },
});
