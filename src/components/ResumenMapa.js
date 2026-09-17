import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function ResumenMapa({
  conceptos,
  progreso,
  onExamen,
}) {
  const { theme } = useTheme();

  return (
    <>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.fila}>
          <View>
            <Text style={[styles.numero, { color: theme.text }]}>
              {conceptos}
            </Text>

            <Text style={{ color: theme.secondaryText }}>
              conceptos
            </Text>
          </View>

          <View style={styles.derecha}>
            <Text style={[styles.numero, { color: theme.primary }]}>
              {progreso}%
            </Text>

            <Text style={{ color: theme.secondaryText }}>
              estudiado
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.barra,
            { backgroundColor: theme.border },
          ]}
        >
          <View
            style={{
              width: `${progreso}%`,
              height: '100%',
              backgroundColor: theme.primary,
            }}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.examen,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
        onPress={onExamen}
      >
        <View
          style={[
            styles.icono,
            { backgroundColor: theme.primarySoft },
          ]}
        >
          <Ionicons
            name="school-outline"
            size={24}
            color={theme.primary}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.titulo, { color: theme.text }]}>
            Modo examen
          </Text>

          <Text style={{ color: theme.secondaryText }}>
            10 preguntas de todo el mapa
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.primary}
        />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 17,
    marginBottom: 12,
  },

  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  derecha: {
    alignItems: 'flex-end',
  },

  numero: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  barra: {
    height: 6,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 15,
  },

  examen: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    padding: 14,
    marginBottom: 28,
  },

  icono: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
});