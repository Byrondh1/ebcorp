import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Alert, ActivityIndicator, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  getDespacho, confirmarDespacho, registrarDevolucion, getDevoluciones,
} from '@/db/queries/despachos';
import { useInventarioStore } from '@/stores/inventarioStore';
import { useJornadaStore } from '@/stores/jornadaStore';
import { Despacho, DevolucionDespacho } from '@/types/despacho';
import { PRODUCTOS } from '@/constants/productos';
import { Colores } from '@/constants/colores';
import { formatKg, formatUnidades } from '@/utils/formatters';
import { parsearNumero } from '@/utils/validators';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfirmModal } from '@/components/shared/ConfirmModal';

export default function DespachoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const despachoId = parseInt(id);
  const { jornadaActual } = useJornadaStore();
  const { refrescar } = useInventarioStore();

  const [despacho, setDespacho] = useState<Despacho | null>(null);
  const [devoluciones, setDevoluciones] = useState<DevolucionDespacho[]>([]);
  const [cantDevolucion, setCantDevolucion] = useState('');
  const [motivoDevolucion, setMotivoDevolucion] = useState('');
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      const [d, devs] = await Promise.all([
        getDespacho(despachoId),
        getDevoluciones(despachoId),
      ]);
      setDespacho(d);
      setDevoluciones(devs);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, [despachoId]);

  async function handleConfirmar() {
    setProcesando(true);
    try {
      await confirmarDespacho(despachoId);
      await cargar();
    } catch (e) {
      Alert.alert('Error', 'No se pudo confirmar el despacho');
    } finally {
      setProcesando(false);
      setShowConfirmar(false);
    }
  }

  async function handleDevolucion() {
    if (!despacho || !jornadaActual) return;
    const cant = parsearNumero(cantDevolucion);
    if (cant <= 0) {
      Alert.alert('Error', 'Ingresa una cantidad válida');
      return;
    }
    setProcesando(true);
    try {
      await registrarDevolucion({
        despacho_id: despachoId,
        jornada_id: jornadaActual.id,
        cantidad: cant,
        motivo: motivoDevolucion.trim() || undefined,
      });
      await refrescar(jornadaActual.id);
      setCantDevolucion('');
      setMotivoDevolucion('');
      await cargar();
    } catch (e) {
      Alert.alert('Error', 'No se pudo registrar la devolución');
    } finally {
      setProcesando(false);
    }
  }

  if (cargando || !despacho) {
    return (
      <SafeAreaView style={estilos.contenedor}>
        <ActivityIndicator color={Colores.primario} style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  const prod = PRODUCTOS[despacho.tipo_producto];
  const cantTexto = despacho.unidad === 'kg'
    ? formatKg(despacho.cantidad)
    : formatUnidades(despacho.cantidad);

  return (
    <SafeAreaView style={estilos.contenedor}>
      <Stack.Screen options={{ title: 'Detalle Despacho' }} />
      <ScrollView contentContainerStyle={estilos.scroll}>
        {/* Info despacho */}
        <View style={estilos.infoCard}>
          <View style={[estilos.prodIcono, { backgroundColor: prod.color + '20' }]}>
            <Ionicons name={prod.icono as any} size={28} color={prod.color} />
          </View>
          <View style={estilos.infoTexto}>
            <Text style={estilos.vendedorNombre}>{despacho.vendedor_nombre}</Text>
            <Text style={estilos.productoDesc}>{prod.label} · {cantTexto}</Text>
          </View>
          <StatusBadge
            texto={despacho.confirmado ? 'Confirmado' : 'Pendiente'}
            estado={despacho.confirmado ? 'exito' : 'advertencia'}
          />
        </View>

        {/* Confirmar entrega */}
        {!despacho.confirmado && (
          <TouchableOpacity
            style={estilos.btnConfirmar}
            onPress={() => setShowConfirmar(true)}
            disabled={procesando}
          >
            {procesando ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={estilos.txtConfirmar}>Confirmar Entrega</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Devoluciones existentes */}
        {devoluciones.length > 0 && (
          <>
            <Text style={estilos.seccion}>Devoluciones registradas</Text>
            {devoluciones.map((dev) => (
              <View key={dev.id} style={estilos.devCard}>
                <Text style={estilos.devCantidad}>
                  -{despacho.unidad === 'kg' ? formatKg(dev.cantidad) : formatUnidades(dev.cantidad)}
                </Text>
                {dev.motivo && <Text style={estilos.devMotivo}>{dev.motivo}</Text>}
              </View>
            ))}
          </>
        )}

        {/* Registrar devolución */}
        <Text style={estilos.seccion}>Registrar devolución</Text>
        <View style={estilos.devForm}>
          <TextInput
            style={estilos.devInput}
            value={cantDevolucion}
            onChangeText={setCantDevolucion}
            keyboardType="decimal-pad"
            placeholder={`Cantidad en ${despacho.unidad}`}
            placeholderTextColor={Colores.textoD}
          />
          <TextInput
            style={[estilos.devInput, { marginTop: 10 }]}
            value={motivoDevolucion}
            onChangeText={setMotivoDevolucion}
            placeholder="Motivo (opcional)"
            placeholderTextColor={Colores.textoD}
          />
          <TouchableOpacity
            style={[estilos.btnDevolucion, procesando && { opacity: 0.6 }]}
            onPress={handleDevolucion}
            disabled={procesando}
          >
            <Text style={estilos.txtDevolucion}>Registrar Devolución</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ConfirmModal
        visible={showConfirmar}
        titulo="Confirmar Entrega"
        mensaje={`¿Confirmas que ${despacho.vendedor_nombre} recibió ${cantTexto} de ${prod.label}?`}
        textoConfirmar="Confirmar"
        onConfirmar={handleConfirmar}
        onCancelar={() => setShowConfirmar(false)}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colores.fondo },
  scroll: { padding: 16, paddingBottom: 32 },
  infoCard: {
    backgroundColor: Colores.superficie,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  prodIcono: { width: 56, height: 56, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  infoTexto: { flex: 1 },
  vendedorNombre: { fontSize: 18, fontWeight: '800', color: Colores.textoP },
  productoDesc: { fontSize: 14, color: Colores.textoS, marginTop: 4 },
  btnConfirmar: {
    backgroundColor: Colores.exito,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  txtConfirmar: { color: '#fff', fontSize: 16, fontWeight: '700' },
  seccion: { fontSize: 15, fontWeight: '700', color: Colores.textoP, marginBottom: 10, marginTop: 4 },
  devCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  devCantidad: { fontSize: 16, fontWeight: '700', color: Colores.peligro },
  devMotivo: { fontSize: 13, color: Colores.textoS, marginTop: 4 },
  devForm: { backgroundColor: Colores.superficie, borderRadius: 12, padding: 16 },
  devInput: {
    backgroundColor: Colores.fondo,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colores.borde,
    padding: 12,
    fontSize: 15,
    color: Colores.textoP,
  },
  btnDevolucion: {
    backgroundColor: Colores.peligro,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  txtDevolucion: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
