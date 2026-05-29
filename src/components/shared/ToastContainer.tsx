import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUIStore } from '@/stores/uiStore';
import { Colores } from '@/constants/colores';

export function ToastContainer() {
  const { toasts } = useUIStore();
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <View style={[estilos.contenedor, { top: insets.top + 8 }]}>
      {toasts.map((toast) => (
        <View
          key={toast.id}
          style={[
            estilos.toast,
            toast.tipo === 'exito' && { backgroundColor: Colores.exito },
            toast.tipo === 'error' && { backgroundColor: Colores.peligro },
            toast.tipo === 'info' && { backgroundColor: Colores.primario },
          ]}
        >
          <Text style={estilos.texto}>{toast.mensaje}</Text>
        </View>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    gap: 8,
  },
  toast: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  texto: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
