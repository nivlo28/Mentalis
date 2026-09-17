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
import { usePlan } from '../context/PlanContext';

export default function PlanesScreen() {
  const { theme } = useTheme();
  const { plan, esPlus } = usePlan();

  // Comparación Free y Plus
  const beneficios = [
    ['Mapas con IA', true, true],
    ['Quiz por concepto', true, true],
    ['Racha de estudio', true, true],
    ['Prioridad de repaso', true, true],
    ['Máximo de mapas', '3', 'Ilimitados'],
    ['Modo examen', '1 diario', 'Ilimitado'],
    ['Explícamelo fácil', 'Limitado', 'Ilimitado'],
    ['Preguntar apuntes', false, true],
    ['Subir archivos PDF', false, true],
  ];

  // Muestra check, X o texto
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
      <Text
        style={[
          styles.valor,
          { color: theme.text },
        ]}
      >
        {dato}
      </Text>
    );
  };

  // Pago real se agrega después
  const mejorarPlan = () => {
    Alert.alert(
      'Mentalis Plus',
      'Próximamente podrás suscribirte a Mentalis Plus.'
    );
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
      {/* Icono */}
      <View
        style={[
          styles.icono,
          { backgroundColor: theme.primarySoft },
        ]}
      >
        <Ionicons
          name="star"
          size={34}
          color={theme.primary}
        />
      </View>

      <Text
        style={[
          styles.titulo,
          { color: theme.text },
        ]}
      >
        Mentalis Plus
      </Text>

      <Text
        style={[
          styles.subtitulo,
          { color: theme.secondaryText },
        ]}
      >
        Lleva tus mapas y repasos a otro nivel.
      </Text>

      {/* Plan actual */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: esPlus
              ? theme.primary
              : theme.border,
          },
        ]}
      >
        <View style={styles.planFila}>
          <View>
            <Text
              style={{
                color: theme.secondaryText,
                fontSize: 12,
              }}
            >
              Tu plan actual
            </Text>

            <Text
              style={[
                styles.plan,
                { color: theme.text },
              ]}
            >
              {esPlus
                ? 'Mentalis Plus'
                : 'Mentalis Free'}
            </Text>
          </View>

          <View
            style={[
              styles.etiqueta,
              {
                backgroundColor: esPlus
                  ? theme.primarySoft
                  : theme.cardSecondary,
              },
            ]}
          >
            <Ionicons
              name={esPlus ? 'star' : 'person'}
              size={14}
              color={
                esPlus
                  ? theme.primary
                  : theme.secondaryText
              }
            />

            <Text
              style={[
                styles.etiquetaTexto,
                {
                  color: esPlus
                    ? theme.primary
                    : theme.secondaryText,
                },
              ]}
            >
              {plan?.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <Text
        style={[
          styles.seccion,
          { color: theme.text },
        ]}
      >
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
        <View
          style={[
            styles.fila,
            { borderBottomColor: theme.border },
          ]}
        >
          <Text
            style={[
              styles.beneficio,
              { color: theme.secondaryText },
            ]}
          >
            Beneficio
          </Text>

          <Text
            style={[
              styles.columnaTexto,
              { color: theme.secondaryText },
            ]}
          >
            Free
          </Text>

          <Text
            style={[
              styles.columnaTexto,
              { color: theme.primary },
            ]}
          >
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
            <Text
              style={[
                styles.beneficio,
                { color: theme.text },
              ]}
            >
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

      {/* Botón */}
      {esPlus ? (
        <View
          style={[
            styles.boton,
            {
              backgroundColor: theme.primarySoft,
              borderColor: theme.primary,
            },
          ]}
        >
          <Ionicons
            name="checkmark-circle"
            size={21}
            color={theme.primary}
          />

          <Text
            style={[
              styles.textoActivo,
              { color: theme.primary },
            ]}
          >
            Ya tienes Mentalis Plus
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.boton,
            {
              backgroundColor: theme.primary,
              borderColor: theme.primary,
            },
          ]}
          onPress={mejorarPlan}
          activeOpacity={0.8}
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
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 14,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  subtitulo: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 25,
  },

  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 25,
  },

  planFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  plan: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },

  etiqueta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },

  etiquetaTexto: {
    fontSize: 11,
    fontWeight: 'bold',
  },

  seccion: {
    fontSize: 17,
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
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },

  beneficio: {
    flex: 2,
    fontSize: 12,
    paddingRight: 5,
  },

  columna: {
    flex: 1,
    alignItems: 'center',
  },

  columnaTexto: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },

  valor: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },

  boton: {
    height: 55,
    borderRadius: 14,
    borderWidth: 1,
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