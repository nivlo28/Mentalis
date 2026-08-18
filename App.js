import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, ActivityIndicator } from 'react-native';

import { supabase } from './src/services/supabase';

import LoginScreen from './src/screens/LoginScreen';
import RegistroScreen from './src/screens/RegistroScreen';
import VerMapaScreen from './src/screens/VerMapaScreen';
import QuizScreen from './src/screens/QuizScreen';

import TabNavigator from './src/navigation/TabNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  const [haySesion, setHaySesion] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function revisarSesion() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (!error) {
          setHaySesion(!!data.session);
        }
      } catch (error) {
        console.log('Error:', error);
      } finally {
        setCargando(false);
      }
    }

    revisarSesion();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setHaySesion(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (cargando) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#8B5CF6" />

        <Text style={{ marginTop: 10 }}>
          Cargando...
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {haySesion ? (
          <>
            <Stack.Screen
              name="Menu"
              component={TabNavigator}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="VerMapa"
              component={VerMapaScreen}
              options={{ title: 'Tu Mapa' }}
            />

            <Stack.Screen
              name="Quiz"
              component={QuizScreen}
              options={{ title: 'Repaso' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: 'Iniciar sesión' }}
            />

            <Stack.Screen
              name="Registro"
              component={RegistroScreen}
              options={{ title: 'Crear cuenta' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}