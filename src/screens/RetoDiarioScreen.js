import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { supabase } from '../services/supabase';
import { useTheme } from '../context/ThemeContext';

export default function RetoDiarioScreen({ navigation }) {
  const { theme } = useTheme();

  const [preguntas, setPreguntas] = useState([]);
  const [actual, setActual] = useState(0);
  const [correctas, setCorrectas] = useState(0);

  const [cargando, setCargando] = useState(true);
  const [terminado, setTerminado] = useState(false);
  const [yaCompletado, setYaCompletado] = useState(false);

  useEffect(() => {
    prepararReto();
  }, []);

  // Fecha local
  const obtenerFechaHoy = () => {
    const hoy = new Date();

    const year = hoy.getFullYear();
    const month = String(
      hoy.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      hoy.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // Prepara el reto
  const prepararReto = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert(
          'Error',
          'No se encontró el usuario.'
        );

        return;
      }

      // Revisa si ya hizo el reto
      const { data: perfil } = await supabase
        .from('perfiles')
        .select('ultimo_reto')
        .eq('user_id', user.id)
        .single();

      const hoy = obtenerFechaHoy();

      if (perfil?.ultimo_reto === hoy) {
        setYaCompletado(true);
        return;
      }

      // Busca resultados anteriores
      const { data: resultados } = await supabase
        .from('resultados_quiz')
        .select(
          'mapa_id, concepto, porcentaje, prioridad'
        )
        .eq('user_id', user.id)
        .order('porcentaje', {
          ascending: true,
        });

      if (!resultados || resultados.length === 0) {
        return;
      }

      // Usa hasta 5 conceptos con menor porcentaje
      const seleccionados = resultados.slice(0, 5);

      const preguntasGeneradas = [];

      for (const item of seleccionados) {
        // Busca los apuntes del mapa
        const { data: mapa } = await supabase
          .from('mapas')
          .select('contenido_fuente')
          .eq('id', item.mapa_id)
          .eq('user_id', user.id)
          .single();

        if (!mapa) continue;

        // Genera quiz con la función que ya tenemos
        const { data, error } =
          await supabase.functions.invoke(
            'generar-quiz',
            {
              body: {
                concepto: item.concepto,
                contenido_fuente:
                  mapa.contenido_fuente,
              },
            }
          );

        if (
          !error &&
          data?.preguntas?.length > 0
        ) {
          // Solo toma una pregunta por concepto
          preguntasGeneradas.push({
            ...data.preguntas[0],
            concepto: item.concepto,
          });
        }

        if (preguntasGeneradas.length === 5) {
          break;
        }
      }

      setPreguntas(preguntasGeneradas);
    } catch (error) {
      console.log(
        'Error preparando reto:',
        error
      );

      Alert.alert(
        'Error',
        'No se pudo preparar el reto.'
      );
    } finally {
      setCargando(false);
    }
  };

  // Responde pregunta
  const responder = (opcion) => {
    let total = correctas;

    if (opcion === preguntas[actual].correcta) {
      total++;
      setCorrectas(total);
    }

    if (actual < preguntas.length - 1) {
      setActual(actual + 1);
    } else {
      finalizarReto(total);
    }
  };

  // Actualiza la racha
  const actualizarRacha = async (userId) => {
    const hoyTexto = obtenerFechaHoy();

    const { data } = await supabase
      .from('perfiles')
      .select('racha, ultimo_estudio')
      .eq('user_id', userId)
      .single();

    // Ya estudió hoy
    if (data?.ultimo_estudio === hoyTexto) {
      return data?.racha || 0;
    }

    let nuevaRacha = 1;

    if (data?.ultimo_estudio) {
      const hoy = new Date(
        `${hoyTexto}T00:00:00`
      );

      const ultimo = new Date(
        `${data.ultimo_estudio}T00:00:00`
      );

      const diferencia = Math.round(
        (hoy - ultimo) /
          (1000 * 60 * 60 * 24)
      );

      if (diferencia === 1) {
        nuevaRacha =
          (data.racha || 0) + 1;
      }
    }

    await supabase
      .from('perfiles')
      .update({
        racha: nuevaRacha,
        ultimo_estudio: hoyTexto,
      })
      .eq('user_id', userId);

    return nuevaRacha;
  };

  // Finaliza reto
  const finalizarReto = async (total) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const hoy = obtenerFechaHoy();

      // Marca reto como completado
      const { error } = await supabase
        .from('perfiles')
        .update({
          ultimo_reto: hoy,
        })
        .eq('user_id', user.id);

      if (error) {
        console.log(error);

        Alert.alert(
          'Error',
          'No se pudo guardar el reto.'
        );

        return;
      }

      // También mantiene la racha
      await actualizarRacha(user.id);

      setCorrectas(total);
      setTerminado(true);
    } catch (error) {
      console.log(error);
    }
  };

  // Cargando
  if (cargando) {
    return (
      <View
        style={[
          styles.centro,
          {
            backgroundColor:
              theme.background,
          },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={theme.primary}
        />

        <Text
          style={[
            styles.cargandoTexto,
            { color: theme.secondaryText },
          ]}
        >
          Preparando tu reto...
        </Text>
      </View>
    );
  }

  // Ya lo completó
  if (yaCompletado) {
    return (
      <View
        style={[
          styles.centro,
          {
            backgroundColor:
              theme.background,
          },
        ]}
      >
        <Ionicons
          name="checkmark-circle"
          size={75}
          color="#22C55E"
        />

        <Text
          style={[
            styles.tituloGrande,
            { color: theme.text },
          ]}
        >
          Reto completado
        </Text>

        <Text
          style={[
            styles.descripcion,
            { color: theme.secondaryText },
          ]}
        >
          Ya completaste el reto de hoy.
          Vuelve mañana para uno nuevo.
        </Text>

        <TouchableOpacity
          style={[
            styles.boton,
            {
              backgroundColor:
                theme.primary,
            },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoBoton}>
            Volver
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // No ha hecho quizzes todavía
  if (preguntas.length === 0) {
    return (
      <View
        style={[
          styles.centro,
          {
            backgroundColor:
              theme.background,
          },
        ]}
      >
        <Ionicons
          name="school-outline"
          size={65}
          color={theme.primary}
        />

        <Text
          style={[
            styles.tituloGrande,
            { color: theme.text },
          ]}
        >
          Todavía no hay reto
        </Text>

        <Text
          style={[
            styles.descripcion,
            { color: theme.secondaryText },
          ]}
        >
          Completa algunos quizzes primero.
          Mentalis usará tus resultados para
          crear retos personalizados.
        </Text>

        <TouchableOpacity
          style={[
            styles.boton,
            {
              backgroundColor:
                theme.primary,
            },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoBoton}>
            Volver
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Terminado
  if (terminado) {
    return (
      <View
        style={[
          styles.centro,
          {
            backgroundColor:
              theme.background,
          },
        ]}
      >
        <View style={styles.circuloFinal}>
          <Ionicons
            name="flash"
            size={48}
            color="#F59E0B"
          />
        </View>

        <Text
          style={[
            styles.tituloGrande,
            { color: theme.text },
          ]}
        >
          ¡Reto completado!
        </Text>

        <Text
          style={[
            styles.resultado,
            { color: theme.primary },
          ]}
        >
          {correctas}/{preguntas.length}
        </Text>

        <Text
          style={[
            styles.descripcion,
            { color: theme.secondaryText },
          ]}
        >
          Respuestas correctas
        </Text>

        <TouchableOpacity
          style={[
            styles.boton,
            {
              backgroundColor:
                theme.primary,
            },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoBoton}>
            Volver al inicio
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pregunta = preguntas[actual];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={25}
            color={theme.text}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitulo,
            { color: theme.text },
          ]}
        >
          Reto diario
        </Text>

        <View style={{ width: 25 }} />
      </View>

      {/* Progreso */}
      <Text
        style={{
          color: theme.secondaryText,
        }}
      >
        Pregunta {actual + 1} de{' '}
        {preguntas.length}
      </Text>

      <View
        style={[
          styles.barra,
          {
            backgroundColor: theme.border,
          },
        ]}
      >
        <View
          style={[
            styles.barraProgreso,
            {
              width: `${
                ((actual + 1) /
                  preguntas.length) *
                100
              }%`,
              backgroundColor:
                theme.primary,
            },
          ]}
        />
      </View>

      {/* Concepto */}
      <View style={styles.conceptoFila}>
        <Ionicons
          name="flash"
          size={17}
          color={theme.primary}
        />

        <Text
          style={[
            styles.concepto,
            { color: theme.primary },
          ]}
        >
          {pregunta.concepto}
        </Text>
      </View>

      {/* Pregunta */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Text
          style={[
            styles.pregunta,
            { color: theme.text },
          ]}
        >
          {pregunta.pregunta}
        </Text>
      </View>

      {/* Opciones */}
      {pregunta.opciones.map(
        (opcion, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.opcion,
              {
                backgroundColor:
                  theme.card,
                borderColor:
                  theme.border,
              },
            ]}
            onPress={() =>
              responder(index)
            }
          >
            <View
              style={[
                styles.letra,
                {
                  borderColor:
                    theme.border,
                },
              ]}
            >
              <Text
                style={{
                  color: theme.text,
                  fontWeight: 'bold',
                }}
              >
                {String.fromCharCode(
                  65 + index
                )}
              </Text>
            </View>

            <Text
              style={[
                styles.opcionTexto,
                { color: theme.text },
              ]}
            >
              {opcion}
            </Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 55,
  },

  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  cargandoTexto: {
    marginTop: 15,
    fontSize: 14,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 35,
  },

  headerTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  barra: {
    height: 6,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 28,
    overflow: 'hidden',
  },

  barraProgreso: {
    height: '100%',
    borderRadius: 10,
  },

  conceptoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },

  concepto: {
    fontSize: 13,
    fontWeight: '600',
  },

  card: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    marginBottom: 22,
  },

  pregunta: {
    fontSize: 19,
    lineHeight: 27,
    fontWeight: '600',
  },

  opcion: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 13,
    padding: 12,
    marginBottom: 12,
  },

  letra: {
    width: 34,
    height: 34,
    borderRadius: 9,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  opcionTexto: {
    flex: 1,
    fontSize: 15,
  },

  tituloGrande: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },

  descripcion: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 300,
  },

  resultado: {
    fontSize: 55,
    fontWeight: 'bold',
    marginTop: 15,
  },

  circuloFinal: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },

  boton: {
    height: 50,
    paddingHorizontal: 30,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },

  textoBoton: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});