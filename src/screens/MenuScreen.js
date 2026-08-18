import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../services/supabase';

export default function MenuScreen({ navigation }) {
  const [mapas, setMapas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarMapas();
  }, []);

  const cargarMapas = async () => {
    const { data, error } = await supabase.from('mapas').select('*');
    if (!error) {
      setMapas(data);
    }
    setCargando(false);
  };

  const handleAbrirMapa = (mapa) => {
    navigation.navigate('VerMapa', { tema: mapa.tema });
  };

  const handleCrearNuevo = () => {
    navigation.navigate('Inicio');
  };

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut();
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis Mapas</Text>

      {cargando && <Text>Cargando...</Text>}

      <FlatList
        data={mapas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleAbrirMapa(item)}>
            <Text style={styles.itemTema}>{item.tema}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.vacio}>Todavía no tenés mapas creados</Text>}
      />

      <TouchableOpacity style={styles.botonNuevo} onPress={handleCrearNuevo}>
        <Text style={styles.botonTexto}>+ Crear nuevo mapa</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
        <Text style={styles.link}>Ver mi perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleCerrarSesion}>
        <Text style={styles.cerrarSesion}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  titulo: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  item: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 15, marginBottom: 10 },
  itemTema: { fontSize: 18, fontWeight: 'bold' },
  vacio: { textAlign: 'center', color: '#666', marginTop: 30 },
  botonNuevo: { backgroundColor: '#333', padding: 15, borderRadius: 8, marginTop: 10 },
  botonTexto: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  link: { textAlign: 'center', color: '#333', marginTop: 15 },
  cerrarSesion: { textAlign: 'center', color: '#999', marginTop: 15 },
});