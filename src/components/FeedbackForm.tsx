import { useState } from 'react';
import { submitFeedback } from '../lib/supabase';

interface FeedbackFormProps {
  entryId: string;
  glowScore: number;
  skinType: string;
}

const SUBMITTED_KEY_PREFIX = 'roop_feedback_submitted_';

function StarRow({
  value,
  onChange,
  label,
  color,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  color: string;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div style={{ marginBottom: 18 }}>
      <p style={{ margin: '0 0 8px', fontSize: 13, color: '#888888', letterSpacing: '1px', textTransform: 'uppercase' }}>
        {label}
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const active = star <= (hovered || value);
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 2,
                fontSize: 28,
                color: active ? color : '#1e1e3a',
                filter: active ? 'drop-shadow(0 0 4px ' + color + '80)' : 'none',
                transition: 'color 0.15s, filter 0.15s',
                lineHeight: 1,
              }}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
            >
              ★
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function FeedbackForm({ entryId, glowScore, skinType }: FeedbackFormProps) {
  const submittedKey = SUBMITTED_KEY_PREFIX + entryId;
  const alreadySubmitted = localStorage.getItem(submittedKey) === 'true';

  const [rating, setRating] = useState(0);
  const [accuracyRating, setAccuracyRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(alreadySubmitted);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (submitted) {
    return (
      <div
        className="card"
        style={{
          border: '1px solid rgba(168,85,247,0.3)',
          textAlign: 'center',
          padding: '32px 22px',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>🙏</div>
        <p
          style={{
            fontSize: 18,
            fontWeight: 700,
            background: 'linear-gradient(135deg,#a855f7,#ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 8px',
          }}
        >
          Thank you for your feedback!
        </p>
        <p style={{ fontSize: 13, color: '#888888', margin: 0 }}>
          Your input helps us improve ROOP AI for everyone.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0 || accuracyRating === 0) {
      setError('Please give a star rating for both fields before submitting.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await submitFeedback({
        glow_score: glowScore,
        skin_type: skinType,
        rating,
        accuracy_rating: accuracyRating,
        comment: comment.trim() || null,
      });
      localStorage.setItem(submittedKey, 'true');
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="card"
      style={{ border: '1px solid rgba(168,85,247,0.2)' }}
    >
      <span className="section-label">Share Your Experience</span>

      <p
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: '#e8e8f0',
          margin: '4px 0 20px',
        }}
      >
        How was your skin analysis?
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <StarRow
          label="Overall Rating"
          value={rating}
          onChange={setRating}
          color="#f59e0b"
        />

        <StarRow
          label="How accurate was your skin analysis?"
          value={accuracyRating}
          onChange={setAccuracyRating}
          color="#f59e0b"
        />

        <div style={{ marginBottom: 20 }}>
          <p
            style={{
              margin: '0 0 8px',
              fontSize: 13,
              color: '#888888',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            Any suggestions? (optional)
          </p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us how we can improve…"
            maxLength={500}
            rows={3}
            style={{
              width: '100%',
              background: '#080818',
              border: '1px solid #1e1e3a',
              borderRadius: 10,
              color: '#e8e8f0',
              fontSize: 14,
              padding: '10px 14px',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit',
              lineHeight: 1.6,
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#a855f7')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#1e1e3a')}
          />
          <p style={{ fontSize: 11, color: '#555566', margin: '4px 0 0', textAlign: 'right' }}>
            {comment.length}/500
          </p>
        </div>

        {error && (
          <p
            style={{
              fontSize: 13,
              color: '#ef4444',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8,
              padding: '8px 12px',
              margin: '0 0 16px',
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', fontSize: 14 }}
        >
          {loading ? (
            <>
              <span
                style={{
                  width: 16,
                  height: 16,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              Submitting…
            </>
          ) : (
            'Submit Feedback'
          )}
        </button>
      </form>
    </div>
  );
}
