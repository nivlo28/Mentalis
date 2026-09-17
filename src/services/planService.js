import { supabase } from './supabase';

// Límites de los planes
export const limitesPlan = {
  free: {
    maxMapas: 3,
    maxExamenesDia: 1,
    maxExplicacionesDia: 3,
    pdf: false,
  },

  plus: {
    maxMapas: Infinity,
    maxExamenesDia: Infinity,
    maxExplicacionesDia: Infinity,
    pdf: true,
  },
};

// Usuario actual
async function obtenerUsuario() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

// Plan del usuario
export async function obtenerPlan() {
  const user = await obtenerUsuario();

  if (!user) return 'free';

  const { data, error } = await supabase
    .from('perfiles')
    .select('plan')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.log('Error obteniendo plan:', error);
    return 'free';
  }

  return data?.plan || 'free';
}

// Cuenta mapas
async function contarMapas() {
  const user = await obtenerUsuario();

  if (!user) return null;

  const { count, error } = await supabase
    .from('mapas')
    .select('*', {
      count: 'exact',
      head: true,
    })
    .eq('user_id', user.id);

  if (error) {
    console.log('Error contando mapas:', error);
    return null;
  }

  return count || 0;
}

// Revisa límite de mapas
export async function puedeCrearMapa() {
  const plan = await obtenerPlan();

  if (plan === 'plus') {
    return { permitido: true, plan };
  }

  const cantidad = await contarMapas();
  const limite = limitesPlan.free.maxMapas;

  if (cantidad === null) {
    return {
      permitido: false,
      error: true,
    };
  }

  return {
    permitido: cantidad < limite,
    cantidad,
    limite,
    plan,
  };
}

// Inicio del día
function inicioDelDia() {
  const hoy = new Date();

  hoy.setHours(0, 0, 0, 0);

  return hoy.toISOString();
}

// Revisa límite de exámenes
export async function puedeHacerExamen() {
  const user = await obtenerUsuario();

  if (!user) {
    return {
      permitido: false,
      error: true,
    };
  }

  const plan = await obtenerPlan();

  if (plan === 'plus') {
    return { permitido: true, plan };
  }

  const { count, error } = await supabase
    .from('resultados_examen')
    .select('*', {
      count: 'exact',
      head: true,
    })
    .eq('user_id', user.id)
    .gte('created_at', inicioDelDia());

  if (error) {
    console.log('Error contando exámenes:', error);

    return {
      permitido: false,
      error: true,
    };
  }

  const cantidad = count || 0;
  const limite = limitesPlan.free.maxExamenesDia;

  return {
    permitido: cantidad < limite,
    cantidad,
    limite,
    plan,
  };
}

// Revisa límite de explicaciones
export async function puedeExplicar() {
  const user = await obtenerUsuario();

  if (!user) {
    return {
      permitido: false,
      error: true,
    };
  }

  const plan = await obtenerPlan();

  if (plan === 'plus') {
    return {
      permitido: true,
      plan,
    };
  }

  const { count, error } = await supabase
    .from('usos_explicacion')
    .select('*', {
      count: 'exact',
      head: true,
    })
    .eq('user_id', user.id)
    .gte('created_at', inicioDelDia());

  if (error) {
    console.log(
      'Error contando explicaciones:',
      error
    );

    return {
      permitido: false,
      error: true,
    };
  }

  const cantidad = count || 0;
  const limite =
    limitesPlan.free.maxExplicacionesDia;

  return {
    permitido: cantidad < limite,
    cantidad,
    limite,
    plan,
  };
}

// Registra una explicación usada
export async function registrarExplicacion() {
  const user = await obtenerUsuario();

  if (!user) return false;

  const { error } = await supabase
    .from('usos_explicacion')
    .insert({
      user_id: user.id,
    });

  if (error) {
    console.log(
      'Error registrando explicación:',
      error
    );

    return false;
  }

  return true;
}