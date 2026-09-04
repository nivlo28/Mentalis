import ColaPrioridad from '../estructuras/ColaPrioridad';

// Ordena los conceptos según su estado
export function obtenerOrdenRepaso(conceptos = []) {
  const cola = new ColaPrioridad();

  conceptos.forEach((concepto) => {
    let prioridad = 3;

    if (concepto.estado === 'repasar') prioridad = 1;
    else if (concepto.estado === 'aprendiendo') prioridad = 2;

    cola.encolar(concepto, prioridad);
  });

  return cola.recorrer();
}