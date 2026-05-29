import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  icono?: keyof typeof Ionicons.glyphMap;
  mensaje?: string;
  subtitulo?: string;
}

export function EmptyState({
  icono = 'file-tray-outline',
  mensaje = 'Sin registros',
  subtitulo = 'No hay datos que mostrar',
}: EmptyStateProps) {
  return (
    <View style={estilos.contenedor}>
      <View style={estilos.iconoContenedor}>
        <Ionicons name={icono} size={56} color="#9CA3AF" />
      </View>
      <Text style={estilos.mensaje}>{mensaje}</Text>
      <Text style={estilos.subtitulo}>{subtitulo}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  iconoContenedor: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  mensaje: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});
