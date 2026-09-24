import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SupabaseService } from '../common/supabase.service';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';

@Module({
  controllers: [AuthController, OnboardingController],
  providers: [AuthService, OnboardingService, SupabaseService],
  exports: [SupabaseService],
})
export class AuthModule {}
