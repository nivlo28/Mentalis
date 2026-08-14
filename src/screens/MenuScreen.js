import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../services/supabase';

export default function MenuScreen({ navigation }) {
  const [mapas, setMapas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const obtenerMapas = async () => {
    try {
      setCargando(true);
      
      const { data, error } = await supabase
        .from('mapas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Error obteniendo mapas:', error.message);
      } else {
        setMapas(data || []);
      }
    } catch (e) {
      console.log('Error:', e);
    } finally {
      setCargando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      obtenerMapas();
    }, [])
  );

  const handleAbrirMapa = (mapa) => {
    navigation.navigate('VerMapa', { tema: mapa.tema, mapaId: mapa.id });
  };

  const handleCrearNuevo = () => {
    navigation.navigate('Inicio');
  };

  const handleIrAPerfil = () => {
    navigation.navigate('Perfil');
  };

  return (
    <View style={styles.container}>
      {/* Encabezado con título y botón de perfil estilo Badge */}
      <View style={styles.header}>
        <View>
          <Text style={styles.subtituloHeader}>Bienvenido</Text>
          <Text style={styles.titulo}>Mis Mapas</Text>
        </View>

        <TouchableOpacity 
          style={styles.botonPerfil} 
          onPress={handleIrAPerfil}
          activeOpacity={0.7}
        >
          <View style={styles.avatarIcono}>
            <Text style={styles.avatarTexto}>👤</Text>
          </View>
          <Text style={styles.botonPerfilTexto}>Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Indicador de carga o Lista */}
      {cargando ? (
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={mapas}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.item} 
              onPress={() => handleAbrirMapa(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.itemTema}>{item.tema}</Text>
              {item.created_at && (
                <Text style={styles.itemFecha}>
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
              )}
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.vacioContainer}>
              <Text style={styles.vacio}>Todavía no tenés mapas creados</Text>
            </View>
          }
        />
      )}

      {/* Botón flotante/destacado para crear nuevo mapa */}
      <TouchableOpacity 
        style={styles.botonNuevo} 
        onPress={handleCrearNuevo}
        activeOpacity={0.8}
      >
        <Text style={styles.botonTexto}>+ Crear nuevo mapa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  subtituloHeader: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  // --- Estilos del Botón de Perfil Mejorado ---
  botonPerfil: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    // Sombra suave para darle elevación
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarIcono: {
    marginRight: 6,
  },
  avatarTexto: {
    fontSize: 14,
  },
  botonPerfilTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  // ------------------------------------------
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  itemTema: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
  },
  itemFecha: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 6,
  },
  vacioContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  vacioEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  vacio: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 15,
  },
  botonNuevo: {
    backgroundColor: '#2563EB', // Azul moderno y vistoso
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    marginTop: 10,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  botonTexto: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
});