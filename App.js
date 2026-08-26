import React, { useEffect, useState } from 'react';

import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  View,
  Text,
  ActivityIndicator,
} from 'react-native';

import { supabase } from './src/services/supabase';

import LoginScreen from './src/screens/LoginScreen';
import RegistroScreen from './src/screens/RegistroScreen';
import VerMapaScreen from './src/screens/VerMapaScreen';
import QuizScreen from './src/screens/QuizScreen';

import TabNavigator from './src/navigation/TabNavigator';

import {
  ThemeProvider,
  useTheme,
} from './src/context/ThemeContext';

const Stack = createNativeStackNavigator();

function AppContenido() {
  const [haySesion, setHaySesion] = useState(false);
  const [cargando, setCargando] = useState(true);

  const {
    theme,
    modoOscuro,
  } = useTheme();

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
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setHaySesion(!!session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const temaNavegacion = {
    ...(modoOscuro ? DarkTheme : DefaultTheme),

    colors: {
      ...(modoOscuro
        ? DarkTheme.colors
        : DefaultTheme.colors),

      primary: theme.primary,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
    },
  };

  if (cargando) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator
          size="large"
          color={theme.primary}
        />

        <Text
          style={{
            marginTop: 10,
            color: theme.text,
          }}
        >
          Cargando...
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer theme={temaNavegacion}>
      <Stack.Navigator>
        {haySesion ? (
          <>
            <Stack.Screen
              name="Menu"
              component={TabNavigator}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="VerMapa"
              component={VerMapaScreen}
              options={{
                title: 'Tu Mapa',

                headerStyle: {
                  backgroundColor: theme.card,
                },

                headerTintColor: theme.text,
              }}
            />

            <Stack.Screen
              name="Quiz"
              component={QuizScreen}
              options={{
                title: 'Repaso',

                headerStyle: {
                  backgroundColor: theme.card,
                },

                headerTintColor: theme.text,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                title: 'Iniciar sesión',
              }}
            />

            <Stack.Screen
              name="Registro"
              component={RegistroScreen}
              options={{
                title: 'Crear cuenta',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContenido />
    </ThemeProvider>
  );
}