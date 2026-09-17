import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { supabase } from '../services/supabase';

const PlanContext = createContext();

export function PlanProvider({ children }) {
  const [plan, setPlan] = useState('free');
  const [cargandoPlan, setCargandoPlan] = useState(true);

  const cargarPlan = async () => {
    setCargandoPlan(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setPlan('free');
      setCargandoPlan(false);
      return;
    }

    const { data, error } = await supabase
      .from('perfiles')
      .select('plan')
      .eq('user_id', user.id)
      .single();

    if (!error && data) {
      setPlan(data.plan);
    }

    setCargandoPlan(false);
  };

  useEffect(() => {
    cargarPlan();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      cargarPlan();
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <PlanContext.Provider
      value={{
        plan,
        esPlus: plan === 'plus',
        cargandoPlan,
        cargarPlan,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  return useContext(PlanContext);
}