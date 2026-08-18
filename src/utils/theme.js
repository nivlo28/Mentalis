// Paleta de colores basada en el diseño (tema oscuro, morado)
export const colores = {
  fondo: '#13111C',           // fondo general, casi negro con tinte morado
  fondoTarjeta: '#1E1B2E',    // fondo de las tarjetas/cards
  fondoInput: '#252137',      // fondo de los inputs de texto

  primario: '#8B5CF6',        // morado principal (botones, acentos)
  primarioClaro: '#A78BFA',   // morado más claro (para gradientes)

  texto: '#FFFFFF',
  textoSecundario: '#9CA3AF', // gris para subtítulos, fechas, descripciones
  textoTerciario: '#6B7280',  // gris más apagado

  exito: '#22C55E',           // verde (respuestas correctas, dominio alto)
  advertencia: '#F59E0B',     // naranja (dominio medio)
  error: '#EF4444',           // rojo (dominio bajo, errores)
  info: '#3B82F6',            // azul (elementos informativos)

  borde: '#2D2A3E',           // bordes sutiles de tarjetas
};

export const espaciado = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const tipografia = {
  titulo: { fontSize: 28, fontWeight: 'bold', color: colores.texto },
  subtitulo: { fontSize: 16, color: colores.textoSecundario },
  cuerpo: { fontSize: 14, color: colores.texto },
  pequeno: { fontSize: 12, color: colores.textoSecundario },
};

export const bordeRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  completo: 999, // para botones/tags totalmente redondeados
};