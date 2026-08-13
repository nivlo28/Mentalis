import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

// Datos de ejemplo (hardcodeados), mientras se conecta Supabase
// que va a traer los mapas reales guardados por el usuario
const mapasEjemplo = [
  { id: '1', tema: 'Derivadas', fecha: '10 de agosto' },
  { id: '2', tema: 'Listas Enlazadas', fecha: '8 de agosto' },
  { id: '3', tema: 'Fotosíntesis', fecha: '5 de agosto' },
];

export default function MenuScreen({ navigation }) {

  // Se ejecuta cuando el usuario toca un mapa de la lista
  // Navega a la pantalla VerMapa, pasándole el tema de ese mapa
  const handleAbrirMapa = (mapa) => {
    navigation.navigate('VerMapa', { tema: mapa.tema });
  };

  // Se ejecuta cuando el usuario toca el botón "+ Crear nuevo mapa"
  // Navega a la pantalla Inicio, donde escribe el tema nuevo
  const handleCrearNuevo = () => {
    navigation.navigate('Inicio');
  };

  return (
    <View style={styles.container}>

      {/* Título fijo arriba de la pantalla */}
      <Text style={styles.titulo}>Mis Mapas</Text>

      {/* FlatList: componente de React Native para mostrar listas largas.
          Es más eficiente que un .map() normal porque solo renderiza
          lo que se ve en pantalla, no toda la lista de una vez */}
      <FlatList
        data={mapasEjemplo} // el array que se va a recorrer
        keyExtractor={(item) => item.id} // identificador único por elemento (obligatorio en FlatList)

        // renderItem: cómo se dibuja CADA elemento de la lista
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleAbrirMapa(item)}>
            <Text style={styles.itemTema}>{item.tema}</Text>
            <Text style={styles.itemFecha}>{item.fecha}</Text>
          </TouchableOpacity>
        )}

        // Qué mostrar si el array está vacío (todavía no hay mapas creados)
        ListEmptyComponent={
          <Text style={styles.vacio}>Todavía no tenés mapas creados</Text>
        }
      />

      {/* Botón fijo abajo para crear un mapa nuevo */}
      <TouchableOpacity style={styles.botonNuevo} onPress={handleCrearNuevo}>
        <Text style={styles.botonTexto}>+ Crear nuevo mapa</Text>
      </TouchableOpacity>

    </View>
  );
}

// Estilos separados al final (así se acostumbra en React Native,
// para no mezclar diseño con la lógica de arriba)
const styles = StyleSheet.create({
  container: {
    flex: 1,        // ocupa toda la pantalla disponible
    padding: 20,
    paddingTop: 60, // más espacio arriba, para no pegarse a la barra de estado
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10, // separación entre cada tarjeta de la lista
  },
  itemTema: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemFecha: {
    fontSize: 13,
    color: '#666', // gris, para que se note menos que el título
    marginTop: 4,
  },
  vacio: {
    textAlign: 'center',
    color: '#666',
    marginTop: 30,
  },
  botonNuevo: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  botonTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});