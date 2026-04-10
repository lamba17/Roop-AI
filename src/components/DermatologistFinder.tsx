import { useEffect, useState } from 'react';
import { DERMATOLOGISTS, CITY_COORDS } from '../data/dermatologists';
import { useLanguage } from '../context/LanguageContext';
import { T } from '../data/translations';

function getNearestCity(lat: number, lng: number): string {
  let nearest = 'Delhi';
  let minDist = Infinity;
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    const dist = Math.sqrt(Math.pow(lat - coords.lat, 2) + Math.pow(lng - coords.lng, 2));
    if (dist < minDist) { minDist = dist; nearest = city; }
  }
  return nearest;
}

export default function DermatologistFinder() {
  const { lang } = useLanguage();
  const t = T[lang];
  const cities = Object.keys(DERMATOLOGISTS);
  const [city, setCity] = useState('Delhi');
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const doctors = DERMATOLOGISTS[city] ?? [];

  useEffect(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const nearest = getNearestCity(pos.coords.latitude, pos.coords.longitude);
        setCity(nearest);
        setLocating(false);
      },
      () => {
        setLocError('Location access denied — select your city manually.');
        setLocating(false);
      },
      { timeout: 6000 }
    );
  }, []);

  return (
    <div>
      {/* Location bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <button
          onClick={() => {
            setLocError(null);
            setLocating(true);
            navigator.geolocation.getCurrentPosition(
              pos => { setCity(getNearestCity(pos.coords.latitude, pos.coords.longitude)); setLocating(false); },
              () => { setLocError('Location access denied.'); setLocating(false); },
              { timeout: 6000 }
            );
          }}
          style={{
            background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)',
            borderRadius: 8, padding: '7px 12px', color: '#a855f7', fontSize: 13,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
          }}
        >
          {locating ? '⏳' : '📍'} {locating ? t.locating : t.nearMe}
        </button>
        <select
          value={city}
          onChange={e => setCity(e.target.value)}
          style={{
            flex: 1, padding: '8px 14px', borderRadius: 10,
            background: '#1a1a30', border: '1px solid #1e1e3a', color: '#e8e8f0',
            fontSize: 14, cursor: 'pointer',
          }}
        >
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {locError && (
        <p style={{ fontSize: 12, color: '#f59e0b', marginBottom: 10 }}>⚠️ {locError}</p>
      )}

      {/* Showing city */}
      <p style={{ fontSize: 12, color: '#555', marginBottom: 12, letterSpacing: 0.5 }}>
        {t.showingDermats} <span style={{ color: '#a855f7', fontWeight: 600 }}>{city}</span>
      </p>

      <div>
        {doctors.map((doc, i) => (
          <div key={i} style={{
            background: '#1a1a30', border: '1px solid #1e1e3a', borderRadius: 12,
            padding: '14px 16px', marginBottom: 10,
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          }}>
            <div style={{ flex: 1, marginRight: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#e8e8f0', marginBottom: 3 }}>{doc.name}</div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{doc.clinic}</div>
              {doc.priceRange && (
                <div style={{ fontSize: 12, color: 'rgba(168,85,247,0.85)', marginBottom: 8 }}>💰 {doc.priceRange}</div>
              )}
              <span style={{
                fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase',
                padding: '3px 8px', borderRadius: 6, background: 'rgba(168,85,247,0.15)', color: '#a855f7',
              }}>{doc.specialty}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f59e0b' }}>⭐ {doc.rating}</div>
              {doc.googleMapsLink && (
                <a href={doc.googleMapsLink} target="_blank" rel="noreferrer noopener"
                  style={{ fontSize: 11, color: '#fff', textDecoration: 'none', background: '#06b6d4', padding: '4px 10px', borderRadius: 6, fontWeight: 600, display: 'block', textAlign: 'center' }}>
                  {t.maps}
                </a>
              )}
              {doc.justDialLink && (
                <a href={doc.justDialLink} target="_blank" rel="noreferrer noopener"
                  style={{ fontSize: 11, color: '#fff', textDecoration: 'none', background: '#f97316', padding: '4px 10px', borderRadius: 6, fontWeight: 600, display: 'block', textAlign: 'center' }}>
                  JD
                </a>
              )}
              {doc.instagramHandle && (
                <a href={`https://www.instagram.com/${doc.instagramHandle}`} target="_blank" rel="noreferrer noopener"
                  style={{ fontSize: 11, color: '#fff', textDecoration: 'none', background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', padding: '4px 10px', borderRadius: 6, fontWeight: 600, display: 'block', textAlign: 'center' }}>
                  IG
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
