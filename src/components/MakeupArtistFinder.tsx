import { useEffect, useMemo, useState } from 'react';
import { MAKEUP_ARTISTS, CITY_COORDS } from '../data/makeupArtists';
import type { MakeupArtist } from '../data/makeupArtists';

const ALL_ARTISTS = Object.entries(MAKEUP_ARTISTS).flatMap(([city, arts]) =>
  arts.map(a => ({ ...a, city }))
);

/* ── Photo pools ─────────────────────────────────────────────────────────── */
const ARTIST_PHOTOS = [
  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=85&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&q=85&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&q=85&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=600&q=85&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=85&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=85&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=85&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=85&fit=crop&crop=faces',
];

const AVATAR_COLORS = [
  ['#ec4899', 'rgba(236,72,153,0.15)'],
  ['#a855f7', 'rgba(168,85,247,0.15)'],
  ['#f59e0b', 'rgba(245,158,11,0.15)'],
  ['#06b6d4', 'rgba(6,182,212,0.15)'],
  ['#ec4899', 'rgba(236,72,153,0.15)'],
  ['#8b5cf6', 'rgba(139,92,246,0.15)'],
  ['#f43f5e', 'rgba(244,63,94,0.15)'],
  ['#d946ef', 'rgba(217,70,239,0.15)'],
];

function getInitials(name: string): string {
  const words = name.replace(/^(The|Studio|Salon)\s+/i, '').split(' ');
  return words.length >= 2
    ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
    : words[0].slice(0, 2).toUpperCase();
}

function getNearestCity(lat: number, lng: number): string {
  let nearest = 'Delhi';
  let minDist = Infinity;
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    const dist = Math.sqrt((lat - coords.lat) ** 2 + (lng - coords.lng) ** 2);
    if (dist < minDist) { minDist = dist; nearest = city; }
  }
  return nearest;
}

