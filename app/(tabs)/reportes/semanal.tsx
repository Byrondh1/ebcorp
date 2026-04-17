import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { getReporteSemanal } from '@/utils/reportHelpers';
import { Colores } from '@/constants/colores';
import { formatCurrency, formatDate, todayISO } from '@/utils/formatters';

function getFechaInicio(semanas: number): string {
  const d = new Date();
  d.setDate(d.getDate() - semanas * 7);
  return d.toISOString().split('T')[0];
}

const RANGOS = [
  { label: 'Última semana', semanas: 1 },
  { label: '2 semanas', semanas: 2 },
  { label: 'Mes (4 sem)', semanas: 4 },
];

export default function ReporteSemanalScreen() {
  const [semanasSelec, setSemanasSelec] = useState(1);
  const [reporte, setReporte] = useState<{
    por_dia: { fecha: string; total: number; cobrado: number }[];
    totales: { total: number; cobrado: number; credito: number };
  } | null>(null);
  const [cargando, setCargando] = useState(false);

  async function cargar(semanas: number) {
    setSemanasSelec(semanas);
    setCargando(true);
    try {
      const inicio = getFechaInicio(semanas);
      const fin = todayISO();
      const data = await getReporteSemanal(inicio, fin);
      setReporte(data);
    } finally {
      setCargando(false);
    }
  }

  React.useEffect(() => { cargar(1); }, []);

  return (
    <SafeAreaView style={estilos.contenedor}>
      <Stack.Screen options={{ title: 'Reporte Semanal' }} />
      <ScrollView contentContainerStyle={estilos.scroll}>
        {/* Selector rango */}
        <View style={estilos.rangosRow}>
          {RANGOS.map((r) => (
            <TouchableOpacity
              key={r.semanas}
              style={[estilos.rangoChip, semanasSelec === r.semanas && estilos.rangoActivo]}
              onPress={() => cargar(r.semanas)}
            >
              <Text style={[estilos.rangoTxt, semanasSelec === r.semanas && estilos.rangoTxtActivo]}>
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {cargando ? (
          <ActivityIndicator color={Colores.primario} style={{ marginTop: 40 }} />
        ) : reporte ? (
          <>
            {/* Totales */}
            <View style={estilos.totalesCard}>
              <FilaTotales label="Total vendido" valor={formatCurrency(reporte.totales.total)} />
              <FilaTotales label="Total cobrado" valor={formatCurrency(reporte.totales.cobrado)} color={Colores.exito} />
              <FilaTotales label="Total crédito" valor={formatCurrency(reporte.totales.credito)} color={Colores.peligro} ultimo />
            </View>

            {/* Por día */}
            <Text style={estilos.seccion}>Detalle por día</Text>
            {reporte.por_dia.length === 0 ? (
              <Text style={estilos.sinDatos}>Sin jornadas en este rango</Text>
            ) : (
              reporte.por_dia.map((dia, idx) => (
                <View key={idx} style={estilos.diaCard}>
                  <Text style={estilos.diaFecha}>{formatDate(dia.fecha)}</Text>
                  <View style={estilos.diaDetalle}>
                    <View>
                      <Text style={estilos.detLabel}>Ventas</Text>
                      <Text style={estilos.detValor}>{formatCurrency(dia.total)}</Text>
                    </View>
                    <View>
                      <Text style={estilos.detLabel}>Cobrado</Text>
                      <Text style={[estilos.detValor, { color: Colores.exito }]}>
                        {formatCurrency(dia.cobrado)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function FilaTotales({ label, valor, color, ultimo }: {
  label: string; valor: string; color?: string; ultimo?: boolean;
}) {
  return (
    <View style={[estilos.filaTotales, ultimo && { borderBottomWidth: 0 }]}>
      <Text style={estilos.filaTLabel}>{label}</Text>
      <Text style={[estilos.filaTValor, color ? { color } : {}]}>{valor}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colores.fondo },
  scroll: { padding: 16, paddingBottom: 32 },
  rangosRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  rangoChip: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colores.borde,
    padding: 10,
    alignItems: 'center',
    backgroundColor: Colores.superficie,
  },
  rangoActivo: { backgroundColor: Colores.primario, borderColor: Colores.primario },
  rangoTxt: { fontSize: 12, fontWeight: '600', color: Colores.textoS },
  rangoTxtActivo: { color: '#fff' },
  totalesCard: {
    backgroundColor: Colores.superficie,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  filaTotales: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colores.borde,
  },
  filaTLabel: { fontSize: 14, color: Colores.textoS },
  filaTValor: { fontSize: 14, fontWeight: '700', color: Colores.textoP },
  seccion: { fontSize: 15, fontWeight: '700', color: Colores.textoP, marginBottom: 10 },
  sinDatos: { fontSize: 14, color: Colores.textoS, textAlign: 'center', padding: 20 },
  diaCard: {
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
  diaFecha: { fontSize: 14, fontWeight: '700', color: Colores.textoP, marginBottom: 8 },
  diaDetalle: { flexDirection: 'row', justifyContent: 'space-between' },
  detLabel: { fontSize: 11, color: Colores.textoS, fontWeight: '600', marginBottom: 2 },
  detValor: { fontSize: 15, fontWeight: '700', color: Colores.textoP },
});
