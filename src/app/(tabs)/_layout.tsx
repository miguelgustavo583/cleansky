import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="painel"
        options={{
          title: 'Painel',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="view-dashboard-outline"
              color={typeof color === 'string' ? color : colors.text}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="historico"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="history"
              color={typeof color === 'string' ? color : colors.text}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ajustes"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="tune-variant"
              color={typeof color === 'string' ? color : colors.text}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}