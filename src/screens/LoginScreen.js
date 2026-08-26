import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import { supabase } from '../services/supabase';

import {
  useTheme,
} from '../context/ThemeContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const {
    theme,
  } = useTheme();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        'Datos incompletos',
        'Ingresa tu correo y contraseña.'
      );

      return;
    }

    try {
      setCargando(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        Alert.alert(
          'Error',
          error.message
        );
      }

      // App.js detecta la sesión automáticamente.
    } catch (error) {
      console.log('Error login:', error);

      Alert.alert(
        'Error',
        'Ocurrió un problema al iniciar sesión.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      {/* LOGO */}
      <View style={styles.logoContainer}>
        <View
          style={[
            styles.logoIcono,
            {
              backgroundColor: theme.primarySoft,
            },
          ]}
        >
          <Ionicons
            name="bulb-outline"
            size={34}
            color={theme.primary}
          />
        </View>

        <Text
          style={[
            styles.logo,
            {
              color: theme.text,
            },
          ]}
        >
          Mentalis
        </Text>

        <Text
          style={[
            styles.descripcion,
            {
              color: theme.secondaryText,
            },
          ]}
        >
          Organiza lo que aprendes y estudia mejor
        </Text>
      </View>

      {/* FORMULARIO */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Text
          style={[
            styles.titulo,
            {
              color: theme.text,
            },
          ]}
        >
          Iniciar sesión
        </Text>

        <Text
          style={[
            styles.subtitulo,
            {
              color: theme.secondaryText,
            },
          ]}
        >
          Ingresa a tu cuenta para continuar
        </Text>

        <Text
          style={[
            styles.label,
            {
              color: theme.text,
            },
          ]}
        >
          Correo
        </Text>

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.input,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons
            name="mail-outline"
            size={20}
            color={theme.secondaryText}
          />

          <TextInput
            style={[
              styles.input,
              {
                color: theme.text,
              },
            ]}
            placeholder="correo@ejemplo.com"
            placeholderTextColor={theme.secondaryText}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!cargando}
          />
        </View>

        <Text
          style={[
            styles.label,
            {
              color: theme.text,
            },
          ]}
        >
          Contraseña
        </Text>

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.input,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={theme.secondaryText}
          />

          <TextInput
            style={[
              styles.input,
              {
                color: theme.text,
              },
            ]}
            placeholder="Tu contraseña"
            placeholderTextColor={theme.secondaryText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!mostrarPassword}
            editable={!cargando}
          />

          <TouchableOpacity
            onPress={() =>
              setMostrarPassword(!mostrarPassword)
            }
          >
            <Ionicons
              name={
                mostrarPassword
                  ? 'eye-off-outline'
                  : 'eye-outline'
              }
              size={21}
              color={theme.secondaryText}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.boton,
            {
              backgroundColor: theme.primary,
            },
            cargando && styles.botonDeshabilitado,
          ]}
          onPress={handleLogin}
          disabled={cargando}
          activeOpacity={0.8}
        >
          {cargando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.textoBoton}>
              Entrar
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.registroContainer}>
          <Text
            style={[
              styles.textoRegistro,
              {
                color: theme.secondaryText,
              },
            ]}
          >
            ¿No tienes cuenta?
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Registro')
            }
          >
            <Text
              style={[
                styles.link,
                {
                  color: theme.primary,
                },
              ]}
            >
              Regístrate
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },

  logoIcono: {
    width: 70,
    height: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  logo: {
    fontSize: 29,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  descripcion: {
    fontSize: 13,
    textAlign: 'center',
  },

  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  subtitulo: {
    fontSize: 13,
    marginBottom: 24,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },

  inputContainer: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17,
  },

  input: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },

  boton: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  botonDeshabilitado: {
    opacity: 0.6,
  },

  textoBoton: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  registroContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 5,
  },

  textoRegistro: {
    fontSize: 13,
  },

  link: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});