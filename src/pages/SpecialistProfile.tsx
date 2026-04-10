import { useParams, useNavigate } from 'react-router-dom';
import { DERMATOLOGISTS } from '../data/dermatologists';
import AppLayout from '../components/AppLayout';

export default function SpecialistProfile() {
  const { city, index } = useParams<{ city: string; index: string }>();
  const navigate = useNavigate();

  const doctors = city ? DERMATOLOGISTS[city] ?? [] : [];
  const doc = doctors[parseInt(index ?? '0', 10)];

  if (!doc) {
    return (
      <AppLayout>
        <div className="page-empty">
          <p>Specialist not found.</p>
          <button onClick={() => navigate('/specialists')} className="btn-primary">
            Back to Specialists
          </button>
        </div>
      </AppLayout>
    );
  }

  const patientVoices = [
    {
      initials: 'SM',
      name: 'Sarah Mitchell',
      rating: 5,
      review: `${doc.name} completely changed my skin journey. The approach to dermatology was painless and the results are incredibly natural. Highly recommend!`,
    },
    {
      initials: 'AJ',
      name: 'Ananya Joshi',
      rating: 5,
      review: `The experience was top-notch. ${doc.name} takes time to explain every detail. My skin has never looked more luminous.`,
    },
  ];

  return (
    <AppLayout>
      <div className="page-specialist-profile fade-in">
        {/* Back button */}
        <button onClick={() => navigate('/specialists')} className="back-btn">
          ← Back to Specialists
        </button>

        {/* Profile hero */}
        <div className="profile-hero">
          <div className="profile-hero-image">
            <div className="profile-avatar-large">
              {doc.name.split(' ').slice(-1)[0].charAt(0)}
            </div>
          </div>

          <div className="profile-hero-info">
            <div className="profile-specialty-badge">{doc.specialty}</div>
            <h1 className="profile-name">
              {doc.name.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="gradient-text">{doc.name.split(' ').slice(-1)[0]}</span>
            </h1>
            <div className="profile-title">Dermatologist & Aesthetic Specialist</div>
            <p className="profile-bio">
              With over 10 years of clinical excellence, {doc.name} blends medical precision with
              artistic finesse at {doc.clinic}. Their philosophy centres on empowering patients
              through science-backed routines and advanced aesthetic interventions.
            </p>

            {/* Specialty tags */}
            <div className="profile-tags">
              <span className="profile-tag">{doc.specialty}</span>
              <span className="profile-tag">Dermatosurgery</span>
              <span className="profile-tag">Laser Therapy</span>
            </div>

            {/* Actions */}
            <div className="profile-actions">
              {doc.googleMapsLink && (
                <a
                  href={doc.googleMapsLink}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-glow"
                >
                  Book Appointment
                </a>
              )}
              {doc.instagramHandle && (
                <a
                  href={`https://www.instagram.com/${doc.instagramHandle}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="profile-share-btn"
                  title="Instagram"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="profile-stats">
          <div className="profile-stat-card">
            <div className="stat-icon">🎓</div>
            <div className="stat-label">Qualifications</div>
            <div className="stat-content">
              <div className="stat-line">MD in Dermatology, Venereology & Leprology</div>
              <div className="stat-line">Fellowship in Aesthetic Medicine (FALI)</div>
              <div className="stat-line">Board Certified Dermatosurgeon</div>
            </div>
          </div>
          <div className="profile-stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-label">Patient Rating</div>
            <div className="stat-rating">
              <span className="stat-rating-num">{doc.rating}</span>
              <span className="stat-rating-denom">/5</span>
            </div>
            <div className="stat-content">
              <div className="stat-line">Based on 200+ successful transformations and clinical consultations this year.</div>
            </div>
          </div>
          <div className="profile-stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-label">Experience</div>
            <div className="stat-exp">12+ <span>Years</span></div>
            <div className="stat-content">
              <div className="stat-line">Practising at leading skincare institutions globally.</div>
            </div>
          </div>
        </div>

        {/* Patient Voices */}
        <div className="patient-voices">
          <div className="voices-header">
            <h3 className="voices-title">Patient Voices</h3>
            <button className="voices-link">View All Reviews</button>
          </div>
          <div className="voices-grid">
            {patientVoices.map((v, i) => (
              <div key={i} className="voice-card">
                <div className="voice-header">
                  <div className="voice-avatar">{v.initials}</div>
                  <div>
                    <div className="voice-name">{v.name}</div>
                    <div className="voice-stars">{'⭐'.repeat(v.rating)}</div>
                  </div>
                </div>
                <p className="voice-text">"{v.review}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Clinic info */}
        {doc.priceRange && (
          <div className="profile-clinic-card">
            <div className="section-label">Consultation Details</div>
            <div className="clinic-detail-row">
              <span>Clinic</span>
              <span>{doc.clinic}</span>
            </div>
            <div className="clinic-detail-row">
              <span>Fee Range</span>
              <span style={{ color: '#a855f7' }}>{doc.priceRange}</span>
            </div>
            {doc.googleMapsLink && (
              <a
                href={doc.googleMapsLink}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-outline"
                style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}
              >
                📍 View on Maps
              </a>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
