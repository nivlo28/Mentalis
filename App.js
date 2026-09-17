import React, { useEffect, useState } from 'react';

import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  View,
  Text,
  ActivityIndicator,
} from 'react-native';

import { supabase } from './src/services/supabase';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegistroScreen from './src/screens/RegistroScreen';
import VerMapaScreen from './src/screens/VerMapaScreen';
import QuizScreen from './src/screens/QuizScreen';
import CentroEstudioScreen from './src/screens/CentroEstudioScreen';
import PlanesScreen from './src/screens/PlanesScreen';
import RetoDiarioScreen from './src/screens/RetoDiarioScreen';
import ExamenScreen from './src/screens/ExamenScreen';

// Navegación
import TabNavigator from './src/navigation/TabNavigator';

// Tema
import {
  ThemeProvider,
  useTheme,
} from './src/context/ThemeContext';

// Plan Free / Plus
import {
  PlanProvider,
} from './src/context/PlanContext';

const Stack = createNativeStackNavigator();

function AppContenido() {
  const [haySesion, setHaySesion] = useState(false);
  const [cargando, setCargando] = useState(true);

  const { theme, modoOscuro } = useTheme();

  // Revisa si existe una sesión
  useEffect(() => {
    async function revisarSesion() {
      try {
        const { data, error } =
          await supabase.auth.getSession();

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

    // Detecta login o logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setHaySesion(!!session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Colores de navegación
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

  // Pantalla de carga
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
            {/* Menú principal */}
            <Stack.Screen
              name="Menu"
              component={TabNavigator}
              options={{
                headerShown: false,
              }}
            />

            {/* Mapa */}
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

            {/* Quiz */}
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

            {/* Reto diario */}
            <Stack.Screen
              name="RetoDiario"
              component={RetoDiarioScreen}
              options={{
                headerShown: false,
              }}
            />

            {/* Modo examen */}
            <Stack.Screen
              name="Examen"
              component={ExamenScreen}
              options={{
                title: 'Modo examen',
                headerStyle: {
                  backgroundColor: theme.card,
                },
                headerTintColor: theme.text,
              }}
            />

            {/* Centro de estudio */}
            <Stack.Screen
              name="CentroEstudio"
              component={CentroEstudioScreen}
              options={{
                title: 'Centro de estudio',
                headerStyle: {
                  backgroundColor: theme.card,
                },
                headerTintColor: theme.text,
              }}
            />

            {/* Planes */}
            <Stack.Screen
              name="Planes"
              component={PlanesScreen}
              options={{
                title: 'Planes',
                headerStyle: {
                  backgroundColor: theme.card,
                },
                headerTintColor: theme.text,
              }}
            />
          </>
        ) : (
          <>
            {/* Login */}
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                title: 'Iniciar sesión',
              }}
            />

            {/* Registro */}
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
      <PlanProvider>
        <AppContenido />
      </PlanProvider>
    </ThemeProvider>
  );
}