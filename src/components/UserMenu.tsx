import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, signOut } from '../lib/supabase';

function getInitials(name: string | undefined, email: string | undefined): string {
  if (name) {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  }
  if (email) return email[0].toUpperCase();
  return '?';
}

export default function UserMenu() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
    } catch {
      // ignore
    } finally {
      setSigningOut(false);
      setOpen(false);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: 'rgba(124,58,237,0.15)',
          animation: 'pulse-glow 2s ease infinite',
        }}
      />
    );
  }

  if (!user) {
    return (
      <button
        onClick={() => navigate('/signin')}
        className="btn-outline"
        style={{ fontSize: 13, padding: '8px 18px', gap: 6 }}
      >
        <span style={{ fontSize: 15 }}>🔑</span>
        Sign In
      </button>
    );
  }

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
  const fullName = user.user_metadata?.full_name as string | undefined;
  const email = user.email;
  const initials = getInitials(fullName, email);

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-label="User menu"
        style={{
          background: 'none',
          border: '2px solid rgba(168,85,247,0.4)',
          borderRadius: '50%',
          padding: 0,
          cursor: 'pointer',
          width: 36,
          height: 36,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: open ? '0 0 0 3px rgba(124,58,237,0.25)' : 'none',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(168,85,247,0.8)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = open ? 'rgba(168,85,247,0.7)' : 'rgba(168,85,247,0.4)'; }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={fullName ?? 'User avatar'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: 14,
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {initials}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: 210,
            background: 'rgba(13,13,31,0.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: 16,
            padding: '12px 0',
            boxShadow: '0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(168,85,247,0.08)',
            zIndex: 100,
            animation: 'fadeInUp 0.18s ease both',
          }}
        >
          {/* User info */}
          <div
            style={{
              padding: '8px 16px 12px',
              borderBottom: '1px solid rgba(124,58,237,0.15)',
              marginBottom: 6,
            }}
          >
            {fullName && (
              <p
                style={{
                  margin: '0 0 2px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#f8f8ff',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {fullName}
              </p>
            )}
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: 'rgba(248,248,255,0.45)',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 178,
              }}
            >
              {email}
            </p>
          </div>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 16px',
              background: 'none',
              border: 'none',
              color: signingOut ? 'rgba(248,248,255,0.3)' : '#f87171',
              fontSize: 13,
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 500,
              cursor: signingOut ? 'not-allowed' : 'pointer',
              textAlign: 'left',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => {
              if (!signingOut) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'none';
            }}
          >
            {signingOut ? (
              <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
            ) : (
              <span style={{ fontSize: 15 }}>↪</span>
            )}
            {signingOut ? 'Signing out…' : 'Sign Out'}
          </button>
        </div>
      )}
    </div>
  );
}
