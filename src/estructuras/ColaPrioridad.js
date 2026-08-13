class NodoPrioridad {
  constructor(valor, prioridad) {
    this.valor = valor;
    this.prioridad = prioridad; // menor número = mayor prioridad (repasar primero)
    this.siguiente = null;
  }
}

class ColaPrioridad {
  constructor() {
    this.primero = null;
    this.longitud = 0;
  }

  esVacia() {
    return this.primero === null;
  }

  // Inserta manteniendo el orden: menor prioridad numérica va primero
  // (ej: nivelDominio bajo = necesita más repaso = prioridad 1)
  encolar(valor, prioridad) {
    const nodoNuevo = new NodoPrioridad(valor, prioridad);

    if (this.esVacia() || prioridad < this.primero.prioridad) {
      nodoNuevo.siguiente = this.primero;
      this.primero = nodoNuevo;
    } else {
      let tmp = this.primero;
      while (tmp.siguiente !== null && tmp.siguiente.prioridad <= prioridad) {
        tmp = tmp.siguiente;
      }
      nodoNuevo.siguiente = tmp.siguiente;
      tmp.siguiente = nodoNuevo;
    }
    this.longitud++;
    return nodoNuevo;
  }

  // Saca y devuelve el elemento con mayor prioridad (el primero de la lista)
  desencolar() {
    if (this.esVacia()) return null;
    const nodoEliminado = this.primero;
    this.primero = this.primero.siguiente;
    nodoEliminado.siguiente = null;
    this.longitud--;
    return nodoEliminado.valor;
  }

  // Ve el siguiente a repasar sin sacarlo
  first() {
    if (this.esVacia()) return null;
    return this.primero.valor;
  }

  // Devuelve todos los elementos en orden de prioridad (sin sacarlos)
  recorrer() {
    const resultado = [];
    let tmp = this.primero;
    while (tmp !== null) {
      resultado.push({ valor: tmp.valor, prioridad: tmp.prioridad });
      tmp = tmp.siguiente;
    }
    return resultado;
  }

  obtenerLongitud() {
    return this.longitud;
  }
}

export default ColaPrioridad;