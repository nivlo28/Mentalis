import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import InicioScreen from './src/screens/InicioScreen';
import VerMapaScreen from './src/screens/VerMapaScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio">
        <Stack.Screen
          name="Inicio"
          component={InicioScreen}
          options={{ title: 'Mentalis' }}
        />
        <Stack.Screen
          name="VerMapa"
          component={VerMapaScreen}
          options={{ title: 'Tu Mapa' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}