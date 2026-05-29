import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getClientesConDeuda } from '@/db/queries/creditos';
import { ResumenCredito } from '@/types/creditos';
import { Colores } from '@/constants/colores';
import { formatCurrency } from '@/utils/formatters';
import { EmptyState } from '@/components/shared/EmptyState';

const UMBRAL_ALERTA = 500;

export default function CreditosScreen() {
  const [clientes, setClientes] = useState<ResumenCredito[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const data = await getClientesConDeuda();
      setClientes(data);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const totalDeuda = clientes.reduce((s, c) => s + c.saldo_total, 0);

  return (
    <SafeAreaView style={estilos.contenedor}>
      <View style={estilos.header}>
        <Text style={estilos.titulo}>Cuentas por Cobrar</Text>
      </View>

      {cargando ? (
        <ActivityIndicator color={Colores.primario} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={clientes}
          keyExtractor={(c) => c.cliente_id.toString()}
          contentContainerStyle={estilos.lista}
          onRefresh={cargar}
          refreshing={cargando}
          ListHeaderComponent={() =>
            clientes.length > 0 ? (
              <View style={estilos.totalCard}>
                <Text style={estilos.totalLabel}>Total en crédito</Text>
                <Text style={estilos.totalMonto}>{formatCurrency(totalDeuda)}</Text>
                <Text style={estilos.totalClientes}>{clientes.length} clientes con saldo</Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              icono="checkmark-circle-outline"
              mensaje="Sin cuentas pendientes"
              subtitulo="Todos los clientes tienen sus cuentas al día"
            />
          }
          renderItem={({ item }) => {
            const esAlerta = item.saldo_total >= UMBRAL_ALERTA;
            return (
              <TouchableOpacity
                style={estilos.clienteCard}
                onPress={() => router.push(`/(tabs)/creditos/${item.cliente_id}`)}
                activeOpacity={0.7}
              >
                <View style={[estilos.avatar, esAlerta && { backgroundColor: '#FEF2F2' }]}>
                  <Text style={[estilos.avatarLetra, esAlerta && { color: Colores.peligro }]}>
                    {item.cliente_nombre[0].toUpperCase()}
                  </Text>
                </View>
                <View style={estilos.clienteInfo}>
                  <View style={estilos.clienteNombreRow}>
                    <Text style={estilos.clienteNombre}>{item.cliente_nombre}</Text>
                    {esAlerta && (
                      <Ionicons name="warning" size={14} color={Colores.advertencia} />
                    )}
                  </View>
                  <Text style={estilos.clienteUltima}>
                    {item.ultima_compra ? `Última compra: ${item.ultima_compra.split('T')[0]}` : ''}
                  </Text>
                </View>
                <Text style={[estilos.deudaMonto, esAlerta && { color: Colores.peligro }]}>
                  {formatCurrency(item.saldo_total)}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colores.fondo },
  header: {
    padding: 16,
    backgroundColor: Colores.superficie,
    borderBottomWidth: 1,
    borderBottomColor: Colores.borde,
  },
  titulo: { fontSize: 20, fontWeight: '800', color: Colores.textoP },
  lista: { padding: 12, gap: 10, paddingBottom: 32 },
  totalCard: {
    backgroundColor: Colores.primario,
    borderRadius: 14,
    padding: 16,
    marginBottom: 4,
  },
  totalLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  totalMonto: { fontSize: 28, fontWeight: '800', color: '#fff', marginVertical: 4 },
  totalClientes: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
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
  clienteNombreRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  clienteNombre: { fontSize: 15, fontWeight: '700', color: Colores.textoP },
  clienteUltima: { fontSize: 12, color: Colores.textoS, marginTop: 2 },
  deudaMonto: { fontSize: 16, fontWeight: '800', color: Colores.textoP },
});
