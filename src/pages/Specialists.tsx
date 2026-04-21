import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DERMATOLOGISTS, CITY_COORDS } from '../data/dermatologists';
import AppLayout from '../components/AppLayout';
import { useLanguage } from '../context/LanguageContext';
import { T } from '../data/translations';
import { useAuth } from '../lib/supabase';
import { usePremium } from '../hooks/usePremium';
import PremiumModal from '../components/PremiumModal';

const ADMIN_EMAILS = ['lamba.akash1994@gmail.com', 'varunvlamba@gmail.com'];

const FEMALE_PHOTOS = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=85&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=85&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&q=85&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&q=85&fit=crop&crop=face',
];
const MALE_PHOTOS = [
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=85&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=85&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=85&fit=crop&crop=face',
];

const FEMALE_NAMES = new Set([
  'Archana','Deepti','Shweta','Priya','Ritu','Neha','Lipy','Monica','Deepali','Niti',
  'Sonal','Renu','Shrilata','Rinky','Sejal','Harshna','Geeta','Shefali','Madhuri',
  'Rasya','Swetha','Navya','Deepika','Chaitra','Pooja','Vandana','Janani','Uma',
  'Meena','Sudha','Lakshmi','Sneha','Anita','Geetika','Nidhi','Aparna','Rekha',
  'Seema','Sunita','Kavitha','Usha','Nisha','Divya','Swati','Pallavi','Vatsan',
]);

function getDoctorPhoto(name: string, idx: number): string {
  const firstName = name.split(' ').slice(1).find(p => p.length > 1) ?? '';
  const isFemale = FEMALE_NAMES.has(firstName);
  return isFemale
    ? FEMALE_PHOTOS[idx % FEMALE_PHOTOS.length]
    : MALE_PHOTOS[idx % MALE_PHOTOS.length];
}

function getNearestCity(lat: number, lng: number): string {
  let nearest = 'Delhi';
  let minDist = Infinity;
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    const dist = Math.sqrt(Math.pow(lat - coords.lat, 2) + Math.pow(lng - coords.lng, 2));
    if (dist < minDist) { minDist = dist; nearest = city; }
  }
  return nearest;
}

const ALL_DOCTORS = Object.entries(DERMATOLOGISTS).flatMap(([city, doctors]) =>
  doctors.map(doc => ({ ...doc, city }))
);

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width="12" height="12" viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? '#f59e0b' : 'none'}
          stroke="#f59e0b" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 700, marginLeft: 3 }}>{rating}</span>
    </div>
  );
}

function SmallDoctorCard({ doc, idx }: { doc: any; idx: number }) {
  return (
    <div className="small-doc-card">
      <div className="small-doc-photo-wrap">
        <img
          src={getDoctorPhoto(doc.name, idx)}
          alt={doc.name}
          className="small-doc-photo"
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
      <div className="small-doc-body">
        <div className="small-doc-name">{doc.name}</div>
        <div className="small-doc-specialty">{doc.specialty}</div>
        <StarRating rating={doc.rating} />
        {doc.priceRange && <div className="small-doc-fee">{doc.priceRange}</div>}
        {doc.googleMapsLink ? (
          <a
            href={doc.googleMapsLink}
            target="_blank"
            rel="noreferrer noopener"
            className="small-doc-book-btn"
          >
            Book
          </a>
        ) : (
          <span className="small-doc-book-btn" style={{ opacity: 0.5, cursor: 'default' }}>Book</span>
        )}
      </div>
    </div>
  );
}

function MapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function IgIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

interface SpecialistsContentProps {
  city: string;
  setCity: (c: string) => void;
  locating: boolean;
  locError: string | null;
  handleLocate: () => void;
  searchQuery: string;
  searchResults: any[] | null;
  cities: string[];
  doctors: any[];
  featured: any;
  rest: any[];
  onScanClick: () => void;
}

