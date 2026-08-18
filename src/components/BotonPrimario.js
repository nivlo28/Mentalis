import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colores, bordeRadius, espaciado } from '../utils/theme';

export default function BotonPrimario({ texto, onPress, icono }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={[colores.primario, colores.primarioClaro]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.boton}
      >
        {icono}
        <Text style={styles.texto}>{texto}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: espaciado.md,
    borderRadius: bordeRadius.completo,
    gap: espaciado.sm,
  },
  texto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});