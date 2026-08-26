// Importamos nuestra estructura ColaPrioridad
import ColaPrioridad from '../estructuras/ColaPrioridad';

/*
  Esta función recibe los conceptos del mapa
  y los introduce en una ColaPrioridad.

  Mientras menor sea el número, mayor será
  la prioridad de repaso.
*/
export function crearColaRepaso(conceptos = []) {
  const cola = new ColaPrioridad();

  conceptos.forEach((concepto) => {
    // Por defecto tiene prioridad baja
    let prioridad = 3;

    // Si necesita repaso, pasa primero
    if (concepto.estado === 'repasar') {
      prioridad = 1;
    }

    // Si está aprendiendo, queda en segundo nivel
    if (concepto.estado === 'aprendiendo') {
      prioridad = 2;
    }

    // Si ya está dominado, tiene menor prioridad
    if (concepto.estado === 'dominado') {
      prioridad = 3;
    }

    // Insertamos el concepto junto con su prioridad
    cola.encolar(concepto, prioridad);
  });

  return cola;
}

/*
  Esta función crea la cola y la recorre
  para obtener los conceptos ya ordenados
  según su prioridad.
*/
export function obtenerOrdenRepaso(conceptos = []) {
  const cola = crearColaRepaso(conceptos);

  return cola.recorrer();
}