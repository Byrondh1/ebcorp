import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Alert, ActivityIndicator, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useJornadaStore } from '@/stores/jornadaStore';
import { useAuthStore } from '@/stores/authStore';
import { getTotalesCaja, realizarCierre } from '@/db/queries/caja';
import { Colores } from '@/constants/colores';
import { formatCurrency } from '@/utils/formatters';
import { parsearNumero } from '@/utils/validators';

export default function CierreCajaScreen() {
  const { jornadaActual } = useJornadaStore();
  const usuario = useAuthStore((s) => s.usuario);

  const [efectivoEsperado, setEfectivoEsperado] = useState(0);
  const [transferenciasTotal, setTransferenciasTotal] = useState(0);
  const [efectivoContado, setEfectivoContado] = useState('');
  const [notas, setNotas] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!jornadaActual) return;
    getTotalesCaja(jornadaActual.id).then((t) => {
      setEfectivoEsperado(t.efectivo_total);
      setTransferenciasTotal(t.transferencias_total);
      setCargando(false);
    });
  }, [jornadaActual]);

  const contado = parsearNumero(efectivoContado);
  const diferencia = contado - efectivoEsperado;

  async function handleCierre() {
    if (!jornadaActual || !usuario) return;

    Alert.alert(
      'Confirmar cierre de caja',
      `Efectivo esperado: ${formatCurrency(efectivoEsperado)}\nEfectivo contado: ${formatCurrency(contado)}\nDiferencia: ${formatCurrency(diferencia)}\n\n¿Confirmas el cierre?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Caja',
          onPress: async () => {
            setGuardando(true);
            try {
              await realizarCierre({
                jornada_id: jornadaActual.id,
                efectivo_esperado: efectivoEsperado,
                efectivo_contado: contado,
                transferencias_total: transferenciasTotal,
                cerrado_por: usuario.id,
                notas: notas.trim() || undefined,
              });
              Alert.alert('Caja cerrada', 'El cierre de caja se registró correctamente', [
                { text: 'OK', onPress: () => router.back() },
              ]);
            } catch (e) {
              Alert.alert('Error', 'No se pudo realizar el cierre');
            } finally {
              setGuardando(false);
            }
          },
        },
      ]
    );
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
      <Stack.Screen options={{ title: 'Cierre de Caja' }} />
      <ScrollView contentContainerStyle={estilos.scroll} keyboardShouldPersistTaps="handled">
        <Text style={estilos.descripcion}>
          Cuenta el efectivo físico disponible y compara con el total esperado del sistema.
        </Text>

        {/* Resumen del sistema */}
        <View style={estilos.seccionCard}>
          <Text style={estilos.seccionTitulo}>Resumen del sistema</Text>
          <FilaResumen label="Efectivo esperado" valor={formatCurrency(efectivoEsperado)} />
          <FilaResumen
            label="Transferencias"
            valor={formatCurrency(transferenciasTotal)}
            ultimo
          />
        </View>

        {/* Conteo físico */}
        <Text style={estilos.inputLabel}>Efectivo contado (físico)</Text>
        <TextInput
          style={estilos.inputMonto}
          value={efectivoContado}
          onChangeText={setEfectivoContado}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={Colores.textoD}
        />

        {/* Diferencia */}
        {efectivoContado !== '' && (
          <View style={[
            estilos.diferenciaCard,
            { backgroundColor: diferencia === 0 ? '#ECFDF5' : diferencia > 0 ? '#EFF6FF' : '#FEF2F2' },
          ]}>
            <Ionicons
              name={diferencia === 0 ? 'checkmark-circle' : diferencia > 0 ? 'arrow-up-circle' : 'arrow-down-circle'}
              size={24}
              color={diferencia === 0 ? Colores.exito : diferencia > 0 ? Colores.transferencia : Colores.peligro}
            />
            <View>
              <Text style={estilos.difLabel}>Diferencia</Text>
              <Text style={[
                estilos.difMonto,
                { color: diferencia === 0 ? Colores.exito : diferencia > 0 ? Colores.transferencia : Colores.peligro },
              ]}>
                {diferencia >= 0 ? '+' : ''}{formatCurrency(diferencia)}
              </Text>
              <Text style={estilos.difTexto}>
                {diferencia === 0 ? 'Cuadre perfecto' : diferencia > 0 ? 'Hay excedente' : 'Hay faltante'}
              </Text>
            </View>
          </View>
        )}

        <TextInput
          style={estilos.notasInput}
          value={notas}
          onChangeText={setNotas}
          placeholder="Notas del cierre (opcional)"
          placeholderTextColor={Colores.textoD}
          multiline
          numberOfLines={3}
        />
      </ScrollView>

      <View style={estilos.pie}>
        <TouchableOpacity style={estilos.btnCancelar} onPress={() => router.back()}>
          <Text style={estilos.txtCancelar}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.btnCerrar, guardando && { opacity: 0.7 }]}
          onPress={handleCierre}
          disabled={guardando || !efectivoContado}
        >
          {guardando ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={estilos.txtCerrar}>Realizar Cierre</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function FilaResumen({ label, valor, ultimo }: { label: string; valor: string; ultimo?: boolean }) {
  return (
    <View style={[estilos.filaResumen, ultimo && { borderBottomWidth: 0 }]}>
      <Text style={estilos.filaLabel}>{label}</Text>
      <Text style={estilos.filaValor}>{valor}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colores.fondo },
  scroll: { padding: 16, paddingBottom: 8 },
  descripcion: {
    fontSize: 14,
    color: Colores.textoS,
    lineHeight: 20,
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  seccionCard: {
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
  seccionTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: Colores.textoS,
    padding: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colores.borde,
  },
  filaResumen: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colores.borde,
  },
  filaLabel: { fontSize: 14, color: Colores.textoS },
  filaValor: { fontSize: 14, fontWeight: '700', color: Colores.textoP },
  inputLabel: { fontSize: 13, fontWeight: '600', color: Colores.textoS, marginBottom: 8 },
  inputMonto: {
    backgroundColor: Colores.superficie,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colores.borde,
    padding: 16,
    fontSize: 24,
    fontWeight: '800',
    color: Colores.textoP,
    textAlign: 'center',
    marginBottom: 16,
  },
  diferenciaCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  difLabel: { fontSize: 12, color: Colores.textoS, fontWeight: '600' },
  difMonto: { fontSize: 22, fontWeight: '800' },
  difTexto: { fontSize: 13, color: Colores.textoS, marginTop: 2 },
  notasInput: {
    backgroundColor: Colores.superficie,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colores.borde,
    padding: 12,
    fontSize: 14,
    color: Colores.textoP,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pie: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colores.borde,
    backgroundColor: Colores.superficie,
  },
  btnCancelar: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colores.borde,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  txtCancelar: { fontSize: 15, fontWeight: '600', color: Colores.textoS },
  btnCerrar: {
    flex: 2,
    backgroundColor: Colores.primario,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  txtCerrar: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
