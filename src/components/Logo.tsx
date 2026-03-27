interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

const SIZES = {
  sm: { imgSize: 36, fontSize: 18, tagSize: 10, gap: 8 },
  md: { imgSize: 48, fontSize: 22, tagSize: 11, gap: 10 },
  lg: { imgSize: 160, fontSize: 38, tagSize: 15, gap: 0 },
};

export default function Logo({ size = 'md', showTagline = false }: LogoProps) {
  const s = SIZES[size];
  const isLg = size === 'lg';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      flexDirection: isLg ? 'column' : 'row',
      gap: s.gap,
    }}>
      <img
        src="/Face 1 Purple.png"
        alt="ROOP AI"
        style={{
          width: s.imgSize,
          height: s.imgSize,
          objectFit: 'contain',
          display: 'block',
        }}
      />
      {!isLg && (
        <span style={{
          fontSize: s.fontSize,
          fontWeight: 800,
          letterSpacing: 1,
          background: 'linear-gradient(135deg, #a855f7, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
          fontFamily: 'Segoe UI, system-ui, sans-serif',
        }}>
          ROOP AI
        </span>
      )}
      {(showTagline && isLg) && (
        <span style={{
          fontSize: s.tagSize,
          color: '#888',
          letterSpacing: 2,
          textTransform: 'uppercase',
          marginTop: 6,
          fontFamily: 'Segoe UI, system-ui, sans-serif',
        }}>
          Skin Coach
        </span>
      )}
    </div>
  );
}
