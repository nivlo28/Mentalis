import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colores, bordeRadius, espaciado } from '../utils/theme';

// Elige color según qué tan bien dominado está el concepto
function colorSegunDominio(porcentaje) {
  if (porcentaje >= 70) return colores.exito;
  if (porcentaje >= 40) return colores.advertencia;
  return colores.error;
}

export default function BarraProgreso({ etiqueta, porcentaje }) {
  const color = colorSegunDominio(porcentaje);

  return (
    <View style={styles.contenedor}>
      <View style={styles.fila}>
        <Text style={styles.etiqueta}>{etiqueta}</Text>
        <Text style={[styles.porcentaje, { color }]}>{porcentaje}%</Text>
      </View>
      <View style={styles.pistaFondo}>
        <View style={[styles.pistaRelleno, { width: `${porcentaje}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { marginBottom: espaciado.sm },
  fila: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  etiqueta: { color: colores.texto, fontSize: 14 },
  porcentaje: { fontSize: 14, fontWeight: 'bold' },
  pistaFondo: {
    height: 8,
    backgroundColor: colores.fondoInput,
    borderRadius: bordeRadius.completo,
    overflow: 'hidden',
  },
  pistaRelleno: {
    height: '100%',
    borderRadius: bordeRadius.completo,
  },
});