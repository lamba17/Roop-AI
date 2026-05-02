import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        border: `1px solid ${isDark ? 'rgba(168,85,247,0.35)' : 'rgba(124,58,237,0.25)'}`,
        background: isDark ? 'rgba(124,58,237,0.10)' : 'rgba(124,58,237,0.08)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        transition: 'all 0.25s ease',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background =
          isDark ? 'rgba(124,58,237,0.20)' : 'rgba(124,58,237,0.15)';
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background =
          isDark ? 'rgba(124,58,237,0.10)' : 'rgba(124,58,237,0.08)';
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
      }}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
