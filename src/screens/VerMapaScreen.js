import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import ListaEnlazada from '../estructuras/ListaEnlazada';

export default function VerMapaScreen({ route }) {
  const { tema, mapa } = route.params;

  // Creamos una lista enlazada con los conceptos generados por Gemini
  const conceptos = useMemo(() => {
    const lista = new ListaEnlazada();

    if (mapa?.conceptos) {
      mapa.conceptos.forEach((concepto) => {
        lista.insertarFinal(concepto);
      });
    }

    console.log(
      'Lista enlazada:',
      lista.recorrer()
    );

    console.log(
      'Cantidad de nodos:',
      lista.obtenerLongitud()
    );

    return lista.recorrer();
  }, [mapa]);

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.titulo}>
        Mapa de: {tema}
      </Text>

      <Text style={styles.subtitulo}>
        Conceptos organizados con Lista Enlazada
      </Text>

      {conceptos.map((concepto, index) => (
        <View key={index} style={styles.concepto}>

          <Text style={styles.numero}>
            Nodo {index + 1}
          </Text>

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

      {conceptos.length === 0 && (
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

  numero: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
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