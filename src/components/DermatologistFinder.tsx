import { useState } from 'react';
import { DERMATOLOGISTS } from '../data/dermatologists';

export default function DermatologistFinder() {
  const cities = Object.keys(DERMATOLOGISTS);
  const [city, setCity] = useState('Dehradun');
  const doctors = DERMATOLOGISTS[city] ?? [];

  return (
    <div>
      <select
        value={city}
        onChange={e => setCity(e.target.value)}
        style={{
          width: '100%', padding: '10px 14px', borderRadius: 10, marginBottom: 16,
          background: '#1a1a30', border: '1px solid #1e1e3a', color: '#e8e8f0',
          fontSize: 14, cursor: 'pointer',
        }}
      >
        {cities.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <div>
        {doctors.map((doc, i) => (
          <div key={i} style={{
            background: '#1a1a30', border: '1px solid #1e1e3a', borderRadius: 12,
            padding: '14px 16px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#e8e8f0', marginBottom: 3 }}>{doc.name}</div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>{doc.clinic}</div>
              <span style={{
                fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase',
                padding: '3px 8px', borderRadius: 6, background: 'rgba(168,85,247,0.15)', color: '#a855f7',
              }}>{doc.specialty}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f59e0b' }}>⭐ {doc.rating}</div>
              {doc.googleMapsLink && (
                <a href={doc.googleMapsLink} target="_blank" rel="noreferrer noopener"
                  style={{ fontSize: 12, color: '#06b6d4', textDecoration: 'none' }}>Maps →</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
