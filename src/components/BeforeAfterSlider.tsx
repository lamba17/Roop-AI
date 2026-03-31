import { useRef, useState } from 'react';
import type { HistoryEntry } from '../types/analysis';

export default function BeforeAfterSlider({ entries }: { entries: HistoryEntry[] }) {
  const before = entries[0];
  const after = entries[entries.length - 1];
  const [sliderX, setSliderX] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  if (entries.length < 2 || !before.imageUrl || !after.imageUrl) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0', color: '#888', fontSize: 14 }}>
        {entries.length < 2
          ? 'Complete at least 2 analyses to see your progress comparison.'
          : 'Photos not available for comparison — cloud storage required.'}
      </div>
    );
  }

  function handleMove(clientX: number) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    setSliderX(pct);
  }

  const delta = after.score - before.score;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: '#888' }}>Score: {before.score}</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: delta >= 0 ? '#22c55e' : '#ef4444' }}>
          {delta >= 0 ? '+' : ''}{delta} pts
        </span>
        <span style={{ fontSize: 13, color: '#888' }}>Score: {after.score}</span>
      </div>
      <div
        ref={containerRef}
        style={{ position: 'relative', height: 240, borderRadius: 14, overflow: 'hidden', cursor: 'ew-resize', userSelect: 'none' }}
        onMouseMove={e => handleMove(e.clientX)}
        onTouchMove={e => handleMove(e.touches[0].clientX)}
      >
        <img src={before.imageUrl} alt="Before" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }} />
        <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - sliderX}% 0 0)` }}>
          <img src={after.imageUrl} alt="After" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }} />
        </div>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${sliderX}%`, width: 3, background: '#a855f7', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: `${sliderX}%`, transform: 'translate(-50%,-50%)', width: 28, height: 28, borderRadius: '50%', background: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff', pointerEvents: 'none' }}>⟺</div>
        <span style={{ position: 'absolute', top: 8, left: 10, fontSize: 11, fontWeight: 700, background: 'rgba(0,0,0,0.6)', color: '#888', padding: '3px 8px', borderRadius: 6 }}>BEFORE</span>
        <span style={{ position: 'absolute', top: 8, right: 10, fontSize: 11, fontWeight: 700, background: 'rgba(168,85,247,0.7)', color: '#fff', padding: '3px 8px', borderRadius: 6 }}>AFTER</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: '#555' }}>
        <span>{new Date(before.date).toLocaleDateString()}</span>
        <span>{new Date(after.date).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
