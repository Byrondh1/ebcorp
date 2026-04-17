import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet,
  TextInput, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getClientes } from '@/db/queries/clientes';
import { ClienteConSaldo } from '@/types/clientes';
import { Colores } from '@/constants/colores';
import { formatCurrency } from '@/utils/formatters';
import { EmptyState } from '@/components/shared/EmptyState';

export default function ClientesScreen() {
  const [clientes, setClientes] = useState<ClienteConSaldo[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const data = await getClientes();
      setClientes(data);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const clientesFiltrados = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <SafeAreaView style={estilos.contenedor}>
      <View style={estilos.header}>
        <Text style={estilos.titulo}>Clientes</Text>
        <TouchableOpacity
          style={estilos.btnNuevo}
          onPress={() => router.push('/(tabs)/clientes/nuevo')}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={estilos.txtBtnNuevo}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      <View style={estilos.buscador}>
        <Ionicons name="search-outline" size={18} color={Colores.textoD} />
        <TextInput
          style={estilos.inputBusqueda}
          value={busqueda}
          onChangeText={setBusqueda}
          placeholder="Buscar cliente..."
          placeholderTextColor={Colores.textoD}
        />
        {busqueda ? (
          <TouchableOpacity onPress={() => setBusqueda('')}>
            <Ionicons name="close-circle" size={18} color={Colores.textoD} />
          </TouchableOpacity>
        ) : null}
      </View>

      {cargando ? (
        <ActivityIndicator color={Colores.primario} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={clientesFiltrados}
          keyExtractor={(c) => c.id.toString()}
          contentContainerStyle={estilos.lista}
          ListEmptyComponent={
            <EmptyState
              icono="person-outline"
              mensaje="Sin clientes"
              subtitulo="Toca + Nuevo para agregar tu primer cliente"
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={estilos.clienteCard}
              onPress={() => router.push(`/(tabs)/clientes/${item.id}`)}
              activeOpacity={0.7}
            >
              <View style={estilos.avatar}>
                <Text style={estilos.avatarLetra}>{item.nombre[0].toUpperCase()}</Text>
              </View>
              <View style={estilos.clienteInfo}>
                <Text style={estilos.clienteNombre}>{item.nombre}</Text>
                {item.telefono ? (
                  <Text style={estilos.clienteTel}>{item.telefono}</Text>
                ) : null}
              </View>
              {item.saldo_pendiente > 0 && (
                <View style={estilos.deudaBadge}>
                  <Text style={estilos.deudaTexto}>
                    {formatCurrency(item.saldo_pendiente)}
                  </Text>
                  <Text style={estilos.deudaLabel}>debe</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={18} color={Colores.textoD} />
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colores.fondo },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colores.superficie,
    borderBottomWidth: 1,
    borderBottomColor: Colores.borde,
  },
  titulo: { fontSize: 20, fontWeight: '800', color: Colores.textoP },
  btnNuevo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colores.primario,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  txtBtnNuevo: { color: '#fff', fontSize: 14, fontWeight: '600' },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    margin: 12,
    backgroundColor: Colores.superficie,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colores.borde,
  },
  inputBusqueda: { flex: 1, fontSize: 15, color: Colores.textoP },
  lista: { padding: 12, gap: 10, paddingBottom: 32 },
  clienteCard: {
    backgroundColor: Colores.superficie,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colores.primario + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetra: { fontSize: 18, fontWeight: '800', color: Colores.primario },
  clienteInfo: { flex: 1 },
  clienteNombre: { fontSize: 16, fontWeight: '700', color: Colores.textoP },
  clienteTel: { fontSize: 13, color: Colores.textoS, marginTop: 2 },
  deudaBadge: { alignItems: 'flex-end', marginRight: 4 },
  deudaTexto: { fontSize: 14, fontWeight: '800', color: Colores.peligro },
  deudaLabel: { fontSize: 11, color: Colores.textoS },
});
