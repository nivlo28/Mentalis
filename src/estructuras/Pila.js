import Nodo from './Nodo';

class Pila {
  constructor() {
    this.top = null;
    this.longitud = 0;
  }

  isEmpty() {
    return this.top === null;
  }

  // Push: agrega un elemento hasta arriba de la pila
  push(valor) {
    const nodoNuevo = new Nodo(valor);
    nodoNuevo.siguiente = this.top;
    this.top = nodoNuevo;
    this.longitud++;
    return nodoNuevo;
  }

  // Pop: quita y devuelve el elemento de hasta arriba
  pop() {
    if (this.isEmpty()) return null;
    const nodoEliminado = this.top;
    this.top = this.top.siguiente;
    nodoEliminado.siguiente = null;
    this.longitud--;
    return nodoEliminado.valor;
  }

  // Peek/Top: devuelve el valor de hasta arriba SIN quitarlo
  peek() {
    if (this.isEmpty()) return null;
    return this.top.valor;
  }

  obtenerLongitud() {
    return this.longitud;
  }
}

export default Pila;