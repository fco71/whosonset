import React from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
  const { colorMode, toggleColorMode } = useTheme();
  
  return (
    <button
      onClick={toggleColorMode}
      className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      aria-label={`Switch to ${colorMode === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.div
        key={colorMode}
        initial={{ opacity: 0, rotate: colorMode === 'dark' ? 90 : -90 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.2 }}
        className="w-5 h-5"
      >
        {colorMode === 'dark' ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
