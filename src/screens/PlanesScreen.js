import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';

export default function PlanesScreen({ route }) {
  const { theme } = useTheme();

  const plan = route.params?.planActual || 'free';

  const beneficios = [
    ['Mapas con IA', true, true],
    ['Quiz por concepto', true, true],
    ['Prioridad de repaso', true, true],
    ['Máximo de mapas', '3', 'Ilimitados'],
    ['Subir archivos PDF', false, true],
  ];

  // Muestra cada beneficio
  const valor = (dato) => {
    if (typeof dato === 'boolean') {
      return (
        <Ionicons
          name={
            dato
              ? 'checkmark-circle'
              : 'close-circle-outline'
          }
          size={22}
          color={
            dato
              ? theme.primary
              : theme.secondaryText
          }
        />
      );
    }

    return (
      <Text style={[styles.valor, { color: theme.text }]}>
        {dato}
      </Text>
    );
  };

  // Pago se agrega después
  const mejorarPlan = () => {
    Alert.alert(
      'Mentalis Plus',
      'Próximamente podrás suscribirte con PayPal.'
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contenido}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.icono,
          { backgroundColor: theme.primarySoft },
        ]}
      >
        <Ionicons
          name="star"
          size={35}
          color={theme.primary}
        />
      </View>

      <Text style={[styles.titulo, { color: theme.text }]}>
        Mentalis Plus
      </Text>

      <Text style={[styles.subtitulo, { color: theme.secondaryText }]}>
        Lleva tus mapas y repasos a otro nivel.
      </Text>

      {/* Plan actual */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Text style={{ color: theme.secondaryText }}>
          Tu plan actual
        </Text>

        <Text style={[styles.plan, { color: theme.text }]}>
          {plan === 'plus'
            ? 'Mentalis Plus'
            : 'Mentalis Free'}
        </Text>
      </View>

      <Text style={[styles.seccion, { color: theme.text }]}>
        Compara los planes
      </Text>

      {/* Tabla */}
      <View
        style={[
          styles.tabla,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={[styles.fila, { borderBottomColor: theme.border }]}>
          <Text style={[styles.beneficio, { color: theme.secondaryText }]}>
            Beneficio
          </Text>

          <Text style={[styles.columna, { color: theme.secondaryText }]}>
            Free
          </Text>

          <Text style={[styles.columna, { color: theme.primary }]}>
            Plus
          </Text>
        </View>

        {beneficios.map((item, index) => (
          <View
            key={index}
            style={[
              styles.fila,
              index < beneficios.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.beneficio, { color: theme.text }]}>
              {item[0]}
            </Text>

            <View style={styles.columna}>
              {valor(item[1])}
            </View>

            <View style={styles.columna}>
              {valor(item[2])}
            </View>
          </View>
        ))}
      </View>

      {/* Botón Plus */}
      {plan === 'plus' ? (
        <View
          style={[
            styles.boton,
            { backgroundColor: theme.primarySoft },
          ]}
        >
          <Ionicons
            name="checkmark-circle"
            size={22}
            color={theme.primary}
          />

          <Text style={[styles.textoActivo, { color: theme.text }]}>
            Ya tienes Mentalis Plus
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.boton,
            { backgroundColor: theme.primary },
          ]}
          onPress={mejorarPlan}
        >
          <Ionicons
            name="star"
            size={20}
            color="#FFFFFF"
          />

          <Text style={styles.textoBoton}>
            Mejorar a Mentalis Plus
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contenido: {
    padding: 20,
    paddingTop: 35,
    paddingBottom: 40,
  },

  icono: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 15,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  subtitulo: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 25,
  },

  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 15,
    marginBottom: 25,
  },

  plan: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 4,
  },

  seccion: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  tabla: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 25,
  },

  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
  },

  beneficio: {
    flex: 2,
    fontSize: 13,
  },

  columna: {
    flex: 1,
    textAlign: 'center',
    alignItems: 'center',
    fontSize: 12,
  },

  valor: {
    fontSize: 12,
    fontWeight: '600',
  },

  boton: {
    height: 55,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  textoBoton: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  textoActivo: {
    fontSize: 15,
    fontWeight: '600',
  },
});