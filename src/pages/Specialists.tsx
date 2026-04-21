import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DERMATOLOGISTS, CITY_COORDS } from '../data/dermatologists';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../lib/supabase';
import { usePremium } from '../hooks/usePremium';
import PremiumModal from '../components/PremiumModal';

const ADMIN_EMAILS = ['lamba.akash1994@gmail.com', 'varunvlamba@gmail.com'];

/**
 * Build a real JustDial search URL from clinic name + city.
 * Avoids the fake hardcoded JD IDs in the data which lead to wrong listings.
 */
function buildJDUrl(clinic: string, city: string): string {
  const clinicName = clinic.split(',')[0].trim(); // take just the clinic name, drop address
  return `https://www.justdial.com/${encodeURIComponent(city)}/search?q=${encodeURIComponent(clinicName)}&catid=0801`;
}

/* ── Doctor photo pools (Unsplash) ─────────────────────────────────────── */
const FEMALE_PHOTOS = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=85&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&q=85&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=500&q=85&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=500&q=85&fit=crop&crop=faces',
];
const MALE_PHOTOS = [
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&q=85&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&q=85&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&q=85&fit=crop&crop=faces',
];

const FEMALE_NAMES = new Set([
  'Archana','Deepti','Shweta','Priya','Ritu','Neha','Lipy','Monica','Deepali','Niti',
  'Sonal','Renu','Shrilata','Rinky','Sejal','Harshna','Geeta','Shefali','Madhuri',
  'Rasya','Swetha','Navya','Deepika','Chaitra','Pooja','Vandana','Janani','Uma',
  'Meena','Sudha','Lakshmi','Sneha','Anita','Geetika','Nidhi','Aparna','Rekha',
  'Seema','Sunita','Kavitha','Usha','Nisha','Divya','Swati','Pallavi',
]);

function getDoctorPhoto(name: string, idx: number): string {
  const firstName = name.split(' ').slice(1).find(p => p.length > 1) ?? '';
  return FEMALE_NAMES.has(firstName)
    ? FEMALE_PHOTOS[idx % FEMALE_PHOTOS.length]
    : MALE_PHOTOS[idx % MALE_PHOTOS.length];
}

/* ── Avatar colour palette (fallback when image fails) ─────────────────── */
const AVATAR_COLORS = [
  ['#7c3aed','rgba(124,58,237,0.18)'],
  ['#db2777','rgba(219,39,119,0.18)'],
  ['#0891b2','rgba(8,145,178,0.18)'],
  ['#059669','rgba(5,150,105,0.18)'],
  ['#d97706','rgba(217,119,6,0.18)'],
  ['#7c3aed','rgba(124,58,237,0.18)'],
  ['#be185d','rgba(190,24,93,0.18)'],
  ['#0e7490','rgba(14,116,144,0.18)'],
  ['#047857','rgba(4,120,87,0.18)'],
  ['#b45309','rgba(180,83,9,0.18)'],
];

