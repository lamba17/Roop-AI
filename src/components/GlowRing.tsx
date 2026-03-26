import { useEffect, useState } from 'react';

interface GlowRingProps {
  score: number;
  size?: number;
}

function glowColor(score: number) {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

export default function GlowRing({ score, size = 140 }: GlowRingProps) {
  const [displayed, setDisplayed] = useState(0);
  const r = 54;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (displayed / 100) * circumference;

  useEffect(() => {
    setDisplayed(0);
    const start = Date.now();
    const duration = 1200;
    const target = score;
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * target));
      if (progress >= 1) clearInterval(tick);
    }, 16);
    return () => clearInterval(tick);
  }, [score]);

  const color = glowColor(score);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a1a2e" strokeWidth={10} />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
        strokeDashoffset={circumference * 0.25}
        style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(.4,0,.2,1)' }}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text x={cx} y={cy - 6} textAnchor="middle" fill={color} fontSize="26" fontWeight="800">
        {displayed}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#888" fontSize="9" letterSpacing="1">
        GLOW SCORE
      </text>
    </svg>
  );
}
