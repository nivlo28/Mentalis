import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import {
  useTheme,
} from '../context/ThemeContext';

export default function HeaderMentalis() {
  const {
    theme,
  } = useTheme();

  return (
    <>
      <View style={styles.logoContainer}>
        <View
          style={[
            styles.logoIcono,
            {
              backgroundColor:
                theme.primarySoft,
            },
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
            {
              color: theme.text,
            },
          ]}
        >
          Mentalis
        </Text>
      </View>

      <View style={styles.header}>
        <View style={styles.saludoContainer}>
          <Text
            style={[
              styles.saludo,
              {
                color: theme.text,
              },
            ]}
          >
            ¡Hola! 👋
          </Text>

          <Text
            style={[
              styles.pregunta,
              {
                color: theme.secondaryText,
              },
            ]}
          >
            ¿Qué tema quieres estudiar hoy?
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.notificacion,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons
            name="notifications-outline"
            size={21}
            color={theme.text}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: 25,
  },

  saludoContainer: {
    flex: 1,
  },

  saludo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  pregunta: {
    fontSize: 14,
  },

  notificacion: {
    width: 43,
    height: 43,

    borderRadius: 12,
    borderWidth: 1,

    justifyContent: 'center',
    alignItems: 'center',

    marginLeft: 10,
  },
});