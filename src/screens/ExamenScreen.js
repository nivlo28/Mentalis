import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { supabase } from '../services/supabase';
import { puedeHacerExamen } from '../services/planService';
import { useTheme } from '../context/ThemeContext';

export default function ExamenScreen({ route, navigation }) {
  const { theme } = useTheme();

  const {
    mapaId,
    tema,
    mapa,
    contenidoFuente,
  } = route.params;

  const [preguntas, setPreguntas] = useState([]);
  const [actual, setActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [cargando, setCargando] = useState(true);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    generarExamen();
  }, []);

  // Genera el examen
  const generarExamen = async () => {
    try {
      // Revisa el límite del plan
      const permiso = await puedeHacerExamen();

      if (permiso.error) {
        Alert.alert(
          'Error',
          'No se pudo verificar tu plan.'
        );

        navigation.goBack();
        return;
      }

      // Free ya hizo su examen del día
      if (!permiso.permitido) {
        Alert.alert(
          'Límite diario',
          `Tu plan Free permite ${permiso.limite} examen al día.`
        );

        navigation.goBack();
        return;
      }

      // Genera preguntas con Gemini
      const { data, error } =
        await supabase.functions.invoke(
          'generar-examen',
          {
            body: {
              tema,
              conceptos: mapa.conceptos,
              contenido_fuente: contenidoFuente,
            },
          }
        );

      if (error || !data?.preguntas) {
        Alert.alert(
          'Error',
          'No se pudo generar el examen.'
        );

        navigation.goBack();
        return;
      }

      setPreguntas(data.preguntas);
    } catch (error) {
      console.log(error);

      Alert.alert(
        'Error',
        'Ocurrió un problema.'
      );

      navigation.goBack();
    } finally {
      setCargando(false);
    }
  };

  // Guarda la respuesta
  const responder = (opcion) => {
    setRespuestas({
      ...respuestas,
      [actual]: opcion,
    });
  };

  // Siguiente pregunta
  const siguiente = () => {
    if (respuestas[actual] === undefined) {
      Alert.alert(
        'Falta respuesta',
        'Selecciona una opción.'
      );

      return;
    }

    if (actual < preguntas.length - 1) {
      setActual(actual + 1);
    } else {
      terminarExamen();
    }
  };

  // Termina y guarda resultado
  const terminarExamen = async () => {
    let correctas = 0;
    const fallados = [];

    preguntas.forEach((pregunta, index) => {
      if (respuestas[index] === pregunta.correcta) {
        correctas++;
      } else if (
        pregunta.concepto &&
        !fallados.includes(pregunta.concepto)
      ) {
        fallados.push(pregunta.concepto);
      }
    });

    const porcentaje = Math.round(
      (correctas / preguntas.length) * 100
    );

    const resultadoFinal = {
      correctas,
      porcentaje,
      fallados,
    };

    setResultado(resultadoFinal);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from('resultados_examen')
      .insert({
        user_id: user.id,
        mapa_id: mapaId,
        correctas,
        total: preguntas.length,
        porcentaje,
        conceptos_fallados: fallados,
      });

    if (error) {
      console.log(
        'Error guardando examen:',
        error
      );
    }
  };

  // Pantalla cargando
  if (cargando) {
    return (
      <View
        style={[
          styles.centro,
          { backgroundColor: theme.background },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={theme.primary}
        />

        <Text
          style={[
            styles.cargando,
            { color: theme.text },
          ]}
        >
          Generando examen...
        </Text>
      </View>
    );
  }

  // Resultado final
  if (resultado) {
    return (
      <View
        style={[
          styles.centro,
          { backgroundColor: theme.background },
        ]}
      >
        <Text
          style={[
            styles.titulo,
            { color: theme.text },
          ]}
        >
          Examen terminado
        </Text>

        <Text
          style={[
            styles.porcentaje,
            { color: theme.primary },
          ]}
        >
          {resultado.porcentaje}%
        </Text>

        <Text style={{ color: theme.text }}>
          {resultado.correctas} de {preguntas.length} correctas
        </Text>

        {resultado.fallados.length > 0 && (
          <View
            style={[
              styles.resultadoCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.resultadoTitulo,
                { color: theme.text },
              ]}
            >
              Conceptos para reforzar
            </Text>

            {resultado.fallados.map(
              (concepto, index) => (
                <Text
                  key={index}
                  style={{
                    color: theme.secondaryText,
                    marginTop: 6,
                  }}
                >
                  • {concepto}
                </Text>
              )
            )}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.boton,
            { backgroundColor: theme.primary },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoBoton}>
            Volver al mapa
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pregunta = preguntas[actual];

  if (!pregunta) return null;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <Text
        style={{
          color: theme.secondaryText,
        }}
      >
        Pregunta {actual + 1} de {preguntas.length}
      </Text>

      <Text
        style={[
          styles.titulo,
          { color: theme.text },
        ]}
      >
        {tema}
      </Text>

      {pregunta.concepto && (
        <Text
          style={[
            styles.concepto,
            { color: theme.primary },
          ]}
        >
          {pregunta.concepto}
        </Text>
      )}

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

      {pregunta.opciones.map((opcion, index) => {
        const seleccionada =
          respuestas[actual] === index;

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.opcion,
              {
                backgroundColor: seleccionada
                  ? theme.primarySoft
                  : theme.card,

                borderColor: seleccionada
                  ? theme.primary
                  : theme.border,
              },
            ]}
            onPress={() => responder(index)}
          >
            <Text
              style={{
                color: theme.text,
              }}
            >
              {String.fromCharCode(65 + index)}. {opcion}
            </Text>
          </TouchableOpacity>
        );
      })}

      <View style={styles.botones}>
        {actual > 0 && (
          <TouchableOpacity
            style={[
              styles.botonSecundario,
              { borderColor: theme.border },
            ]}
            onPress={() => setActual(actual - 1)}
          >
            <Text style={{ color: theme.text }}>
              Anterior
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.boton,
            { backgroundColor: theme.primary },
          ]}
          onPress={siguiente}
        >
          <Text style={styles.textoBoton}>
            {actual === preguntas.length - 1
              ? 'Entregar'
              : 'Siguiente'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    paddingTop: 45,
  },

  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },

  cargando: {
    marginTop: 12,
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 18,
  },

  concepto: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },

  card: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },

  pregunta: {
    fontSize: 18,
    lineHeight: 25,
  },

  opcion: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },

  botones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 15,
  },

  boton: {
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 12,
  },

  botonSecundario: {
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },

  textoBoton: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  porcentaje: {
    fontSize: 55,
    fontWeight: 'bold',
  },

  resultadoCard: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 15,
    padding: 18,
    marginTop: 25,
  },

  resultadoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});