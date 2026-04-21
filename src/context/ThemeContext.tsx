import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  forceTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'light', toggle: () => {}, forceTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('roop_theme_v3');
    // Default to light for all pages; respect saved user preference
    return (saved === 'light' || saved === 'dark') ? saved : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('roop_theme_v3', theme);
  }, [theme]);

  function toggle() {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }

  // Force a specific theme without saving to localStorage (used by pages)
  function forceTheme(t: Theme) {
    setTheme(t);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle, forceTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
