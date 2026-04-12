import { useEffect, useState } from 'react';
import { DERMATOLOGISTS, CITY_COORDS } from '../data/dermatologists';
import AppLayout from '../components/AppLayout';
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

export default function Specialists() {
  const { lang } = useLanguage();
  const t = T[lang];
  const cities = Object.keys(DERMATOLOGISTS);
  const [city, setCity] = useState('Delhi');
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const doctors = DERMATOLOGISTS[city] ?? [];
  const [featured, ...rest] = doctors;

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
    <AppLayout>
      <div className="page-specialists fade-in">
        {/* Header */}
        <div className="specialists-header">
          <span className="page-eyebrow">Expert Care</span>
          <h1 className="specialists-title">
            Find a <span className="gradient-text">Dermatologist</span>
          </h1>
        </div>

        <div className="specialists-layout">
          {/* Left Column */}
          <div className="specialists-main">
            {/* Clinical Perspective Quote */}
            <div className="clinical-quote-card">
              <div className="clinical-quote-icon">🩺</div>
              <blockquote className="clinical-quote-text">
                "Regular dermatological check-ups combined with an AI-powered skincare routine can
                dramatically improve your skin health outcomes. Early intervention is the key to
                long-term skin wellness."
              </blockquote>
              <div className="clinical-quote-attr">— Clinical Perspective, ROOP AI Advisory Board</div>
            </div>

            {/* Location bar */}
            <div className="specialists-location-bar">
              <div className="specialists-location-title">
                {t.specialistsNear}
              </div>
              <div className="specialists-location-controls">
                <button onClick={handleLocate} className="btn-locate">
                  {locating ? '⏳' : '📍'} {locating ? t.locating : t.nearMe}
                </button>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="city-select"
                >
                  {cities.map(c => <option key={c} value={c}>{c}, India</option>)}
                </select>
              </div>
              {locError && <p className="loc-error">⚠️ {locError}</p>}
            </div>

            {/* Featured Doctor */}
            {featured && (
              <div className="doctor-featured-card">
                <div className="doctor-featured-left">
                  <div className="doctor-featured-avatar">
                    {featured.name.split(' ').slice(-1)[0].charAt(0)}
                  </div>
                  <div>
                    <div className="doctor-featured-name">{featured.name}</div>
                    <div className="doctor-featured-specialty">{featured.specialty}</div>
                    <div className="doctor-featured-clinic">{featured.clinic}</div>
                    {featured.priceRange && (
                      <div className="doctor-price">💰 {featured.priceRange}</div>
                    )}
                    <div className="doctor-featured-rating">
                      ⭐ {featured.rating} · Featured Specialist
                    </div>
                  </div>
                </div>
                <div className="doctor-featured-actions">
                  {featured.googleMapsLink && (
                    <a
                      href={featured.googleMapsLink}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="btn-book-consultation"
                    >
                      Book Consultation
                    </a>
                  )}
                  <div className="doctor-social-links">
                    {featured.instagramHandle && (
                      <a
                        href={`https://www.instagram.com/${featured.instagramHandle}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="doctor-social-btn ig-btn"
                      >
                        IG
                      </a>
                    )}
                    {featured.justDialLink && (
                      <a
                        href={featured.justDialLink}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="doctor-social-btn jd-btn"
                      >
                        JD
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Top Rated + More Doctors */}
            {rest.length > 0 && (
              <>
                {/* Second doctor as "top rated" */}
                <div className="doctors-section-label">More Specialists</div>
                <div className="doctors-grid">
                  {rest.map((doc, i) => (
                    <div key={i} className="doctor-card">
                      <div className="doctor-card-top">
                        <div className="doctor-card-avatar">
                          {doc.name.split(' ').slice(-1)[0].charAt(0)}
                        </div>
                        <div className="doctor-card-rating">⭐ {doc.rating}</div>
                      </div>
                      <div className="doctor-card-name">{doc.name}</div>
                      <div className="doctor-card-clinic">{doc.clinic}</div>
                      <span className="doctor-card-specialty">{doc.specialty}</span>
                      {doc.priceRange && (
                        <div className="doctor-card-price">💰 {doc.priceRange}</div>
                      )}
                      <div className="doctor-card-links">
                        {doc.googleMapsLink && (
                          <a href={doc.googleMapsLink} target="_blank" rel="noreferrer noopener"
                            className="doctor-link-btn maps-btn">
                            {t.maps}
                          </a>
                        )}
                        {doc.instagramHandle && (
                          <a href={`https://www.instagram.com/${doc.instagramHandle}`} target="_blank" rel="noreferrer noopener"
                            className="doctor-link-btn ig-btn-sm">
                            IG
                          </a>
                        )}
                        {doc.justDialLink && (
                          <a href={doc.justDialLink} target="_blank" rel="noreferrer noopener"
                            className="doctor-link-btn jd-btn-sm">
                            JD
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right sidebar */}
          <div className="specialists-sidebar">
            {/* Urgent evaluation CTA */}
            <div className="urgent-eval-card">
              <div className="urgent-eval-icon">⚡</div>
              <div className="urgent-eval-title">Need an urgent evaluation?</div>
              <div className="urgent-eval-desc">
                If you're experiencing severe acne, rashes, or sudden skin changes, consult a specialist immediately.
              </div>
              <a
                href={`https://www.practo.com/search/doctors?results_type=doctor&q=%5B%7B%22word%22%3A%22dermatologist%22%7D%5D&city=${encodeURIComponent(city)}`}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-glow"
                style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '11px' }}
              >
                Find on Practo
              </a>
            </div>

            {/* City stats */}
            <div className="city-stats-card">
              <div className="section-label">Showing in {city}</div>
              <div className="city-stats-num">{doctors.length}</div>
              <div className="city-stats-label">Verified Specialists</div>
              <div className="city-stat-row">
                <span>Avg. Rating</span>
                <span style={{ color: '#f59e0b' }}>
                  ⭐ {doctors.length > 0
                    ? (doctors.reduce((a, d) => a + d.rating, 0) / doctors.length).toFixed(1)
                    : '—'}
                </span>
              </div>
              <div className="city-stat-row">
                <span>With Maps</span>
                <span style={{ color: '#22c55e' }}>
                  {doctors.filter(d => d.googleMapsLink).length} doctors
                </span>
              </div>
            </div>

            {/* Doctor Advice reminder */}
            <div className="derm-reminder-card">
              <div className="section-label">Reminder</div>
              <p className="derm-reminder-text">
                ROOP AI analysis complements — but does not replace — professional dermatological advice. Always consult a qualified dermatologist for medical concerns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
