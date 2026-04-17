import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colores } from '@/constants/colores';

interface SectionHeaderProps {
  titulo: string;
  accion?: React.ReactNode;
}

export function SectionHeader({ titulo, accion }: SectionHeaderProps) {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>{titulo}</Text>
      {accion}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  titulo: { fontSize: 16, fontWeight: '700', color: Colores.textoP },
});
