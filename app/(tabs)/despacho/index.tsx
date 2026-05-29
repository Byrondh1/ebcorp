import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useJornadaStore } from '@/stores/jornadaStore';
import { useAuthStore } from '@/stores/authStore';
import { getDespachosDia } from '@/db/queries/despachos';
import { Despacho } from '@/types/despacho';
import { PRODUCTOS } from '@/constants/productos';
import { Colores } from '@/constants/colores';
import { formatKg, formatUnidades } from '@/utils/formatters';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';

export default function DespachoScreen() {
  const { jornadaActual } = useJornadaStore();
  const usuario = useAuthStore((s) => s.usuario);
  const [despachos, setDespachos] = useState<Despacho[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    if (!jornadaActual) { setCargando(false); return; }
    setCargando(true);
    try {
      const vendedorId = usuario?.rol === 'vendedor' ? usuario.id : undefined;
      const data = await getDespachosDia(jornadaActual.id, vendedorId);
      setDespachos(data);
    } finally {
      setCargando(false);
    }
  }, [jornadaActual, usuario]);

  useEffect(() => { cargar(); }, [cargar]);

  const estaAbierta = jornadaActual?.estado === 'abierta';

  return (
    <SafeAreaView style={estilos.contenedor}>
      <View style={estilos.header}>
        <Text style={estilos.titulo}>Despacho</Text>
        {estaAbierta && usuario?.rol === 'admin' && (
          <TouchableOpacity
            style={estilos.btnNuevo}
            onPress={() => router.push('/(tabs)/despacho/nuevo')}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={estilos.txtBtnNuevo}>Nuevo</Text>
          </TouchableOpacity>
        )}
      </View>

      {!jornadaActual ? (
        <EmptyState
          icono="calendar-outline"
          mensaje="Sin jornada activa"
          subtitulo="Abre una jornada para registrar despachos"
        />
      ) : cargando ? (
        <ActivityIndicator color={Colores.primario} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={despachos}
          keyExtractor={(d) => d.id.toString()}
          contentContainerStyle={estilos.lista}
          onRefresh={cargar}
          refreshing={cargando}
          ListEmptyComponent={
            <EmptyState
              icono="car-outline"
              mensaje="Sin despachos"
              subtitulo="No hay despachos registrados hoy"
            />
          }
          renderItem={({ item }) => {
            const prod = PRODUCTOS[item.tipo_producto];
            const cantidad =
              item.unidad === 'kg'
                ? formatKg(item.cantidad)
                : formatUnidades(item.cantidad);
            return (
              <TouchableOpacity
                style={estilos.despachoCard}
                onPress={() => router.push(`/(tabs)/despacho/${item.id}`)}
                activeOpacity={0.7}
              >
                <View style={[estilos.productoIcono, { backgroundColor: prod.color + '20' }]}>
                  <Ionicons name={prod.icono as any} size={22} color={prod.color} />
                </View>
                <View style={estilos.despachoInfo}>
                  <Text style={estilos.vendedorNombre}>{item.vendedor_nombre}</Text>
                  <Text style={estilos.productoNombre}>{prod.label} · {cantidad}</Text>
                </View>
                <StatusBadge
                  texto={item.confirmado ? 'Confirmado' : 'Pendiente'}
                  estado={item.confirmado ? 'exito' : 'advertencia'}
                />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colores.fondo },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colores.superficie,
    borderBottomWidth: 1,
    borderBottomColor: Colores.borde,
  },
  titulo: { fontSize: 20, fontWeight: '800', color: Colores.textoP },
  btnNuevo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colores.primario,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  txtBtnNuevo: { color: '#fff', fontSize: 14, fontWeight: '600' },
  lista: { padding: 12, gap: 10, paddingBottom: 32 },
  despachoCard: {
    backgroundColor: Colores.superficie,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  productoIcono: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  despachoInfo: { flex: 1 },
  vendedorNombre: { fontSize: 15, fontWeight: '700', color: Colores.textoP },
  productoNombre: { fontSize: 13, color: Colores.textoS, marginTop: 2 },
});
