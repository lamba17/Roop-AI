import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../lib/supabase';
import LanguageToggle from './LanguageToggle';

const TOP_NAV = [
  { label: 'DASHBOARD', path: '/dashboard' },
  { label: 'ANALYSIS', path: '/' },
  { label: 'PRODUCTS', path: '/products' },
  { label: 'ROUTINE', path: '/routine' },
  { label: 'SPECIALISTS', path: '/specialists' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  function isActive(path: string) {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        {/* Top nav bar */}
        <header className="app-topbar">
          <nav className="app-topnav">
            {TOP_NAV.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`topnav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="app-topbar-right">
            <LanguageToggle />
            <button className="topbar-icon-btn" title="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            {user && (
              <button
                onClick={() => navigate('/dashboard')}
                className="topbar-avatar"
                title={user.email}
              >
                {(user?.user_metadata?.full_name as string | undefined)?.charAt(0)?.toUpperCase()
                  ?? user?.email?.charAt(0)?.toUpperCase()
                  ?? 'U'}
              </button>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}
