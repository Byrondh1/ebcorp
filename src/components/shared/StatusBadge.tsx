import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colores } from '@/constants/colores';

type EstadoBadge = 'exito' | 'peligro' | 'advertencia' | 'info' | 'neutro';

const COLOR_MAP: Record<EstadoBadge, { bg: string; text: string }> = {
  exito: { bg: '#D1FAE5', text: '#065F46' },
  peligro: { bg: '#FEE2E2', text: '#991B1B' },
  advertencia: { bg: '#FEF3C7', text: '#92400E' },
  info: { bg: '#DBEAFE', text: '#1E40AF' },
  neutro: { bg: '#F3F4F6', text: '#374151' },
};

interface StatusBadgeProps {
  texto: string;
  estado: EstadoBadge;
}

export function StatusBadge({ texto, estado }: StatusBadgeProps) {
  const colores = COLOR_MAP[estado];
  return (
    <View style={[estilos.badge, { backgroundColor: colores.bg }]}>
      <Text style={[estilos.texto, { color: colores.text }]}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  texto: { fontSize: 12, fontWeight: '600' },
});
