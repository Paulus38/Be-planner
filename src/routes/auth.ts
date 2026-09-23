import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const SUPABASE_URL = process.env.SUPABASE_URL || '';

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password required' });
    return;
  }

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.json({
    user: data.user,
    session: data.session,
  });
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password required' });
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.json({
    user: data.user,
    session: data.session,
  });
});

router.post('/signout', async (_req, res) => {
  res.json({ success: true });
});

// Google OAuth — build the Supabase OAuth authorization URL for the frontend
// The frontend redirects the browser here, and we redirect to Supabase's Google OAuth
// Supabase will redirect back to FRONTEND_URL/auth/callback with a code
router.get('/google-url', (_req, res) => {
  const callbackUrl = `${FRONTEND_URL}/auth/callback`;
  res.json({ url: callbackUrl });
});

// Google OAuth — exchange authorization code for session tokens
// After Supabase redirects back to our frontend with ?code=..., the frontend sends it here
router.post('/google/callback', async (req, res) => {
  const { code } = req.body;
  if (!code) {
    res.status(400).json({ error: 'Authorization code required' });
    return;
  }

  try {
    // Exchange the code for a session using Supabase's PKCE flow
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.session) {
      res.status(400).json({ error: error?.message || 'Failed to exchange code' });
      return;
    }

    res.json({
      user: { id: data.user.id, email: data.user.email || '' },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      },
    });
  } catch (err: any) {
    console.error('Google OAuth exchange error:', err);
    res.status(500).json({ error: err.message || 'Exchange failed' });
  }
});

router.get('/session', async (req, res) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.json({ user: null, session: null });
    return;
  }

  const token = header.substring(7);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    res.json({ user: null, session: null });
    return;
  }

  res.json({ user: { id: data.user.id, email: data.user.email || '' } });
});

export default router;
