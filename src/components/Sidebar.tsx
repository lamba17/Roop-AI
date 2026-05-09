import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, signOut } from '../lib/supabase';
import PremiumModal from './PremiumModal';

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
    id: 'scan',
    label: 'Skin Scan',
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
    id: 'analysis',
    label: 'Skin Analysis',
    path: '/analysis',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
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
  const [showPremium, setShowPremium] = useState(false);

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
    if (path === '/analysis') return location.pathname === '/analysis';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }

  function isHidden() {
    return false;
  }

  function handleNavClick(path: string) {
    navigate(path);
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
        {NAV_ITEMS.filter(() => !isHidden()).map(item => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.path)}
            className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
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
          onClick={() => setShowPremium(true)}
          className="sidebar-cta"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '10px 14px',
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            border: 'none',
            borderRadius: 10,
            color: '#ffffff',
            fontSize: 13,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s',
            marginBottom: 8,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 20px rgba(168, 85, 247, 0.3)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          Upgrade
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

      {showPremium && user && (
        <PremiumModal
          user={user}
          onClose={() => setShowPremium(false)}
          onUpgraded={() => setShowPremium(false)}
        />
      )}
    </aside>
  );
}
