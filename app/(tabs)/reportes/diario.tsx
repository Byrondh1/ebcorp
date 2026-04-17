import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useJornadaStore } from '@/stores/jornadaStore';
import { getReporteDiario, ReporteDiario } from '@/utils/reportHelpers';
import { Colores } from '@/constants/colores';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { EmptyState } from '@/components/shared/EmptyState';

export default function ReporteDiarioScreen() {
  const { jornadaActual } = useJornadaStore();
  const [reporte, setReporte] = useState<ReporteDiario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!jornadaActual) { setCargando(false); return; }
    getReporteDiario(jornadaActual.id).then((r) => {
      setReporte(r);
      setCargando(false);
    });
  }, [jornadaActual]);

  return (
    <SafeAreaView style={estilos.contenedor}>
      <Stack.Screen options={{ title: 'Reporte del Día' }} />
      {cargando ? (
        <ActivityIndicator color={Colores.primario} style={{ marginTop: 40 }} />
      ) : !reporte ? (
        <EmptyState icono="today-outline" mensaje="Sin jornada activa" subtitulo="Abre una jornada para ver el reporte" />
      ) : (
        <ScrollView contentContainerStyle={estilos.scroll}>
          <Text style={estilos.fecha}>{formatDate(reporte.fecha)}</Text>

          {/* Resumen */}
          <View style={estilos.resumenCard}>
            <Text style={estilos.resumenTitulo}>Resumen financiero</Text>
            <FilaReporte label="Total ventas" valor={formatCurrency(reporte.total_ventas)} negrita />
            <FilaReporte label="Efectivo cobrado" valor={formatCurrency(reporte.total_efectivo)} color={Colores.exito} />
            <FilaReporte label="Transferencias" valor={formatCurrency(reporte.total_transferencias)} color={Colores.transferencia} />
            <FilaReporte label="Pendiente (crédito)" valor={formatCurrency(reporte.total_credito)} color={Colores.peligro} ultimo />
          </View>

          <View style={estilos.metaCard}>
            <Text style={estilos.metaTxt}>
              {reporte.num_clientes} cliente{reporte.num_clientes !== 1 ? 's' : ''} atendidos
            </Text>
          </View>

          {/* Por cliente */}
          <Text style={estilos.seccion}>Detalle por cliente</Text>
          {reporte.ventas_por_cliente.length === 0 ? (
            <Text style={estilos.sinVentas}>Sin ventas en este día</Text>
          ) : (
            reporte.ventas_por_cliente.map((c, idx) => (
              <View key={idx} style={estilos.clienteCard}>
                <Text style={estilos.clienteNombre}>{c.cliente_nombre}</Text>
                <View style={estilos.clienteDetalle}>
                  <View>
                    <Text style={estilos.detLabel}>Total</Text>
                    <Text style={estilos.detValor}>{formatCurrency(c.subtotal)}</Text>
                  </View>
                  <View>
                    <Text style={estilos.detLabel}>Pagado</Text>
                    <Text style={[estilos.detValor, { color: Colores.exito }]}>
                      {formatCurrency(c.monto_pagado)}
                    </Text>
                  </View>
                  {c.saldo_pendiente > 0 && (
                    <View>
                      <Text style={estilos.detLabel}>Pendiente</Text>
                      <Text style={[estilos.detValor, { color: Colores.peligro }]}>
                        {formatCurrency(c.saldo_pendiente)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function FilaReporte({ label, valor, negrita, color, ultimo }: {
  label: string; valor: string; negrita?: boolean; color?: string; ultimo?: boolean;
}) {
  return (
    <View style={[estilos.filaReporte, ultimo && { borderBottomWidth: 0 }]}>
      <Text style={estilos.filaLabel}>{label}</Text>
      <Text style={[estilos.filaValor, negrita && { fontWeight: '800' }, color ? { color } : {}]}>
        {valor}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colores.fondo },
  scroll: { padding: 16, paddingBottom: 32 },
  fecha: { fontSize: 14, color: Colores.textoS, marginBottom: 12, fontWeight: '600' },
  resumenCard: {
    backgroundColor: Colores.superficie,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  resumenTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: Colores.textoS,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colores.borde,
  },
  filaReporte: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: Colores.borde,
  },
  filaLabel: { fontSize: 14, color: Colores.textoS },
  filaValor: { fontSize: 14, fontWeight: '600', color: Colores.textoP },
  metaCard: {
    backgroundColor: Colores.primario + '15',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  metaTxt: { fontSize: 14, fontWeight: '700', color: Colores.primario },
  seccion: { fontSize: 15, fontWeight: '700', color: Colores.textoP, marginBottom: 10 },
  sinVentas: { fontSize: 14, color: Colores.textoS, textAlign: 'center', padding: 16 },
  clienteCard: {
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
  clienteNombre: { fontSize: 15, fontWeight: '700', color: Colores.textoP, marginBottom: 10 },
  clienteDetalle: { flexDirection: 'row', justifyContent: 'space-between' },
  detLabel: { fontSize: 11, color: Colores.textoS, fontWeight: '600', marginBottom: 2 },
  detValor: { fontSize: 15, fontWeight: '700', color: Colores.textoP },
});
