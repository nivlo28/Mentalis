import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function VerMapaScreen({ route }) {
  const { tema, mapa } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>
        Mapa de: {tema}
      </Text>

      <Text style={styles.subtitulo}>
        Conceptos generados por Gemini
      </Text>

      {mapa?.conceptos?.map((concepto, index) => (
        <View key={index} style={styles.concepto}>
          <Text style={styles.nombre}>
            {concepto.nombre}
          </Text>

          {concepto.requiere?.length > 0 ? (
            <Text style={styles.requiere}>
              Requiere: {concepto.requiere.join(', ')}
            </Text>
          ) : (
            <Text style={styles.requiere}>
              Sin prerrequisitos
            </Text>
          )}
        </View>
      ))}

      {!mapa?.conceptos && (
        <Text style={styles.error}>
          No se recibieron conceptos.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  subtitulo: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },

  concepto: {
    width: '100%',
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },

  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  requiere: {
    fontSize: 14,
    color: '#666',
  },

  error: {
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
});