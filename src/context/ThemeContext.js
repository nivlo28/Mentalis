import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

const temas = {
  oscuro: {
    background: '#07111F',
    card: '#111D2D',
    cardSecondary: '#162235',
    text: '#FFFFFF',
    secondaryText: '#98A2B3',
    border: '#1B2A3D',
    primary: '#9333EA',
    input: '#111D2D',
    tabBar: '#0F172A',
    primarySoft: '#2A1741',
    danger: '#EF4444',
  },

  claro: {
    background: '#F5F7FB',
    card: '#FFFFFF',
    cardSecondary: '#F0F2F5',
    text: '#111827',
    secondaryText: '#667085',
    border: '#E4E7EC',
    primary: '#9333EA',
    input: '#FFFFFF',
    tabBar: '#FFFFFF',
    primarySoft: '#F3E8FF',
    danger: '#EF4444',
  },
};

export function ThemeProvider({ children }) {
  const [modoOscuro, setModoOscuro] = useState(true);

  const cambiarTema = () => {
    setModoOscuro((anterior) => !anterior);
  };

  const theme = modoOscuro
    ? temas.oscuro
    : temas.claro;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        modoOscuro,
        cambiarTema,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}