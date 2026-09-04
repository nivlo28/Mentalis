import { supabase } from './supabase';

// Límites de cada plan
export const limitesPlan = {
  free: {
    maxMapas: 3,
    pdf: false,
  },
  plus: {
    maxMapas: Infinity,
    pdf: true,
  },
};

// Obtiene el usuario actual
async function obtenerUsuario() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

// Obtiene el plan del usuario
export async function obtenerPlan() {
  const user = await obtenerUsuario();

  if (!user) return 'free';

  const { data } = await supabase
    .from('perfiles')
    .select('plan')
    .eq('user_id', user.id)
    .single();

  return data?.plan || 'free';
}

// Cuenta los mapas del usuario
async function contarMapas() {
  const user = await obtenerUsuario();

  if (!user) return null;

  const { data, error } = await supabase
    .from('mapas')
    .select('id')
    .eq('user_id', user.id);

  if (error) {
    console.log('Error contando mapas:', error);
    return null;
  }

  return data.length;
}

// Revisa si puede crear otro mapa
export async function puedeCrearMapa() {
  const plan = await obtenerPlan();

  // Plus no tiene límite
  if (plan === 'plus') {
    return { permitido: true };
  }

  const cantidad = await contarMapas();
  const limite = limitesPlan.free.maxMapas;

  // Evita crear si hubo un error
  if (cantidad === null) {
    return { permitido: false, error: true };
  }

  return {
    permitido: cantidad < limite,
    cantidad,
    limite,
  };
}