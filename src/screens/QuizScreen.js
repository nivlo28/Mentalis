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
import { useTheme } from '../context/ThemeContext';

export default function QuizScreen({ route, navigation }) {
  const { theme } = useTheme();

  const {
    concepto,
    contenidoFuente,
    mapaId,
    tema,
    mapa,
  } = route.params;

  const [preguntas, setPreguntas] = useState([]);
  const [actual, setActual] = useState(0);
  const [correctas, setCorrectas] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [terminado, setTerminado] = useState(false);

  useEffect(() => {
    generarQuiz();
  }, []);

  // Genera las preguntas
  const generarQuiz = async () => {
    try {
      const { data, error } = await supabase.functions.invoke(
        'generar-quiz',
        {
          body: {
            concepto: concepto.nombre,
            contenido_fuente: contenidoFuente,
          },
        }
      );

      if (error || !data?.preguntas) {
        Alert.alert('Error', 'No se pudo generar el quiz.');
        return;
      }

      setPreguntas(data.preguntas);

    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  // Revisa respuesta
  const responder = (opcion) => {
    let total = correctas;

    if (opcion === preguntas[actual].correcta) {
      total++;
      setCorrectas(total);
    }

    if (actual < preguntas.length - 1) {
      setActual(actual + 1);
    } else {
      setTerminado(true);
    }
  };

  // Calcula resultado
  const obtenerResultado = () => {
    const porcentaje = Math.round(
      (correctas / preguntas.length) * 100
    );

    let estado = 'repasar';
    let prioridad = 1;

    if (porcentaje >= 80) {
      estado = 'dominado';
      prioridad = 3;
    } else if (porcentaje >= 50) {
      estado = 'aprendiendo';
      prioridad = 2;
    }

    return {
      porcentaje,
      estado,
      prioridad,
    };
  };

  // Guarda y vuelve al mapa
  const volverAlMapa = async () => {
    const resultado = obtenerResultado();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert('Error', 'No se encontró el usuario.');
      return;
    }

    // Borra resultado anterior
    await supabase
      .from('resultados_quiz')
      .delete()
      .eq('user_id', user.id)
      .eq('mapa_id', mapaId)
      .eq('concepto', concepto.nombre);

    // Guarda resultado nuevo
    const { error } = await supabase
      .from('resultados_quiz')
      .insert({
        user_id: user.id,
        mapa_id: mapaId,
        concepto: concepto.nombre,
        porcentaje: resultado.porcentaje,
        estado: resultado.estado,
        prioridad: resultado.prioridad,
      });

    if (error) {
      console.log('Error guardando:', error);
      Alert.alert('Error', 'No se pudo guardar.');
      return;
    }

    navigation.popTo('VerMapa', {
      mapaId,
      tema,
      mapa,
      contenidoFuente,
    });
  };

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

        <Text style={{ color: theme.text }}>
          Generando preguntas...
        </Text>
      </View>
    );
  }

  if (terminado) {
    const resultado = obtenerResultado();

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
          Quiz terminado
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
          {correctas} de {preguntas.length} correctas
        </Text>

        <Text
          style={{
            color: theme.secondaryText,
            marginTop: 10,
          }}
        >
          Estado: {resultado.estado}
        </Text>

        <TouchableOpacity
          style={[
            styles.boton,
            { backgroundColor: theme.primary },
          ]}
          onPress={volverAlMapa}
        >
          <Text style={styles.textoBoton}>
            Volver al mapa
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
        { backgroundColor: theme.background },
      ]}
    >
      <Text style={{ color: theme.secondaryText }}>
        Pregunta {actual + 1} de {preguntas.length}
      </Text>

      <Text
        style={[
          styles.titulo,
          { color: theme.text },
        ]}
      >
        {concepto.nombre}
      </Text>

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

      {pregunta.opciones.map((opcion, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.opcion,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
          onPress={() => responder(index)}
        >
          <Text style={{ color: theme.text }}>
            {String.fromCharCode(65 + index)}. {opcion}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    paddingTop: 70,
  },

  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },

  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical: 20,
  },

  card: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },

  pregunta: {
    fontSize: 18,
    lineHeight: 26,
  },

  opcion: {
    borderWidth: 1,
    borderRadius: 13,
    padding: 16,
    marginBottom: 12,
  },

  porcentaje: {
    fontSize: 55,
    fontWeight: 'bold',
  },

  boton: {
    padding: 15,
    borderRadius: 12,
    marginTop: 25,
  },

  textoBoton: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});