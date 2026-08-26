import React from 'react';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import Ionicons from '@expo/vector-icons/Ionicons';

import MenuScreen from '../screens/MenuScreen';
import InicioScreen from '../screens/InicioScreen';
import PerfilScreen from '../screens/PerfilScreen';

import {
  useTheme,
} from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const {
    theme,
  } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: theme.primary,

        tabBarInactiveTintColor:
          theme.secondaryText,

        tabBarStyle: {
          height: 75,
          paddingBottom: 12,
          paddingTop: 8,

          backgroundColor: theme.tabBar,

          borderTopWidth: 1,
          borderTopColor: theme.border,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },

        tabBarIcon: ({
          color,
          size,
          focused,
        }) => {
          let iconName = 'home-outline';

          if (route.name === 'Inicio') {
            iconName = focused
              ? 'home'
              : 'home-outline';
          }

          if (route.name === 'Mapas') {
            iconName = focused
              ? 'map'
              : 'map-outline';
          }

          if (route.name === 'Perfil') {
            iconName = focused
              ? 'person'
              : 'person-outline';
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={InicioScreen}
      />

      <Tab.Screen
        name="Mapas"
        component={MenuScreen}
      />

      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
      />
    </Tab.Navigator>
  );
}