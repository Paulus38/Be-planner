import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase.service';

@Injectable()
export class AuthService {
  private readonly frontendUrl: string;
  private readonly supabaseUrl: string;

  constructor(private readonly supabaseService: SupabaseService) {
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    this.supabaseUrl = process.env.SUPABASE_URL || '';
  }

  async signUp(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Email and password required');
    }
    const { data, error } = await this.supabaseService.client.auth.signUp({ email, password });
    if (error) {
      throw new BadRequestException(error.message);
    }
    return { user: data.user, session: data.session };
  }

  async signIn(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Email and password required');
    }
    const { data, error } = await this.supabaseService.client.auth.signInWithPassword({ email, password });
    if (error) {
      throw new BadRequestException(error.message);
    }
    return { user: data.user, session: data.session };
  }

  getGoogleUrl() {
    const callbackUrl = `${this.frontendUrl}/auth/callback`;
    return { url: callbackUrl };
  }

  async exchangeCodeForSession(code: string) {
    if (!code) {
      throw new BadRequestException('Authorization code required');
    }
    try {
      const { data, error } = await this.supabaseService.client.auth.exchangeCodeForSession(code);
      if (error || !data.session) {
        throw new BadRequestException(error?.message || 'Failed to exchange code');
      }
      return {
        user: { id: data.user.id, email: data.user.email || '' },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        },
      };
    } catch (err: any) {
      if (err instanceof BadRequestException) throw err;
      throw new BadRequestException(err.message || 'Exchange failed');
    }
  }

  async getSession(token: string) {
    const { data, error } = await this.supabaseService.client.auth.getUser(token);
    if (error || !data.user) {
      return { user: null, session: null };
    }
    return { user: { id: data.user.id, email: data.user.email || '' } };
  }
}