/* ── Sub-components ──────────────────────────────────────────────────────── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} width="12" height="12" viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 700, marginLeft: 3 }}>{rating}</span>
    </div>
  );
}

function ArtistAvatar({ name, idx, size = 52 }: { name: string; idx: number; size?: number }) {
  const [color, bg] = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.3,
      background: bg, border: `1.5px solid ${color}55`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, color, fontWeight: 800,
      fontSize: size * 0.34, fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      {getInitials(name)}
    </div>
  );
}

function MapIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
function IgIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>;
}

/* ── Small artist card ───────────────────────────────────────────────────── */
function SmallArtistCard({ artist, idx }: { artist: MakeupArtist; idx: number }) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <div className="small-doc-card">
      <div className="small-doc-photo-wrap">
        {imgOk ? (
          <img
            src={ARTIST_PHOTOS[idx % ARTIST_PHOTOS.length]}
            alt={artist.name}
            className="small-doc-photo"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArtistAvatar name={artist.name} idx={idx} size={56} />
          </div>
        )}
      </div>
      <div className="small-doc-body">
        <div className="small-doc-name">{artist.name}</div>
        <div className="small-doc-specialty">{artist.specialty}</div>
        <StarRating rating={artist.rating} />
        <div className="small-doc-fee">{artist.priceRange}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{artist.studio.split(',').slice(-1)[0].trim()}</div>

        <div className="small-doc-actions">
          <div style={{ display: 'flex', gap: 5 }}>
            {artist.googleMapsLink && (
              <a href={artist.googleMapsLink} target="_blank" rel="noreferrer noopener" className="doc-social-icon" title="Google Maps">
                <MapIcon />
              </a>
            )}
            {artist.justDialLink && (
              <a href={artist.justDialLink} target="_blank" rel="noreferrer noopener" className="doc-social-icon" title="JustDial">
                <span style={{ fontSize: 9, fontWeight: 800 }}>JD</span>
              </a>
            )}
            {artist.instagramHandle && (
              <a href={`https://www.instagram.com/${artist.instagramHandle}`} target="_blank" rel="noreferrer noopener" className="doc-social-icon" title="Instagram">
                <IgIcon />
              </a>
            )}
          </div>
          {artist.googleMapsLink && (
            <a href={artist.googleMapsLink} target="_blank" rel="noreferrer noopener" className="small-doc-book-btn">
              Book
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function MakeupArtistFinder() {
  const cities = Object.keys(MAKEUP_ARTISTS);
  const [city, setCity] = useState('Delhi');
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [featuredImgOk, setFeaturedImgOk] = useState(true);
  const [topImgOk, setTopImgOk] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const artists = MAKEUP_ARTISTS[city] ?? [];
  const [featured, topRated, ...otherArtists] = artists;

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return ALL_ARTISTS.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.studio.toLowerCase().includes(q) ||
      a.specialty.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const featuredTags = featured
    ? featured.specialty.split(/\s*[&,]\s*/).filter(Boolean)
    : [];

  useEffect(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => { setCity(getNearestCity(pos.coords.latitude, pos.coords.longitude)); setLocating(false); },
      () => { setLocError('Location access denied — select your city manually.'); setLocating(false); },
      { timeout: 6000 }
    );
  }, []);

  function handleLocate() {
    setLocError(null);
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => { setCity(getNearestCity(pos.coords.latitude, pos.coords.longitude)); setLocating(false); },
      () => { setLocError('Location access denied.'); setLocating(false); },
      { timeout: 6000 }
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* Search bar */}
      <div className="specialists-search-bar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by name, studio, specialty or city…"
          className="specialists-search-input"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="specialists-search-clear">✕</button>
        )}
      </div>

      {/* Search results */}
      {searchResults !== null ? (
        <div>
          <div className="doctors-section-label" style={{ marginBottom: 14 }}>
            {searchResults.length > 0
              ? `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${searchQuery}"`
              : `No results for "${searchQuery}"`}
          </div>
          {searchResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, color: 'var(--text-muted)', fontSize: 14 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>💄</div>
              <p style={{ margin: 0 }}>Try a different name, specialty, or city.</p>
            </div>
          ) : (
            <div className="specialist-cards-grid">
              {searchResults.map((artist, i) => (
                <SmallArtistCard key={i} artist={artist} idx={i} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>

      {/* Glam Perspective banner */}
      <div className="clinical-perspective-card">
        <div className="clinical-perspective-inner">
          <div className="clinical-icon-box">💄</div>
          <div className="clinical-content">
            <div className="clinical-label">Pro Styling Insight</div>
            <p className="clinical-quote-v2">
              "A certified makeup artist can identify your{' '}
              <strong style={{ color: 'var(--text-primary)' }}>undertone, face shape, and skin finish</strong>{' '}
              to recommend looks that genuinely flatter — something AI scoring guides but a trained eye confirms."
            </p>
            <div className="clinical-verified-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              curated by ROOP AI glam intelligence
            </div>
          </div>
        </div>
      </div>

      {/* Header + Filters */}
      <div className="specialists-section-header">
        <div>
          <h2 className="specialists-nearby-title">Artists Near You</h2>
          <p className="specialists-nearby-sub">Top-rated makeup studios and artists in your city.</p>
        </div>
        <div className="specialists-filter-bar">
          <div className="city-filter-chip">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {city}, India
          </div>
          <button onClick={handleLocate} className="filter-action-btn">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
            </svg>
            {locating ? 'Locating…' : 'Near Me'}
          </button>
          <div style={{ position: 'relative' }}>
            <button className="filter-action-btn" onClick={() => setShowCityDropdown(f => !f)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
              </svg>
              Filters
            </button>
            {showCityDropdown && (
              <div className="city-filter-dropdown">
                {cities.map(c => (
                  <button key={c} className={`city-filter-option${city === c ? ' active' : ''}`}
                    onClick={() => { setCity(c); setShowCityDropdown(false); }}>
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {locError && <p className="loc-error">{locError}</p>}
      </div>

      {/* Hero grid: Featured (large) + Top Rated */}
      <div className="specialist-hero-grid">

        {/* Featured artist */}
        {featured && (
          <div className="featured-doc-card">
            <div className="featured-doc-photo-wrap">
              {featuredImgOk ? (
                <img
                  src={ARTIST_PHOTOS[0]}
                  alt={featured.name}
                  className="featured-doc-photo"
                  onError={() => setFeaturedImgOk(false)}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArtistAvatar name={featured.name} idx={0} size={80} />
                </div>
              )}
            </div>
            <div className="featured-doc-info">
              <div className="featured-doc-specialties">
                {featuredTags.map((tag, i) => (
                  <span key={i} className="doc-specialty-tag" style={{ background: 'rgba(236,72,153,0.12)', color: '#ec4899', borderColor: 'rgba(236,72,153,0.25)' }}>{tag}</span>
                ))}
              </div>
              <h3 className="featured-doc-name">{featured.name}</h3>
              <p className="featured-doc-clinic">{featured.studio}</p>
              <StarRating rating={featured.rating} />
              <span className="featured-doc-fee" style={{ marginTop: 4 }}>
                Starting · {featured.priceRange}
              </span>
              <div className="featured-doc-actions">
                {featured.googleMapsLink ? (
                  <a href={featured.googleMapsLink} target="_blank" rel="noreferrer noopener"
                    className="doc-book-btn"
                    style={{ background: 'linear-gradient(135deg, #ec4899, #a855f7)', boxShadow: '0 4px 16px rgba(236,72,153,0.35)' }}>
                    Book Appointment
                  </a>
                ) : (
                  <button className="doc-book-btn" disabled style={{ opacity: 0.5 }}>Book Appointment</button>
                )}
                <div className="doc-social-icons">
                  {featured.googleMapsLink && (
                    <a href={featured.googleMapsLink} target="_blank" rel="noreferrer noopener" className="doc-social-icon" title="Google Maps"><MapIcon /></a>
                  )}
                  {featured.justDialLink && (
                    <a href={featured.justDialLink} target="_blank" rel="noreferrer noopener" className="doc-social-icon" title="JustDial">
                      <span style={{ fontSize: 9, fontWeight: 800 }}>JD</span>
                    </a>
                  )}
                  {featured.instagramHandle && (
                    <a href={`https://www.instagram.com/${featured.instagramHandle}`} target="_blank" rel="noreferrer noopener" className="doc-social-icon" title="Instagram"><IgIcon /></a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Rated artist */}
        {topRated && (
          <div className="top-rated-doc-card">
            <div className="top-rated-badge" style={{ background: 'linear-gradient(135deg, #ec4899, #a855f7)' }}>TOP RATED ARTIST</div>
            <div className="top-rated-header">
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 className="top-rated-name">{topRated.name}</h3>
                <p className="top-rated-clinic">{topRated.studio}</p>
                <StarRating rating={topRated.rating} />
              </div>
              <div className="top-rated-photo-wrap">
                {topImgOk ? (
                  <img
                    src={ARTIST_PHOTOS[1]}
                    alt={topRated.name}
                    className="top-rated-photo"
                    onError={() => setTopImgOk(false)}
                  />
                ) : (
                  <ArtistAvatar name={topRated.name} idx={1} size={58} />
                )}
              </div>
            </div>
            <p className="top-rated-known-for">
              <strong>Known for:</strong> {topRated.specialty.toLowerCase()} and exceptional client results
            </p>
            <div className="top-rated-footer">
              <span className="top-rated-fee">{topRated.priceRange}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {topRated.googleMapsLink && (
                  <a href={topRated.googleMapsLink} target="_blank" rel="noreferrer noopener" className="doc-social-icon"><MapIcon /></a>
                )}
                {topRated.instagramHandle && (
                  <a href={`https://www.instagram.com/${topRated.instagramHandle}`} target="_blank" rel="noreferrer noopener" className="doc-social-icon"><IgIcon /></a>
                )}
                {topRated.justDialLink && (
                  <a href={topRated.justDialLink} target="_blank" rel="noreferrer noopener" className="doc-social-icon" title="JustDial">
                    <span style={{ fontSize: 9, fontWeight: 800 }}>JD</span>
                  </a>
                )}
                {topRated.googleMapsLink && (
                  <a href={topRated.googleMapsLink} target="_blank" rel="noreferrer noopener" className="doc-book-btn" style={{ fontSize: 11, padding: '6px 12px' }}>
                    Book
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* More artists grid */}
      {otherArtists.length > 0 && (
        <>
          <div className="doctors-section-label">More Artists in {city}</div>
          <div className="specialist-cards-grid">
            {otherArtists.map((artist, i) => (
              <SmallArtistCard key={i} artist={artist} idx={i + 2} />
            ))}
          </div>
        </>
      )}

      {/* Book CTA */}
      <div className="urgent-eval-section">
        <h3 className="urgent-eval-title">Get your Glam Score first?</h3>
        <p className="urgent-eval-desc">
          Upload a makeup selfie for an AI-powered glam analysis before your artist appointment — know your undertone, shade match, and look style in advance.
        </p>
        <a
          href="/scan"
          className="btn-glow"
          style={{ fontSize: 14, padding: '12px 28px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          onClick={e => { e.preventDefault(); window.location.href = '/scan'; }}
        >
          💄 Start Glam Analysis
        </a>
      </div>

        </>
      )}
    </div>
  );
}
