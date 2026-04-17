import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { crearUsuario } from '@/db/queries/usuarios';
import { useAuthStore } from '@/stores/authStore';
import { FormField } from '@/components/shared/FormField';
import { Colores } from '@/constants/colores';

export default function SetupScreen() {
  const [nombre, setNombre] = useState('');
  const [pin, setPin] = useState('');
  const [confirmarPin, setConfirmarPin] = useState('');
  const [guardando, setGuardando] = useState(false);
  const { login } = useAuthStore();

  async function handleCrear() {
    if (!nombre.trim()) {
      Alert.alert('Error', 'Ingresa tu nombre');
      return;
    }
    if (!/^\d{4}$/.test(pin)) {
      Alert.alert('Error', 'El PIN debe ser de 4 dígitos');
      return;
    }
    if (pin !== confirmarPin) {
      Alert.alert('Error', 'Los PINs no coinciden');
      return;
    }

    setGuardando(true);
    try {
      await crearUsuario(nombre.trim(), pin, 'admin');
      const ok = await login(pin);
      if (ok) {
        router.replace('/(tabs)/');
      }
    } catch (e) {
      Alert.alert('Error', 'No se pudo crear el usuario');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <SafeAreaView style={estilos.contenedor}>
      <ScrollView contentContainerStyle={estilos.scroll} keyboardShouldPersistTaps="handled">
        <View style={estilos.header}>
          <View style={estilos.iconoApp}>
            <Ionicons name="storefront" size={36} color="#fff" />
          </View>
          <Text style={estilos.titulo}>Bienvenido</Text>
          <Text style={estilos.subtitulo}>
            Configura tu cuenta de administrador para comenzar
          </Text>
        </View>

        <View style={estilos.formulario}>
          <FormField
            label="Nombre del administrador"
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej: Carlos"
            autoCapitalize="words"
          />
          <FormField
            label="PIN de acceso (4 dígitos)"
            value={pin}
            onChangeText={setPin}
            placeholder="••••"
            keyboardType="numeric"
            secureTextEntry
            maxLength={4}
          />
          <FormField
            label="Confirmar PIN"
            value={confirmarPin}
            onChangeText={setConfirmarPin}
            placeholder="••••"
            keyboardType="numeric"
            secureTextEntry
            maxLength={4}
          />

          <TouchableOpacity
            style={[estilos.btnCrear, guardando && { opacity: 0.7 }]}
            onPress={handleCrear}
            disabled={guardando}
          >
            {guardando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={estilos.txtCrear}>Crear cuenta y entrar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colores.fondo },
  scroll: { padding: 24, flexGrow: 1 },
  header: { alignItems: 'center', marginBottom: 32 },
  iconoApp: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colores.primario,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  titulo: { fontSize: 24, fontWeight: '800', color: Colores.textoP, marginBottom: 8 },
  subtitulo: { fontSize: 15, color: Colores.textoS, textAlign: 'center', lineHeight: 22 },
  formulario: { backgroundColor: Colores.superficie, borderRadius: 16, padding: 20 },
  btnCrear: {
    backgroundColor: Colores.primario,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  txtCrear: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
