import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useJornadaStore } from '@/stores/jornadaStore';
import { getTotalesCaja, getMovimientosDia, getCierreCaja } from '@/db/queries/caja';
import { TotalesCaja, CajaMovimiento } from '@/types/caja';
import { Colores } from '@/constants/colores';
import { formatCurrency } from '@/utils/formatters';
import { EmptyState } from '@/components/shared/EmptyState';

export default function CajaScreen() {
  const { jornadaActual } = useJornadaStore();
  const [totales, setTotales] = useState<TotalesCaja | null>(null);
  const [movimientos, setMovimientos] = useState<CajaMovimiento[]>([]);
  const [tieneCierre, setTieneCierre] = useState(false);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    if (!jornadaActual) { setCargando(false); return; }
    setCargando(true);
    try {
      const [t, m, cierre] = await Promise.all([
        getTotalesCaja(jornadaActual.id),
        getMovimientosDia(jornadaActual.id),
        getCierreCaja(jornadaActual.id),
      ]);
      setTotales(t);
      setMovimientos(m);
      setTieneCierre(cierre !== null);
    } finally {
      setCargando(false);
    }
  }, [jornadaActual]);

  useEffect(() => { cargar(); }, [cargar]);

  const estaAbierta = jornadaActual?.estado === 'abierta';

  return (
    <SafeAreaView style={estilos.contenedor}>
      <View style={estilos.header}>
        <Text style={estilos.titulo}>Caja del día</Text>
        {estaAbierta && !tieneCierre && (
          <TouchableOpacity
            style={estilos.btnCierre}
            onPress={() => router.push('/(tabs)/caja/cierre')}
          >
            <Ionicons name="lock-closed-outline" size={16} color="#fff" />
            <Text style={estilos.txtBtnCierre}>Cierre</Text>
          </TouchableOpacity>
        )}
      </View>

      {!jornadaActual ? (
        <EmptyState icono="cash-outline" mensaje="Sin jornada activa" subtitulo="Abre una jornada para ver la caja" />
      ) : cargando ? (
        <ActivityIndicator color={Colores.primario} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={movimientos}
          keyExtractor={(m) => m.id.toString()}
          onRefresh={cargar}
          refreshing={cargando}
          ListHeaderComponent={() => (
            <>
              {/* Tarjetas totales */}
              <View style={estilos.totalesRow}>
                <TarjetaCaja
                  label="Efectivo"
                  monto={totales?.efectivo_total ?? 0}
                  color={Colores.exito}
                  icono="cash-outline"
                />
                <TarjetaCaja
                  label="Transferencias"
                  monto={totales?.transferencias_total ?? 0}
                  color={Colores.transferencia}
                  icono="swap-horizontal-outline"
                />
              </View>

              <View style={estilos.totalGeneralCard}>
                <Text style={estilos.totalGeneralLabel}>Total cobrado</Text>
                <Text style={estilos.totalGeneralMonto}>
                  {formatCurrency(totales?.total_general ?? 0)}
                </Text>
              </View>

              {tieneCierre && (
                <View style={estilos.cierreAviso}>
                  <Ionicons name="lock-closed" size={16} color={Colores.exito} />
                  <Text style={estilos.cierreAvisoTxt}>Caja cerrada</Text>
                </View>
              )}

              <Text style={estilos.seccion}>Movimientos</Text>
            </>
          )}
          ListEmptyComponent={
            <EmptyState
              icono="receipt-outline"
              mensaje="Sin movimientos"
              subtitulo="Los cobros de ventas aparecerán aquí"
            />
          }
          contentContainerStyle={estilos.lista}
          renderItem={({ item }) => (
            <View style={estilos.movCard}>
              <View style={[
                estilos.movIcono,
                { backgroundColor: item.metodo === 'efectivo' ? '#ECFDF5' : '#EFF6FF' },
              ]}>
                <Ionicons
                  name={item.metodo === 'efectivo' ? 'cash-outline' : 'swap-horizontal-outline'}
                  size={18}
                  color={item.metodo === 'efectivo' ? Colores.exito : Colores.transferencia}
                />
              </View>
              <View style={estilos.movInfo}>
                <Text style={estilos.movConcepto}>{item.concepto}</Text>
                <Text style={estilos.movMetodo}>
                  {item.metodo === 'efectivo' ? 'Efectivo' : 'Transferencia'}
                </Text>
              </View>
              <Text style={[
                estilos.movMonto,
                { color: item.tipo === 'egreso' ? Colores.peligro : Colores.exito },
              ]}>
                {item.tipo === 'egreso' ? '-' : '+'}{formatCurrency(item.monto)}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

function TarjetaCaja({
  label, monto, color, icono,
}: {
  label: string; monto: number; color: string; icono: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={[estilos.tarjetaCaja, { borderTopColor: color, borderTopWidth: 3 }]}>
      <Ionicons name={icono} size={20} color={color} />
      <Text style={estilos.tarjetaCajaLabel}>{label}</Text>
      <Text style={[estilos.tarjetaCajaMonto, { color }]}>{formatCurrency(monto)}</Text>
    </View>
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
  btnCierre: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colores.primario,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  txtBtnCierre: { color: '#fff', fontSize: 14, fontWeight: '600' },
  lista: { padding: 12, paddingBottom: 32 },
  totalesRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  tarjetaCaja: {
    flex: 1,
    backgroundColor: Colores.superficie,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  tarjetaCajaLabel: { fontSize: 12, color: Colores.textoS, fontWeight: '600' },
  tarjetaCajaMonto: { fontSize: 18, fontWeight: '800' },
  totalGeneralCard: {
    backgroundColor: Colores.primario,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalGeneralLabel: { fontSize: 16, fontWeight: '700', color: '#fff' },
  totalGeneralMonto: { fontSize: 22, fontWeight: '800', color: '#fff' },
  cierreAviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  cierreAvisoTxt: { fontSize: 14, fontWeight: '600', color: Colores.exito },
  seccion: { fontSize: 15, fontWeight: '700', color: Colores.textoP, marginBottom: 10 },
  movCard: {
    backgroundColor: Colores.superficie,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  movIcono: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  movInfo: { flex: 1 },
  movConcepto: { fontSize: 14, fontWeight: '600', color: Colores.textoP },
  movMetodo: { fontSize: 12, color: Colores.textoS, marginTop: 2 },
  movMonto: { fontSize: 16, fontWeight: '800' },
});
