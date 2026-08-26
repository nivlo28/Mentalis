import React, {
  useState,
} from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import {
  supabase,
} from '../services/supabase';

import {
  useTheme,
} from '../context/ThemeContext';

export default function InicioScreen({
  navigation,
}) {
  const [tema, setTema] = useState('');
  const [cargando, setCargando] = useState(false);

  const {
    theme,
  } = useTheme();

  const handleCrearMapa = async () => {
    if (tema.trim() === '') {
      Alert.alert(
        'Tema requerido',
        'Escribe un tema primero'
      );

      return;
    }

    try {
      setCargando(true);

      console.log(
        'Generando mapa para:',
        tema
      );

      const {
        data,
        error,
      } = await supabase.functions.invoke(
        'generar-mapa',
        {
          body: {
            tema: tema.trim(),
          },
        }
      );

      if (error) {
        console.error(
          'Error generando mapa:',
          error
        );

        Alert.alert(
          'Error',
          'No se pudo generar el mapa.'
        );

        return;
      }

      console.log(
        'Mapa generado:',
        data
      );

      navigation.navigate(
        'VerMapa',
        {
          tema: tema.trim(),
          mapa: data,
        }
      );

      setTema('');
    } catch (error) {
      console.error(
        'Error inesperado:',
        error
      );

      Alert.alert(
        'Error',
        'Ocurrió un problema al generar el mapa.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
      contentContainerStyle={styles.contenido}
      showsVerticalScrollIndicator={false}
    >
      {/* LOGO */}
      <View style={styles.logoContainer}>
        <View
          style={[
            styles.logoIcono,
            {
              backgroundColor:
                theme.primarySoft,
            },
          ]}
        >
          <Ionicons
            name="bulb-outline"
            size={23}
            color={theme.primary}
          />
        </View>

        <Text
          style={[
            styles.logo,
            {
              color: theme.text,
            },
          ]}
        >
          Mentalis
        </Text>
      </View>

      {/* SALUDO */}
      <View style={styles.header}>
        <View style={styles.saludoContainer}>
          <Text
            style={[
              styles.saludo,
              {
                color: theme.text,
              },
            ]}
          >
            ¡Hola! 👋
          </Text>

          <Text
            style={[
              styles.pregunta,
              {
                color:
                  theme.secondaryText,
              },
            ]}
          >
            ¿Qué tema quieres estudiar hoy?
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.notificacion,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons
            name="notifications-outline"
            size={21}
            color={theme.text}
          />
        </TouchableOpacity>
      </View>

      {/* GENERADOR */}
      <View style={styles.generador}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.input,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          placeholder="Ej: Listas enlazadas..."
          placeholderTextColor={
            theme.secondaryText
          }
          value={tema}
          onChangeText={setTema}
          editable={!cargando}
        />

        <TouchableOpacity
          style={[
            styles.botonGenerar,
            {
              backgroundColor:
                theme.primary,
            },

            cargando &&
              styles.botonDeshabilitado,
          ]}
          onPress={handleCrearMapa}
          disabled={cargando}
          activeOpacity={0.8}
        >
          {cargando ? (
            <View style={styles.filaBoton}>
              <ActivityIndicator
                color="#FFFFFF"
              />

              <Text style={styles.textoBoton}>
                Generando...
              </Text>
            </View>
          ) : (
            <View style={styles.filaBoton}>
              <Ionicons
                name="sparkles"
                size={18}
                color="#FFFFFF"
              />

              <Text style={styles.textoBoton}>
                Generar mapa
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* RECIENTES */}
      <View style={styles.tituloSeccion}>
        <Text
          style={[
            styles.seccion,
            {
              color: theme.text,
            },
          ]}
        >
          Tus mapas recientes
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Mapas')
          }
        >
          <Text
            style={[
              styles.verTodos,
              {
                color: theme.primary,
              },
            ]}
          >
            Ver todos
          </Text>
        </TouchableOpacity>
      </View>

      <MapaReciente
        titulo="Listas enlazadas"
        conceptos="7 conceptos"
        theme={theme}
      />

      <MapaReciente
        titulo="Árboles binarios"
        conceptos="6 conceptos"
        theme={theme}
      />

      <MapaReciente
        titulo="Algoritmos"
        conceptos="9 conceptos"
        theme={theme}
      />

      {/* PROGRESO */}
      <Text
        style={[
          styles.seccion,
          styles.seccionProgreso,
          {
            color: theme.text,
          },
        ]}
      >
        Tu progreso general
      </Text>

      <View
        style={[
          styles.progresoCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <View
          style={[
            styles.circulo,
            {
              borderColor: theme.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.porcentaje,
              {
                color: theme.text,
              },
            ]}
          >
            65%
          </Text>
        </View>

        <View style={styles.infoProgreso}>
          <Text
            style={[
              styles.tituloProgreso,
              {
                color: theme.text,
              },
            ]}
          >
            Dominio promedio
          </Text>

          <Text
            style={[
              styles.descripcionProgreso,
              {
                color:
                  theme.secondaryText,
              },
            ]}
          >
            Sigue estudiando para fortalecer tus conceptos.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function MapaReciente({
  titulo,
  conceptos,
  theme,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.mapaCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.iconoMapa,
          {
            backgroundColor:
              theme.primarySoft,

            borderColor:
              theme.primary,
          },
        ]}
      >
        <Ionicons
          name="git-network-outline"
          size={21}
          color={theme.primary}
        />
      </View>

      <View style={styles.infoMapa}>
        <Text
          style={[
            styles.tituloMapa,
            {
              color: theme.text,
            },
          ]}
        >
          {titulo}
        </Text>

        <Text
          style={[
            styles.conceptosMapa,
            {
              color:
                theme.secondaryText,
            },
          ]}
        >
          {conceptos}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={theme.primary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contenido: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },

  logoIcono: {
    width: 38,
    height: 38,

    borderRadius: 10,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 9,
  },

  logo: {
    fontSize: 21,
    fontWeight: 'bold',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: 25,
  },

  saludoContainer: {
    flex: 1,
  },

  saludo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  pregunta: {
    fontSize: 14,
  },

  notificacion: {
    width: 43,
    height: 43,

    borderRadius: 12,
    borderWidth: 1,

    justifyContent: 'center',
    alignItems: 'center',

    marginLeft: 10,
  },

  generador: {
    marginBottom: 30,
  },

  input: {
    height: 54,

    borderRadius: 13,
    borderWidth: 1,

    paddingHorizontal: 16,

    fontSize: 15,

    marginBottom: 12,
  },

  botonGenerar: {
    height: 52,
    borderRadius: 13,

    justifyContent: 'center',
    alignItems: 'center',
  },

  botonDeshabilitado: {
    opacity: 0.6,
  },

  filaBoton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  textoBoton: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  tituloSeccion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: 12,
  },

  seccion: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  verTodos: {
    fontSize: 13,
    fontWeight: '600',
  },

  mapaCard: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: 14,

    borderRadius: 13,
    borderWidth: 1,

    marginBottom: 10,
  },

  iconoMapa: {
    width: 43,
    height: 43,

    borderRadius: 10,
    borderWidth: 1,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
  },

  infoMapa: {
    flex: 1,
  },

  tituloMapa: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },

  conceptosMapa: {
    fontSize: 12,
  },

  seccionProgreso: {
    marginTop: 22,
    marginBottom: 12,
  },

  progresoCard: {
    borderRadius: 14,
    borderWidth: 1,

    padding: 18,

    flexDirection: 'row',
    alignItems: 'center',
  },

  circulo: {
    width: 65,
    height: 65,

    borderRadius: 33,

    borderWidth: 6,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 16,
  },

  porcentaje: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  infoProgreso: {
    flex: 1,
  },

  tituloProgreso: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  descripcionProgreso: {
    fontSize: 12,
    lineHeight: 18,
  },
});