interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

const SIZES = {
  sm: { imgSize: 34, fontSize: 17, tagSize: 10, gap: 9 },
  md: { imgSize: 46, fontSize: 21, tagSize: 11, gap: 10 },
  lg: { imgSize: 260, fontSize: 38, tagSize: 15, gap: 0 },
};

export default function Logo({ size = 'md', showTagline = false }: LogoProps) {
  const s = SIZES[size];
  const isLg = size === 'lg';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: isLg ? 'column' : 'row',
        gap: s.gap,
      }}
    >
      <img
        src="/Face 1 Purple.png"
        alt="ROOP AI"
        style={{
          width: s.imgSize,
          height: s.imgSize,
          objectFit: 'contain',
          display: 'block',
          filter: isLg ? 'drop-shadow(0 0 32px rgba(124,58,237,0.5)) drop-shadow(0 0 60px rgba(219,39,119,0.25))' : 'none',
        }}
      />
      {!isLg && (
        <span
          style={{
            fontSize: s.fontSize,
            fontWeight: 800,
            letterSpacing: 1.5,
            background: 'linear-gradient(135deg, #a855f7 0%, #db2777 60%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1,
            fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
          }}
        >
          ROOP AI
        </span>
      )}
      {showTagline && isLg && (
        <span
          style={{
            fontSize: s.tagSize,
            color: 'rgba(248,248,255,0.45)',
            letterSpacing: 3,
            textTransform: 'uppercase',
            marginTop: 8,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 500,
          }}
        >
          Skin Coach
        </span>
      )}
    </div>
  );
}
