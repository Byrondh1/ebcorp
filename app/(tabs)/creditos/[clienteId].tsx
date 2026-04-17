import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Alert, ActivityIndicator, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getSaldoCliente, getHistorialPagos, registrarPago } from '@/db/queries/creditos';
import { getCliente } from '@/db/queries/clientes';
import { useJornadaStore } from '@/stores/jornadaStore';
import { useAuthStore } from '@/stores/authStore';
import { PagoCredito } from '@/types/creditos';
import { Colores } from '@/constants/colores';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { parsearNumero } from '@/utils/validators';

export default function CreditoClienteScreen() {
  const { clienteId: clienteIdStr } = useLocalSearchParams<{ clienteId: string }>();
  const clienteId = parseInt(clienteIdStr);
  const { jornadaActual } = useJornadaStore();
  const usuario = useAuthStore((s) => s.usuario);

  const [clienteNombre, setClienteNombre] = useState('');
  const [saldo, setSaldo] = useState(0);
  const [historial, setHistorial] = useState<PagoCredito[]>([]);
  const [monto, setMonto] = useState('');
  const [metodo, setMetodo] = useState<'efectivo' | 'transferencia'>('efectivo');
  const [notas, setNotas] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const [cliente, s, h] = await Promise.all([
        getCliente(clienteId),
        getSaldoCliente(clienteId),
        getHistorialPagos(clienteId),
      ]);
      if (cliente) setClienteNombre(cliente.nombre);
      setSaldo(s);
      setHistorial(h);
    } finally {
      setCargando(false);
    }
  }, [clienteId]);

  useEffect(() => { cargar(); }, [cargar]);

  async function handleRegistrarPago() {
    if (!jornadaActual || !usuario) {
      Alert.alert('Error', 'Debe haber una jornada abierta para registrar pagos');
      return;
    }
    const montoNum = parsearNumero(monto);
    if (montoNum <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido');
      return;
    }
    if (montoNum > saldo) {
      Alert.alert('Error', `El monto no puede superar el saldo pendiente de ${formatCurrency(saldo)}`);
      return;
    }

    setGuardando(true);
    try {
      await registrarPago({
        cliente_id: clienteId,
        monto: montoNum,
        metodo,
        registrado_por: usuario.id,
        jornada_id: jornadaActual.id,
        notas: notas.trim() || undefined,
      });
      setMonto('');
      setNotas('');
      await cargar();
    } catch (e) {
      Alert.alert('Error', 'No se pudo registrar el pago');
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
      <Stack.Screen options={{ title: clienteNombre }} />
      <ScrollView contentContainerStyle={estilos.scroll} keyboardShouldPersistTaps="handled">
        {/* Saldo */}
        <View style={estilos.saldoCard}>
          <Text style={estilos.saldoLabel}>Saldo pendiente</Text>
          <Text style={estilos.saldoMonto}>{formatCurrency(saldo)}</Text>
          {saldo === 0 && (
            <Text style={estilos.saldoCero}>¡Cuenta saldada!</Text>
          )}
        </View>

        {/* Registrar pago */}
        {saldo > 0 && jornadaActual?.estado === 'abierta' && (
          <View style={estilos.pagoCard}>
            <Text style={estilos.seccion}>Registrar abono</Text>

            <Text style={estilos.inputLabel}>Monto</Text>
            <TextInput
              style={estilos.inputMonto}
              value={monto}
              onChangeText={setMonto}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={Colores.textoD}
            />

            <Text style={estilos.inputLabel}>Método de pago</Text>
            <View style={estilos.metodosRow}>
              {(['efectivo', 'transferencia'] as const).map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[estilos.metodoChip, metodo === m && estilos.metodoActivo]}
                  onPress={() => setMetodo(m)}
                >
                  <Text style={[estilos.metodoTxt, metodo === m && estilos.metodoTxtActivo]}>
                    {m === 'efectivo' ? 'Efectivo' : 'Transferencia'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={estilos.notasInput}
              value={notas}
              onChangeText={setNotas}
              placeholder="Notas (opcional)"
              placeholderTextColor={Colores.textoD}
            />

            <TouchableOpacity
              style={[estilos.btnPagar, guardando && { opacity: 0.7 }]}
              onPress={handleRegistrarPago}
              disabled={guardando}
            >
              {guardando ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={estilos.txtPagar}>Registrar Pago</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Historial */}
        <Text style={estilos.seccion}>Historial de pagos</Text>
        {historial.length === 0 ? (
          <Text style={estilos.sinHistorial}>Sin pagos registrados</Text>
        ) : (
          historial.map((p) => (
            <View key={p.id} style={estilos.pagoItem}>
              <View style={[
                estilos.pagoIcono,
                { backgroundColor: p.metodo === 'efectivo' ? '#ECFDF5' : '#EFF6FF' },
              ]}>
                <Ionicons
                  name={p.metodo === 'efectivo' ? 'cash-outline' : 'swap-horizontal-outline'}
                  size={18}
                  color={p.metodo === 'efectivo' ? Colores.exito : Colores.transferencia}
                />
              </View>
              <View style={estilos.pagoInfo}>
                <Text style={estilos.pagoFecha}>
                  {formatDate(p.registrado_en.split('T')[0])}
                </Text>
                <Text style={estilos.pagoMetodo}>
                  {p.metodo === 'efectivo' ? 'Efectivo' : 'Transferencia'}
                </Text>
              </View>
              <Text style={estilos.pagoMonto}>{formatCurrency(p.monto)}</Text>
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
  saldoCard: {
    backgroundColor: Colores.peligro,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  saldoLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  saldoMonto: { fontSize: 36, fontWeight: '800', color: '#fff', marginTop: 4 },
  saldoCero: { fontSize: 16, color: '#fff', fontWeight: '600', marginTop: 8 },
  pagoCard: {
    backgroundColor: Colores.superficie,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  seccion: { fontSize: 15, fontWeight: '700', color: Colores.textoP, marginBottom: 12 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: Colores.textoS, marginBottom: 8 },
  inputMonto: {
    backgroundColor: Colores.fondo,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colores.borde,
    padding: 14,
    fontSize: 22,
    fontWeight: '800',
    color: Colores.textoP,
    textAlign: 'center',
    marginBottom: 14,
  },
  metodosRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  metodoChip: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colores.borde,
    padding: 10,
    alignItems: 'center',
  },
  metodoActivo: { backgroundColor: Colores.primario, borderColor: Colores.primario },
  metodoTxt: { fontSize: 13, fontWeight: '600', color: Colores.textoS },
  metodoTxtActivo: { color: '#fff' },
  notasInput: {
    backgroundColor: Colores.fondo,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colores.borde,
    padding: 10,
    fontSize: 14,
    color: Colores.textoP,
    marginBottom: 14,
  },
  btnPagar: {
    backgroundColor: Colores.exito,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  txtPagar: { color: '#fff', fontSize: 15, fontWeight: '700' },
  sinHistorial: { fontSize: 14, color: Colores.textoS, textAlign: 'center', padding: 20 },
  pagoItem: {
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
  pagoIcono: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  pagoInfo: { flex: 1 },
  pagoFecha: { fontSize: 14, fontWeight: '600', color: Colores.textoP },
  pagoMetodo: { fontSize: 12, color: Colores.textoS, marginTop: 2 },
  pagoMonto: { fontSize: 16, fontWeight: '800', color: Colores.exito },
});
