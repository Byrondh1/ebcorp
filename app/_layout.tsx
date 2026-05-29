import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Stack, router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { runMigrations, hayUsuarios } from '@/db/migrations';
import { useAuthStore } from '@/stores/authStore';
import { Colores } from '@/constants/colores';
import { ToastContainer } from '@/components/shared/ToastContainer';

const DESKTOP_BP = 768;

function WebFrame({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowDimensions();
  if (Platform.OS !== 'web' || width < DESKTOP_BP) {
    return <>{children}</>;
  }
  return (
    <View style={[s.webBg, { minHeight: height }]}>
      <View style={s.webFrame}>
        {children}
      </View>
    </View>
  );
}

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
      <View style={s.splash}>
        <ActivityIndicator size="large" color={Colores.primario} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <WebFrame>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          <ToastContainer />
        </WebFrame>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const s = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colores.fondo,
  },
  webBg: {
    flex: 1,
    backgroundColor: '#0d1f35',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  webFrame: {
    flex: 1,
    width: '100%',
    maxWidth: 1200,
    backgroundColor: Colores.fondo,
    overflow: 'hidden' as any,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
  },
});
