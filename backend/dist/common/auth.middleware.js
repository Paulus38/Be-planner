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
exports.AuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("./supabase.service");
let AuthMiddleware = class AuthMiddleware {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async use(req, res, next) {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Missing authorization header');
        }
        const token = header.substring(7);
        const { data, error } = await this.supabaseService.client.auth.getUser(token);
        if (error || !data.user) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
        req.userClient = this.supabaseService.createUserClient(token);
        req.userId = data.user.id;
        req.accessToken = token;
        next();
    }
};
exports.AuthMiddleware = AuthMiddleware;
exports.AuthMiddleware = AuthMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], AuthMiddleware);
//# sourceMappingURL=auth.middleware.js.map