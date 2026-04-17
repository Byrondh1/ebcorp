import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/constants/colores';

const REPORTES = [
  {
    id: 'diario',
    titulo: 'Reporte del Día',
    descripcion: 'Ventas por cliente, cobros y créditos del día activo',
    icono: 'today-outline' as const,
    color: Colores.primario,
    ruta: '/(tabs)/reportes/diario' as const,
  },
  {
    id: 'inventario',
    titulo: 'Inventario',
    descripcion: 'Entrada, procesamiento y disponibilidad del día',
    icono: 'cube-outline' as const,
    color: Colores.acento,
    ruta: '/(tabs)/reportes/inventario' as const,
  },
  {
    id: 'semanal',
    titulo: 'Semanal / Mensual',
    descripcion: 'Resumen de ventas y cobros por rango de fechas',
    icono: 'calendar-outline' as const,
    color: Colores.exito,
    ruta: '/(tabs)/reportes/semanal' as const,
  },
];

export default function ReportesScreen() {
  return (
    <SafeAreaView style={estilos.contenedor}>
      <View style={estilos.header}>
        <Text style={estilos.titulo}>Reportes</Text>
      </View>
      <ScrollView contentContainerStyle={estilos.scroll}>
        <Text style={estilos.descripcion}>
          Accede a los reportes del negocio para tomar decisiones informadas.
        </Text>
        {REPORTES.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={estilos.reporteCard}
            onPress={() => router.push(r.ruta)}
            activeOpacity={0.7}
          >
            <View style={[estilos.reporteIcono, { backgroundColor: r.color + '20' }]}>
              <Ionicons name={r.icono} size={28} color={r.color} />
            </View>
            <View style={estilos.reporteInfo}>
              <Text style={estilos.reporteTitulo}>{r.titulo}</Text>
              <Text style={estilos.reporteDesc}>{r.descripcion}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colores.textoD} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colores.fondo },
  header: {
    padding: 16,
    backgroundColor: Colores.superficie,
    borderBottomWidth: 1,
    borderBottomColor: Colores.borde,
  },
  titulo: { fontSize: 20, fontWeight: '800', color: Colores.textoP },
  scroll: { padding: 16, gap: 12, paddingBottom: 32 },
  descripcion: { fontSize: 14, color: Colores.textoS, lineHeight: 20, marginBottom: 8 },
  reporteCard: {
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
  reporteIcono: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reporteInfo: { flex: 1 },
  reporteTitulo: { fontSize: 16, fontWeight: '700', color: Colores.textoP, marginBottom: 4 },
  reporteDesc: { fontSize: 13, color: Colores.textoS, lineHeight: 18 },
});
