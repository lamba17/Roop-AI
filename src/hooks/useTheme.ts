import { useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('roop_theme') as Theme) ?? 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('roop_theme', theme);
  }, [theme]);

  function toggle() {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }

  return { theme, toggle, isDark: theme === 'dark' };
}

/* Returns inline-style-safe color values for the current theme */
export function useThemeColors() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('roop_theme') as Theme) ?? 'light';
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const t = document.documentElement.getAttribute('data-theme') as Theme;
      if (t) setTheme(t);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const isDark = theme === 'dark';

  return {
    isDark,
    // Page / layout
    pageBg:        isDark ? '#050510'                    : '#faf8ff',
    meshBg:        isDark
      ? 'radial-gradient(ellipse 100% 80% at 50% -10%,rgba(124,58,237,.22) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 90% 90%,rgba(219,39,119,.15) 0%,transparent 55%),radial-gradient(ellipse 50% 40% at 10% 80%,rgba(124,58,237,.12) 0%,transparent 50%),#050510'
      : 'radial-gradient(ellipse 100% 80% at 50% -10%,rgba(168,85,247,.12) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 90% 90%,rgba(219,39,119,.08) 0%,transparent 55%),radial-gradient(ellipse 50% 40% at 10% 80%,rgba(124,58,237,.07) 0%,transparent 50%),#faf8ff',
    // Cards
    cardBg:        isDark ? 'rgba(13,13,31,0.75)'        : 'rgba(255,255,255,0.92)',
    cardBorder:    isDark ? 'rgba(124,58,237,0.25)'      : 'rgba(124,58,237,0.18)',
    cardShadow:    isDark ? '0 8px 40px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.06)' : '0 8px 40px rgba(124,58,237,0.08),inset 0 1px 0 rgba(255,255,255,0.9)',
    innerCard:     isDark ? '#12122a'                    : '#f5f3ff',
    innerBorder:   isDark ? '#1e1e3a'                    : '#e4dcff',
    // Header
    headerBg:      isDark ? 'rgba(5,5,16,0.85)'          : 'rgba(250,248,255,0.92)',
    headerBorder:  isDark ? 'rgba(124,58,237,0.18)'      : 'rgba(124,58,237,0.15)',
    // Text
    textPrimary:   isDark ? '#f8f8ff'                    : '#1a1630',
    textMuted:     isDark ? '#8888aa'                    : '#55557a',
    textHint:      isDark ? '#44445a'                    : '#9090b8',
    textBody:      isDark ? 'rgba(248,248,255,0.75)'     : 'rgba(26,22,48,0.75)',
    textSoft:      isDark ? 'rgba(248,248,255,0.55)'     : 'rgba(26,22,48,0.55)',
    // Inputs / selects
    inputBg:       isDark ? 'rgba(20,20,42,0.8)'         : 'rgba(245,243,255,0.9)',
    inputBorder:   isDark ? 'rgba(124,58,237,0.3)'       : 'rgba(124,58,237,0.3)',
    selectBg:      isDark ? '#1a1a30'                    : '#f0ecff',
    selectBorder:  isDark ? '#1e1e3a'                    : '#ddd6fe',
    selectColor:   isDark ? '#e8e8f0'                    : '#1a1630',
    // Score bar track
    barTrack:      isDark ? '#1e1e3a'                    : '#e8e3ff',
    // Scrollbar
    scrollThumb:   isDark ? 'linear-gradient(180deg,#7c3aed,#db2777)' : 'linear-gradient(180deg,#a78bfa,#f9a8d4)',
  };
}
