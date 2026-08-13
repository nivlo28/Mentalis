import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Preguntas fijas de ejemplo, mientras la IA genera preguntas reales por concepto
const preguntasEjemplo = [
  {
    pregunta: '¿Qué es una función?',
    opciones: ['Una relación entre entrada y salida', 'Un número', 'Una lista'],
    correcta: 0, // índice de la opción correcta dentro del array 'opciones'
  },
  {
    pregunta: '¿Un límite describe...?',
    opciones: ['El valor final de una lista', 'A qué valor se acerca una función', 'Una derivada'],
    correcta: 1,
  },
];

export default function QuizScreen({ route, navigation }) {
  // 'concepto' es un objeto de la clase Concepto (de MapaConocimiento.js),
  // no solo texto — por eso podemos llamar sus métodos como marcarRespuesta()
  const { concepto } = route.params;

  // Índice de qué pregunta se está mostrando ahora mismo
  const [preguntaActual, setPreguntaActual] = useState(0);

  // Contador de cuántas respondió bien, para mostrar el resultado al final
  const [respuestasCorrectas, setRespuestasCorrectas] = useState(0);

  // true cuando ya respondió todas las preguntas
  const [terminado, setTerminado] = useState(false);

  const pregunta = preguntasEjemplo[preguntaActual];

  // Se ejecuta al tocar una opción de respuesta
  const handleResponder = (indiceElegido) => {
    const esCorrecta = indiceElegido === pregunta.correcta;

    // Actualiza el nivelDominio del concepto usando el método
    // que ya está definido en la clase Concepto (src/modelos/Concepto.js)
    concepto.marcarRespuesta(esCorrecta);

    if (esCorrecta) {
      setRespuestasCorrectas(respuestasCorrectas + 1);
    }

    // Avanza a la siguiente pregunta, o termina el quiz si ya no hay más
    const siguienteIndice = preguntaActual + 1;
    if (siguienteIndice < preguntasEjemplo.length) {
      setPreguntaActual(siguienteIndice);
    } else {
      setTerminado(true);
    }
  };

  // Pantalla de resultado final, se muestra en vez del quiz cuando terminado === true
  if (terminado) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>¡Terminaste!</Text>
        <Text style={styles.resultado}>
          Respondiste bien {respuestasCorrectas} de {preguntasEjemplo.length}
        </Text>
        <Text style={styles.dominio}>
          Nivel de dominio de "{concepto.nombre}": {concepto.nivelDominio}%
        </Text>
        <TouchableOpacity style={styles.boton} onPress={() => navigation.goBack()}>
          <Text style={styles.botonTexto}>Volver al mapa</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Pantalla normal del quiz, mientras terminado === false
  return (
    <View style={styles.container}>
      <Text style={styles.concepto}>{concepto.nombre}</Text>
      <Text style={styles.pregunta}>{pregunta.pregunta}</Text>

      {/* Recorre las opciones de la pregunta actual y crea un botón por cada una */}
      {pregunta.opciones.map((opcion, index) => (
        <TouchableOpacity
          key={index}
          style={styles.opcion}
          onPress={() => handleResponder(index)}
        >
          <Text style={styles.opcionTexto}>{opcion}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  concepto: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  pregunta: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  opcion: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  opcionTexto: {
    fontSize: 16,
    textAlign: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  resultado: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  dominio: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  boton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
  },
  botonTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});