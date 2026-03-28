import { useEffect, useState, useCallback } from 'react';
import { getSubscription } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

function localPremiumValid(): boolean {
  const expires = localStorage.getItem('roop_premium_expires');
  if (!expires) return false;
  return new Date(expires) > new Date();
}

export function usePremium(user: User | null) {
  const [premium, setPremium] = useState<boolean>(localPremiumValid);
  const [checking, setChecking] = useState(false);

  const verify = useCallback(async () => {
    if (!user) { setPremium(false); return; }
    // Fast path: valid local cache
    if (localPremiumValid()) { setPremium(true); return; }
    // Slow path: check Supabase
    setChecking(true);
    try {
      const sub = await getSubscription(user.id);
      if (sub) {
        localStorage.setItem('roop_premium', 'true');
        localStorage.setItem('roop_premium_expires', sub.expires_at);
        setPremium(true);
      } else {
        localStorage.removeItem('roop_premium');
        localStorage.removeItem('roop_premium_expires');
        setPremium(false);
      }
    } catch {
      // Network error — fall back to local cache value
    } finally {
      setChecking(false);
    }
  }, [user]);

  useEffect(() => { verify(); }, [verify]);

  return { premium, checking, refresh: verify };
}
