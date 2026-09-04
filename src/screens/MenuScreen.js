import React, { useCallback, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { supabase } from '../services/supabase';
import { useTheme } from '../context/ThemeContext';

import MapaCard from '../components/MapaCard';

export default function MenuScreen({ navigation }) {
  const { theme } = useTheme();

  const [mapas, setMapas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);

  // Carga mapas del usuario
  const cargarMapas = async () => {
    setCargando(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setCargando(false);
      return;
    }

    const { data, error } = await supabase
      .from('mapas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Error cargando mapas:', error);
    } else {
      setMapas(data || []);
    }

    setCargando(false);
  };

  // Actualiza al entrar
  useFocusEffect(
    useCallback(() => {
      cargarMapas();
    }, [])
  );

  // Abre un mapa
  const abrirMapa = (mapa) => {
    navigation.navigate('VerMapa', {
      mapaId: mapa.id,
      tema: mapa.tema,
      mapa: mapa.contenido,
      contenidoFuente: mapa.contenido_fuente,
    });
  };

  // Elimina un mapa
  const eliminarMapa = (id) => {
    Alert.alert(
      'Eliminar mapa',
      '¿Seguro que quieres eliminar este mapa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('mapas')
              .delete()
              .eq('id', id);

            if (error) {
              Alert.alert('Error', 'No se pudo eliminar.');
              return;
            }

            setMapas((actuales) =>
              actuales.filter((mapa) => mapa.id !== id)
            );
          },
        },
      ]
    );
  };

  // Filtra por tema
  const mapasFiltrados = mapas.filter((mapa) =>
    mapa.tema
      .toLowerCase()
      .includes(busqueda.trim().toLowerCase())
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <Text
        style={[
          styles.titulo,
          { color: theme.text },
        ]}
      >
        Mis mapas
      </Text>

      {/* Buscador */}
      <View
        style={[
          styles.buscador,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={theme.secondaryText}
        />

        <TextInput
          style={[
            styles.input,
            { color: theme.text },
          ]}
          placeholder="Buscar mapa..."
          placeholderTextColor={theme.secondaryText}
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {/* Mapas */}
      <FlatList
        data={mapasFiltrados}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={cargando}
            onRefresh={cargarMapas}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.fila}>
            <View style={styles.mapa}>
              <MapaCard
                titulo={item.tema}
                conceptos={`${item.contenido?.conceptos?.length || 0} conceptos`}
                onPress={() => abrirMapa(item)}
              />
            </View>

            <TouchableOpacity
              style={styles.eliminar}
              onPress={() => eliminarMapa(item.id)}
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color={theme.danger}
              />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text
            style={[
              styles.vacio,
              { color: theme.secondaryText },
            ]}
          >
            No tienes mapas.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 55,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  buscador: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  input: {
    flex: 1,
    marginLeft: 8,
  },

  fila: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  mapa: {
    flex: 1,
  },

  eliminar: {
    padding: 12,
    marginLeft: 5,
  },

  vacio: {
    textAlign: 'center',
    marginTop: 40,
  },
});