import { Platform, useWindowDimensions, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { Colores } from '@/constants/colores';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const SIDEBAR_WIDTH = 220;
const DESKTOP_BP = 768;

const TABS_CONFIG = [
  { name: 'index',      title: 'Inicio',      icono: 'home-outline',       adminOnly: false },
  { name: 'inventario', title: 'Inventario',   icono: 'cube-outline',       adminOnly: true  },
  { name: 'despacho',   title: 'Despacho',     icono: 'car-outline',        adminOnly: false },
  { name: 'clientes',   title: 'Clientes',     icono: 'people-outline',     adminOnly: false },
  { name: 'caja',       title: 'Caja',         icono: 'cash-outline',       adminOnly: true  },
  { name: 'creditos',   title: 'Créditos',     icono: 'card-outline',       adminOnly: true  },
  { name: 'reportes',   title: 'Reportes',     icono: 'bar-chart-outline',  adminOnly: true  },
] as const;

function SidebarNav({ state, navigation }: BottomTabBarProps) {
  const { logout } = useAuthStore();
  const usuario = useAuthStore((s) => s.usuario);
  const esAdmin = usuario?.rol === 'admin';

  return (
    <View style={s.sidebar}>
      <View style={s.sidebarHeader}>
        <Ionicons name="storefront" size={28} color={Colores.primario} />
        <Text style={s.sidebarTitle}>Distribuidora</Text>
      </View>

      <View style={s.sidebarNav}>
        {state.routes.map((route, index) => {
          const tab = TABS_CONFIG.find((t) => t.name === route.name);
          if (!tab || (tab.adminOnly && !esAdmin)) return null;
          const focused = state.index === index;
          return (
            <TouchableOpacity
              key={route.key}
              style={[s.sidebarItem, focused && s.sidebarItemActive]}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={tab.icono as any}
                size={20}
                color={focused ? Colores.primario : Colores.textoS}
              />
              <Text style={[s.sidebarLabel, focused && s.sidebarLabelActive]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={s.sidebarLogout} onPress={logout}>
        <Ionicons name="log-out-outline" size={18} color={Colores.textoS} />
        <Text style={s.sidebarLogoutTxt}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function TabsLayout() {
  const usuario = useAuthStore((s) => s.usuario);
  const esAdmin = usuario?.rol === 'admin';
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BP;

  return (
    <Tabs
      tabBar={isDesktop ? (props) => <SidebarNav {...props} /> : undefined}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colores.primario,
        tabBarInactiveTintColor: Colores.textoD,
        tabBarStyle: {
          backgroundColor: Colores.superficie,
          borderTopColor: Colores.borde,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inventario"
        options={{
          title: 'Inventario',
          href: esAdmin ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="despacho"
        options={{
          title: 'Despacho',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="clientes"
        options={{
          title: 'Clientes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="caja"
        options={{
          title: 'Caja',
          href: esAdmin ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="creditos"
        options={{
          title: 'Créditos',
          href: esAdmin ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reportes"
        options={{
          title: 'Reportes',
          href: esAdmin ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const s = StyleSheet.create({
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: Colores.superficie,
    borderRightWidth: 1,
    borderRightColor: Colores.borde,
    paddingTop: 24,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colores.textoP,
  },
  sidebarNav: {
    flex: 1,
    gap: 4,
    paddingHorizontal: 12,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  sidebarItemActive: {
    backgroundColor: Colores.primario + '15',
  },
  sidebarLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colores.textoS,
  },
  sidebarLabelActive: {
    color: Colores.primario,
  },
  sidebarLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 8,
  },
  sidebarLogoutTxt: {
    fontSize: 14,
    color: Colores.textoS,
    fontWeight: '600',
  },
});
