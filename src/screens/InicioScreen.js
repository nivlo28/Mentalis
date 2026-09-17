import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { supabase } from '../services/supabase';
import { puedeCrearMapa } from '../services/planService';
import { useTheme } from '../context/ThemeContext';

import HeaderMentalis from '../components/HeaderMentalis';
import MapaCard from '../components/MapaCard';
import ProgressCard from '../components/ProgressCard';

export default function InicioScreen({ navigation }) {
  const { theme } = useTheme();

  const [tema, setTema] = useState('');
  const [contenidoFuente, setContenidoFuente] = useState('');
  const [cargando, setCargando] = useState(false);

  const [mapas, setMapas] = useState([]);
  const [progreso, setProgreso] = useState(0);
  const [racha, setRacha] = useState(0);
  const [retoCompletado, setRetoCompletado] = useState(false);

  // Fecha actual
  const fechaHoy = () => {
    const hoy = new Date();

    return `${hoy.getFullYear()}-${String(
      hoy.getMonth() + 1
    ).padStart(2, '0')}-${String(
      hoy.getDate()
    ).padStart(2, '0')}`;
  };

  // Carga datos del inicio
  const cargarDatos = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const hoy = fechaHoy();

    // Perfil
    const { data: perfil } = await supabase
      .from('perfiles')
      .select('racha, ultimo_estudio, ultimo_reto')
      .eq('user_id', user.id)
      .single();

    let rachaActual = perfil?.racha || 0;

    // Revisa si perdió la racha
    if (perfil?.ultimo_estudio) {
      const fechaActual = new Date(`${hoy}T00:00:00`);
      const ultimoEstudio = new Date(
        `${perfil.ultimo_estudio}T00:00:00`
      );

      const diferencia = Math.round(
        (fechaActual - ultimoEstudio) / 86400000
      );

      if (diferencia > 1) {
        rachaActual = 0;
      }
    }

    setRacha(rachaActual);
    setRetoCompletado(perfil?.ultimo_reto === hoy);

    // Mapas
    const { data: mapasData } = await supabase
      .from('mapas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    const todosMapas = mapasData || [];

    setMapas(todosMapas.slice(0, 3));

    // Resultados
    const { data: resultados } = await supabase
      .from('resultados_quiz')
      .select('mapa_id, concepto')
      .eq('user_id', user.id);

    const totalConceptos = todosMapas.reduce(
      (total, item) =>
        total +
        (item.contenido?.conceptos?.length || 0),
      0
    );

    const evaluados = new Set(
      (resultados || []).map(
        (item) => `${item.mapa_id}-${item.concepto}`
      )
    );

    setProgreso(
      totalConceptos
        ? Math.round(
            (evaluados.size / totalConceptos) * 100
          )
        : 0
    );
  };

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  // Abre mapa
  const abrirMapa = (item) => {
    navigation.navigate('VerMapa', {
      mapaId: item.id,
      tema: item.tema,
      mapa: item.contenido,
      contenidoFuente: item.contenido_fuente,
    });
  };

  // Crea mapa
  const crearMapa = async () => {
    if (!tema.trim() || !contenidoFuente.trim()) {
      Alert.alert(
        'Faltan datos',
        'Escribe el tema y tus apuntes.'
      );
      return;
    }

    setCargando(true);

    try {
      // Revisa Free / Plus
      const permiso = await puedeCrearMapa();

      if (permiso.error) {
        Alert.alert(
          'Error',
          'No se pudo verificar tu plan.'
        );
        return;
      }

      if (!permiso.permitido) {
        Alert.alert(
          'Límite alcanzado',
          `Tu plan Free permite máximo ${permiso.limite} mapas.`
        );
        return;
      }

      // Genera con IA
      const { data, error } =
        await supabase.functions.invoke(
          'generar-mapa',
          {
            body: {
              tema: tema.trim(),
              contenido_fuente:
                contenidoFuente.trim(),
            },
          }
        );

      if (error) {
        Alert.alert(
          'Error',
          'No se pudo generar el mapa.'
        );
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Guarda mapa
      const {
        data: mapaGuardado,
        error: errorGuardar,
      } = await supabase
        .from('mapas')
        .insert({
          tema: tema.trim(),
          contenido: data,
          contenido_fuente:
            contenidoFuente.trim(),
          user_id: user.id,
        })
        .select()
        .single();

      if (errorGuardar) {
        Alert.alert(
          'Error',
          'No se pudo guardar el mapa.'
        );
        return;
      }

      setTema('');
      setContenidoFuente('');

      abrirMapa(mapaGuardado);
    } catch (error) {
      console.log(error);

      Alert.alert(
        'Error',
        'Ocurrió un problema.'
      );
    } finally {
      setCargando(false);
    }
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
      {/* Saludo */}
      <HeaderMentalis />

      {/* Racha + reto */}
      <View
        style={[
          styles.estudio,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.racha}>
          <Ionicons
            name="flame"
            size={24}
            color="#FF8A00"
          />

          <View>
            <Text
              style={[
                styles.numero,
                { color: theme.text },
              ]}
            >
              {racha} {racha === 1 ? 'día' : 'días'}
            </Text>

            <Text
              style={[
                styles.pequeno,
                { color: theme.secondaryText },
              ]}
            >
              de racha
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.divisor,
            { backgroundColor: theme.border },
          ]}
        />

        <TouchableOpacity
          style={styles.reto}
          onPress={() =>
            navigation.navigate('RetoDiario')
          }
        >
          <Ionicons
            name={
              retoCompletado
                ? 'checkmark-circle'
                : 'flash'
            }
            size={22}
            color={
              retoCompletado
                ? '#22C55E'
                : theme.primary
            }
          />

          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.retoTitulo,
                { color: theme.text },
              ]}
            >
              Reto diario
            </Text>

            <Text
              style={[
                styles.pequeno,
                { color: theme.secondaryText },
              ]}
            >
              {retoCompletado
                ? 'Completado hoy'
                : '5 preguntas rápidas'}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.secondaryText}
          />
        </TouchableOpacity>
      </View>

      {/* Generador */}
      <View style={styles.seccionHeader}>
        <View>
          <Text
            style={[
              styles.titulo,
              { color: theme.text },
            ]}
          >
            Crear mapa
          </Text>

          <Text
            style={[
              styles.descripcion,
              { color: theme.secondaryText },
            ]}
          >
            Convierte tus apuntes en un mapa de estudio
          </Text>
        </View>

        <Ionicons
          name="sparkles"
          size={20}
          color={theme.primary}
        />
      </View>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.input,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
        placeholder="Tema, ej: Listas enlazadas"
        placeholderTextColor={theme.secondaryText}
        value={tema}
        onChangeText={setTema}
      />

      <TextInput
        style={[
          styles.input,
          styles.apuntes,
          {
            backgroundColor: theme.input,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
        placeholder="Escribe o pega tus apuntes..."
        placeholderTextColor={theme.secondaryText}
        value={contenidoFuente}
        onChangeText={setContenidoFuente}
        multiline
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={[
          styles.boton,
          { backgroundColor: theme.primary },
          cargando && { opacity: 0.6 },
        ]}
        onPress={crearMapa}
        disabled={cargando}
      >
        {cargando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Ionicons
              name="sparkles"
              size={18}
              color="#FFFFFF"
            />

            <Text style={styles.botonTexto}>
              Generar mapa
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Mapas recientes */}
      <View style={styles.mapasHeader}>
        <Text
          style={[
            styles.titulo,
            { color: theme.text },
          ]}
        >
          Mapas recientes
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Mapas')
          }
        >
          <Text
            style={{
              color: theme.primary,
              fontWeight: '600',
            }}
          >
            Ver todos
          </Text>
        </TouchableOpacity>
      </View>

      {mapas.length > 0 ? (
        mapas.map((item) => (
          <MapaCard
            key={item.id}
            titulo={item.tema}
            conceptos={`${
              item.contenido?.conceptos?.length || 0
            } conceptos`}
            onPress={() => abrirMapa(item)}
          />
        ))
      ) : (
        <View
          style={[
            styles.vacio,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons
            name="map-outline"
            size={25}
            color={theme.secondaryText}
          />

          <Text
            style={[
              styles.vacioTitulo,
              { color: theme.text },
            ]}
          >
            Aún no tienes mapas
          </Text>

          <Text
            style={[
              styles.pequeno,
              { color: theme.secondaryText },
            ]}
          >
            Crea uno usando tus apuntes.
          </Text>
        </View>
      )}

      {/* Centro de estudio */}
      <TouchableOpacity
        style={[
          styles.centro,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
        onPress={() =>
          navigation.navigate('CentroEstudio')
        }
      >
        <View
          style={[
            styles.centroIcono,
            { backgroundColor: theme.primarySoft },
          ]}
        >
          <Ionicons
            name="school-outline"
            size={24}
            color={theme.primary}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.centroTitulo,
              { color: theme.text },
            ]}
          >
            Centro de estudio
          </Text>

          <Text
            style={[
              styles.pequeno,
              { color: theme.secondaryText },
            ]}
          >
            Repasa conceptos y revisa tu historial
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.secondaryText}
        />
      </TouchableOpacity>

      {/* Progreso */}
      <View style={styles.progresoHeader}>
        <Text
          style={[
            styles.titulo,
            { color: theme.text },
          ]}
        >
          Tu progreso
        </Text>

        <Text
          style={[
            styles.porcentaje,
            { color: theme.primary },
          ]}
        >
          {progreso}%
        </Text>
      </View>

      <ProgressCard porcentaje={progreso} />
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

  estudio: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    padding: 14,
    marginBottom: 28,
  },

  racha: {
    width: 110,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  numero: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  pequeno: {
    fontSize: 11,
    marginTop: 2,
  },

  divisor: {
    width: 1,
    height: 40,
    marginHorizontal: 12,
  },

  reto: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  retoTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  seccionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 13,
  },

  titulo: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  descripcion: {
    fontSize: 12,
    marginTop: 3,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 15,
    fontSize: 14,
    marginBottom: 11,
  },

  apuntes: {
    height: 120,
    paddingTop: 13,
  },

  boton: {
    height: 51,
    borderRadius: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
  },

  botonTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  mapasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 12,
  },

  vacio: {
    borderWidth: 1,
    borderRadius: 13,
    padding: 20,
    alignItems: 'center',
  },

  vacioTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 7,
  },

  centro: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginTop: 22,
    gap: 11,
  },

  centroIcono: {
    width: 43,
    height: 43,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  centroTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  progresoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 11,
  },

  porcentaje: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});