import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { runMigrations, hayUsuarios } from '@/db/migrations';
import { useAuthStore } from '@/stores/authStore';
import { Colores } from '@/constants/colores';
import { ToastContainer } from '@/components/shared/ToastContainer';

export default function RootLayout() {
  const [inicializando, setInicializando] = useState(true);
  const usuario = useAuthStore((s) => s.usuario);

  useEffect(() => {
    async function init() {
      try {
        await runMigrations();
        const tieneUsuarios = await hayUsuarios();
        if (!tieneUsuarios) {
          router.replace('/(auth)/setup');
        } else if (!usuario) {
          router.replace('/(auth)/pin');
        } else {
          router.replace('/(tabs)/');
        }
      } catch (e) {
        console.error('Error inicializando app:', e);
      } finally {
        setInicializando(false);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (!inicializando) {
      if (usuario) {
        router.replace('/(tabs)/');
      }
    }
  }, [usuario, inicializando]);

  if (inicializando) {
    return (
      <View style={estilos.splash}>
        <ActivityIndicator size="large" color={Colores.primario} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <ToastContainer />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const estilos = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colores.fondo,
  },
});
