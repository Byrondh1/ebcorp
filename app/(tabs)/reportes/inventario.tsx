import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useJornadaStore } from '@/stores/jornadaStore';
import { getReporteInventario, ReporteInventario } from '@/utils/reportHelpers';
import { Colores } from '@/constants/colores';
import { formatDate, formatKg, formatUnidades } from '@/utils/formatters';
import { EmptyState } from '@/components/shared/EmptyState';
import { useInventarioStore } from '@/stores/inventarioStore';

export default function ReporteInventarioScreen() {
  const { jornadaActual } = useJornadaStore();
  const { balance } = useInventarioStore();
  const [reporte, setReporte] = useState<ReporteInventario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!jornadaActual) { setCargando(false); return; }
    getReporteInventario(jornadaActual.id).then((r) => {
      setReporte(r);
      setCargando(false);
    });
  }, [jornadaActual]);

  return (
    <SafeAreaView style={estilos.contenedor}>
      <Stack.Screen options={{ title: 'Reporte Inventario' }} />
      {cargando ? (
        <ActivityIndicator color={Colores.primario} style={{ marginTop: 40 }} />
      ) : !reporte ? (
        <EmptyState icono="cube-outline" mensaje="Sin jornada activa" subtitulo="Abre una jornada para ver el inventario" />
      ) : (
        <ScrollView contentContainerStyle={estilos.scroll}>
          <Text style={estilos.fecha}>{formatDate(reporte.fecha)}</Text>

          <View style={estilos.entradaCard}>
            <Text style={estilos.entradaLabel}>Peso de entrada total</Text>
            <Text style={estilos.entradaMonto}>{formatKg(reporte.peso_entrada)}</Text>
          </View>

          <Text style={estilos.seccion}>Procesamiento</Text>
          <View style={estilos.tabla}>
            <FilaTabla label="Pechuga" procesado={formatKg(reporte.pechuga_procesada)} disponible={balance ? formatKg(balance.pechuga_disponible) : '—'} />
            <FilaTabla label="Filete" procesado={formatKg(reporte.filete_procesado)} disponible={balance ? formatKg(balance.filete_disponible) : '—'} />
            <FilaTabla label="Pollo Entero" procesado={formatKg(reporte.pollo_entero_procesado)} disponible={balance ? formatKg(balance.pollo_entero_disponible) : '—'} />
            <FilaTabla label="Recortes" procesado={formatKg(reporte.recortes_procesados)} disponible={balance ? formatKg(balance.recortes_disponible) : '—'} />
            <FilaTabla
              label="Menudencia"
              procesado={formatUnidades(reporte.menudencia_procesada)}
              disponible={balance ? formatUnidades(balance.menudencia_disponible) : '—'}
              ultimo
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function FilaTabla({ label, procesado, disponible, ultimo }: {
  label: string; procesado: string; disponible: string; ultimo?: boolean;
}) {
  return (
    <View style={[estilos.filaTabla, ultimo && { borderBottomWidth: 0 }]}>
      <Text style={estilos.filaLabel}>{label}</Text>
      <Text style={estilos.filaProcesado}>{procesado}</Text>
      <Text style={estilos.filaDisponible}>{disponible}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colores.fondo },
  scroll: { padding: 16, paddingBottom: 32 },
  fecha: { fontSize: 14, color: Colores.textoS, marginBottom: 12, fontWeight: '600' },
  entradaCard: {
    backgroundColor: Colores.primario,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  entradaLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  entradaMonto: { fontSize: 32, fontWeight: '800', color: '#fff', marginTop: 4 },
  seccion: { fontSize: 15, fontWeight: '700', color: Colores.textoP, marginBottom: 10 },
  tabla: {
    backgroundColor: Colores.superficie,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  filaTabla: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colores.borde,
  },
  filaLabel: { flex: 1, fontSize: 14, color: Colores.textoP, fontWeight: '600' },
  filaProcesado: { width: 80, fontSize: 13, color: Colores.textoS, textAlign: 'right' },
  filaDisponible: { width: 80, fontSize: 13, fontWeight: '700', color: Colores.exito, textAlign: 'right' },
});
