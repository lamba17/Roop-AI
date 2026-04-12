import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useLanguage } from '../context/LanguageContext';
import { T } from '../data/translations';

interface RoutineChecklistProps {
  morning: string[];
  evening: string[];
}

const EMOJIS_MORNING = ['🌅', '💧', '☀️'];
const EMOJIS_EVENING = ['🌙', '✨', '💤'];

export default function RoutineChecklist({ morning, evening }: RoutineChecklistProps) {
  const { lang } = useLanguage();
  const t = T[lang];
  const [tab, setTab] = useState<'morning' | 'evening'>('morning');
  const today = new Date().toISOString().split('T')[0];
  const [checked, setChecked] = useLocalStorage<Record<string, boolean>>(`routine_${today}`, {});

  const steps = tab === 'morning' ? morning : evening;
  const emojis = tab === 'morning' ? EMOJIS_MORNING : EMOJIS_EVENING;

  function toggle(key: string) {
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div>
      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['morning', 'evening'] as const).map(tabKey => (
          <button
            key={tabKey}
            onClick={() => setTab(tabKey)}
            style={{
              padding: '8px 18px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              border: tab === tabKey ? 'none' : '1px solid var(--border)',
              cursor: 'pointer',
              background: tab === tabKey
                ? 'linear-gradient(135deg,#a855f7,#ec4899)'
                : 'var(--bg-elevated)',
              color: tab === tabKey ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.2s',
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            {tabKey === 'morning' ? `🌅 ${t.morning}` : `🌙 ${t.evening}`}
          </button>
        ))}
      </div>

      {/* Steps */}
      <div>
        {steps.map((step, i) => {
          const key = `${tab}_${i}`;
          const done = !!checked[key];
          return (
            <div
              key={key}
              onClick={() => toggle(key)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '12px 0',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
              }}
            >
              {/* Checkbox */}
              <div style={{
                width: 20,
                height: 20,
                borderRadius: 6,
                flexShrink: 0,
                marginTop: 2,
                border: done ? 'none' : '2px solid var(--border)',
                background: done ? 'linear-gradient(135deg,#a855f7,#ec4899)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}>
                {done && <span style={{ color: '#fff', fontSize: 11 }}>✓</span>}
              </div>

              {/* Step text */}
              <span style={{
                fontSize: 14,
                fontWeight: 500,
                color: done ? 'var(--text-hint)' : 'var(--text-primary)',
                textDecoration: done ? 'line-through' : 'none',
                lineHeight: 1.5,
              }}>
                {emojis[i] ?? '•'} {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
