import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from './src/services/supabase';

import InicioScreen from './src/screens/InicioScreen';
import VerMapaScreen from './src/screens/VerMapaScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
  const probarSupabase = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.log('❌ Error conectando con Supabase:', error);
      return;
    }

    console.log('✅ Supabase conectado correctamente');
    console.log('Sesión actual:', data.session);
  };

  probarSupabase();
}, []);
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