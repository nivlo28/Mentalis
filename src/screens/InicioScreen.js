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

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { supabase } from '../services/supabase';
import { puedeCrearMapa } from '../services/planService';
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

  const [racha, setRacha] = useState(0);
  const [retoCompletado, setRetoCompletado] = useState(false);

  // Fecha de hoy
  const obtenerFechaHoy = () => {
    const hoy = new Date();

    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // Carga información de inicio
  const cargarDatos = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: perfil } = await supabase
      .from('perfiles')
      .select('racha, ultimo_estudio, ultimo_reto')
      .eq('user_id', user.id)
      .single();

    const hoyTexto = obtenerFechaHoy();
    let rachaActual = perfil?.racha || 0;

    // Revisa si perdió la racha
    if (perfil?.ultimo_estudio) {
      const hoy = new Date(`${hoyTexto}T00:00:00`);
      const ultimo = new Date(
        `${perfil.ultimo_estudio}T00:00:00`
      );

      const diferencia = Math.round(
        (hoy - ultimo) / (1000 * 60 * 60 * 24)
      );

      if (diferencia > 1) {
        rachaActual = 0;
      }
    }

    setRacha(rachaActual);

    setRetoCompletado(
      perfil?.ultimo_reto === hoyTexto
    );

    // Mapas del usuario
    const { data: mapasData } = await supabase
      .from('mapas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    const listaMapas = mapasData || [];

    setMapas(listaMapas.slice(0, 3));

    // Resultados de quiz
    const { data: resultados } = await supabase
      .from('resultados_quiz')
      .select('mapa_id, concepto')
      .eq('user_id', user.id);

    const totalConceptos = listaMapas.reduce(
      (total, mapa) =>
        total +
        (mapa.contenido?.conceptos?.length || 0),
      0
    );

    const evaluados = new Set(
      (resultados || []).map(
        (item) => `${item.mapa_id}-${item.concepto}`
      )
    );

    const porcentaje = totalConceptos
      ? Math.round(
          (evaluados.size / totalConceptos) * 100
        )
      : 0;

    setProgreso(porcentaje);
  };

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
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

  // Crea un mapa
  const crearMapa = async () => {
    if (!tema.trim() || !contenidoFuente.trim()) {
      Alert.alert(
        'Faltan datos',
        'Escribe el tema y tus apuntes.'
      );

      return;
    }

    setCargando(true);

    try {
      // Revisa límite del plan
      const permiso = await puedeCrearMapa();

      if (permiso.error) {
        Alert.alert(
          'Error',
          'No se pudo verificar tu plan.'
        );

        return;
      }

      if (!permiso.permitido) {
        Alert.alert(
          'Límite alcanzado',
          `Tu plan Free permite máximo ${permiso.limite} mapas.`
        );

        return;
      }

      // Genera mapa con IA
      const { data, error } =
        await supabase.functions.invoke(
          'generar-mapa',
          {
            body: {
              tema: tema.trim(),
              contenido_fuente:
                contenidoFuente.trim(),
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
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Guarda mapa
      const {
        data: mapaGuardado,
        error: errorGuardar,
      } = await supabase
        .from('mapas')
        .insert({
          tema: tema.trim(),
          contenido: data,
          contenido_fuente:
            contenidoFuente.trim(),
          user_id: user.id,
        })
        .select()
        .single();

      if (errorGuardar) {
        Alert.alert(
          'Error',
          'No se pudo guardar el mapa.'
        );

        return;
      }

      setTema('');
      setContenidoFuente('');

      abrirMapa(mapaGuardado);
    } catch (error) {
      console.log(error);

      Alert.alert(
        'Error',
        'Ocurrió un problema.'
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

      {/* Racha y reto */}
      <View
        style={[
          styles.estudioCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.rachaParte}>
          <View style={styles.iconoFila}>
            <Ionicons
              name="flame"
              size={25}
              color="#FF8A00"
            />

            <Text
              style={[
                styles.numeroRacha,
                { color: theme.text },
              ]}
            >
              {racha}
            </Text>
          </View>

          <Text
            style={[
              styles.textoPequeno,
              { color: theme.secondaryText },
            ]}
          >
            {racha === 1
              ? 'día de racha'
              : 'días de racha'}
          </Text>
        </View>

        <View
          style={[
            styles.divisor,
            { backgroundColor: theme.border },
          ]}
        />

        <TouchableOpacity
          style={styles.retoParte}
          onPress={() =>
            navigation.navigate('RetoDiario')
          }
        >
          <View style={styles.retoTexto}>
            <View style={styles.iconoFila}>
              <Ionicons
                name={
                  retoCompletado
                    ? 'checkmark-circle'
                    : 'flash'
                }
                size={20}
                color={
                  retoCompletado
                    ? '#22C55E'
                    : theme.primary
                }
              />

              <Text
                style={[
                  styles.retoTitulo,
                  { color: theme.text },
                ]}
              >
                Reto diario
              </Text>
            </View>

            <Text
              style={[
                styles.textoPequeno,
                { color: theme.secondaryText },
              ]}
            >
              {retoCompletado
                ? 'Completado hoy'
                : '5 preguntas rápidas'}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={19}
            color={theme.secondaryText}
          />
        </TouchableOpacity>
      </View>

      {/* Crear mapa */}
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
            {
              backgroundColor: theme.primary,
            },
          ]}
          onPress={crearMapa}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color="#FFFFFF" />
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

      {mapas.length === 0 ? (
        <Text
          style={{
            color: theme.secondaryText,
          }}
        >
          Todavía no tienes mapas.
        </Text>
      ) : (
        mapas.map((mapa) => (
          <MapaCard
            key={mapa.id}
            titulo={mapa.tema}
            conceptos={`${
              mapa.contenido?.conceptos?.length || 0
            } conceptos`}
            onPress={() => abrirMapa(mapa)}
          />
        ))
      )}

      {/* Centro de estudio */}
      <TouchableOpacity
        style={[
          styles.centroCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
        onPress={() =>
          navigation.navigate('CentroEstudio')
        }
      >
        <View style={styles.centroIcono}>
          <Ionicons
            name="school-outline"
            size={28}
            color={theme.primary}
          />
        </View>

        <View style={styles.centroInfo}>
          <Text
            style={[
              styles.centroTitulo,
              { color: theme.text },
            ]}
          >
            Centro de estudio
          </Text>

          <Text
            style={[
              styles.centroDescripcion,
              {
                color: theme.secondaryText,
              },
            ]}
          >
            Organiza tus conceptos pendientes y revisa tu
            historial.
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={22}
          color={theme.secondaryText}
        />
      </TouchableOpacity>

      {/* Progreso */}
      <Text
        style={[
          styles.seccion,
          styles.progresoTitulo,
          { color: theme.text },
        ]}
      >
        Progreso de estudio
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

  estudioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    padding: 14,
    marginBottom: 22,
  },

  rachaParte: {
    width: 95,
  },

  iconoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  numeroRacha: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  textoPequeno: {
    fontSize: 11,
    marginTop: 3,
  },

  divisor: {
    width: 1,
    height: 40,
    marginHorizontal: 14,
  },

  retoParte: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  retoTexto: {
    flex: 1,
  },

  retoTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
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

  centroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 13,
    padding: 16,
    marginTop: 22,
  },

  centroIcono: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  centroInfo: {
    flex: 1,
  },

  centroTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  centroDescripcion: {
    fontSize: 13,
    lineHeight: 18,
  },

  progresoTitulo: {
    marginTop: 22,
    marginBottom: 12,
  },
});