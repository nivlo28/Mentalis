import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { supabase } from '../services/supabase';
import { useTheme } from '../context/ThemeContext';

export default function HeaderMentalis() {
  const { theme } = useTheme();
  const [nombre, setNombre] = useState('');

  useFocusEffect(
    useCallback(() => {
      cargarNombre();
    }, [])
  );

  const cargarNombre = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from('perfiles')
      .select('nombre')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data?.nombre) {
      const primerNombre = data.nombre
        .trim()
        .split(' ')[0];

      setNombre(primerNombre);
    } else {
      setNombre('');
    }
  };

  const obtenerSaludo = () => {
    const hora = new Date().getHours();

    if (hora < 12) return 'Buenos días';
    if (hora < 18) return 'Buenas tardes';

    return 'Buenas noches';
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View
          style={[
            styles.logoIcono,
            { backgroundColor: theme.primarySoft },
          ]}
        >
          <Ionicons
            name="bulb-outline"
            size={23}
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
      </View>

      <Text
        style={[
          styles.saludo,
          { color: theme.text },
        ]}
      >
        {obtenerSaludo()}
        {nombre ? `, ${nombre}` : ''} 👋
      </Text>

      <Text
        style={[
          styles.pregunta,
          { color: theme.secondaryText },
        ]}
      >
        ¿Qué quieres aprender hoy?
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },

  logoIcono: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },

  logo: {
    fontSize: 21,
    fontWeight: 'bold',
  },

  saludo: {
    fontSize: 26,
    fontWeight: 'bold',
  },

  pregunta: {
    fontSize: 14,
    marginTop: 6,
  },
});