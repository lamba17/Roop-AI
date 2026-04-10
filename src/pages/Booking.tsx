import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DERMATOLOGISTS } from '../data/dermatologists';
import AppLayout from '../components/AppLayout';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['MON','TUE','WED','THU','FRI','SAT','SUN'];

const MORNING_SLOTS = ['09:00 AM', '10:30 AM'];
const AFTERNOON_SLOTS = ['01:45 PM', '03:00 PM'];
const EVENING_SLOTS = ['05:30 PM', '07:00 PM'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  // 0=Sun, adjust to Mon=0
  const d = new Date(year, month, 1).getDay();
  return (d + 6) % 7;
}

export default function Booking() {
  const { city, index } = useParams<{ city: string; index: string }>();
  const navigate = useNavigate();

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState(now.getDate());
  const [selectedSlot, setSelectedSlot] = useState('01:45 PM');
  const [confirmed, setConfirmed] = useState(false);

  const doctors = city ? DERMATOLOGISTS[city] ?? [] : [];
  const doc = doctors[parseInt(index ?? '0', 10)];

  if (!doc) {
    return (
      <AppLayout>
        <div className="page-empty">
          <p>Doctor not found.</p>
          <button onClick={() => navigate('/specialists')} className="btn-primary">
            Back to Specialists
          </button>
        </div>
      </AppLayout>
    );
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const selectedDate = new Date(viewYear, viewMonth, selectedDay);
  const dateStr = selectedDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  if (confirmed) {
    return (
      <AppLayout>
        <div className="booking-confirmed fade-in">
          <div className="confirmed-icon">✅</div>
          <h2 className="confirmed-title">Booking Confirmed!</h2>
          <p className="confirmed-desc">
            Your appointment with <strong>{doc.name}</strong> is scheduled for{' '}
            <strong>{dateStr}</strong> at <strong>{selectedSlot}</strong>.
          </p>
          <div className="confirmed-details">
            <div className="confirmed-row"><span>Doctor</span><span>{doc.name}</span></div>
            <div className="confirmed-row"><span>Clinic</span><span>{doc.clinic}</span></div>
            <div className="confirmed-row"><span>Date</span><span>{dateStr}</span></div>
            <div className="confirmed-row"><span>Time</span><span>{selectedSlot} (45 min)</span></div>
            {doc.priceRange && <div className="confirmed-row"><span>Fee Range</span><span>{doc.priceRange}</span></div>}
          </div>
          <div className="confirmed-actions">
            {doc.googleMapsLink && (
              <a href={doc.googleMapsLink} target="_blank" rel="noreferrer noopener" className="btn-outline">
                📍 Get Directions
              </a>
            )}
            <button onClick={() => navigate('/specialists')} className="btn-primary">
              Back to Specialists
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="page-booking fade-in">
        {/* Back */}
        <button onClick={() => navigate('/specialists')} className="back-btn">
          ← Back to Specialists
        </button>

        {/* Header */}
        <div className="booking-header">
          <h1 className="booking-title">Reserve Your <span className="gradient-text">Glow</span></h1>
          <p className="booking-subtitle">
            Select your preferred date and time for a personalized consultation with our senior skin specialists.
          </p>
        </div>

        <div className="booking-layout">
          {/* Left: Calendar + Slots */}
          <div className="booking-main">
            {/* Calendar */}
            <div className="booking-calendar">
              <div className="calendar-header">
                <span className="calendar-month-label">{MONTHS[viewMonth]} {viewYear}</span>
                <div className="calendar-nav">
                  <button onClick={prevMonth} className="cal-nav-btn">‹</button>
                  <button onClick={nextMonth} className="cal-nav-btn">›</button>
                </div>
              </div>
              <div className="calendar-grid">
                {DAYS.map(d => (
                  <div key={d} className="cal-day-header">{d}</div>
                ))}
                {cells.map((day, i) => (
                  <div
                    key={i}
                    className={`cal-day ${day === null ? 'cal-day-empty' : ''} ${day === selectedDay && viewMonth === now.getMonth() && viewYear === now.getFullYear() ? 'cal-day-selected' : ''} ${day !== null && day < now.getDate() && viewMonth === now.getMonth() && viewYear === now.getFullYear() ? 'cal-day-past' : ''}`}
                    onClick={() => day !== null && setSelectedDay(day)}
                  >
                    {day ?? ''}
                  </div>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="booking-slots">
              <div className="slots-section-label">Available Slots</div>

              {[
                { label: 'MORNING', slots: MORNING_SLOTS },
                { label: 'AFTERNOON', slots: AFTERNOON_SLOTS },
                { label: 'EVENING', slots: EVENING_SLOTS },
              ].map(group => (
                <div key={group.label} className="slots-group">
                  <div className="slots-group-label">{group.label}</div>
                  <div className="slots-row">
                    {group.slots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`slot-btn ${selectedSlot === slot ? 'slot-btn-active' : ''}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Doctor card + summary */}
          <div className="booking-sidebar">
            {/* Doctor card */}
            <div className="booking-doctor-card">
              <div className="booking-doc-avatar">
                {doc.name.split(' ').slice(-1)[0].charAt(0)}
                <span className="booking-doc-online" />
              </div>
              <div className="booking-doc-name">{doc.name}</div>
              <div className="booking-doc-title">{doc.specialty.toUpperCase()}</div>
            </div>

            {/* Booking summary */}
            <div className="booking-summary">
              <div className="summary-row">
                <span className="summary-label">Date</span>
                <span className="summary-val">{dateStr}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Time</span>
                <span className="summary-val">{selectedSlot} (45 mins)</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Service</span>
                <span className="summary-val">Advanced AI Skin Mapping</span>
              </div>
              {doc.priceRange && (
                <div className="summary-row summary-total">
                  <span className="summary-label">Est. Fee</span>
                  <span className="summary-total-val">{doc.priceRange}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setConfirmed(true)}
              className="btn-glow"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Confirm Booking
            </button>

            <div className="booking-security">
              <span>🔒</span>
              <span>Secure Booking · HIPAA-Compliant Data Storage</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
