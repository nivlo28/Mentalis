import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../services/supabase';

export default function PerfilScreen() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function obtenerDatosUsuario() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          Alert.alert('Error', 'No se pudieron cargar los datos del perfil.');
        } else {
          setUsuario(user);
        }
      } catch (e) {
        console.log('Error de perfil:', e);
      } finally {
        setCargando(false);
      }
    }

    obtenerDatosUsuario();
  }, []);

  const handleCerrarSesion = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Sección Superior: Información Personal */}
      <View style={styles.infoContainer}>
        <Text style={styles.titulo}>Mi Perfil</Text>

        <View style={styles.tarjeta}>
          <Text style={styles.label}>Correo Electrónico:</Text>
          <Text style={styles.valor}>{usuario?.email ?? 'No disponible'}</Text>

          <Text style={styles.label}>ID de Usuario:</Text>
          <Text style={styles.valor}>{usuario?.id ?? 'No disponible'}</Text>
        </View>
      </View>

      {/* Sección Inferior: Botón de Cerrar Sesión */}
      <View style={styles.botonContainer}>
        <Button 
          title="Cerrar sesión" 
          color="#dc3545" 
          onPress={handleCerrarSesion} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between', // Empuja el contenido hacia arriba y abajo
    backgroundColor: '#f8f9fa',
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    marginTop: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  tarjeta: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 10,
    fontWeight: '600',
  },
  valor: {
    fontSize: 16,
    color: '#212529',
    marginTop: 2,
  },
  botonContainer: {
    marginBottom: 30, // Separación del borde inferior de la pantalla
  },
});