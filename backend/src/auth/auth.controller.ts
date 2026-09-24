import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() body: { email: string; password: string }) {
    return this.authService.signUp(body.email, body.password);
  }

  @Post('signin')
  async signIn(@Body() body: { email: string; password: string }) {
    return this.authService.signIn(body.email, body.password);
  }

  @Post('signout')
  async signOut() {
    return { success: true };
  }

  @Get('google-url')
  async getGoogleUrl() {
    return this.authService.getGoogleUrl();
  }

  @Post('google/callback')
  async googleCallback(@Body() body: { code: string }) {
    return this.authService.exchangeCodeForSession(body.code);
  }

  @Get('session')
  async getSession(@Req() req: Request) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return { user: null, session: null };
    }
    const token = header.substring(7);
    return this.authService.getSession(token);
  }
}
