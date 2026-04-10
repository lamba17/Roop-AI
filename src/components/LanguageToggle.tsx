import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
      title={lang === 'en' ? 'Switch to Hindi' : 'Switch to English'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        padding: '6px 12px',
        borderRadius: 20,
        border: '1px solid rgba(168,85,247,0.35)',
        background: 'rgba(168,85,247,0.08)',
        color: '#a855f7',
        fontSize: 13,
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s',
        letterSpacing: 0.3,
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(168,85,247,0.18)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(168,85,247,0.6)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(168,85,247,0.08)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(168,85,247,0.35)';
      }}
    >
      {lang === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
    </button>
  );
}
