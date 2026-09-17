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
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import ListaEnlazada from '../estructuras/ListaEnlazada';
import ColaPrioridad from '../estructuras/ColaPrioridad';

import ConceptoCard from '../components/ConceptoCard';
import ResumenMapa from '../components/ResumenMapa';
import PrioridadRepaso from '../components/PrioridadRepaso';

import { supabase } from '../services/supabase';

import {
  puedeExplicar,
  registrarExplicacion,
} from '../services/planService';

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
  const [modal, setModal] = useState(false);
  const [concepto, setConcepto] = useState('');
  const [explicacion, setExplicacion] = useState('');
  const [cargando, setCargando] = useState(false);

  // Actualiza resultados
  useFocusEffect(
    useCallback(() => {
      cargarResultados();
    }, [mapaId])
  );

  // Carga resultados
  const cargarResultados = async () => {
    if (!mapaId) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from('resultados_quiz')
      .select('*')
      .eq('mapa_id', mapaId)
      .eq('user_id', user.id);

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

  // Lista enlazada
  const conceptos = useMemo(() => {
    const lista = new ListaEnlazada();

    mapa?.conceptos?.forEach((item) => {
      lista.insertarFinal(item);
    });

    return lista.recorrer();
  }, [mapa]);

  // Cola de prioridad
  const ordenRepaso = useMemo(() => {
    const cola = new ColaPrioridad();

    conceptos.forEach((item) => {
      const resultado = resultados[item.nombre];

      cola.encolar(
        {
          ...item,
          estado:
            resultado?.estado || 'sin evaluar',
          porcentaje: resultado?.porcentaje,
        },
        resultado?.prioridad || 2
      );
    });

    return cola.recorrer();
  }, [conceptos, resultados]);

  // Progreso
  const progreso = useMemo(() => {
    if (!conceptos.length) return 0;

    const evaluados = conceptos.filter(
      (item) => resultados[item.nombre]
    ).length;

    return Math.round(
      (evaluados / conceptos.length) * 100
    );
  }, [conceptos, resultados]);

  // Abre quiz
  const abrirQuiz = async (item) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from('historial_estudio')
        .insert({
          user_id: user.id,
          mapa_id: mapaId,
          concepto: item.nombre,
        });
    }

    navigation.navigate('Quiz', {
      mapaId,
      concepto: item,
      contenidoFuente,
      tema,
      mapa,
    });
  };

  // Abre examen
  const abrirExamen = () => {
    navigation.navigate('Examen', {
      mapaId,
      tema,
      mapa,
      contenidoFuente,
    });
  };

  // Explícamelo fácil
  const explicar = async (item) => {
    try {
      // Revisa límite Free
      const permiso = await puedeExplicar();

      if (permiso.error) {
        Alert.alert(
          'Error',
          'No se pudo verificar tu plan.'
        );

        return;
      }

      if (!permiso.permitido) {
        Alert.alert(
          'Límite diario',
          `Tu plan Free permite ${permiso.limite} explicaciones al día.`
        );

        return;
      }

      setConcepto(item.nombre);
      setExplicacion('');
      setModal(true);
      setCargando(true);

      // Genera explicación
      const { data, error } =
        await supabase.functions.invoke(
          'explicar-concepto',
          {
            body: {
              concepto: item.nombre,
              contenido_fuente: contenidoFuente,
            },
          }
        );

      if (error || !data?.explicacion) {
        setModal(false);

        Alert.alert(
          'Error',
          'No se pudo generar la explicación.'
        );

        return;
      }

      // Solo cuenta si funcionó
      await registrarExplicacion();

      setExplicacion(data.explicacion);
    } catch (error) {
      console.log(error);

      setModal(false);

      Alert.alert(
        'Error',
        'Ocurrió un problema.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: theme.background,
        }}
        contentContainerStyle={styles.contenido}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.titulo,
            { color: theme.text },
          ]}
        >
          {tema}
        </Text>

        <Text
          style={[
            styles.descripcion,
            { color: theme.secondaryText },
          ]}
        >
          Tu mapa de conocimiento
        </Text>

        <ResumenMapa
          conceptos={conceptos.length}
          progreso={progreso}
          onExamen={abrirExamen}
        />

        <View style={styles.header}>
          <Text
            style={[
              styles.subtitulo,
              { color: theme.text },
            ]}
          >
            Conceptos
          </Text>

          <Text
            style={[
              styles.ayudaHeader,
              { color: theme.secondaryText },
            ]}
          >
            Toca para practicar
          </Text>
        </View>

        {conceptos.map((item, index) => (
          <ConceptoCard
            key={index}
            numero={index + 1}
            concepto={item}
            onPress={() => abrirQuiz(item)}
            onExplicar={() => explicar(item)}
          />
        ))}

        <Text
          style={[
            styles.subtitulo,
            styles.prioridad,
            { color: theme.text },
          ]}
        >
          Prioridad de repaso
        </Text>

        <Text
          style={[
            styles.ayuda,
            { color: theme.secondaryText },
          ]}
        >
          Estudia primero lo que necesita más práctica
        </Text>

        <PrioridadRepaso datos={ordenRepaso} />
      </ScrollView>

      {/* Modal explicación */}
      <Modal
        visible={modal}
        transparent
        animationType="fade"
        onRequestClose={() => setModal(false)}
      >
        <View style={styles.fondo}>
          <View
            style={[
              styles.modal,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitulo,
                { color: theme.text },
              ]}
            >
              ✨ Explícamelo fácil
            </Text>

            <Text
              style={[
                styles.concepto,
                { color: theme.primary },
              ]}
            >
              {concepto}
            </Text>

            {cargando ? (
              <View style={styles.cargando}>
                <ActivityIndicator
                  size="large"
                  color={theme.primary}
                />

                <Text
                  style={{
                    color: theme.secondaryText,
                    marginTop: 10,
                  }}
                >
                  Generando explicación...
                </Text>
              </View>
            ) : (
              <>
                <ScrollView
                  style={styles.explicacionScroll}
                >
                  <Text
                    style={[
                      styles.explicacion,
                      { color: theme.text },
                    ]}
                  >
                    {explicacion}
                  </Text>
                </ScrollView>

                <TouchableOpacity
                  style={[
                    styles.boton,
                    {
                      backgroundColor:
                        theme.primary,
                    },
                  ]}
                  onPress={() => setModal(false)}
                >
                  <Text style={styles.botonTexto}>
                    Entendido
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  contenido: {
    padding: 20,
    paddingBottom: 45,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  descripcion: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  subtitulo: {
    fontSize: 19,
    fontWeight: 'bold',
  },

  ayudaHeader: {
    fontSize: 12,
  },

  prioridad: {
    marginTop: 30,
  },

  ayuda: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 14,
  },

  fondo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 22,
  },

  modal: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
  },

  modalTitulo: {
    fontSize: 19,
    fontWeight: 'bold',
  },

  concepto: {
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 20,
  },

  cargando: {
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },

  explicacionScroll: {
    maxHeight: 280,
  },

  explicacion: {
    fontSize: 15,
    lineHeight: 23,
  },

  boton: {
    padding: 14,
    borderRadius: 11,
    alignItems: 'center',
    marginTop: 20,
  },

  botonTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});