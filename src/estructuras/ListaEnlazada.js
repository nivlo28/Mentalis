import Nodo from './Nodo';

class ListaEnlazada {
  constructor() {
    this.head = null;
    this.tail = null;
    this.longitud = 0;
  }

  estaVacia() {
    return this.head === null;
  }

  // Inserción al inicio
  insertarInicio(valor) {
    const nodoNuevo = new Nodo(valor);
    if (this.estaVacia()) {
      this.head = nodoNuevo;
      this.tail = nodoNuevo;
    } else {
      nodoNuevo.siguiente = this.head;
      this.head = nodoNuevo;
    }
    this.longitud++;
    return nodoNuevo;
  }

  // Inserción al final
  insertarFinal(valor) {
    const nodoNuevo = new Nodo(valor);
    if (this.estaVacia()) {
      this.head = nodoNuevo;
      this.tail = nodoNuevo;
    } else {
      this.tail.siguiente = nodoNuevo;
      this.tail = nodoNuevo;
    }
    this.longitud++;
    return nodoNuevo;
  }

  // Eliminación al inicio
  eliminarInicio() {
    if (this.estaVacia()) return null;
    const nodoEliminado = this.head;
    this.head = this.head.siguiente;
    if (this.head === null) this.tail = null;
    nodoEliminado.siguiente = null;
    this.longitud--;
    return nodoEliminado.valor;
  }

  // Eliminación al final
  eliminarFinal() {
    if (this.estaVacia()) return null;
    if (this.head === this.tail) {
      const valor = this.head.valor;
      this.head = null;
      this.tail = null;
      this.longitud--;
      return valor;
    }
    let tmp = this.head;
    while (tmp.siguiente !== this.tail) {
      tmp = tmp.siguiente;
    }
    const valor = this.tail.valor;
    tmp.siguiente = null;
    this.tail = tmp;
    this.longitud--;
    return valor;
  }

  // Búsqueda: recorre comparando cada nodo
  buscar(valor) {
    let tmp = this.head;
    while (tmp !== null) {
      if (tmp.valor === valor) return tmp;
      tmp = tmp.siguiente;
    }
    return null;
  }

  // Recorrido: visita cada nodo
  recorrer() {
    const resultado = [];
    let tmp = this.head;
    while (tmp !== null) {
      resultado.push(tmp.valor);
      tmp = tmp.siguiente;
    }
    return resultado;
  }

  obtenerLongitud() {
    return this.longitud;
  }
}

export default ListaEnlazada;