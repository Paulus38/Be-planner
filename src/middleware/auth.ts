import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';

export interface AuthedRequest extends Request {
  userClient?: ReturnType<typeof import('../lib/supabase').createUserClient>;
  userId?: string;
  accessToken?: string;
}

export async function authMiddleware(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing authorization header' });
    return;
  }

  const token = header.substring(7);
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    const { createUserClient } = await import('../lib/supabase');
    req.userClient = createUserClient(token);
    req.userId = data.user.id;
    req.accessToken = token;
    next();
  } catch {
    res.status(401).json({ error: 'Authentication failed' });
  }
}
