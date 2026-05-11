# WEBHOOK ISSUE FOUND ⚠️

## Problem:
Your webhook trigger is configured on `public.user_profiles` but new users sign up via `auth.users`.

### From logs, the trigger is:
```sql
CREATE TRIGGER "notify-new-signup" AFTER INSERT ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION
  supabase_functions.http_request('https://www.roopai.co.in/api/notify-signup','POST','{"x-webhook-secret":"roopai-94"}','{}','5000');
```

### What should happen:
1. User signs up via `auth.users` table (Google OAuth)
2. A webhook should trigger to call your `/api/notify-signup` endpoint
3. The endpoint sends welcome email + admin notification + Brevo sync

### Current Status:
❌ Webhook will NEVER fire because:
- New users in `auth.users` don't trigger the `public.user_profiles` trigger
- The webhook secret in the trigger ("roopai-94") doesn't match your rotated secret
- You need to configure a webhook directly on `auth.users` INSERT event

## Solution:
Delete the current trigger and create a proper Supabase webhook instead:

1. Go to Supabase Dashboard → Project Settings → Webhooks
2. Create new webhook for `auth.users` table on INSERT event
3. Set endpoint: `https://www.roopai.co.in/api/notify-signup`
4. Use your actual SUPABASE_WEBHOOK_SECRET from .env.local
5. Test with a new user signup
