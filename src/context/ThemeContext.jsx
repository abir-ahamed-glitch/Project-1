import { createContext, useContext, useState, useEffect } from 'react';
import { themes } from '../data/mockData';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('qrforall-theme') || 'theme-dark';
  });

  useEffect(() => {
    localStorage.setItem('qrforall-theme', activeTheme);
    document.body.className = activeTheme; // Apply theme to body
  }, [activeTheme]);

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
