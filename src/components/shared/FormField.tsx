import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Colores } from '@/constants/colores';

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function FormField({ label, error, style, ...props }: FormFieldProps) {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.label}>{label}</Text>
      <TextInput
        style={[estilos.input, error ? estilos.inputError : null, style]}
        placeholderTextColor={Colores.textoD}
        {...props}
      />
      {error ? <Text style={estilos.error}>{error}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: Colores.textoS, marginBottom: 6 },
  input: {
    backgroundColor: Colores.superficie,
    borderWidth: 1,
    borderColor: Colores.borde,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: Colores.textoP,
  },
  inputError: { borderColor: Colores.peligro },
  error: { fontSize: 12, color: Colores.peligro, marginTop: 4 },
});
