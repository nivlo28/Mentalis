import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import {
  useTheme,
} from '../context/ThemeContext';

import {
  supabase,
} from '../services/supabase';

export default function PerfilScreen() {
  const {
    theme,
    modoOscuro,
    cambiarTema,
  } = useTheme();

  async function cerrarSesion() {
    Alert.alert(
      'Cerrar sesión',
      '¿Seguro que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },

        {
          text: 'Cerrar sesión',
          style: 'destructive',

          onPress: async () => {
            const {
              error,
            } = await supabase.auth.signOut();

            if (error) {
              Alert.alert(
                'Error',
                'No se pudo cerrar sesión.'
              );
            }
          },
        },
      ]
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
      contentContainerStyle={styles.contenido}
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={[
          styles.titulo,
          {
            color: theme.text,
          },
        ]}
      >
        Perfil
      </Text>

      <Text
        style={[
          styles.subtitulo,
          {
            color: theme.secondaryText,
          },
        ]}
      >
        Configura tu experiencia en Mentalis
      </Text>

      {/* PERFIL */}
      <View
        style={[
          styles.perfilCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: theme.primarySoft,
            },
          ]}
        >
          <Ionicons
            name="person"
            size={35}
            color={theme.primary}
          />
        </View>

        <View>
          <Text
            style={[
              styles.nombre,
              {
                color: theme.text,
              },
            ]}
          >
            Usuario Mentalis
          </Text>

          <Text
            style={[
              styles.email,
              {
                color: theme.secondaryText,
              },
            ]}
          >
            Estudiante
          </Text>
        </View>
      </View>

      {/* APARIENCIA */}
      <Text
        style={[
          styles.tituloSeccion,
          {
            color: theme.text,
          },
        ]}
      >
        Apariencia
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
        <View style={styles.opcion}>
          <View
            style={[
              styles.iconoContenedor,
              {
                backgroundColor: theme.primarySoft,
              },
            ]}
          >
            <Ionicons
              name={
                modoOscuro
                  ? 'moon'
                  : 'sunny'
              }
              size={22}
              color={theme.primary}
            />
          </View>

          <View style={styles.textoOpcion}>
            <Text
              style={[
                styles.nombreOpcion,
                {
                  color: theme.text,
                },
              ]}
            >
              {modoOscuro
                ? 'Modo oscuro'
                : 'Modo claro'}
            </Text>

            <Text
              style={[
                styles.descripcion,
                {
                  color: theme.secondaryText,
                },
              ]}
            >
              Cambia la apariencia de Mentalis
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
      </View>

      {/* ESTADÍSTICAS */}
      <Text
        style={[
          styles.tituloSeccion,
          {
            color: theme.text,
          },
        ]}
      >
        Tu actividad
      </Text>

      <View style={styles.estadisticas}>
        <View
          style={[
            styles.estadistica,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons
            name="map-outline"
            size={25}
            color={theme.primary}
          />

          <Text
            style={[
              styles.numero,
              {
                color: theme.text,
              },
            ]}
          >
            0
          </Text>

          <Text
            style={[
              styles.descripcionEstadistica,
              {
                color: theme.secondaryText,
              },
            ]}
          >
            Mapas
          </Text>
        </View>

        <View
          style={[
            styles.estadistica,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons
            name="school-outline"
            size={25}
            color={theme.primary}
          />

          <Text
            style={[
              styles.numero,
              {
                color: theme.text,
              },
            ]}
          >
            0
          </Text>

          <Text
            style={[
              styles.descripcionEstadistica,
              {
                color: theme.secondaryText,
              },
            ]}
          >
            Repasos
          </Text>
        </View>

        <View
          style={[
            styles.estadistica,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons
            name="flame-outline"
            size={25}
            color={theme.primary}
          />

          <Text
            style={[
              styles.numero,
              {
                color: theme.text,
              },
            ]}
          >
            0
          </Text>

          <Text
            style={[
              styles.descripcionEstadistica,
              {
                color: theme.secondaryText,
              },
            ]}
          >
            Racha
          </Text>
        </View>
      </View>

      {/* CUENTA */}
      <Text
        style={[
          styles.tituloSeccion,
          {
            color: theme.text,
          },
        ]}
      >
        Cuenta
      </Text>

      <TouchableOpacity
        style={[
          styles.cerrarSesion,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
        activeOpacity={0.8}
        onPress={cerrarSesion}
      >
        <Ionicons
          name="log-out-outline"
          size={22}
          color={theme.danger}
        />

        <Text
          style={[
            styles.textoCerrar,
            {
              color: theme.danger,
            },
          ]}
        >
          Cerrar sesión
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contenido: {
    paddingHorizontal: 20,
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

  perfilCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 17,

    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 28,
  },

  avatar: {
    width: 58,
    height: 58,

    borderRadius: 29,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 15,
  },

  nombre: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  email: {
    fontSize: 13,
  },

  tituloSeccion: {
    fontSize: 16,
    fontWeight: 'bold',

    marginBottom: 12,
    marginTop: 5,
  },

  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 15,

    marginBottom: 28,
  },

  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconoContenedor: {
    width: 45,
    height: 45,

    borderRadius: 11,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
  },

  textoOpcion: {
    flex: 1,
  },

  nombreOpcion: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },

  descripcion: {
    fontSize: 12,
  },

  estadisticas: {
    flexDirection: 'row',
    gap: 10,

    marginBottom: 28,
  },

  estadistica: {
    flex: 1,

    minHeight: 110,

    borderRadius: 14,
    borderWidth: 1,

    alignItems: 'center',
    justifyContent: 'center',

    padding: 10,
  },

  numero: {
    fontSize: 20,
    fontWeight: 'bold',

    marginTop: 7,
    marginBottom: 2,
  },

  descripcionEstadistica: {
    fontSize: 11,
  },

  cerrarSesion: {
    height: 54,

    borderRadius: 14,
    borderWidth: 1,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    gap: 8,
  },

  textoCerrar: {
    fontSize: 15,
    fontWeight: '600',
  },
});