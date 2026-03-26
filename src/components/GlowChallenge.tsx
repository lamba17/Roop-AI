import { useLocalStorage } from '../hooks/useLocalStorage';

export default function GlowChallenge() {
  const [days, setDays] = useLocalStorage<number>('glow_challenge_days', 0);

  function markDone() {
    if (days < 7) setDays(days + 1);
  }

  function reset() {
    setDays(0);
  }

  if (days >= 7) {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🎉</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#22c55e', marginBottom: 8 }}>Challenge Complete!</div>
        <p style={{ fontSize: 14, color: '#888', marginBottom: 16 }}>You completed the 7-Day Glow Challenge!</p>
        <button onClick={reset} className="btn-outline" style={{ fontSize: 13 }}>Start Again</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} style={{
            width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700,
            background: i < days ? '#f59e0b' : '#1e1e3a',
            color: i < days ? '#080818' : '#555',
            border: i === days ? '2px solid #f59e0b' : '2px solid transparent',
          }}>
            {i < days ? '✓' : i + 1}
          </div>
        ))}
      </div>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 14 }}>
        Day {days + 1} of 7 — Keep up your skincare routine!
      </p>
      <button onClick={markDone} className="btn-primary" style={{ fontSize: 14, padding: '10px 22px' }}>
        ✅ Mark Day {days + 1} Done
      </button>
    </div>
  );
}
