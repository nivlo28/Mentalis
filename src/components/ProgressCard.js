import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTheme } from '../context/ThemeContext';

export default function ProgressCard({ porcentaje = 0 }) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <View
        style={[
          styles.circulo,
          { borderColor: theme.primary },
        ]}
      >
        <Text
          style={[
            styles.porcentaje,
            { color: theme.text },
          ]}
        >
          {porcentaje}%
        </Text>
      </View>

      <View style={styles.info}>
        <Text
          style={[
            styles.titulo,
            { color: theme.text },
          ]}
        >
          Progreso de estudio
        </Text>

        <Text
          style={[
            styles.descripcion,
            { color: theme.secondaryText },
          ]}
        >
          Porcentaje de conceptos que ya has evaluado.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  circulo: {
    width: 65,
    height: 65,
    borderRadius: 33,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  porcentaje: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  info: {
    flex: 1,
  },

  titulo: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  descripcion: {
    fontSize: 12,
    lineHeight: 18,
  },
});