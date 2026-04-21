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
    // On the landing page, default to light. Everywhere else, use saved or dark.
    if (typeof window !== 'undefined' && window.location.pathname === '/') return 'light';
    const saved = localStorage.getItem('roop_theme_v3');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    // Only persist the theme when it was set on an app page (not landing)
    if (window.location.pathname !== '/') {
      localStorage.setItem('roop_theme_v3', theme);
    }
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
