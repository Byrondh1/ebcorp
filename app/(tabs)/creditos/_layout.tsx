import { Stack } from 'expo-router';
import { Colores } from '@/constants/colores';

export default function CreditosLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colores.superficie },
        headerTintColor: Colores.primario,
        headerTitleStyle: { fontWeight: '700', color: Colores.textoP },
        headerShadowVisible: false,
      }}
    />
  );
}
