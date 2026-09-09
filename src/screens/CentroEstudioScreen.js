import React, { use, useEffect, useState,useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../services/supabase';
import Pila from '../estructuras/Pila';

export default function CentroEstudioScreen() {
  const { theme } = useTheme();
  const [historial, setHistorial] = useState([]);

    const cargarHistorial = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from('historial_estudio')
      .select('*')
      .eq('user_id', user.id)
      .order('fecha', { ascending: true });

    if (error) {
      console.log('Error cargando historial:', error);
      return;
    }
    const pila = new Pila();

(data || []).forEach((item) => {
  pila.push(item);
});

const historialPila = [];

while (!pila.isEmpty()) {
  historialPila.push(pila.pop());
}

setHistorial(historialPila);

  };
  const limpiarHistorial = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('historial_estudio')
      .delete()
      .eq('user_id', user.id);
      if(error){
        console.log('Error al limpiar historial:', error);
      }
      setHistorial([]);
    };
  useFocusEffect(
    useCallback(() => {
        cargarHistorial();
    }, [])
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <Text
        style={[
          styles.titulo,
          { color: theme.text },
        ]}
      >
        Centro de estudio
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
            styles.cardTitulo,
            { color: theme.text },
          ]}
        >
          📚 Conceptos pendientes
        </Text>

        <Text
              style={[
               styles.descripcion,
               { color: theme.secondaryText },
             ]}
        >
            Aquí aparecerán los conceptos que tienes
             pendientes de estudiar.
            </Text>

      </View>

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
          🕘 Historial de estudio
        </Text>

        {historial.length === 0 ? (
  <Text
    style={[
      styles.descripcion,
      { color: theme.secondaryText },
    ]}
  >
    Todavía no has estudiado ningún concepto.
  </Text>
) : (
  <>
    {historial.map((item, index) => (
      <Text
        key={item.id}
        style={[
          styles.descripcion,
          {
            color: theme.text,
            marginBottom: 8,
          },
        ]}
      >
        {index + 1}. {item.concepto}
      </Text>
    ))}

    <TouchableOpacity
      onPress={limpiarHistorial}
    >
      <Text
        style={{
          color: theme.primary,
          fontWeight: 'bold',
          marginTop: 10,
        }}
      >
        🗑️ Limpiar historial
      </Text>
    </TouchableOpacity>
  </>
)}
          
        <Text
          style={[
            styles.descripcion,
            { color: theme.secondaryText },
          ]}
        >
          Aquí aparecerán los conceptos que has
          estudiado recientemente.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
  },

  cardTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  descripcion: {
    fontSize: 14,
    lineHeight: 20,
  },
});