import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function VerMapaScreen({ route }) {
  // route.params trae lo que le mandó la pantalla anterior (InicioScreen o MenuScreen)
  const { tema } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mapa de: {tema}</Text>

      {/* Placeholder: acá va a ir el grafo dibujado con SVG,
          cuando esté conectada la IA que genera los conceptos */}
      <Text style={styles.info}>Acá va a ir el grafo con las conexiones</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    color: '#666',
  },
});