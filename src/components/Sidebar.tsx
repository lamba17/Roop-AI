import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, signOut } from '../lib/supabase';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { AppMode } from '../types/analysis';

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    id: 'analysis',
    label: 'Skin Analysis',
    path: '/scan',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="10" r="3"/>
        <path d="M6.168 18.849A4 4 0 0 1 10 17h4a4 4 0 0 1 3.832 1.849"/>
      </svg>
    ),
  },
  {
    id: 'glam',
    label: 'Makeup Analysis',
    path: '/glam',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c-1 0-2-.4-2.7-1.1L3.1 14.7A4 4 0 0 1 2 12V7a2 2 0 0 1 2-2l5-1.5a2 2 0 0 1 1 0L15 5a2 2 0 0 1 2 2v5a4 4 0 0 1-1.2 2.8L14.7 20.9A3.7 3.7 0 0 1 12 22z"/>
        <circle cx="12" cy="10" r="2"/>
      </svg>
    ),
  },
  {
    id: 'makeup-artists',
    label: 'Makeup Artists',
    path: '/makeup-artists',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    id: 'routine',
    label: 'Routine',
    path: '/routine',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    id: 'products',
    label: 'Products',
    path: '/products',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
  },
  {
    id: 'specialists',
    label: 'Specialists',
    path: '/specialists',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [scoreMode] = useLocalStorage<AppMode | null>('roop_score_mode', null);

  async function handleSignOut() {
    try {
      await signOut();
      navigate('/signin');
    } catch {
      // ignore
    }
  }

  const firstName = (user?.user_metadata?.full_name as string | undefined)?.split(' ')[0]
    ?? user?.email?.split('@')[0]
    ?? 'Guest';

  function isActive(path: string) {
    if (path === '/scan') return location.pathname === '/scan' || location.pathname === '/results';
    if (path === '/glam') return location.pathname === '/scan' || location.pathname === '/glam-results';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }

  function handleNavClick(path: string) {
    if (path === '/glam') {
      navigate('/scan');
    } else {
      navigate(path);
    }
  }

  // Hide nav items that don't apply to the user's chosen mode
  function isHidden(id: string) {
    if (!scoreMode) {
      // No mode chosen yet — hide all mode-specific items until user picks on Dashboard
      return id === 'analysis' || id === 'glam' || id === 'specialists' || id === 'makeup-artists';
    }
    if (id === 'analysis' && scoreMode === 'glam') return true;
    if (id === 'glam' && scoreMode === 'glow') return true;
    if (id === 'specialists' && scoreMode === 'glam') return true;
    if (id === 'makeup-artists' && scoreMode === 'glow') return true;
    return false;
  }

  return (
    <aside className="sidebar">
      {/* Logo & Clinic */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 2.74 1.54 5.12 3.82 6.37L12 22l3.18-6.63C17.46 14.12 19 11.74 19 9c0-3.87-3.13-7-7-7z" fill="url(#logoGrad)"/>
            <circle cx="12" cy="9" r="2.5" fill="white" opacity="0.9"/>
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a855f7"/>
                <stop offset="100%" stopColor="#ec4899"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <div className="sidebar-brand">ROOP AI</div>
          <div className="sidebar-clinic">The Ethereal Clinic</div>
          <div className="sidebar-tier">PREMIUM WELLNESS</div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.filter(item => !isHidden(item.id)).map(item => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.path)}
            className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''} ${item.id === 'glam' ? 'sidebar-nav-glam' : ''}`}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.id === 'glam' && (
              <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, letterSpacing: 0.5, padding: '2px 6px', borderRadius: 20, background: 'linear-gradient(135deg,#ec4899,#a855f7)', color: '#fff', flexShrink: 0 }}>
                AI
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {firstName.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{firstName}</div>
            <div className="sidebar-user-role">Member</div>
          </div>
        </div>
        <button
          onClick={() => scoreMode ? navigate('/scan') : navigate('/dashboard')}
          className="sidebar-cta"
        >
          {scoreMode === 'glam' ? '💄 New Glam Scan' : scoreMode === 'glow' ? '🌿 New Skin Scan' : '+ Choose Score'}
        </button>
        <button
          onClick={handleSignOut}
          style={{
            marginTop: 8,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 14px',
            background: 'none',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 10,
            color: '#f87171',
            fontSize: 13,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.4)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'none';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.2)';
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