function getInitials(name: string): string {
  const parts = name.replace('Dr. ', '').split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
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

const ALL_DOCTORS = Object.entries(DERMATOLOGISTS).flatMap(([city, docs]) =>
  docs.map(d => ({ ...d, city }))
);

/* ── Shared sub-components ──────────────────────────────────────────────── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width="12" height="12" viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 700, marginLeft: 3 }}>{rating}</span>
    </div>
  );
}

function DoctorAvatar({ name, idx, size = 52 }: { name: string; idx: number; size?: number }) {
  const [color, bg] = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: bg, border: `1.5px solid ${color}44`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, color, fontWeight: 800,
      fontSize: size * 0.34, fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      {getInitials(name)}
    </div>
  );
}

function MapIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function IgIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
}

/* ── Small card (used in grid + search results) ─────────────────────────── */
interface Doc {
  name: string; clinic: string; rating: number; specialty: string;
  priceRange?: string; googleMapsLink?: string; justDialLink?: string;
  instagramHandle?: string; city?: string;
}

function SmallDoctorCard({ doc, idx }: { doc: Doc; idx: number }) {
  // Use dynamic JustDial search URL — reliable, no fake IDs
  const jdUrl = buildJDUrl(doc.clinic, doc.city ?? 'Delhi');
  const [imgOk, setImgOk] = useState(true);

  return (
    <div className="small-doc-card">
      <div className="small-doc-photo-wrap">
        {imgOk ? (
          <img
            src={getDoctorPhoto(doc.name, idx)}
            alt={doc.name}
            className="small-doc-photo"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DoctorAvatar name={doc.name} idx={idx} size={56} />
          </div>
        )}
      </div>
      <div className="small-doc-body">
        <div className="small-doc-name">{doc.name}</div>
        {doc.city && <div style={{ fontSize: 10, color: '#a855f7', fontWeight: 600, marginBottom: 2 }}>📍 {doc.city}</div>}
        <div className="small-doc-specialty">{doc.specialty}</div>
        <StarRating rating={doc.rating} />
        {doc.priceRange && <div className="small-doc-fee">{doc.priceRange}</div>}
        <a href={jdUrl} target="_blank" rel="noreferrer noopener" className="small-doc-book-btn">Book</a>
      </div>
    </div>
  );
}

/* ── Main content ───────────────────────────────────────────────────────── */
interface ContentProps {
  city: string; setCity: (c: string) => void;
  locating: boolean; locError: string | null; handleLocate: () => void;
  searchQuery: string; searchResults: (Doc & { city: string })[] | null;
  cities: string[]; doctors: Doc[];
  featured: Doc | undefined; rest: Doc[];
  onScanClick: () => void;
}

function SpecialistsContent({
  city, setCity, locating, locError, handleLocate,
  searchQuery, searchResults, cities, featured, rest, onScanClick,
}: ContentProps) {
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [featuredImgOk, setFeaturedImgOk] = useState(true);
  const [topImgOk, setTopImgOk] = useState(true);

  const topRated = rest[0];
  const otherDoctors = rest.slice(1);

  const featuredTags = featured
    ? featured.specialty.split(/\s*[&,]\s*/).filter(Boolean)
    : [];

  // Book Consultation: dynamic JustDial search URLs (no fake hardcoded IDs)
  const featuredBookUrl = featured ? buildJDUrl(featured.clinic, city) : null;
  const topBookUrl = topRated ? buildJDUrl(topRated.clinic, city) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* Clinical Perspective */}
      <div className="clinical-perspective-card">
        <div className="clinical-perspective-inner">
          <div className="clinical-icon-box">🩺</div>
          <div className="clinical-content">
            <div className="clinical-label">Clinical Perspective</div>
            <p className="clinical-quote-v2">
              "If dark circles persist despite consistent cream use, it is critical to{' '}
              <strong style={{ color: 'var(--text-primary)' }}>consult a dermatologist</strong>{' '}
              to rule out hyperpigmentation or vascular issues that topical treatments cannot address."
            </p>
            <div className="clinical-verified-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              verified by AI-based medical inputs
            </div>
          </div>
        </div>
      </div>

      {/* Header + Filters */}
      <div className="specialists-section-header">
        <div>
          <h2 className="specialists-nearby-title">Specialists Near You</h2>
          <p className="specialists-nearby-sub">Top-rated dermatology clinics in your vicinity.</p>
        </div>
        <div className="specialists-filter-bar">
          <div className="city-filter-chip">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {city}, India
          </div>
          <button onClick={handleLocate} className="filter-action-btn">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
            {locating ? 'Locating…' : 'Near Me'}
          </button>
          <div style={{ position: 'relative' }}>
            <button className="filter-action-btn" onClick={() => setShowCityDropdown(f => !f)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
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

      {searchResults !== null ? (
        /* Search results */
        <div>
          <div className="doctors-section-label" style={{ marginBottom: 14 }}>
            {searchResults.length > 0
              ? `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${searchQuery}"`
              : `No results for "${searchQuery}"`}
          </div>
          {searchResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, color: 'var(--text-muted)', fontSize: 14 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
              <p style={{ margin: 0 }}>Try a different name, specialty, or city.</p>
            </div>
          ) : (
            <div className="specialist-cards-grid">
              {searchResults.map((doc, i) => <SmallDoctorCard key={i} doc={doc} idx={i} />)}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* ── Hero grid: Featured (large) + Top Rated ── */}
          <div className="specialist-hero-grid">

            {/* Featured doctor — horizontal card with photo */}
            {featured && (
              <div className="featured-doc-card">
                <div className="featured-doc-photo-wrap">
                  {featuredImgOk ? (
                    <img
                      src={getDoctorPhoto(featured.name, 0)}
                      alt={featured.name}
                      className="featured-doc-photo"
                      onError={() => setFeaturedImgOk(false)}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <DoctorAvatar name={featured.name} idx={0} size={80} />
                    </div>
                  )}
                </div>
                <div className="featured-doc-info">
                  <div className="featured-doc-specialties">
                    {featuredTags.map((tag: string, i: number) => (
                      <span key={i} className="doc-specialty-tag">{tag}</span>
                    ))}
                    {!featured.specialty.toLowerCase().includes('dermatosurgery') && (
                      <span className="doc-specialty-tag doc-specialty-tag-alt">Dermatosurgery</span>
                    )}
                  </div>
                  <h3 className="featured-doc-name">{featured.name}</h3>
                  <p className="featured-doc-clinic">{featured.clinic}</p>
                  <StarRating rating={featured.rating} />
                  <span className="featured-doc-fee" style={{ marginTop: 4 }}>
                    Consultation · {featured.priceRange ?? '₹900–₹1,500'}
                  </span>
                  <div className="featured-doc-actions">
                    {featuredBookUrl ? (
                      <a href={featuredBookUrl} target="_blank" rel="noreferrer noopener" className="doc-book-btn">
                        Book Consultation
                      </a>
                    ) : (
                      <button className="doc-book-btn" disabled style={{ opacity: 0.5 }}>Book Consultation</button>
                    )}
                    <div className="doc-social-icons">
                      {featured.googleMapsLink && (
                        <a href={featured.googleMapsLink} target="_blank" rel="noreferrer noopener" className="doc-social-icon" title="Google Maps"><MapIcon /></a>
                      )}
                      {featured.instagramHandle && (
                        <a href={`https://www.instagram.com/${featured.instagramHandle}`} target="_blank" rel="noreferrer noopener" className="doc-social-icon" title="Instagram"><IgIcon /></a>
                      )}
                      <a href={buildJDUrl(featured.clinic, city)} target="_blank" rel="noreferrer noopener" className="doc-social-icon" title="JustDial">
                        <span style={{ fontSize: 9, fontWeight: 800 }}>JD</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Top Rated doctor */}
            {topRated && (
              <div className="top-rated-doc-card">
                <div className="top-rated-badge">TOP RATED SPECIALIST</div>
                <div className="top-rated-header">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 className="top-rated-name">{topRated.name}</h3>
                    <p className="top-rated-clinic">{topRated.clinic}</p>
                    <StarRating rating={topRated.rating} />
                  </div>
                  <div className="top-rated-photo-wrap">
                    {topImgOk ? (
                      <img
                        src={getDoctorPhoto(topRated.name, 1)}
                        alt={topRated.name}
                        className="top-rated-photo"
                        onError={() => setTopImgOk(false)}
                      />
                    ) : (
                      <DoctorAvatar name={topRated.name} idx={1} size={58} />
                    )}
                  </div>
                </div>
                <p className="top-rated-known-for">
                  <strong>Known for:</strong> advanced skin therapies and surgical treatments in dermatology
                </p>
                <div className="top-rated-footer">
                  <span className="top-rated-fee">{topRated.priceRange ?? '₹1,000–₹2,500'}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {topRated.googleMapsLink && (
                      <a href={topRated.googleMapsLink} target="_blank" rel="noreferrer noopener" className="doc-social-icon"><MapIcon /></a>
                    )}
                    {topRated.instagramHandle && (
                      <a href={`https://www.instagram.com/${topRated.instagramHandle}`} target="_blank" rel="noreferrer noopener" className="doc-social-icon"><IgIcon /></a>
                    )}
                    <a href={buildJDUrl(topRated.clinic, city)} target="_blank" rel="noreferrer noopener" className="doc-social-icon" title="JustDial">
                      <span style={{ fontSize: 9, fontWeight: 800 }}>JD</span>
                    </a>
                    {topBookUrl && (
                      <a href={topBookUrl} target="_blank" rel="noreferrer noopener" className="doc-book-btn" style={{ fontSize: 11, padding: '6px 12px' }}>
                        Book
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* More specialists grid */}
          {otherDoctors.length > 0 && (
            <>
              <div className="doctors-section-label">More Specialists in {city}</div>
              <div className="specialist-cards-grid">
                {otherDoctors.map((doc, i) => (
                  <SmallDoctorCard key={i} doc={doc} idx={i + 2} />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Urgent CTA */}
      <div className="urgent-eval-section">
        <h3 className="urgent-eval-title">Need an urgent evaluation?</h3>
        <p className="urgent-eval-desc">
          Upload a high-resolution scan of your skin condition for an AI-powered preliminary report before your visit.
        </p>
        <button onClick={onScanClick} className="btn-glow" style={{ fontSize: 14, padding: '12px 28px' }}>
          🔍 Start AI Skin Scan
        </button>
      </div>
    </div>
  );
}

/* ── Page shell ─────────────────────────────────────────────────────────── */
export default function Specialists() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { premium, refresh: refreshPremium } = usePremium(user ?? null);
  const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email);
  const hasFullAccess = isAdmin || premium;
  const [showPremium, setShowPremium] = useState(false);

  const cities = Object.keys(DERMATOLOGISTS);
  const [city, setCity] = useState('Delhi');
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const doctors = DERMATOLOGISTS[city] ?? [];
  const [featured, ...rest] = doctors;

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return ALL_DOCTORS.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.clinic.toLowerCase().includes(q) ||
      d.specialty.toLowerCase().includes(q) ||
      d.city.toLowerCase().includes(q)
    );
  }, [searchQuery]);

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

  const contentProps: ContentProps = {
    city, setCity, locating, locError, handleLocate,
    searchQuery, searchResults, cities, doctors,
    featured, rest, onScanClick: () => navigate('/scan'),
  };

  return (
    <AppLayout>
      {showPremium && user && (
        <PremiumModal
          user={user}
          onClose={() => setShowPremium(false)}
          onUpgraded={() => { setShowPremium(false); refreshPremium(); }}
        />
      )}

      <div className="page-specialists fade-in">
        {/* Search */}
        <div className="specialists-search-bar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, clinic, specialty or city…"
            className="specialists-search-input"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="specialists-search-clear">✕</button>
          )}
        </div>

        {!hasFullAccess ? (
          <div className="locked-section">
            <div className="locked-blur-preview" aria-hidden="true">
              <SpecialistsContent {...contentProps} />
            </div>
            <div className="locked-overlay">
              <div className="locked-overlay-inner">
                <div style={{ fontSize: 44, marginBottom: 12 }}>🔒</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
                  Unlock Specialist Finder
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 20px', lineHeight: 1.6, maxWidth: 280 }}>
                  Find verified dermatologists near you, book consultations, and get expert skin care advice.
                </p>
                <button onClick={() => setShowPremium(true)} className="btn-glow"
                  style={{ justifyContent: 'center', fontSize: 14, padding: '12px 28px' }}>
                  🚀 Try Full Access — ₹25 for 7 days
                </button>
                <p style={{ fontSize: 11, color: 'var(--text-hint)', marginTop: 10 }}>
                  Then just ₹49/month · Cancel anytime · No surprises
                </p>
              </div>
            </div>
          </div>
        ) : (
          <SpecialistsContent {...contentProps} />
        )}
      </div>
    </AppLayout>
  );
}
