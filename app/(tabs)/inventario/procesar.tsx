import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { useJornadaStore } from '@/stores/jornadaStore';
import { useInventarioStore } from '@/stores/inventarioStore';
import { registrarProcesamiento, getEntradasJornada } from '@/db/queries/inventario';
import { FormField } from '@/components/shared/FormField';
import { Colores } from '@/constants/colores';
import { parsearNumero, esNumeroValido } from '@/utils/validators';
import { formatKg } from '@/utils/formatters';

export default function ProcesarScreen() {
  const { jornadaActual } = useJornadaStore();
  const { refrescar } = useInventarioStore();

  const [pechugas, setPechugas] = useState('');
  const [filetes, setFiletes] = useState('');
  const [menudencia, setMenudencia] = useState('');
  const [recortes, setRecortes] = useState('');
  const [polloEntero, setPolloEntero] = useState('');
  const [entradaId, setEntradaId] = useState<number | undefined>();
  const [pesoReferencia, setPesoReferencia] = useState(0);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (jornadaActual) {
      getEntradasJornada(jornadaActual.id).then((entradas) => {
        if (entradas.length > 0) {
          const ultima = entradas[0];
          setEntradaId(ultima.id);
          setPesoReferencia(ultima.peso_total_kg);
        }
      });
    }
  }, [jornadaActual]);

  const totalProcesado =
    parsearNumero(pechugas) +
    parsearNumero(filetes) +
    parsearNumero(recortes) +
    parsearNumero(polloEntero);

  async function handleGuardar() {
    if (!jornadaActual) return;

    if (totalProcesado <= 0 && parsearNumero(menudencia) === 0) {
      Alert.alert('Error', 'Ingresa al menos un producto procesado');
      return;
    }

    setGuardando(true);
    try {
      await registrarProcesamiento(jornadaActual.id, {
        entrada_id: entradaId,
        pechuga_kg: parsearNumero(pechugas),
        filete_kg: parsearNumero(filetes),
        menudencia_unidades: parseInt(menudencia) || 0,
        recortes_kg: parsearNumero(recortes),
        recortes_unidades: 0,
        pollo_entero_kg: parsearNumero(polloEntero),
      });
      await refrescar(jornadaActual.id);
      router.back();
    } catch (e) {
      Alert.alert('Error', 'No se pudo registrar el procesamiento');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <SafeAreaView style={estilos.contenedor}>
      <Stack.Screen options={{ title: 'Registrar Procesamiento' }} />
      <ScrollView contentContainerStyle={estilos.scroll} keyboardShouldPersistTaps="handled">
        {pesoReferencia > 0 && (
          <View style={estilos.referencia}>
            <Text style={estilos.referenciaTexto}>
              Peso de entrada registrado: {formatKg(pesoReferencia)}
            </Text>
            {totalProcesado > 0 && (
              <Text style={estilos.referenciaTexto}>
                Procesado hasta ahora: {formatKg(totalProcesado)}
                {' '}({((totalProcesado / pesoReferencia) * 100).toFixed(1)}%)
              </Text>
            )}
          </View>
        )}

        <View style={estilos.formulario}>
          <FormField
            label="Pechuga (kg)"
            value={pechugas}
            onChangeText={setPechugas}
            keyboardType="decimal-pad"
            placeholder="0.00"
          />
          <FormField
            label="Filete (kg)"
            value={filetes}
            onChangeText={setFiletes}
            keyboardType="decimal-pad"
            placeholder="0.00"
          />
          <FormField
            label="Pollo Entero (kg)"
            value={polloEntero}
            onChangeText={setPolloEntero}
            keyboardType="decimal-pad"
            placeholder="0.00"
          />
          <FormField
            label="Recortes Bandeja (kg)"
            value={recortes}
            onChangeText={setRecortes}
            keyboardType="decimal-pad"
            placeholder="0.00"
          />
          <FormField
            label="Menudencia (unidades)"
            value={menudencia}
            onChangeText={setMenudencia}
            keyboardType="number-pad"
            placeholder="0"
          />
        </View>
      </ScrollView>

      <View style={estilos.pie}>
        <TouchableOpacity style={estilos.btnCancelar} onPress={() => router.back()}>
          <Text style={estilos.txtCancelar}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.btnGuardar, guardando && { opacity: 0.7 }]}
          onPress={handleGuardar}
          disabled={guardando}
        >
          {guardando ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={estilos.txtGuardar}>Guardar Procesamiento</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colores.fondo },
  scroll: { padding: 16, paddingBottom: 8 },
  referencia: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  referenciaTexto: { fontSize: 14, color: Colores.secundario, fontWeight: '600', marginBottom: 2 },
  formulario: { gap: 0 },
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
  btnGuardar: {
    flex: 2,
    backgroundColor: Colores.primario,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  txtGuardar: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
