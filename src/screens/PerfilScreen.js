import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { useTheme } from '../context/ThemeContext';
import { usePlan } from '../context/PlanContext';
import { supabase } from '../services/supabase';

export default function PerfilScreen({ navigation }) {
  const { theme, modoOscuro, cambiarTema } = useTheme();
  const { plan, esPlus } = usePlan();

  const [nombre, setNombre] = useState('Usuario Mentalis');
  const [email, setEmail] = useState('');
  const [foto, setFoto] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    cargarPerfil();
  }, []);

  // Carga nombre, correo y foto
  const cargarPerfil = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setEmail(user.email || '');

    const { data } = await supabase
      .from('perfiles')
      .select('nombre, foto_url')
      .eq('user_id', user.id)
      .single();

    setNombre(data?.nombre || 'Usuario Mentalis');
    setFoto(data?.foto_url || null);
  };

  // Selecciona foto
  const seleccionarFoto = async () => {
    const permiso =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert(
        'Permiso necesario',
        'Debes permitir acceso a tus fotos.'
      );
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      subirFoto(resultado.assets[0].uri);
    }
  };

  // Sube foto a Supabase
  const subirFoto = async (uri) => {
    try {
      setSubiendo(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const respuesta = await fetch(uri);
      const archivo = await respuesta.arrayBuffer();
      const ruta = `${user.id}/perfil.jpg`;

      const { error } = await supabase.storage
        .from('avatars')
        .upload(ruta, archivo, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(ruta);

      const fotoUrl = `${data.publicUrl}?t=${Date.now()}`;

      await supabase
        .from('perfiles')
        .update({ foto_url: fotoUrl })
        .eq('user_id', user.id);

      setFoto(fotoUrl);
      Alert.alert('Listo', 'Foto actualizada.');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudo actualizar la foto.');
    } finally {
      setSubiendo(false);
    }
  };

  // Cerrar sesión
  const cerrarSesion = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Seguro que quieres cerrar sesión?',
      [
        { text: 'Cancelar' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: () => supabase.auth.signOut(),
        },
      ]
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
      <Text style={[styles.titulo, { color: theme.text }]}>
        Perfil
      </Text>

      <Text
        style={[
          styles.subtitulo,
          { color: theme.secondaryText },
        ]}
      >
        Configura tu experiencia en Mentalis
      </Text>

      {/* Perfil */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.avatarContenedor}
          onPress={seleccionarFoto}
          disabled={subiendo}
        >
          {foto ? (
            <Image source={{ uri: foto }} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: theme.primarySoft,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
            >
              <Ionicons
                name="person"
                size={35}
                color={theme.primary}
              />
            </View>
          )}

          <View
            style={[
              styles.camara,
              { backgroundColor: theme.primary },
            ]}
          >
            <Ionicons name="camera" size={14} color="white" />
          </View>
        </TouchableOpacity>

        <View style={styles.datos}>
          <View style={styles.nombreFila}>
            <Text
              style={[styles.nombrePerfil, { color: theme.text }]}
              numberOfLines={1}
            >
              {nombre}
            </Text>

            <View
              style={[
                styles.badge,
                {
                  backgroundColor: esPlus
                    ? theme.primarySoft
                    : theme.cardSecondary,
                },
              ]}
            >
              {esPlus && (
                <Ionicons
                  name="star"
                  size={10}
                  color={theme.primary}
                />
              )}

              <Text
                style={{
                  color: esPlus
                    ? theme.primary
                    : theme.secondaryText,
                  fontSize: 10,
                  fontWeight: 'bold',
                }}
              >
                {plan.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.descripcion,
              { color: theme.secondaryText },
            ]}
            numberOfLines={1}
          >
            {email}
          </Text>

          <TouchableOpacity onPress={seleccionarFoto}>
            <Text
              style={[
                styles.cambiarFoto,
                { color: theme.primary },
              ]}
            >
              {subiendo
                ? 'Subiendo...'
                : foto
                ? 'Cambiar foto'
                : 'Agregar foto'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Plan */}
      <Text style={[styles.seccion, { color: theme.text }]}>
        Tu plan
      </Text>

      <TouchableOpacity
        style={[
          styles.opcion,
          {
            backgroundColor: theme.card,
            borderColor: esPlus
              ? theme.primary
              : theme.border,
          },
        ]}
        onPress={() => navigation.navigate('Planes')}
      >
        <Ionicons
          name={esPlus ? 'star' : 'rocket-outline'}
          size={24}
          color={theme.primary}
        />

        <View style={styles.texto}>
          <Text style={[styles.nombre, { color: theme.text }]}>
            {esPlus ? 'Mentalis Plus' : 'Mentalis Free'}
          </Text>

          <Text
            style={[
              styles.descripcion,
              { color: theme.secondaryText },
            ]}
          >
            {esPlus
              ? 'Todas las funciones desbloqueadas'
              : 'Conoce las ventajas de Plus'}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.primary}
        />
      </TouchableOpacity>

      {/* Apariencia */}
      <Text style={[styles.seccion, { color: theme.text }]}>
        Apariencia
      </Text>

      <View
        style={[
          styles.opcion,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Ionicons
          name={modoOscuro ? 'moon' : 'sunny'}
          size={24}
          color={theme.primary}
        />

        <View style={styles.texto}>
          <Text style={[styles.nombre, { color: theme.text }]}>
            {modoOscuro ? 'Modo oscuro' : 'Modo claro'}
          </Text>

          <Text
            style={[
              styles.descripcion,
              { color: theme.secondaryText },
            ]}
          >
            Cambia la apariencia
          </Text>
        </View>

        <Switch
          value={modoOscuro}
          onValueChange={cambiarTema}
          trackColor={{
            false: '#D1D5DB',
            true: theme.primary,
          }}
          thumbColor="#FFFFFF"
        />
      </View>

      {/* Cerrar sesión */}
      <TouchableOpacity
        style={[
          styles.cerrar,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
        onPress={cerrarSesion}
      >
        <Ionicons
          name="log-out-outline"
          size={21}
          color={theme.danger}
        />

        <Text style={{ color: theme.danger, fontWeight: '600' }}>
          Cerrar sesión
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  contenido: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitulo: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 25,
  },

  seccion: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 25,
  },

  avatarContenedor: {
    position: 'relative',
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },

  camara: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },

  datos: {
    flex: 1,
    marginLeft: 15,
  },

  nombreFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  nombrePerfil: {
    maxWidth: '65%',
    fontSize: 17,
    fontWeight: 'bold',
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 12,
  },

  descripcion: {
    fontSize: 12,
    marginTop: 3,
  },

  cambiarFoto: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 7,
  },

  opcion: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
  },

  texto: {
    flex: 1,
    marginLeft: 12,
  },

  nombre: {
    fontSize: 15,
    fontWeight: '600',
  },

  cerrar: {
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});