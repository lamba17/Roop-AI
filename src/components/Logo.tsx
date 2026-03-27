interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

const SIZES = {
  sm: { width: 32, height: 32, fontSize: 16, tagSize: 10 },
  md: { width: 48, height: 48, fontSize: 20, tagSize: 11 },
  lg: { width: 120, height: 120, fontSize: 36, tagSize: 14 },
};

export default function Logo({ size = 'md', showTagline = false }: LogoProps) {
  const s = SIZES[size];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size === 'lg' ? 0 : 10, flexDirection: size === 'lg' ? 'column' : 'row' }}>
      {/* SVG Icon */}
      <svg
        width={s.width}
        height={s.height}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Face silhouette */}
        <path
          d="M72 20 C72 20 85 28 85 50 C85 65 80 72 75 78 C70 84 68 90 70 96 C60 96 52 90 50 84 C45 78 38 70 36 58 C34 46 38 30 50 24 C58 20 66 18 72 20Z"
          stroke="url(#faceGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Hair flow */}
        <path
          d="M70 96 C65 100 55 102 48 98 C42 94 38 88 38 82"
          stroke="url(#faceGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Nose hint */}
        <path
          d="M62 58 C63 62 61 65 59 66"
          stroke="url(#faceGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Sparkle star */}
        <g transform="translate(78, 18)">
          <path d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z" fill="#ec4899" />
        </g>
        {/* Small sparkle */}
        <g transform="translate(86, 30)">
          <path d="M3 0 L3.8 2.2 L6 3 L3.8 3.8 L3 6 L2.2 3.8 L0 3 L2.2 2.2 Z" fill="#a855f7" opacity="0.7" />
        </g>

        <defs>
          <linearGradient id="faceGrad" x1="36" y1="20" x2="85" y2="96" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e8e0d0" />
            <stop offset="100%" stopColor="#c8b89a" />
          </linearGradient>
          <linearGradient id="textGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>

      {/* Text */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: size === 'lg' ? 'center' : 'flex-start' }}>
        <span style={{
          fontSize: s.fontSize,
          fontWeight: 800,
          letterSpacing: size === 'lg' ? 4 : 1,
          background: 'linear-gradient(135deg, #a855f7, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
          fontFamily: 'Segoe UI, system-ui, sans-serif',
        }}>
          ROOP <span style={{
            background: 'linear-gradient(135deg, #ec4899, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>AI</span>
        </span>
        {(showTagline || size === 'lg') && (
          <span style={{
            fontSize: s.tagSize,
            color: '#888',
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginTop: 4,
            fontFamily: 'Segoe UI, system-ui, sans-serif',
          }}>
            Skin Coach
          </span>
        )}
      </div>
    </div>
  );
}
