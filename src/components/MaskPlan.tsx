import type { MaskType } from '../types/analysis';
import { MASK_RECOMMENDATIONS } from '../data/masks';

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MaskPlan({ maskType }: { maskType: MaskType }) {
  const mask = MASK_RECOMMENDATIONS[maskType];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h4 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#e8e8f0' }}>{mask.name}</h4>
        <p style={{ margin: 0, fontSize: 13, color: '#888' }}>{mask.frequency} · {mask.time}</p>
        <p style={{ margin: '8px 0 0', fontSize: 13, color: '#a855f7' }}>{mask.benefit}</p>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {ALL_DAYS.map(day => {
          const active = mask.days.includes(day);
          return (
            <div key={day} style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: active ? '#a855f7' : '#1e1e3a',
              color: active ? '#fff' : '#555',
            }}>
              {day}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <a href={mask.nykaaLink} target="_blank" rel="noreferrer noopener"
          style={{
            padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: '#ec4899', color: '#fff', textDecoration: 'none',
          }}>
          Shop on Nykaa →
        </a>
        {mask.amazonLink && (
          <a href={mask.amazonLink} target="_blank" rel="noreferrer noopener"
            style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: '#f59e0b', color: '#fff', textDecoration: 'none',
            }}>
            Shop on Amazon →
          </a>
        )}
        {mask.myntraLink && (
          <a href={mask.myntraLink} target="_blank" rel="noreferrer noopener"
            style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: '#06b6d4', color: '#fff', textDecoration: 'none',
            }}>
            Shop on Myntra →
          </a>
        )}
      </div>
    </div>
  );
}
