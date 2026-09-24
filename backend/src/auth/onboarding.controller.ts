import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { OnboardingService } from './onboarding.service';

@Controller('auth/onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get()
  async getStatus(@Req() req: Request) {
    const token = req.headers.authorization?.substring(7) || '';
    return this.onboardingService.getStatus(token);
  }

  @Post('complete')
  async complete(@Req() req: Request) {
    const token = req.headers.authorization?.substring(7) || '';
    return this.onboardingService.markComplete(token);
  }
}
