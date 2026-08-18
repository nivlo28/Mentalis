import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colores, bordeRadius, espaciado } from '../utils/theme';

export default function Tarjeta({ children, style }) {
  return <View style={[styles.tarjeta, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.fondoTarjeta,
    borderRadius: bordeRadius.md,
    borderWidth: 1,
    borderColor: colores.borde,
    padding: espaciado.md,
  },
});