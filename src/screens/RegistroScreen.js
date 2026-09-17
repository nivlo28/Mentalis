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
  ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { supabase } from '../services/supabase';
import { useTheme } from '../context/ThemeContext';

export default function RegistroScreen({ navigation }) {
  const { theme } = useTheme();

  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');

  const [cargando, setCargando] = useState(false);
  const [verPassword, setVerPassword] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);

  // Formatea AAAA-MM-DD
  const cambiarFecha = (texto) => {
    const n = texto.replace(/\D/g, '').slice(0, 8);

    let resultado = n;

    if (n.length > 4) {
      resultado = `${n.slice(0, 4)}-${n.slice(4)}`;
    }

    if (n.length > 6) {
      resultado =
        `${n.slice(0, 4)}-${n.slice(4, 6)}-${n.slice(6)}`;
    }

    setFecha(resultado);
  };

  // Crea la cuenta
  const registrar = async () => {
    if (
      !nombre.trim() ||
      !fecha ||
      !email.trim() ||
      !password ||
      !confirmar
    ) {
      Alert.alert(
        'Datos incompletos',
        'Completa todos los campos.'
      );
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert(
        'Correo inválido',
        'Ingresa un correo válido.'
      );
      return;
    }

    if (fecha.length !== 10) {
      Alert.alert(
        'Fecha inválida',
        'Usa el formato AAAA-MM-DD.'
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Contraseña muy corta',
        'Debe tener mínimo 6 caracteres.'
      );
      return;
    }

    if (password !== confirmar) {
      Alert.alert(
        'Contraseñas diferentes',
        'Las contraseñas no coinciden.'
      );
      return;
    }

    try {
      setCargando(true);

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,

        options: {
          data: {
            nombre: nombre.trim(),
            fecha_nacimiento: fecha,
          },
        },
      });

      if (error) {
        Alert.alert(
          'No se pudo crear la cuenta',
          error.message
        );
        return;
      }

      if (!data.user) {
        Alert.alert(
          'Error',
          'No se pudo crear el usuario.'
        );
        return;
      }

      if (data.session) {
        Alert.alert(
          'Cuenta creada',
          `Bienvenido a Mentalis, ${nombre.trim().split(' ')[0]}.`
        );
      } else {
        Alert.alert(
          'Cuenta creada',
          'Revisa tu correo para confirmar tu cuenta.'
        );
      }
    } catch (error) {
      console.log('Error registro:', error);

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
        { backgroundColor: theme.background },
      ]}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.contenido}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.encabezado}>
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
              size={30}
              color={theme.primary}
            />
          </View>

          <Text
            style={[
              styles.logo,
              { color: theme.text },
            ]}
          >
            Mentalis
          </Text>

          <Text
            style={[
              styles.descripcion,
              { color: theme.secondaryText },
            ]}
          >
            Tu espacio para aprender mejor
          </Text>
        </View>

        {/* Formulario */}
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
              { color: theme.text },
            ]}
          >
            Crear cuenta
          </Text>

          <Text
            style={[
              styles.subtitulo,
              { color: theme.secondaryText },
            ]}
          >
            Empieza a estudiar con Mentalis
          </Text>

          <Campo
            icono="person-outline"
            placeholder="Nombre completo"
            value={nombre}
            onChangeText={setNombre}
            theme={theme}
          />

          <Campo
            icono="calendar-outline"
            placeholder="Fecha de nacimiento  AAAA-MM-DD"
            value={fecha}
            onChangeText={cambiarFecha}
            keyboardType="number-pad"
            maxLength={10}
            theme={theme}
          />

          <Campo
            icono="mail-outline"
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            theme={theme}
          />

          <Campo
            icono="lock-closed-outline"
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!verPassword}
            theme={theme}
            derecha={
              <TouchableOpacity
                onPress={() =>
                  setVerPassword(!verPassword)
                }
              >
                <Ionicons
                  name={
                    verPassword
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={21}
                  color={theme.secondaryText}
                />
              </TouchableOpacity>
            }
          />

          <Campo
            icono="shield-checkmark-outline"
            placeholder="Confirmar contraseña"
            value={confirmar}
            onChangeText={setConfirmar}
            secureTextEntry={!verConfirmar}
            theme={theme}
            derecha={
              <TouchableOpacity
                onPress={() =>
                  setVerConfirmar(!verConfirmar)
                }
              >
                <Ionicons
                  name={
                    verConfirmar
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={21}
                  color={theme.secondaryText}
                />
              </TouchableOpacity>
            }
          />

          <TouchableOpacity
            style={[
              styles.boton,
              { backgroundColor: theme.primary },
              cargando && { opacity: 0.6 },
            ]}
            onPress={registrar}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.botonTexto}>
                  Crear cuenta
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#FFFFFF"
                />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.login}>
            <Text
              style={[
                styles.loginTexto,
                { color: theme.secondaryText },
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
                  { color: theme.primary },
                ]}
              >
                Inicia sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Input reutilizable
function Campo({
  icono,
  theme,
  derecha,
  ...props
}) {
  return (
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
        name={icono}
        size={19}
        color={theme.secondaryText}
      />

      <TextInput
        {...props}
        style={[
          styles.input,
          { color: theme.text },
        ]}
        placeholderTextColor={theme.secondaryText}
      />

      {derecha}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contenido: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 35,
  },

  encabezado: {
    alignItems: 'center',
    marginBottom: 22,
  },

  logoIcono: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 9,
  },

  logo: {
    fontSize: 27,
    fontWeight: 'bold',
  },

  descripcion: {
    fontSize: 13,
    marginTop: 5,
  },

  card: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
  },

  titulo: {
    fontSize: 23,
    fontWeight: 'bold',
  },

  subtitulo: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 20,
  },

  inputContainer: {
    minHeight: 53,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  input: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },

  boton: {
    height: 53,
    borderRadius: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 5,
  },

  botonTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  login: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    marginTop: 19,
  },

  loginTexto: {
    fontSize: 13,
  },

  link: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});