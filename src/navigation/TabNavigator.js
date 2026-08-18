import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import MenuScreen from '../screens/MenuScreen';
import InicioScreen from '../screens/InicioScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#888',

        tabBarStyle: {
          height: 75,
          paddingBottom: 12,
          paddingTop: 8,
          backgroundColor: '#0F172A',
          borderTopWidth: 0,
        },
        

        tabBarIcon: ({ color, size }) => {
          let iconName = 'home-outline';

          if (route.name === 'Inicio') {
            iconName = 'home-outline';
          }

          if (route.name === 'Mapas') {
            iconName = 'map-outline';
          }

          if (route.name === 'Perfil') {
            iconName = 'person-outline';
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
        component={MenuScreen}
      />

      <Tab.Screen
        name="Mapas"
        component={InicioScreen}
      />

      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
      />
    </Tab.Navigator>
  );
}