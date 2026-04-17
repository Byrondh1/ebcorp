import React, { useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useJornadaStore } from '@/stores/jornadaStore';
import { useInventarioStore } from '@/stores/inventarioStore';
import { LISTA_PRODUCTOS } from '@/constants/productos';
import { Colores } from '@/constants/colores';
import { formatKg, formatUnidades } from '@/utils/formatters';
import { EmptyState } from '@/components/shared/EmptyState';

export default function InventarioScreen() {
  const { jornadaActual } = useJornadaStore();
  const { balance, cargando, refrescar } = useInventarioStore();

  useEffect(() => {
    if (jornadaActual) {
      refrescar(jornadaActual.id);
    }
  }, [jornadaActual]);

  const estaAbierta = jornadaActual?.estado === 'abierta';

  function getDisponible(tipo: string): string {
    if (!balance) return '—';
    switch (tipo) {
      case 'pechuga': return formatKg(balance.pechuga_disponible);
      case 'filete': return formatKg(balance.filete_disponible);
      case 'menudencia': return formatUnidades(balance.menudencia_disponible);
      case 'recortes': return formatKg(balance.recortes_disponible);
      case 'pollo_entero': return formatKg(balance.pollo_entero_disponible);
      default: return '—';
    }
  }

  function getBajo(tipo: string): boolean {
    if (!balance) return false;
    switch (tipo) {
      case 'pechuga': return balance.pechuga_disponible < 5;
      case 'filete': return balance.filete_disponible < 5;
      case 'menudencia': return balance.menudencia_disponible < 5;
      case 'recortes': return balance.recortes_disponible < 5;
      case 'pollo_entero': return balance.pollo_entero_disponible < 5;
      default: return false;
    }
  }

  if (!jornadaActual) {
    return (
      <SafeAreaView style={estilos.contenedor}>
        <EmptyState icono="calendar-outline" mensaje="Sin jornada activa" subtitulo="Abre una jornada desde el inicio para gestionar el inventario" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={estilos.contenedor}>
      <View style={estilos.header}>
        <View>
          <Text style={estilos.titulo}>Inventario</Text>
          <Text style={estilos.subtitulo}>
            Entrada total: {balance ? formatKg(balance.peso_entrada_total) : '—'}
          </Text>
        </View>
        {estaAbierta && (
          <View style={estilos.acciones}>
            <TouchableOpacity
              style={estilos.btnAccion}
              onPress={() => router.push('/(tabs)/inventario/nueva-entrada')}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={estilos.txtBtnAccion}>Entrada</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[estilos.btnAccion, { backgroundColor: Colores.acento }]}
              onPress={() => router.push('/(tabs)/inventario/procesar')}
            >
              <Ionicons name="construct-outline" size={18} color="#fff" />
              <Text style={estilos.txtBtnAccion}>Procesar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {cargando ? (
        <ActivityIndicator color={Colores.primario} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={estilos.scroll}>
          <Text style={estilos.seccion}>Disponible ahora</Text>
          {LISTA_PRODUCTOS.map((prod) => {
            const bajo = getBajo(prod.id);
            return (
              <View key={prod.id} style={estilos.productoCard}>
                <View style={[estilos.productoIcono, { backgroundColor: prod.color + '20' }]}>
                  <Ionicons name={prod.icono as any} size={24} color={prod.color} />
                </View>
                <View style={estilos.productoInfo}>
                  <Text style={estilos.productoNombre}>{prod.label}</Text>
                  <Text style={estilos.productoUnidad}>por {prod.unidad}</Text>
                </View>
                <View style={estilos.productoCantidad}>
                  <Text style={[estilos.cantidadTexto, bajo && { color: Colores.peligro }]}>
                    {getDisponible(prod.id)}
                  </Text>
                  {bajo && (
                    <Text style={estilos.advertencia}>Stock bajo</Text>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colores.fondo },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: Colores.superficie,
    borderBottomWidth: 1,
    borderBottomColor: Colores.borde,
  },
  titulo: { fontSize: 20, fontWeight: '800', color: Colores.textoP },
  subtitulo: { fontSize: 13, color: Colores.textoS, marginTop: 2 },
  acciones: { flexDirection: 'row', gap: 8 },
  btnAccion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colores.primario,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  txtBtnAccion: { color: '#fff', fontSize: 13, fontWeight: '600' },
  scroll: { padding: 16, gap: 10 },
  seccion: { fontSize: 14, fontWeight: '700', color: Colores.textoS, marginBottom: 4 },
  productoCard: {
    backgroundColor: Colores.superficie,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
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
  productoInfo: { flex: 1 },
  productoNombre: { fontSize: 16, fontWeight: '700', color: Colores.textoP },
  productoUnidad: { fontSize: 12, color: Colores.textoS, marginTop: 2 },
  productoCantidad: { alignItems: 'flex-end' },
  cantidadTexto: { fontSize: 18, fontWeight: '800', color: Colores.textoP },
  advertencia: { fontSize: 11, color: Colores.peligro, fontWeight: '600', marginTop: 2 },
});
