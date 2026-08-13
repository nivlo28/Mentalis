import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function InicioScreen({ navigation }) {
  // Guarda lo que el usuario va escribiendo en el input
  const [tema, setTema] = useState('');

  // Se ejecuta al tocar el botón "Crear mapa"
  const handleCrearMapa = () => {
    // Validación simple: no dejar crear un mapa con el campo vacío
    if (tema.trim() === '') {
      alert('Escribí un tema primero');
      return;
    }
    // Navega a VerMapa, pasándole el tema escrito como parámetro
    navigation.navigate('VerMapa', { tema: tema });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mentalis</Text>
      <Text style={styles.subtitulo}>¿Qué tema querés estudiar?</Text>

      {/* Input controlado: value y onChangeText conectados al estado 'tema' */}
      <TextInput
        style={styles.input}
        placeholder="Ej: Derivadas, Listas Enlazadas..."
        value={tema}
        onChangeText={setTema}
      />

      <Button title="Crear mapa" onPress={handleCrearMapa} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // centra verticalmente
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