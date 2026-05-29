import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colores } from '@/constants/colores';

interface ConfirmModalProps {
  visible: boolean;
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  peligro?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmModal({
  visible,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  peligro = false,
  onConfirmar,
  onCancelar,
}: ConfirmModalProps) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancelar}>
      <View style={estilos.overlay}>
        <View style={estilos.tarjeta}>
          <Text style={estilos.titulo}>{titulo}</Text>
          <Text style={estilos.mensaje}>{mensaje}</Text>
          <View style={estilos.botones}>
            <TouchableOpacity style={estilos.btnCancelar} onPress={onCancelar}>
              <Text style={estilos.txtCancelar}>{textoCancelar}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[estilos.btnConfirmar, peligro && { backgroundColor: Colores.peligro }]}
              onPress={onConfirmar}
            >
              <Text style={estilos.txtConfirmar}>{textoConfirmar}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 360,
  },
  titulo: { fontSize: 18, fontWeight: '700', color: Colores.textoP, marginBottom: 8 },
  mensaje: { fontSize: 14, color: Colores.textoS, lineHeight: 20, marginBottom: 24 },
  botones: { flexDirection: 'row', gap: 12 },
  btnCancelar: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colores.borde,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  txtCancelar: { fontSize: 15, fontWeight: '600', color: Colores.textoS },
  btnConfirmar: {
    flex: 1,
    backgroundColor: Colores.secundario,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  txtConfirmar: { fontSize: 15, fontWeight: '600', color: '#fff' },
});
