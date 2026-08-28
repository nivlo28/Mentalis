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

import HeaderMentalis from '../components/HeaderMentalis';
import MapaCard from '../components/MapaCard';
import ProgressCard from '../components/ProgressCard';

export default function InicioScreen({
  navigation,
}) {
  const [tema, setTema] = useState('');
  const [contenidoFuente, setContenidoFuente] = useState('');
  const [cargando, setCargando] = useState(false);

  const {
    theme,
  } = useTheme();

  const handleCrearMapa = async () => {
    if (!tema.trim()) {
      Alert.alert(
        'Tema requerido',
        'Escribe un tema primero'
      );

      return;
    }

    try {
      setCargando(true);

      const {
        data,
        error,
      } = await supabase.functions.invoke(
        'generar-mapa',
        {
          body: {
            tema: tema.trim(),
            contenido_fuente: contenidoFuente.trim(),
          },
        }
      );

      if (error) {
        Alert.alert(
          'Error',
          'No se pudo generar el mapa.'
        );

        return;
      }

      const {
        data: {
          user,
        },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert(
          'Error',
          'No se pudo identificar tu usuario.'
        );

        return;
      }

      const {
        data: mapaGuardado,
        error: errorGuardar,
      } = await supabase
        .from('mapas')
        .insert({
          tema: tema.trim(),
          contenido: data,
          contenido_fuente: contenidoFuente.trim(),
          user_id: user.id,
        })
        .select()
        .single();

      if (errorGuardar) {
        console.log(
          'Error guardando mapa:',
          errorGuardar
        );

        Alert.alert(
          'Error',
          'El mapa se generó pero no se pudo guardar.'
        );

        return;
      }

      navigation.navigate(
        'VerMapa',
        {
          tema: mapaGuardado.tema,
          mapa: mapaGuardado.contenido,
        }
      );

      setTema('');
      setContenidoFuente('');
    } catch (error) {
      console.log(
        'Error:',
        error
      );

      Alert.alert(
        'Error',
        'Ocurrió un problema inesperado.'
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
      <HeaderMentalis />

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

        <TextInput
  style={[
    styles.input,
    styles.inputGrande,
    {
      backgroundColor: theme.input,
      borderColor: theme.border,
      color: theme.text,
    },
  ]}
  placeholder="Escribe aquí tus apuntes o información sobre el tema..."
  placeholderTextColor={theme.secondaryText}
  value={contenidoFuente}
  onChangeText={setContenidoFuente}
  multiline
  textAlignVertical="top"
  editable={!cargando}
/>

        <TouchableOpacity
          style={[
            styles.botonGenerar,
            {
              backgroundColor:
                theme.primary,
            },
          ]}
          onPress={handleCrearMapa}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator
              color="#FFFFFF"
            />
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
            style={{
              color: theme.primary,
              fontWeight: '600',
            }}
          >
            Ver todos
          </Text>
        </TouchableOpacity>
      </View>

      <MapaCard
        titulo="Listas enlazadas"
        conceptos="7 conceptos"
      />

      <MapaCard
        titulo="Árboles binarios"
        conceptos="6 conceptos"
      />

      <MapaCard
        titulo="Algoritmos"
        conceptos="9 conceptos"
      />

      <Text
        style={[
          styles.seccion,
          styles.progresoTitulo,
          {
            color: theme.text,
          },
        ]}
      >
        Tu progreso general
      </Text>

      <ProgressCard porcentaje={65} />
    </ScrollView>
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

  inputGrande: {
  height: 130,
  paddingTop: 14,
  marginBottom: 12,
},

  botonGenerar: {
    height: 52,

    borderRadius: 13,

    justifyContent: 'center',
    alignItems: 'center',
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

  progresoTitulo: {
    marginTop: 22,
    marginBottom: 12,
  },
});