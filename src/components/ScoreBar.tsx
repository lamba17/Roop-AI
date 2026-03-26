import { useEffect, useState } from 'react';

interface ScoreBarProps {
  label: string;
  score: number;
  delay?: number;
}

function barColor(score: number) {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

export default function ScoreBar({ label, score, delay = 0 }: ScoreBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(score), delay + 200);
    return () => clearTimeout(timer);
  }, [score, delay]);

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: '#888' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: barColor(score) }}>{score}</span>
      </div>
      <div style={{ height: 6, background: '#1e1e3a', borderRadius: 999, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${width}%`,
            background: barColor(score),
            borderRadius: 999,
            transition: `width 1.2s cubic-bezier(.4,0,.2,1) ${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}
