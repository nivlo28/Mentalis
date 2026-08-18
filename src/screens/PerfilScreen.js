import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { supabase } from '../services/supabase';

export default function PerfilScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [mapasCreados, setMapasCreados] = useState(0);
  const [sesionesCompletadas, setSesionesCompletadas] = useState(0);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setEmail(user.email);
    }

    const { count: countMapas } = await supabase
      .from('mapas')
      .select('*', { count: 'exact', head: true });
    setMapasCreados(countMapas || 0);

    const { count: countSesiones } = await supabase
      .from('sesiones_estudio')
      .select('*', { count: 'exact', head: true });
    setSesionesCompletadas(countSesiones || 0);
  };

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut();
    navigation.navigate('Login');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Perfil</Text>

      <Text style={styles.correo}>{email}</Text>

      <View style={styles.item}>
        <Text style={styles.etiqueta}>Mapas creados</Text>
        <Text style={styles.valor}>{mapasCreados}</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.etiqueta}>Sesiones completadas</Text>
        <Text style={styles.valor}>{sesionesCompletadas}</Text>
      </View>

      <TouchableOpacity style={styles.boton} onPress={handleCerrarSesion}>
        <Text style={styles.botonTexto}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  titulo: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  correo: { fontSize: 14, color: '#666', marginBottom: 20 },
  item: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  etiqueta: { fontSize: 16 },
  valor: { fontSize: 16, fontWeight: 'bold' },
  boton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  botonTexto: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});