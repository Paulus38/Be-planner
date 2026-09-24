import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SupabaseService } from './supabase.service';

export interface AuthedRequest extends Request {
  userClient?: ReturnType<SupabaseService['createUserClient']>;
  userId?: string;
  accessToken?: string;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly supabaseService: SupabaseService) {}

  async use(req: AuthedRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const token = header.substring(7);
    const { data, error } = await this.supabaseService.client.auth.getUser(token);
    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    req.userClient = this.supabaseService.createUserClient(token);
    req.userId = data.user.id;
    req.accessToken = token;
    next();
  }
}
