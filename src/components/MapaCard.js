import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function MapaCard({
  titulo,
  conceptos,
  onPress,
}) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.icono,
          {
            backgroundColor: theme.primarySoft,
            borderColor: theme.primary,
          },
        ]}
      >
        <Ionicons
          name="git-network-outline"
          size={21}
          color={theme.primary}
        />
      </View>

      <View style={styles.info}>
        <Text
          style={[
            styles.titulo,
            { color: theme.text },
          ]}
          numberOfLines={1}
        >
          {titulo}
        </Text>

        <Text
          style={[
            styles.conceptos,
            { color: theme.secondaryText },
          ]}
        >
          {conceptos}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={theme.primary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 13,
    borderWidth: 1,
    marginBottom: 10,
  },

  icono: {
    width: 43,
    height: 43,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  titulo: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },

  conceptos: {
    fontSize: 12,
  },
});