function SpecialistsContent({
  city, setCity, locating, locError, handleLocate,
  searchQuery, searchResults, cities, featured, rest, onScanClick,
}: SpecialistsContentProps) {
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const topRated = rest[0];
  const smallCards = rest.slice(1, 4);

  const specialtyTags = featured
    ? featured.specialty.split(/\s*[&,]\s*/).filter(Boolean)
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Clinical Perspective Card */}
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
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              verified by AI-based medical inputs
            </div>
          </div>
        </div>
      </div>

      {/* Section Header + Filter Bar */}
      <div className="specialists-section-header">
        <div>
          <h2 className="specialists-nearby-title">Specialists Near You</h2>
          <p className="specialists-nearby-sub">Top-rated dermatology clinics in your vicinity.</p>
        </div>
        <div className="specialists-filter-bar">
          <div className="city-filter-chip">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
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
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
                <line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              Filters
            </button>
            {showCityDropdown && (
              <div className="city-filter-dropdown">
                {cities.map(c => (
                  <button
                    key={c}
                    className={`city-filter-option${city === c ? ' active' : ''}`}
                    onClick={() => { setCity(c); setShowCityDropdown(false); }}
                  >
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
          <div className="doctors-section-label" style={{ marginBottom: 12 }}>
            {searchResults.length > 0
              ? `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${searchQuery}"`
              : `No results for "${searchQuery}"`}
          </div>
          {searchResults.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '40px 20px', background: 'var(--bg-card)',
              border: '1px solid var(--border)', borderRadius: 14, color: 'var(--text-muted)', fontSize: 14,
            }}>
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
          {/* Hero: Featured + Top Rated */}
          <div className="specialist-hero-grid">

            {/* Featured Doctor — large card */}
            {featured && (
              <div className="featured-doc-card">
                <div className="featured-doc-photo-wrap">
                  <img
                    src={getDoctorPhoto(featured.name, 0)}
                    alt={featured.name}
                    className="featured-doc-photo"
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <div className="featured-doc-info">
                  <div className="featured-doc-specialties">
                    {specialtyTags.map((tag: string, i: number) => (
                      <span key={i} className="doc-specialty-tag">{tag}</span>
                    ))}
                    {!featured.specialty.toLowerCase().includes('dermatosurgery') && (
                      <span className="doc-specialty-tag doc-specialty-tag-alt">Dermatosurgery</span>
                    )}
                  </div>
                  <h3 className="featured-doc-name">{featured.name}</h3>
                  <p className="featured-doc-clinic">{featured.clinic}</p>
                  <div className="featured-doc-fee-row">
                    <StarRating rating={featured.rating} />
                    <span className="featured-doc-fee">
                      Consultation · {featured.priceRange ?? '₹900–₹1,500'}
                    </span>
                  </div>
                  <div className="featured-doc-actions">
                    {featured.googleMapsLink ? (
                      <a
                        href={featured.googleMapsLink}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="doc-book-btn"
                      >
                        Book Consultation
                      </a>
                    ) : (
                      <button className="doc-book-btn">Book Consultation</button>
                    )}
                    <div className="doc-social-icons">
                      {featured.googleMapsLink && (
                        <a href={featured.googleMapsLink} target="_blank" rel="noreferrer noopener" className="doc-social-icon" title="Google Maps">
                          <MapIcon />
                        </a>
                      )}
                      {featured.instagramHandle && (
                        <a href={`https://www.instagram.com/${featured.instagramHandle}`} target="_blank" rel="noreferrer noopener" className="doc-social-icon" title="Instagram">
                          <IgIcon />
                        </a>
                      )}
                      {featured.justDialLink && (
                        <a href={featured.justDialLink} target="_blank" rel="noreferrer noopener" className="doc-social-icon" title="JustDial">
                          <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 0 }}>JD</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Top Rated Doctor */}
            {topRated && (
              <div className="top-rated-doc-card">
                <div className="top-rated-badge">TOP RATED SPECIALIST</div>
                <div className="top-rated-header">
                  <div style={{ flex: 1 }}>
                    <h3 className="top-rated-name">{topRated.name}</h3>
                    <p className="top-rated-clinic">{topRated.clinic}</p>
                    <StarRating rating={topRated.rating} />
                  </div>
                  <img
                    src={getDoctorPhoto(topRated.name, 1)}
                    alt={topRated.name}
                    className="top-rated-photo"
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <p className="top-rated-known-for">
                  <strong>Known for:</strong> advanced skin therapies and surgical treatments in dermatology
                </p>
                <div className="top-rated-footer">
                  <span className="top-rated-fee">{topRated.priceRange ?? '₹3,000'}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {topRated.googleMapsLink && (
                      <a href={topRated.googleMapsLink} target="_blank" rel="noreferrer noopener" className="doc-social-icon">
                        <MapIcon />
                      </a>
                    )}
                    {topRated.instagramHandle && (
                      <a href={`https://www.instagram.com/${topRated.instagramHandle}`} target="_blank" rel="noreferrer noopener" className="doc-social-icon">
                        <IgIcon />
                      </a>
                    )}
                    {topRated.justDialLink && (
                      <a href={topRated.justDialLink} target="_blank" rel="noreferrer noopener" className="doc-social-icon">
                        <span style={{ fontSize: 9, fontWeight: 800 }}>JD</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* More Specialists — small cards */}
          {smallCards.length > 0 && (
            <div className="specialist-cards-grid">
              {smallCards.map((doc: any, i: number) => (
                <SmallDoctorCard key={i} doc={doc} idx={i + 2} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Urgent Evaluation CTA */}
      <div className="urgent-eval-section">
        <h3 className="urgent-eval-title">Need an urgent evaluation?</h3>
        <p className="urgent-eval-desc">
          Upload a high-resolution scan of your skin condition for an AI-powered
          preliminary report before your visit.
        </p>
        <button onClick={onScanClick} className="btn-glow" style={{ fontSize: 14, padding: '12px 28px' }}>
          🔍 Start AI Skin Scan
        </button>
      </div>
    </div>
  );
}

export default function Specialists() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = T[lang];
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
    return ALL_DOCTORS.filter(doc =>
      doc.name.toLowerCase().includes(q) ||
      doc.clinic.toLowerCase().includes(q) ||
      doc.specialty.toLowerCase().includes(q) ||
      doc.city.toLowerCase().includes(q)
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

  // Suppress unused variable warning for t
  void t;

  const contentProps: SpecialistsContentProps = {
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

        {/* Search bar — always visible */}
        <div className="specialists-search-bar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
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
                <button
                  onClick={() => setShowPremium(true)}
                  className="btn-glow"
                  style={{ justifyContent: 'center', fontSize: 14, padding: '12px 28px' }}
                >
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
