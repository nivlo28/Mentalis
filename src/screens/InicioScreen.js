import React, { useCallback, useState } from 'react';

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
import { useFocusEffect } from '@react-navigation/native';

import { supabase } from '../services/supabase';
import { useTheme } from '../context/ThemeContext';

import HeaderMentalis from '../components/HeaderMentalis';
import MapaCard from '../components/MapaCard';
import ProgressCard from '../components/ProgressCard';

export default function InicioScreen({ navigation }) {
  const { theme } = useTheme();

  const [tema, setTema] = useState('');
  const [contenidoFuente, setContenidoFuente] = useState('');
  const [cargando, setCargando] = useState(false);

  const [mapas, setMapas] = useState([]);
  const [progreso, setProgreso] = useState(0);

  // Carga mapas y progreso
  const cargarDatos = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    // Busca los mapas
    const { data: mapasData } = await supabase
      .from('mapas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    const listaMapas = mapasData || [];

    // Muestra solo los últimos 3
    setMapas(listaMapas.slice(0, 3));

    // Busca resultados de quiz
    const { data: resultados } = await supabase
      .from('resultados_quiz')
      .select('mapa_id, concepto')
      .eq('user_id', user.id);

    // Cuenta todos los conceptos
    let totalConceptos = 0;

    listaMapas.forEach((mapa) => {
      totalConceptos += mapa.contenido?.conceptos?.length || 0;
    });

    // No cuenta dos veces el mismo concepto
    const evaluados = new Set(
      (resultados || []).map(
        (item) => `${item.mapa_id}-${item.concepto}`
      )
    );

    // Calcula el progreso
    const porcentaje =
      totalConceptos > 0
        ? Math.round((evaluados.size / totalConceptos) * 100)
        : 0;

    setProgreso(porcentaje);
  };

  // Actualiza cuando entra a Inicio
  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  // Genera un mapa
  const handleCrearMapa = async () => {
    if (!tema.trim() || !contenidoFuente.trim()) {
      Alert.alert(
        'Faltan datos',
        'Escribe el tema y tus apuntes.'
      );
      return;
    }

    try {
      setCargando(true);

      // Gemini genera el mapa
      const { data, error } = await supabase.functions.invoke(
        'generar-mapa',
        {
          body: {
            tema: tema.trim(),
            contenido_fuente: contenidoFuente.trim(),
          },
        }
      );

      if (error) {
        Alert.alert('Error', 'No se pudo generar el mapa.');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      // Guarda el mapa
      const { data: mapaGuardado, error: errorGuardar } =
        await supabase
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
        Alert.alert('Error', 'No se pudo guardar el mapa.');
        return;
      }

      setTema('');
      setContenidoFuente('');

      // Abre el mapa
      navigation.navigate('VerMapa', {
        mapaId: mapaGuardado.id,
        tema: mapaGuardado.tema,
        mapa: mapaGuardado.contenido,
        contenidoFuente: mapaGuardado.contenido_fuente,
      });

    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Ocurrió un problema.');
    } finally {
      setCargando(false);
    }
  };

  // Abre un mapa reciente
  const abrirMapa = (mapa) => {
    navigation.navigate('VerMapa', {
      mapaId: mapa.id,
      tema: mapa.tema,
      mapa: mapa.contenido,
      contenidoFuente: mapa.contenido_fuente,
    });
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
      contentContainerStyle={styles.contenido}
      showsVerticalScrollIndicator={false}
    >
      <HeaderMentalis />

      {/* Generador */}
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
          placeholderTextColor={theme.secondaryText}
          value={tema}
          onChangeText={setTema}
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
          placeholder="Escribe aquí tus apuntes..."
          placeholderTextColor={theme.secondaryText}
          value={contenidoFuente}
          onChangeText={setContenidoFuente}
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[
            styles.boton,
            { backgroundColor: theme.primary },
          ]}
          onPress={handleCrearMapa}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.filaBoton}>
              <Ionicons
                name="sparkles"
                size={18}
                color="#fff"
              />

              <Text style={styles.textoBoton}>
                Generar mapa
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Mapas recientes */}
      <View style={styles.tituloSeccion}>
        <Text
          style={[
            styles.seccion,
            { color: theme.text },
          ]}
        >
          Tus mapas recientes
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('Mapas')}
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

      {mapas.length === 0 ? (
        <Text style={{ color: theme.secondaryText }}>
          Todavía no tienes mapas.
        </Text>
      ) : (
        mapas.map((mapa) => (
          <MapaCard
            key={mapa.id}
            titulo={mapa.tema}
            conceptos={
              `${mapa.contenido?.conceptos?.length || 0} conceptos`
            }
            onPress={() => abrirMapa(mapa)}
          />
        ))
      )}

      {/* Progreso */}
      <Text
        style={[
          styles.seccion,
          styles.progresoTitulo,
          { color: theme.text },
        ]}
      >
        Tu progreso general
      </Text>

      <ProgressCard porcentaje={progreso} />

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
  },

  boton: {
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
    color: '#fff',
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