import React, { createContext, useContext, useEffect, useState } from 'react';
import { theme, Theme } from './theme.config';

// Theme type is now imported from theme.config

type ThemeContextType = {
  theme: Theme;
  colorMode: 'light' | 'dark';
  toggleColorMode: () => void;
  setColorMode: (mode: 'light' | 'dark') => void;
};

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme,
  colorMode: 'light',
  toggleColorMode: () => {},
  setColorMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialColorMode?: 'light' | 'dark';
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialColorMode = 'light',
}) => {
  const [colorMode, setColorMode] = useState<'light' | 'dark'>(initialColorMode);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('colorMode') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setColorMode(savedTheme);
    } else if (prefersDark) {
      setColorMode('dark');
    } else {
      setColorMode('light');
    }
  }, []);

  // Update document class when color mode changes
  useEffect(() => {
    if (colorMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('colorMode', colorMode);
  }, [colorMode]);

  const toggleColorMode = () => {
    setColorMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: {
          ...theme,
          colors: {
            ...theme.colors,
            // Add theme-aware colors
            bg: colorMode === 'dark' ? theme.colors.neutral[900] : theme.colors.neutral[50],
            text: colorMode === 'dark' ? theme.colors.neutral[100] : theme.colors.neutral[900],
            card: colorMode === 'dark' ? theme.colors.neutral[800] : '#ffffff',
            border: colorMode === 'dark' ? theme.colors.neutral[700] : theme.colors.neutral[200],
          },
        } as Theme,
        colorMode,
        toggleColorMode,
        setColorMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
