import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function ConceptoCard({
  concepto,
  numero,
  onPress,
  onExplicar,
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
          styles.numeroContainer,
          { backgroundColor: theme.primarySoft },
        ]}
      >
        <Text
          style={[
            styles.numero,
            { color: theme.primary },
          ]}
        >
          {numero}
        </Text>
      </View>

      <View style={styles.info}>
        <Text
          style={[
            styles.nombre,
            { color: theme.text },
          ]}
        >
          {concepto.nombre}
        </Text>

        <Text
          style={[
            styles.requiere,
            { color: theme.secondaryText },
          ]}
        >
          {concepto.requiere?.length
            ? `Requiere: ${concepto.requiere.join(', ')}`
            : 'Sin prerrequisitos'}
        </Text>

        {/* Explicación con IA */}
        <TouchableOpacity
          style={styles.explicar}
          onPress={(event) => {
            event.stopPropagation();
            onExplicar();
          }}
        >
          <Ionicons
            name="sparkles"
            size={14}
            color={theme.primary}
          />

          <Text
            style={[
              styles.explicarTexto,
              { color: theme.primary },
            ]}
          >
            Explícamelo fácil
          </Text>
        </TouchableOpacity>
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
    width: '100%',
    minHeight: 90,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  numeroContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },

  numero: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  info: {
    flex: 1,
  },

  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  requiere: {
    fontSize: 12,
    lineHeight: 17,
  },

  explicar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
    alignSelf: 'flex-start',
  },

  explicarTexto: {
    fontSize: 12,
    fontWeight: '600',
  },
});