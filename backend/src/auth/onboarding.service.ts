import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase.service';

@Injectable()
export class OnboardingService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getStatus(token: string) {
    const { data: userData, error } = await this.supabaseService.client.auth.getUser(token);
    if (error || !userData.user) {
      return { onboarding_completed: false };
    }

    const userClient = this.supabaseService.createUserClient(token);
    const { data, error: dbError } = await userClient
      .from('user_preferences')
      .select('onboarding_completed')
      .eq('user_id', userData.user.id)
      .maybeSingle();

    if (dbError || !data) {
      return { onboarding_completed: false };
    }
    return { onboarding_completed: data.onboarding_completed };
  }

  async markComplete(token: string) {
    const { data: userData, error } = await this.supabaseService.client.auth.getUser(token);
    if (error || !userData.user) {
      throw new UnauthorizedException('Invalid token');
    }

    const userClient = this.supabaseService.createUserClient(token);

    // Upsert: try update first, if no row then insert
    const { data: existing } = await userClient
      .from('user_preferences')
      .select('id')
      .eq('user_id', userData.user.id)
      .maybeSingle();

    if (existing) {
      const { error: updateError } = await userClient
        .from('user_preferences')
        .update({ onboarding_completed: true, updated_at: new Date().toISOString() })
        .eq('user_id', userData.user.id);
      if (updateError) {
        throw new Error(updateError.message);
      }
    } else {
      const { error: insertError } = await userClient
        .from('user_preferences')
        .insert({ user_id: userData.user.id, onboarding_completed: true });
      if (insertError) {
        throw new Error(insertError.message);
      }
    }

    return { success: true, onboarding_completed: true };
  }
}
