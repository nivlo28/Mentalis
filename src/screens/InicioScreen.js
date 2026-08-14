import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../services/supabase';

export default function InicioScreen({ navigation }) {
  const [tema, setTema] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleCrearMapa = async () => {
    if (tema.trim() === '') {
      Alert.alert('Tema requerido', 'Escribí un tema primero');
      return;
    }

    try {
      setCargando(true);

      console.log('Generando mapa para:', tema);

      const { data, error } = await supabase.functions.invoke(
        'generar-mapa',
        {
          body: {
            tema: tema.trim(),
          },
        }
      );

      if (error) {
        console.error('Error llamando a generar-mapa:', error);

        Alert.alert(
          'Error',
          'No se pudo generar el mapa. Revisá la conexión.'
        );

        return;
      }

      console.log('Mapa generado:', data);

      navigation.navigate('VerMapa', {
        tema: tema.trim(),
        mapa: data,
      });

    } catch (error) {
      console.error('Error inesperado:', error);

      Alert.alert(
        'Error',
        'Ocurrió un problema al generar el mapa.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mentalis</Text>

      <Text style={styles.subtitulo}>
        ¿Qué tema querés estudiar?
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ej: Derivadas, Listas Enlazadas..."
        value={tema}
        onChangeText={setTema}
      />

      <Button
        title={cargando ? 'Generando mapa...' : 'Crear mapa'}
        onPress={handleCrearMapa}
        disabled={cargando}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },

  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },

  subtitulo: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
});