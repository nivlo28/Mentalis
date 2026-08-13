import Nodo from './Nodo';

class Cola {
  constructor() {
    this.primero = null;
    this.ultimo = null;
    this.longitud = 0;
  }

  esVacia() {
    return this.primero === null;
  }

  // Encolar: ingresa un elemento al final
  encolar(valor) {
    const nodoNuevo = new Nodo(valor);
    if (this.esVacia()) {
      this.primero = nodoNuevo;
      this.ultimo = nodoNuevo;
    } else {
      this.ultimo.siguiente = nodoNuevo;
      this.ultimo = nodoNuevo;
    }
    this.longitud++;
    return nodoNuevo;
  }

  // Desencolar: extrae el elemento del inicio y lo devuelve
  desencolar() {
    if (this.esVacia()) {
      console.log('error: la cola está vacía');
      return null;
    }
    const nodoEliminado = this.primero;
    this.primero = this.primero.siguiente;
    if (this.primero === null) this.ultimo = null;
    nodoEliminado.siguiente = null;
    this.longitud--;
    return nodoEliminado.valor;
  }

  // First: regresa el primer elemento SIN eliminarlo
  first() {
    if (this.esVacia()) return null;
    return this.primero.valor;
  }

  // Clear: borra todos los elementos
  clear() {
    this.primero = null;
    this.ultimo = null;
    this.longitud = 0;
  }

  obtenerLongitud() {
    return this.longitud;
  }
}

export default Cola;