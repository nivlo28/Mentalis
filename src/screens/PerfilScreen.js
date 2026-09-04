import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import { supabase } from '../services/supabase';

export default function PerfilScreen() {
  const { theme, modoOscuro, cambiarTema } = useTheme();

  const [nombre, setNombre] = useState('Usuario Mentalis');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('free');

  useEffect(() => {
    cargarPerfil();
  }, []);

  // Carga los datos del usuario
  const cargarPerfil = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setEmail(user.email || '');

    const { data } = await supabase
      .from('perfiles')
      .select('nombre, plan')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setNombre(data.nombre || 'Usuario Mentalis');
      setPlan(data.plan || 'free');
    }
  };

  // Cierra sesión
  const cerrarSesion = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Seguro que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase.auth.signOut();

            if (error) {
              Alert.alert(
                'Error',
                'No se pudo cerrar sesión.'
              );
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
      contentContainerStyle={styles.contenido}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.titulo, { color: theme.text }]}>
        Perfil
      </Text>

      <Text
        style={[
          styles.subtitulo,
          { color: theme.secondaryText },
        ]}
      >
        Configura tu experiencia en Mentalis
      </Text>

      {/* Usuario */}
      <View
        style={[
          styles.card,
          styles.perfil,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <View
          style={[
            styles.avatar,
            { backgroundColor: theme.primarySoft },
          ]}
        >
          <Ionicons
            name="person"
            size={30}
            color={theme.primary}
          />
        </View>

        <View style={styles.texto}>
          <Text style={[styles.nombre, { color: theme.text }]}>
            {nombre}
          </Text>

          <Text
            style={[
              styles.descripcion,
              { color: theme.secondaryText },
            ]}
          >
            {email}
          </Text>
        </View>
      </View>

      {/* Plan */}
      <Text style={[styles.seccion, { color: theme.text }]}>
        Tu plan
      </Text>

      <View
        style={[
          styles.card,
          styles.fila,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Ionicons
          name={plan === 'plus' ? 'star' : 'person-outline'}
          size={24}
          color={theme.primary}
        />

        <View style={styles.texto}>
          <Text style={[styles.nombre, { color: theme.text }]}>
            {plan === 'plus'
              ? 'Mentalis Plus'
              : 'Mentalis Free'}
          </Text>

          <Text
            style={[
              styles.descripcion,
              { color: theme.secondaryText },
            ]}
          >
            {plan === 'plus'
              ? 'Suscripción activa'
              : 'Plan gratuito'}
          </Text>
        </View>
      </View>

      {/* Apariencia */}
      <Text style={[styles.seccion, { color: theme.text }]}>
        Apariencia
      </Text>

      <View
        style={[
          styles.card,
          styles.fila,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Ionicons
          name={modoOscuro ? 'moon' : 'sunny'}
          size={24}
          color={theme.primary}
        />

        <View style={styles.texto}>
          <Text style={[styles.nombre, { color: theme.text }]}>
            {modoOscuro ? 'Modo oscuro' : 'Modo claro'}
          </Text>

          <Text
            style={[
              styles.descripcion,
              { color: theme.secondaryText },
            ]}
          >
            Cambia la apariencia
          </Text>
        </View>

        <Switch
          value={modoOscuro}
          onValueChange={cambiarTema}
          trackColor={{
            false: '#D1D5DB',
            true: theme.primary,
          }}
          thumbColor="#FFFFFF"
        />
      </View>

      {/* Cerrar sesión */}
      <TouchableOpacity
        style={[
          styles.cerrar,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
        onPress={cerrarSesion}
      >
        <Ionicons
          name="log-out-outline"
          size={22}
          color={theme.danger}
        />

        <Text
          style={[
            styles.textoCerrar,
            { color: theme.danger },
          ]}
        >
          Cerrar sesión
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contenido: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitulo: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 25,
  },

  seccion: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 15,
    marginBottom: 25,
  },

  perfil: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  fila: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  texto: {
    flex: 1,
    marginLeft: 12,
  },

  nombre: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },

  descripcion: {
    fontSize: 12,
  },

  cerrar: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  textoCerrar: {
    fontSize: 15,
    fontWeight: '600',
  },
});