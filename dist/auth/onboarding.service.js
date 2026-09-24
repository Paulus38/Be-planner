"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardingService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../common/supabase.service");
let OnboardingService = class OnboardingService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async getStatus(token) {
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
    async markComplete(token) {
        const { data: userData, error } = await this.supabaseService.client.auth.getUser(token);
        if (error || !userData.user) {
            throw new common_1.UnauthorizedException('Invalid token');
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
        }
        else {
            const { error: insertError } = await userClient
                .from('user_preferences')
                .insert({ user_id: userData.user.id, onboarding_completed: true });
            if (insertError) {
                throw new Error(insertError.message);
            }
        }
        return { success: true, onboarding_completed: true };
    }
};
exports.OnboardingService = OnboardingService;
exports.OnboardingService = OnboardingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], OnboardingService);
//# sourceMappingURL=onboarding.service.js.map