import React, { createContext, useContext } from 'react';
import { theme, Theme } from './theme.config';

type ThemeContextType = {
  theme: Theme;
};

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
}) => {
  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
