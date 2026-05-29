import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { useJornadaStore } from '@/stores/jornadaStore';
import { useInventarioStore } from '@/stores/inventarioStore';
import { Colores } from '@/constants/colores';
import { formatDate, formatCurrency, formatKg, todayISO } from '@/utils/formatters';
import { getTotalesCaja } from '@/db/queries/caja';
import { getVentasDia } from '@/db/queries/ventas';

export default function DashboardScreen() {
  const usuario = useAuthStore((s) => s.usuario);
  const { logout } = useAuthStore();
  const {
    jornadaActual,
    cargando: cargandoJornada,
    cargarJornadaHoy,
    abrirJornada,
    cerrarJornada,
  } = useJornadaStore();
  const { balance, refrescar: refrescarInventario } = useInventarioStore();

  const [totalesCaja, setTotalesCaja] = React.useState({ efectivo: 0, transferencia: 0 });
  const [totalVentas, setTotalVentas] = React.useState(0);

  const cargarDatos = useCallback(async () => {
    await cargarJornadaHoy();
  }, [cargarJornadaHoy]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  useEffect(() => {
    if (jornadaActual) {
      refrescarInventario(jornadaActual.id);
      cargarResumen(jornadaActual.id);
    }
  }, [jornadaActual]);

  async function cargarResumen(jornadaId: number) {
    try {
      const [totales, ventas] = await Promise.all([
        getTotalesCaja(jornadaId),
        getVentasDia(jornadaId),
      ]);
      setTotalesCaja({ efectivo: totales.efectivo_total, transferencia: totales.transferencias_total });
      setTotalVentas(ventas.reduce((s, v) => s + v.subtotal, 0));
    } catch {}
  }

  async function handleAbrirJornada() {
    if (!usuario) return;
    try {
      await abrirJornada(usuario.id);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'No se pudo abrir la jornada');
    }
  }

  async function handleCerrarJornada() {
    if (!usuario || !jornadaActual) return;
    Alert.alert(
      'Cerrar Jornada',
      '¿Confirmas que deseas cerrar la jornada del día? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar',
          style: 'destructive',
          onPress: async () => {
            await cerrarJornada(usuario.id);
          },
        },
      ]
    );
  }

  const estaAbierta = jornadaActual?.estado === 'abierta';

  return (
    <SafeAreaView style={estilos.contenedor}>
      <View style={estilos.header}>
        <View>
          <Text style={estilos.saludo}>Hola, {usuario?.nombre}</Text>
          <Text style={estilos.fecha}>{formatDate(todayISO())}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={estilos.btnSalir}>
          <Ionicons name="log-out-outline" size={22} color={Colores.textoS} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={estilos.scroll} showsVerticalScrollIndicator={false}>
        {/* Estado de Jornada */}
        <View style={[estilos.jornadaCard, estaAbierta ? estilos.jornadaAbierta : estilos.jornadaCerrada]}>
          <View style={estilos.jornadaInfo}>
            <Ionicons
              name={estaAbierta ? 'radio-button-on' : 'stop-circle-outline'}
              size={20}
              color={estaAbierta ? Colores.exito : Colores.textoS}
            />
            <Text style={estilos.jornadaEstado}>
              {jornadaActual
                ? estaAbierta
                  ? 'Jornada en curso'
                  : 'Jornada cerrada'
                : 'Sin jornada activa'}
            </Text>
          </View>
          {cargandoJornada ? (
            <ActivityIndicator color={Colores.primario} size="small" />
          ) : usuario?.rol === 'admin' ? (
            !jornadaActual ? (
              <TouchableOpacity style={estilos.btnJornada} onPress={handleAbrirJornada}>
                <Text style={estilos.txtBtnJornada}>Abrir Jornada</Text>
              </TouchableOpacity>
            ) : estaAbierta ? (
              <TouchableOpacity style={[estilos.btnJornada, { backgroundColor: Colores.peligro }]} onPress={handleCerrarJornada}>
                <Text style={estilos.txtBtnJornada}>Cerrar Jornada</Text>
              </TouchableOpacity>
            ) : null
          ) : null}
        </View>

        {/* Tarjetas de resumen */}
        {jornadaActual && (
          <>
            <Text style={estilos.seccionTitulo}>Resumen del día</Text>
            <View style={estilos.grilla}>
              <TarjetaResumen
                icono="cash-outline"
                titulo="Efectivo"
                valor={formatCurrency(totalesCaja.efectivo)}
                color={Colores.exito}
              />
              <TarjetaResumen
                icono="swap-horizontal-outline"
                titulo="Transferencias"
                valor={formatCurrency(totalesCaja.transferencia)}
                color={Colores.transferencia}
              />
              <TarjetaResumen
                icono="receipt-outline"
                titulo="Total Ventas"
                valor={formatCurrency(totalVentas)}
                color={Colores.acento}
              />
              <TarjetaResumen
                icono="cube-outline"
                titulo="Inventario"
                valor={balance ? formatKg(balance.peso_entrada_total) : '—'}
                color={Colores.primario}
              />
            </View>

            {/* Balance de inventario */}
            {balance && usuario?.rol === 'admin' && (
              <>
                <Text style={estilos.seccionTitulo}>Inventario disponible</Text>
                <View style={estilos.inventarioCard}>
                  <FilaInventario label="Pechuga" valor={formatKg(balance.pechuga_disponible)} />
                  <FilaInventario label="Filete" valor={formatKg(balance.filete_disponible)} />
                  <FilaInventario label="Pollo Entero" valor={formatKg(balance.pollo_entero_disponible)} />
                  <FilaInventario label="Recortes" valor={formatKg(balance.recortes_disponible)} />
                  <FilaInventario label="Menudencia" valor={`${balance.menudencia_disponible} und`} ultimo />
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function TarjetaResumen({
  icono, titulo, valor, color,
}: {
  icono: keyof typeof Ionicons.glyphMap;
  titulo: string;
  valor: string;
  color: string;
}) {
  return (
    <View style={estilos.tarjeta}>
      <View style={[estilos.tarjetaIcono, { backgroundColor: color + '20' }]}>
        <Ionicons name={icono} size={22} color={color} />
      </View>
      <Text style={estilos.tarjetaValor}>{valor}</Text>
      <Text style={estilos.tarjetaTitulo}>{titulo}</Text>
    </View>
  );
}

function FilaInventario({ label, valor, ultimo }: { label: string; valor: string; ultimo?: boolean }) {
  return (
    <View style={[estilos.filaInventario, ultimo && { borderBottomWidth: 0 }]}>
      <Text style={estilos.filaLabel}>{label}</Text>
      <Text style={estilos.filaValor}>{valor}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colores.fondo },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colores.superficie,
    borderBottomWidth: 1,
    borderBottomColor: Colores.borde,
  },
  saludo: { fontSize: 20, fontWeight: '800', color: Colores.textoP },
  fecha: { fontSize: 13, color: Colores.textoS, marginTop: 2 },
  btnSalir: { padding: 8 },
  scroll: { padding: 16, paddingBottom: 32 },
  jornadaCard: {
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  jornadaAbierta: { backgroundColor: '#ECFDF5' },
  jornadaCerrada: { backgroundColor: '#F3F4F6' },
  jornadaInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  jornadaEstado: { fontSize: 15, fontWeight: '600', color: Colores.textoP },
  btnJornada: {
    backgroundColor: Colores.primario,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  txtBtnJornada: { color: '#fff', fontSize: 13, fontWeight: '700' },
  seccionTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: Colores.textoP,
    marginBottom: 12,
    marginTop: 4,
  },
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  tarjeta: {
    backgroundColor: Colores.superficie,
    borderRadius: 14,
    padding: 16,
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  tarjetaIcono: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  tarjetaValor: { fontSize: 18, fontWeight: '800', color: Colores.textoP, marginBottom: 4 },
  tarjetaTitulo: { fontSize: 12, color: Colores.textoS },
  inventarioCard: {
    backgroundColor: Colores.superficie,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  filaInventario: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colores.borde,
  },
  filaLabel: { fontSize: 14, color: Colores.textoS },
  filaValor: { fontSize: 14, fontWeight: '700', color: Colores.textoP },
});
