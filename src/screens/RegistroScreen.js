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

export default function RegistroScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  const [cargando, setCargando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const {
    theme,
  } = useTheme();

  const handleRegistro = async () => {
    if (
      !email.trim() ||
      !password.trim() ||
      !confirmarPassword.trim()
    ) {
      Alert.alert(
        'Datos incompletos',
        'Completa todos los campos.'
      );

      return;
    }

    if (password !== confirmarPassword) {
      Alert.alert(
        'Contraseñas diferentes',
        'Las contraseñas no coinciden.'
      );

      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Contraseña muy corta',
        'La contraseña debe tener al menos 6 caracteres.'
      );

      return;
    }

    try {
      setCargando(true);

      const {
        data,
        error,
      } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        Alert.alert(
          'Error',
          error.message
        );

        return;
      }

      console.log(
        'Usuario registrado:',
        data
      );

      Alert.alert(
        'Cuenta creada',
        'Tu cuenta fue creada correctamente.',
        [
          {
            text: 'Continuar',
            onPress: () => {
              navigation.navigate('Login');
            },
          },
        ]
      );
    } catch (error) {
      console.log(
        'Error registro:',
        error
      );

      Alert.alert(
        'Error',
        'Ocurrió un problema al crear la cuenta.'
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
          Empieza a organizar tu aprendizaje
        </Text>
      </View>

      {/* TARJETA */}
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
          Crear cuenta
        </Text>

        <Text
          style={[
            styles.subtitulo,
            {
              color: theme.secondaryText,
            },
          ]}
        >
          Regístrate para comenzar
        </Text>

        {/* CORREO */}
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

        {/* CONTRASEÑA */}
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
            placeholder="Mínimo 6 caracteres"
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

        {/* CONFIRMAR CONTRASEÑA */}
        <Text
          style={[
            styles.label,
            {
              color: theme.text,
            },
          ]}
        >
          Confirmar contraseña
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
            name="shield-checkmark-outline"
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
            placeholder="Repite tu contraseña"
            placeholderTextColor={theme.secondaryText}
            value={confirmarPassword}
            onChangeText={setConfirmarPassword}
            secureTextEntry={!mostrarConfirmacion}
            editable={!cargando}
          />

          <TouchableOpacity
            onPress={() =>
              setMostrarConfirmacion(!mostrarConfirmacion)
            }
          >
            <Ionicons
              name={
                mostrarConfirmacion
                  ? 'eye-off-outline'
                  : 'eye-outline'
              }
              size={21}
              color={theme.secondaryText}
            />
          </TouchableOpacity>
        </View>

        {/* BOTÓN */}
        <TouchableOpacity
          style={[
            styles.boton,
            {
              backgroundColor: theme.primary,
            },
            cargando && styles.botonDeshabilitado,
          ]}
          onPress={handleRegistro}
          disabled={cargando}
          activeOpacity={0.8}
        >
          {cargando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.textoBoton}>
              Crear cuenta
            </Text>
          )}
        </TouchableOpacity>

        {/* LOGIN */}
        <View style={styles.loginContainer}>
          <Text
            style={[
              styles.textoLogin,
              {
                color: theme.secondaryText,
              },
            ]}
          >
            ¿Ya tienes cuenta?
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Login')
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
              Inicia sesión
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
    marginBottom: 25,
  },

  logoIcono: {
    width: 65,
    height: 65,
    borderRadius: 18,

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 10,
  },

  logo: {
    fontSize: 27,
    fontWeight: 'bold',
    marginBottom: 5,
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
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  subtitulo: {
    fontSize: 13,
    marginBottom: 20,
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

    marginBottom: 15,
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

    marginTop: 7,
  },

  botonDeshabilitado: {
    opacity: 0.6,
  },

  textoBoton: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',

    marginTop: 19,

    gap: 5,
  },

  textoLogin: {
    fontSize: 13,
  },

  link: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});