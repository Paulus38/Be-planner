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
exports.CrudService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../common/supabase.service");
const ALLOWED_TABLES = new Set([
    'books',
    'study_sessions',
    'journal_entries',
    'schedule_entries',
    'settings',
    'weekly_goals',
    'instrument_practices',
    'weekly_reviews',
    'tasks',
    'fixed_activities',
    'study_subjects',
    'daily_progress',
    'user_preferences',
]);
let CrudService = class CrudService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    validateTable(table) {
        if (!ALLOWED_TABLES.has(table)) {
            throw new common_1.BadRequestException(`Table '${table}' is not allowed`);
        }
    }
    getClient(token) {
        return this.supabaseService.createUserClient(token);
    }
    async getAll(table, query, token) {
        this.validateTable(table);
        const client = this.getClient(token);
        let q = client.from(table).select(typeof query.select === 'string' ? query.select : '*');
        if (query.filter_field && query.filter_value) {
            q = q.eq(String(query.filter_field), String(query.filter_value));
        }
        if (query.filter_in && query.filter_field) {
            const values = String(query.filter_in).split(',');
            q = q.in(String(query.filter_field), values);
        }
        if (query.order) {
            const [column, ascending] = String(query.order).split(':');
            q = q.order(column, { ascending: ascending !== 'false' });
        }
        if (query.limit) {
            q = q.limit(parseInt(String(query.limit), 10));
        }
        if (query.single === 'true') {
            const { data, error } = await q.single();
            if (error && error.code !== 'PGRST116') {
                throw new common_1.BadRequestException(error.message);
            }
            return { data };
        }
        if (query.maybe_single === 'true') {
            const { data, error } = await q.maybeSingle();
            if (error) {
                throw new common_1.BadRequestException(error.message);
            }
            return { data };
        }
        const { data, error } = await q;
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return { data };
    }
    async insert(table, body, token) {
        this.validateTable(table);
        const client = this.getClient(token);
        const rows = Array.isArray(body) ? body : [body];
        const { data, error } = await client.from(table).insert(rows).select();
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return { data };
    }
    async update(table, query, body, token) {
        this.validateTable(table);
        const client = this.getClient(token);
        if (!query.filter_field || !query.filter_value) {
            throw new common_1.BadRequestException('filter_field and filter_value required for PUT');
        }
        const { data, error } = await client
            .from(table)
            .update(body)
            .eq(String(query.filter_field), String(query.filter_value))
            .select();
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return { data };
    }
    async remove(table, query, token) {
        this.validateTable(table);
        const client = this.getClient(token);
        if (!query.filter_field) {
            throw new common_1.BadRequestException('filter_field required for DELETE');
        }
        let q = client.from(table).delete();
        if (query.filter_in) {
            const values = String(query.filter_in).split(',');
            q = q.in(String(query.filter_field), values);
        }
        else if (query.filter_value) {
            q = q.eq(String(query.filter_field), String(query.filter_value));
        }
        else {
            throw new common_1.BadRequestException('filter_value or filter_in required for DELETE');
        }
        const { error } = await q;
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return { success: true };
    }
};
exports.CrudService = CrudService;
exports.CrudService = CrudService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], CrudService);
//# sourceMappingURL=crud.service.js.map