import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import ListaEnlazada from '../estructuras/ListaEnlazada';
import ColaPrioridad from '../estructuras/ColaPrioridad';

import ConceptoCard from '../components/ConceptoCard';

import { supabase } from '../services/supabase';
import { useTheme } from '../context/ThemeContext';

export default function VerMapaScreen({
  route,
  navigation,
}) {
  const { theme } = useTheme();

  const {
    mapaId,
    tema,
    mapa,
    contenidoFuente,
  } = route.params || {};

  const [resultados, setResultados] = useState({});

  // Carga resultados al entrar o volver del quiz
  useFocusEffect(
    useCallback(() => {
      cargarResultados();
    }, [mapaId])
  );

  const cargarResultados = async () => {
    if (!mapaId) return;

    const { data, error } = await supabase
      .from('resultados_quiz')
      .select('*')
      .eq('mapa_id', mapaId);

    if (error) {
      console.log('Error cargando:', error);
      return;
    }

    const guardados = {};

    (data || []).forEach((item) => {
      guardados[item.concepto] = item;
    });

    setResultados(guardados);
  };

  // Crea la lista enlazada
  const conceptos = useMemo(() => {
    const lista = new ListaEnlazada();

    mapa?.conceptos?.forEach((concepto) => {
      lista.insertarFinal(concepto);
    });

    return lista.recorrer();
  }, [mapa]);

  // Crea la cola de prioridad
  const ordenRepaso = useMemo(() => {
    const cola = new ColaPrioridad();

    conceptos.forEach((concepto) => {
      const resultado =
        resultados[concepto.nombre];

      let estado = 'sin evaluar';
      let prioridad = 2;

      if (resultado) {
        estado = resultado.estado;
        prioridad = resultado.prioridad;
      }

      cola.encolar(
        {
          ...concepto,
          estado,
          porcentaje: resultado?.porcentaje,
        },
        prioridad
      );
    });

    return cola.recorrer();
  }, [conceptos, resultados]);

  // Abre el quiz
  const abrirQuiz = (concepto) => {
    navigation.navigate('Quiz', {
      mapaId,
      concepto,
      contenidoFuente,
      tema,
      mapa,
    });
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
      contentContainerStyle={styles.contenido}
    >
      <Text
        style={[
          styles.titulo,
          { color: theme.text },
        ]}
      >
        {tema}
      </Text>

      {/* Información */}
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
            styles.cardTitulo,
            { color: theme.text },
          ]}
        >
          Mapa de conceptos
        </Text>

        <Text
          style={{
            color: theme.secondaryText,
          }}
        >
          {conceptos.length} conceptos
        </Text>
      </View>

      <Text
        style={[
          styles.subtitulo,
          { color: theme.text },
        ]}
      >
        Conceptos
      </Text>

      {/* Conceptos */}
      {conceptos.map((concepto, index) => (
        <View key={index}>
          <ConceptoCard
            numero={index + 1}
            concepto={concepto}
            onPress={() => abrirQuiz(concepto)}
          />

          {index < conceptos.length - 1 && (
            <View
              style={[
                styles.linea,
                { backgroundColor: theme.border },
              ]}
            />
          )}
        </View>
      ))}

      <Text
        style={[
          styles.subtitulo,
          styles.espacio,
          { color: theme.text },
        ]}
      >
        Prioridad de repaso
      </Text>

      {/* Cola de prioridad */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        {ordenRepaso.map((item, index) => (
          <View
            key={index}
            style={styles.repaso}
          >
            <Text
              style={[
                styles.numero,
                { color: theme.primary },
              ]}
            >
              {index + 1}
            </Text>

            <View>
              <Text
                style={[
                  styles.nombre,
                  { color: theme.text },
                ]}
              >
                {item.valor.nombre}
              </Text>

              <Text
                style={[
                  styles.estado,
                  {
                    color: theme.secondaryText,
                  },
                ]}
              >
                {item.valor.estado}
                {item.valor.porcentaje !== undefined
                  ? ` - ${item.valor.porcentaje}%`
                  : ''}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contenido: {
    padding: 20,
    paddingBottom: 40,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  card: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 18,
    marginBottom: 25,
  },

  cardTitulo: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  linea: {
    width: 2,
    height: 20,
    alignSelf: 'center',
  },

  espacio: {
    marginTop: 30,
  },

  repaso: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  numero: {
    width: 35,
    fontSize: 20,
    fontWeight: 'bold',
  },

  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  estado: {
    fontSize: 13,
    marginTop: 2,
    textTransform: 'capitalize',
  },
});