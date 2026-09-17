import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';

export default function PrioridadRepaso({ datos }) {
  const { theme } = useTheme();

  const colorEstado = (estado) => {
    if (estado === 'dominado') return '#22C55E';
    if (estado === 'aprendiendo') return '#F59E0B';
    if (estado === 'repasar') return '#EF4444';

    return theme.secondaryText;
  };

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
      {datos.map((item, index) => {
        const color = colorEstado(item.valor.estado);

        return (
          <View
            key={index}
            style={[
              styles.fila,
              index < datos.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.numero,
                { color: theme.primary },
              ]}
            >
              {index + 1}
            </Text>

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.nombre,
                  { color: theme.text },
                ]}
              >
                {item.valor.nombre}
              </Text>

              <Text
                style={[
                  styles.estado,
                  { color },
                ]}
              >
                ● {item.valor.estado}
              </Text>
            </View>

            {item.valor.porcentaje !== undefined && (
              <Text
                style={[
                  styles.porcentaje,
                  { color: theme.text },
                ]}
              >
                {item.valor.porcentaje}%
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
  },

  fila: {
    minHeight: 65,
    flexDirection: 'row',
    alignItems: 'center',
  },

  numero: {
    width: 35,
    fontSize: 17,
    fontWeight: 'bold',
  },

  nombre: {
    fontSize: 14,
    fontWeight: '600',
  },

  estado: {
    fontSize: 11,
    marginTop: 4,
    textTransform: 'capitalize',
  },

  porcentaje: {
    fontWeight: 'bold',
  },
});