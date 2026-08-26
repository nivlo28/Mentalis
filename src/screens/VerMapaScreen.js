import React, { useMemo } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

// Estructura de datos que usamos para guardar los conceptos del mapa
import ListaEnlazada from '../estructuras/ListaEnlazada';

// Tema claro y oscuro de la aplicación
import { useTheme } from '../context/ThemeContext';

// Componente para mostrar cada concepto
import ConceptoCard from '../components/ConceptoCard';

// Servicio que utiliza nuestra ColaPrioridad
import { obtenerOrdenRepaso } from '../services/repasoService';

export default function VerMapaScreen({ route }) {
  // Recibimos el tema y el mapa desde la pantalla anterior
  const { tema, mapa } = route.params;

  const { theme } = useTheme();

  /*
    LISTA ENLAZADA

    Gemini nos devuelve un arreglo de conceptos.
    Nosotros tomamos esos conceptos y los insertamos
    en nuestra propia ListaEnlazada.

    Cada concepto se convierte en un nodo de la lista.
  */
  const conceptos = useMemo(() => {
    const lista = new ListaEnlazada();

    if (mapa?.conceptos) {
      mapa.conceptos.forEach((concepto, index) => {

        /*
          Estos estados son temporales.

          Después los vamos a calcular dependiendo
          de los resultados que tenga el usuario
          cuando realice los quiz.
        */
        let estado = 'dominado';

        if (index === 0) {
          estado = 'repasar';
        } else if (index === 1) {
          estado = 'aprendiendo';
        }

        const conceptoConEstado = {
          ...concepto,
          estado,
        };

        // Insertamos el concepto al final de la lista enlazada
        lista.insertarFinal(conceptoConEstado);
      });
    }

    // Recorremos la lista para obtener los conceptos
    const resultado = lista.recorrer();

    // Estos console.log nos ayudan a comprobar la estructura
    console.log('Lista enlazada:', resultado);
    console.log(
      'Cantidad de nodos:',
      lista.obtenerLongitud()
    );

    return resultado;
  }, [mapa]);

  /*
    COLA DE PRIORIDAD

    Después de tener los conceptos en la lista enlazada,
    usamos una ColaPrioridad para decidir cuáles deberían
    ser repasados primero.

    Prioridad 1 = necesita repaso
    Prioridad 2 = está aprendiendo
    Prioridad 3 = dominado
  */
  const ordenRepaso = useMemo(() => {
    const resultado = obtenerOrdenRepaso(conceptos);

    console.log(
      'Orden generado por ColaPrioridad:',
      resultado
    );

    return resultado;
  }, [conceptos]);

  return (
    <ScrollView
      style={{
        backgroundColor: theme.background,
      }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* ENCABEZADO DEL MAPA */}
      <View
        style={[
          styles.iconoPrincipal,
          {
            backgroundColor: theme.primarySoft,
          },
        ]}
      >
        <Ionicons
          name="git-network-outline"
          size={30}
          color={theme.primary}
        />
      </View>

      <Text
        style={[
          styles.titulo,
          {
            color: theme.text,
          },
        ]}
      >
        {tema}
      </Text>

      <Text
        style={[
          styles.subtitulo,
          {
            color: theme.secondaryText,
          },
        ]}
      >
        Mapa de conocimiento
      </Text>

      {/* INFORMACIÓN DE LA LISTA ENLAZADA */}
      {conceptos.length > 0 && (
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons
            name="information-circle-outline"
            size={21}
            color={theme.primary}
          />

          <Text
            style={[
              styles.infoTexto,
              {
                color: theme.secondaryText,
              },
            ]}
          >
            {conceptos.length} conceptos organizados mediante
            una lista enlazada
          </Text>
        </View>
      )}

      {/* CONCEPTOS DEL MAPA */}
      <Text
        style={[
          styles.tituloSeccion,
          {
            color: theme.text,
          },
        ]}
      >
        Conceptos
      </Text>

      <View style={styles.lista}>
        {conceptos.map((concepto, index) => (
          <View key={index}>

            {/* Cada tarjeta representa un nodo de la lista */}
            <ConceptoCard
              concepto={concepto}
              numero={index + 1}
              onPress={() => {
                console.log(
                  'Concepto seleccionado:',
                  concepto
                );
              }}
            />

            {/* Línea visual que conecta los nodos */}
            {index < conceptos.length - 1 && (
              <View
                style={[
                  styles.linea,
                  {
                    backgroundColor: theme.primary,
                  },
                ]}
              />
            )}
          </View>
        ))}
      </View>

      {/* RESULTADO DE LA COLA DE PRIORIDAD */}
      {ordenRepaso.length > 0 && (
        <>
          <Text
            style={[
              styles.tituloSeccion,
              styles.tituloRepaso,
              {
                color: theme.text,
              },
            ]}
          >
            Prioridad de repaso
          </Text>

          <Text
            style={[
              styles.descripcionRepaso,
              {
                color: theme.secondaryText,
              },
            ]}
          >
            Mentalis organiza qué conceptos deberías repasar
            primero usando una cola de prioridad.
          </Text>

          {ordenRepaso.map((concepto, index) => (
            <RepasoCard
              key={index}
              concepto={concepto}
              posicion={index + 1}
              theme={theme}
            />
          ))}
        </>
      )}

      {/* MENSAJE SI GEMINI NO DEVUELVE CONCEPTOS */}
      {conceptos.length === 0 && (
        <View style={styles.vacio}>
          <Ionicons
            name="alert-circle-outline"
            size={40}
            color={theme.secondaryText}
          />

          <Text
            style={[
              styles.error,
              {
                color: theme.secondaryText,
              },
            ]}
          >
            No se recibieron conceptos.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

/*
  Componente que muestra cada elemento
  que salió de la ColaPrioridad.
*/
function RepasoCard({
  concepto,
  posicion,
  theme,
}) {
  // Por defecto consideramos el concepto dominado
  let icono = 'checkmark-circle-outline';
  let textoEstado = 'Dominado';
  let colorEstado = '#22C55E';

  // Prioridad más alta de repaso
  if (concepto.estado === 'repasar') {
    icono = 'flame-outline';
    textoEstado = 'Repasar primero';
    colorEstado = '#F97316';
  }

  // Prioridad intermedia
  if (concepto.estado === 'aprendiendo') {
    icono = 'book-outline';
    textoEstado = 'En aprendizaje';
    colorEstado = '#3B82F6';
  }

  return (
    <View
      style={[
        styles.repasoCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      {/* Posición que ocupa dentro de la cola */}
      <View
        style={[
          styles.posicion,
          {
            backgroundColor: theme.primarySoft,
          },
        ]}
      >
        <Text
          style={{
            color: theme.primary,
            fontWeight: 'bold',
          }}
        >
          {posicion}
        </Text>
      </View>

      <View style={styles.infoRepaso}>
        <Text
          style={[
            styles.nombreRepaso,
            {
              color: theme.text,
            },
          ]}
        >
          {concepto.nombre}
        </Text>

        <View style={styles.estadoFila}>
          <Ionicons
            name={icono}
            size={15}
            color={colorEstado}
          />

          <Text
            style={[
              styles.estadoTexto,
              {
                color: colorEstado,
              },
            ]}
          >
            {textoEstado}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 50,
  },

  iconoPrincipal: {
    width: 58,
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 13,
  },

  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  subtitulo: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 22,
  },

  infoCard: {
    borderWidth: 1,
    borderRadius: 13,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  infoTexto: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 9,
  },

  tituloSeccion: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 13,
  },

  lista: {
    width: '100%',
  },

  linea: {
    width: 2,
    height: 14,
    alignSelf: 'center',
    marginTop: -12,
    opacity: 0.5,
  },

  tituloRepaso: {
    marginTop: 28,
    marginBottom: 5,
  },

  descripcionRepaso: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 15,
  },

  repasoCard: {
    minHeight: 68,
    borderRadius: 13,
    borderWidth: 1,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  posicion: {
    width: 40,
    height: 40,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  infoRepaso: {
    flex: 1,
  },

  nombreRepaso: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 5,
  },

  estadoFila: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  estadoTexto: {
    fontSize: 11,
    marginLeft: 5,
    fontWeight: '600',
  },

  vacio: {
    alignItems: 'center',
    marginTop: 50,
  },

  error: {
    marginTop: 10,
    fontSize: 14,
  },
});