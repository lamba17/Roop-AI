import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import UserMenu from './UserMenu';
import { useTheme } from '../context/ThemeContext';

const TOP_NAV = [
  { label: 'DASHBOARD', path: '/dashboard' },
  { label: 'SKIN SCAN', path: '/scan' },
  { label: 'GLAM SCAN', path: '/glam' },
  { label: 'PRODUCTS', path: '/products' },
  { label: 'ROUTINE', path: '/routine' },
  { label: 'SPECIALISTS', path: '/specialists' },
];

const MOBILE_NAV = [
  {
    label: 'Home',
    path: '/dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    label: 'Scan',
    path: '/scan',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/>
        <path d="M6.168 18.849A4 4 0 0 1 10 17h4a4 4 0 0 1 3.832 1.849"/>
      </svg>
    ),
  },
  {
    label: 'Routine',
    path: '/routine',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    label: 'Products',
    path: '/products',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
  },
  {
    label: 'Glam',
    path: '/glam',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c-1 0-2-.4-2.7-1.1L3.1 14.7A4 4 0 0 1 2 12V7a2 2 0 0 1 2-2l5-1.5a2 2 0 0 1 1 0L15 5a2 2 0 0 1 2 2v5a4 4 0 0 1-1.2 2.8L14.7 20.9A3.7 3.7 0 0 1 12 22z"/>
        <circle cx="12" cy="10" r="2"/>
      </svg>
    ),
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggle } = useTheme();

  function isActive(path: string) {
    if (path === '/glam') return location.pathname === '/glam-results';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }

  function handleTopNav(path: string) {
    if (path === '/glam') navigate('/scan', { state: { mode: 'glam' } });
    else navigate(path);
  }

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        {/* Top nav bar */}
        <header className="app-topbar">
          {/* Mobile: show logo; Desktop: show nav links */}
          <div className="mobile-topbar-logo">
            <div className="mobile-topbar-logo-mark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 2.74 1.54 5.12 3.82 6.37L12 22l3.18-6.63C17.46 14.12 19 11.74 19 9c0-3.87-3.13-7-7-7z" fill="url(#mobileLogoGrad)"/>
                <circle cx="12" cy="9" r="2.5" fill="white" opacity="0.9"/>
                <defs>
                  <linearGradient id="mobileLogoGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a855f7"/>
                    <stop offset="100%" stopColor="#ec4899"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="mobile-topbar-brand">ROOP AI</span>
          </div>

          <nav className="app-topnav">
            {TOP_NAV.map(item => (
              <button
                key={item.path}
                onClick={() => handleTopNav(item.path)}
                className={`topnav-link ${isActive(item.path) ? 'active' : ''} ${item.path === '/glam' ? 'topnav-glam' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="app-topbar-right">
            <button
              onClick={toggle}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              className="topbar-icon-btn"
            >
              {theme === 'light' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              )}
            </button>
            <UserMenu />
          </div>
        </header>

        {/* Page content */}
        <main className="app-content">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="mobile-bottom-nav">
        {MOBILE_NAV.map(item => (
          <button
            key={item.path}
            onClick={() => handleTopNav(item.path)}
            className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <span className="mobile-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            {isActive(item.path) && <div className="mobile-nav-dot" />}
          </button>
        ))}
      </nav>
    </div>
  );
}
