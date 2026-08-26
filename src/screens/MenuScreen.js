import React, {
  useCallback,
  useState,
} from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import {
  useFocusEffect,
} from '@react-navigation/native';

import Ionicons from '@expo/vector-icons/Ionicons';

import {
  supabase,
} from '../services/supabase';

import {
  useTheme,
} from '../context/ThemeContext';

export default function MenuScreen({ navigation }) {
  const [mapas, setMapas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const {
    theme,
  } = useTheme();

  // Se ejecuta cada vez que entramos a la pestaña Mapas
  useFocusEffect(
    useCallback(() => {
      cargarMapas();
    }, [])
  );

  const cargarMapas = async () => {
    try {
      const {
        data: {
          user,
        },
      } = await supabase.auth.getUser();

      if (!user) {
        setMapas([]);
        return;
      }

      const {
        data,
        error,
      } = await supabase
        .from('mapas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', {
          ascending: false,
        });

      if (error) {
        console.log(
          'Error cargando mapas:',
          error
        );

        return;
      }

      setMapas(data || []);
    } catch (error) {
      console.log(
        'Error inesperado:',
        error
      );
    } finally {
      setCargando(false);
      setActualizando(false);
    }
  };

  const refrescar = () => {
    setActualizando(true);
    cargarMapas();
  };

  const handleAbrirMapa = (mapa) => {
    navigation.navigate('VerMapa', {
      tema: mapa.tema,

      // Soporta el campo "contenido"
      // que utilizaremos para guardar el mapa generado
      mapa:
        mapa.contenido ||
        mapa.mapa ||
        mapa,
    });
  };

  const handleCrearNuevo = () => {
    navigation.navigate('Inicio');
  };

  const mapasFiltrados = mapas.filter((mapa) =>
    mapa.tema
      ?.toLowerCase()
      .includes(
        busqueda.toLowerCase()
      )
  );

  const renderMapa = ({ item }) => {
    const cantidadConceptos =
      item.contenido?.conceptos?.length ||
      item.mapa?.conceptos?.length ||
      0;

    return (
      <TouchableOpacity
        style={[
          styles.mapaCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
        onPress={() =>
          handleAbrirMapa(item)
        }
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.iconoMapa,
            {
              backgroundColor:
                theme.primarySoft,
            },
          ]}
        >
          <Ionicons
            name="git-network-outline"
            size={24}
            color={theme.primary}
          />
        </View>

        <View style={styles.infoMapa}>
          <Text
            style={[
              styles.tema,
              {
                color: theme.text,
              },
            ]}
            numberOfLines={1}
          >
            {item.tema}
          </Text>

          <Text
            style={[
              styles.detalle,
              {
                color:
                  theme.secondaryText,
              },
            ]}
          >
            {cantidadConceptos > 0
              ? `${cantidadConceptos} conceptos`
              : 'Mapa de conocimiento'}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={21}
          color={theme.secondaryText}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme.background,
        },
      ]}
    >
      {/* ENCABEZADO */}
      <View style={styles.header}>
        <View>
          <Text
            style={[
              styles.titulo,
              {
                color: theme.text,
              },
            ]}
          >
            Mis Mapas
          </Text>

          <Text
            style={[
              styles.subtitulo,
              {
                color:
                  theme.secondaryText,
              },
            ]}
          >
            Todo lo que estás aprendiendo
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.botonAgregar,
            {
              backgroundColor:
                theme.primary,
            },
          ]}
          onPress={handleCrearNuevo}
          activeOpacity={0.8}
        >
          <Ionicons
            name="add"
            size={25}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      {/* BUSCADOR */}
      <View
        style={[
          styles.buscador,
          {
            backgroundColor:
              theme.card,

            borderColor:
              theme.border,
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
            {
              color: theme.text,
            },
          ]}
          placeholder="Buscar un mapa..."
          placeholderTextColor={
            theme.secondaryText
          }
          value={busqueda}
          onChangeText={setBusqueda}
        />

        {busqueda.length > 0 && (
          <TouchableOpacity
            onPress={() =>
              setBusqueda('')
            }
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={
                theme.secondaryText
              }
            />
          </TouchableOpacity>
        )}
      </View>

      {/* CANTIDAD */}
      {!cargando && mapas.length > 0 && (
        <Text
          style={[
            styles.cantidad,
            {
              color:
                theme.secondaryText,
            },
          ]}
        >
          {mapasFiltrados.length}{' '}
          {mapasFiltrados.length === 1
            ? 'mapa'
            : 'mapas'}
        </Text>
      )}

      {/* CARGANDO */}
      {cargando ? (
        <View
          style={
            styles.cargandoContainer
          }
        >
          <ActivityIndicator
            size="large"
            color={theme.primary}
          />

          <Text
            style={[
              styles.cargandoTexto,
              {
                color:
                  theme.secondaryText,
              },
            ]}
          >
            Cargando mapas...
          </Text>
        </View>
      ) : (
        <FlatList
          data={mapasFiltrados}
          keyExtractor={(item) =>
            item.id.toString()
          }
          renderItem={renderMapa}
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            mapasFiltrados.length === 0
              ? styles.listaVacia
              : styles.lista
          }
          refreshControl={
            <RefreshControl
              refreshing={actualizando}
              onRefresh={refrescar}
              tintColor={theme.primary}
            />
          }
          ListEmptyComponent={
            <View
              style={
                styles.vacioContainer
              }
            >
              <View
                style={[
                  styles.vacioIcono,
                  {
                    backgroundColor:
                      theme.primarySoft,
                  },
                ]}
              >
                <Ionicons
                  name={
                    busqueda
                      ? 'search-outline'
                      : 'map-outline'
                  }
                  size={42}
                  color={theme.primary}
                />
              </View>

              <Text
                style={[
                  styles.vacioTitulo,
                  {
                    color: theme.text,
                  },
                ]}
              >
                {busqueda
                  ? 'No encontramos ese mapa'
                  : 'Todavía no tienes mapas'}
              </Text>

              <Text
                style={[
                  styles.vacioTexto,
                  {
                    color:
                      theme.secondaryText,
                  },
                ]}
              >
                {busqueda
                  ? 'Prueba buscando con otro nombre.'
                  : 'Genera tu primer mapa de conocimiento para empezar.'}
              </Text>

              {!busqueda && (
                <TouchableOpacity
                  style={[
                    styles.botonCrear,
                    {
                      backgroundColor:
                        theme.primary,
                    },
                  ]}
                  onPress={
                    handleCrearNuevo
                  }
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="sparkles"
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text
                    style={
                      styles.botonCrearTexto
                    }
                  >
                    Crear mi primer mapa
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 55,
  },

  header: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitulo: {
    fontSize: 13,
    marginTop: 5,
  },

  botonAgregar: {
    width: 45,
    height: 45,
    borderRadius: 13,

    justifyContent: 'center',
    alignItems: 'center',
  },

  buscador: {
    height: 52,

    borderRadius: 13,
    borderWidth: 1,

    paddingHorizontal: 14,

    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 12,
  },

  input: {
    flex: 1,
    fontSize: 14,
    marginHorizontal: 10,
  },

  cantidad: {
    fontSize: 12,
    marginBottom: 13,
  },

  lista: {
    paddingBottom: 30,
  },

  mapaCard: {
    minHeight: 75,

    borderRadius: 14,
    borderWidth: 1,

    padding: 14,

    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 11,
  },

  iconoMapa: {
    width: 47,
    height: 47,

    borderRadius: 12,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 13,
  },

  infoMapa: {
    flex: 1,
  },

  tema: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },

  detalle: {
    fontSize: 12,
  },

  cargandoContainer: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',

    paddingBottom: 100,
  },

  cargandoTexto: {
    marginTop: 12,
    fontSize: 13,
  },

  listaVacia: {
    flexGrow: 1,

    justifyContent: 'center',

    paddingBottom: 100,
  },

  vacioContainer: {
    alignItems: 'center',
    paddingHorizontal: 25,
  },

  vacioIcono: {
    width: 85,
    height: 85,

    borderRadius: 25,

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 18,
  },

  vacioTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 7,
    textAlign: 'center',
  },

  vacioTexto: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',

    marginBottom: 20,
  },

  botonCrear: {
    minHeight: 48,

    paddingHorizontal: 20,

    borderRadius: 12,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    gap: 8,
  },

  botonCrearTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
