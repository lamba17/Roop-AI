import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface RoutineChecklistProps {
  morning: string[];
  evening: string[];
}

const EMOJIS_MORNING = ['🌅', '💧', '☀️'];
const EMOJIS_EVENING = ['🌙', '✨', '💤'];

export default function RoutineChecklist({ morning, evening }: RoutineChecklistProps) {
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
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['morning', 'evening'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600,
              border: 'none', cursor: 'pointer',
              background: tab === t ? 'linear-gradient(135deg,#a855f7,#ec4899)' : '#1e1e3a',
              color: tab === t ? '#fff' : '#888',
              transition: 'all 0.2s',
              textTransform: 'capitalize',
            }}
          >
            {t === 'morning' ? '🌅 Morning' : '🌙 Evening'}
          </button>
        ))}
      </div>
      <div>
        {steps.map((step, i) => {
          const key = `${tab}_${i}`;
          const done = !!checked[key];
          return (
            <div
              key={key}
              onClick={() => toggle(key)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0',
                borderBottom: '1px solid #1e1e3a', cursor: 'pointer',
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 2,
                border: done ? 'none' : '2px solid #333',
                background: done ? 'linear-gradient(135deg,#a855f7,#ec4899)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {done && <span style={{ color: '#fff', fontSize: 11 }}>✓</span>}
              </div>
              <span style={{ fontSize: 14, color: done ? '#555' : '#e8e8f0', textDecoration: done ? 'line-through' : 'none' }}>
                {emojis[i] ?? '•'} {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
