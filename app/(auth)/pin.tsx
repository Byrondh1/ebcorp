import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { Colores } from '@/constants/colores';

const TECLAS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

export default function PinScreen() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const { login, cargando } = useAuthStore();

  async function handleTecla(tecla: string) {
    if (tecla === '⌫') {
      setPin((p) => p.slice(0, -1));
      setError('');
      return;
    }
    if (tecla === '') return;
    const nuevoPin = pin + tecla;
    setPin(nuevoPin);
    setError('');

    if (nuevoPin.length === 4) {
      const ok = await login(nuevoPin);
      if (ok) {
        router.replace('/(tabs)/');
      } else {
        setError('PIN incorrecto. Intenta de nuevo.');
        setPin('');
      }
    }
  }

  return (
    <SafeAreaView style={estilos.contenedor}>
      <View style={estilos.header}>
        <View style={estilos.iconoApp}>
          <Ionicons name="storefront" size={36} color="#fff" />
        </View>
        <Text style={estilos.titulo}>Distribuidora de Pollo</Text>
        <Text style={estilos.subtitulo}>Ingresa tu PIN para continuar</Text>
      </View>

      <View style={estilos.puntosContenedor}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[estilos.punto, pin.length > i && estilos.puntoActivo]}
          />
        ))}
      </View>

      {error ? <Text style={estilos.error}>{error}</Text> : null}

      {cargando ? (
        <ActivityIndicator size="large" color={Colores.primario} style={{ marginTop: 40 }} />
      ) : (
        <View style={estilos.teclado}>
          {TECLAS.map((tecla, idx) => (
            <TouchableOpacity
              key={idx}
              style={[estilos.tecla, tecla === '' && { opacity: 0 }]}
              onPress={() => handleTecla(tecla)}
              disabled={tecla === '' || pin.length === 4}
              activeOpacity={0.7}
            >
              {tecla === '⌫' ? (
                <Ionicons name="backspace-outline" size={24} color={Colores.textoP} />
              ) : (
                <Text style={estilos.textoTecla}>{tecla}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: Colores.fondo,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  header: { alignItems: 'center', marginBottom: 40 },
  iconoApp: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colores.primario,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  titulo: { fontSize: 22, fontWeight: '800', color: Colores.textoP, marginBottom: 8 },
  subtitulo: { fontSize: 15, color: Colores.textoS },
  puntosContenedor: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  punto: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colores.borde,
    backgroundColor: 'transparent',
  },
  puntoActivo: {
    backgroundColor: Colores.primario,
    borderColor: Colores.primario,
  },
  error: {
    color: Colores.peligro,
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  teclado: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 280,
    marginTop: 24,
    gap: 16,
  },
  tecla: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colores.superficie,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  textoTecla: { fontSize: 24, fontWeight: '600', color: Colores.textoP },
});
