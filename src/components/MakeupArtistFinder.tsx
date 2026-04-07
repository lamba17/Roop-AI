import { useEffect, useState } from 'react';
import { MAKEUP_ARTISTS, CITY_COORDS } from '../data/makeupArtists';

function getNearestCity(lat: number, lng: number): string {
  let nearest = 'Delhi';
  let minDist = Infinity;
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    const dist = Math.sqrt(Math.pow(lat - coords.lat, 2) + Math.pow(lng - coords.lng, 2));
    if (dist < minDist) { minDist = dist; nearest = city; }
  }
  return nearest;
}

export default function MakeupArtistFinder() {
  const cities = Object.keys(MAKEUP_ARTISTS);
  const [city, setCity] = useState('Delhi');
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const artists = MAKEUP_ARTISTS[city] ?? [];

  useEffect(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCity(getNearestCity(pos.coords.latitude, pos.coords.longitude));
        setLocating(false);
      },
      () => {
        setLocError('Location access denied — select your city manually.');
        setLocating(false);
      },
      { timeout: 6000 }
    );
  }, []);

  function retryLocation() {
    setLocError(null);
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => { setCity(getNearestCity(pos.coords.latitude, pos.coords.longitude)); setLocating(false); },
      () => { setLocError('Location access denied.'); setLocating(false); },
      { timeout: 6000 }
    );
  }

  return (
    <div>
      {/* Location bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <button
          onClick={retryLocation}
          style={{
            background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.3)',
            borderRadius: 8, padding: '7px 12px', color: '#ec4899', fontSize: 13,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
          }}
        >
          {locating ? '⏳' : '📍'} {locating ? 'Locating...' : 'Near Me'}
        </button>
        <select
          value={city}
          onChange={e => setCity(e.target.value)}
          style={{
            flex: 1, padding: '8px 14px', borderRadius: 10,
            background: 'var(--select-bg)', border: '1px solid var(--inner-border)', color: 'var(--text-primary)',
            fontSize: 14, cursor: 'pointer',
          }}
        >
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {locError && (
        <p style={{ fontSize: 12, color: '#f59e0b', marginBottom: 10 }}>⚠️ {locError}</p>
      )}

      <p style={{ fontSize: 12, color: '#555', marginBottom: 12, letterSpacing: 0.5 }}>
        Makeup artists in <span style={{ color: '#ec4899', fontWeight: 600 }}>{city}</span>
      </p>

      <div>
        {artists.map((artist, i) => (
          <div key={i} style={{
            background: 'var(--inner-card)', border: '1px solid var(--inner-border)', borderRadius: 12,
            padding: '14px 16px', marginBottom: 10,
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          }}>
            <div style={{ flex: 1, marginRight: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 3 }}>{artist.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{artist.studio}</div>
              <div style={{ fontSize: 12, color: 'rgba(236,72,153,0.8)', marginBottom: 8 }}>{artist.priceRange}</div>
              <span style={{
                fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase',
                padding: '3px 8px', borderRadius: 6,
                background: 'rgba(236,72,153,0.12)', color: '#ec4899',
              }}>{artist.specialty}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f59e0b' }}>⭐ {artist.rating}</div>
              <a
                href={artist.googleMapsLink}
                target="_blank"
                rel="noreferrer noopener"
                style={{
                  fontSize: 12, color: '#fff', textDecoration: 'none',
                  background: '#ec4899', padding: '4px 10px', borderRadius: 6, fontWeight: 600,
                }}
              >
                Maps →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
