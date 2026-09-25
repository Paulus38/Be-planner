# Study Planner Backend

Backend API cho Study Planner, xây dựng bằng NestJS và Supabase. Backend xử lý xác thực, phân quyền theo người dùng, CRUD dữ liệu, tải dữ liệu tổng hợp và tạo dữ liệu mẫu.

## Kiến trúc

```text
Frontend (Next.js) -> REST API (NestJS) -> Supabase/PostgreSQL
```

Mọi endpoint nghiệp vụ dùng tiền tố `/api`. Middleware xác thực đọc `Authorization: Bearer <token>`, xác minh JWT và tạo Supabase client theo người dùng để RLS bảo vệ dữ liệu.

## Công nghệ

- Node.js, TypeScript, NestJS 10
- Supabase JS SDK và PostgreSQL
- JWT, bcryptjs
- `ws` để tương thích Supabase Realtime trên Node.js 20

## Yêu cầu

- Node.js 20 trở lên (Node 22 được khuyến nghị)
- npm 9 trở lên
- Một Supabase project

## Cài đặt và chạy

```bash
npm install
cp .env.example .env
npm run dev
```

API mặc định chạy tại `http://localhost:3001`; health check:

```text
GET http://localhost:3001/api/health
```

Các lệnh khác:

```bash
npm run typecheck
npm run build
npm start
```

## Biến môi trường

| Biến | Bắt buộc | Mô tả |
|---|---:|---|
| `SUPABASE_URL` | Có | URL project Supabase |
| `SUPABASE_ANON_KEY` | Có | Anon key dùng cho client theo người dùng |
| `SUPABASE_SERVICE_ROLE_KEY` | Khuyến nghị | Service-role key để đọc `sample_templates` và seed dữ liệu mẫu qua RLS |
| `JWT_SECRET` | Có | Secret ký JWT của ứng dụng |
| `PORT` | Không | Port API, mặc định `3001` |
| `FRONTEND_URL` | Không | Origin frontend cho CORS, mặc định `http://localhost:3000` |

Không commit file `.env` hoặc service-role key.

## Database migration

Chạy SQL trong Supabase Dashboard → SQL Editor theo thứ tự:

1. `supabase/migrations/20260922092619_create_initial_schema.sql`
2. `supabase/migrations/20260923012252_add_multi_user_auth.sql`

Migration tạo các bảng cài đặt, hoạt động cố định, thời khóa biểu, môn học, task, phiên học, nhật ký, sách, mục tiêu và thống kê. Migration thứ hai thêm `user_id` và RLS `auth.uid() = user_id`.

## API

### Health

| Method | Path | Auth |
|---|---|---|
| GET | `/api/health` | Không |

### Auth

| Method | Path | Mô tả |
|---|---|---|
| POST | `/api/auth/signup` | Đăng ký `{ email, password, name? }` |
| POST | `/api/auth/signin` | Đăng nhập, trả access/refresh token |
| POST | `/api/auth/signout` | Kết thúc phiên phía client |
| POST | `/api/auth/refresh` | Cấp token mới từ Bearer token |
| GET | `/api/auth/session` | Lấy người dùng hiện tại |

### Dữ liệu tổng hợp

`GET /api/data` trả về settings, fixed activities, schedule entries, subjects, tasks, study sessions, journal entries, weekly goals, daily progress và user config.

### Onboarding và seed

| Method | Path | Mô tả |
|---|---|---|
| GET | `/api/auth/onboarding` | Lấy trạng thái onboarding |
| POST | `/api/auth/onboarding/complete` | Đánh dấu đã hoàn tất |
| GET | `/api/seed/templates` | Danh sách sample template |
| GET | `/api/seed/template?id=<id>` | Lấy template theo ID hoặc template mặc định |
| POST | `/api/seed` | Seed dữ liệu cho user; body tùy chọn `{ template_id }` |

Hai endpoint GET template không yêu cầu đăng nhập. Nếu `SUPABASE_SERVICE_ROLE_KEY` thiếu, RLS có thể khiến danh sách template rỗng.

### CRUD

Các route CRUD yêu cầu Bearer token:

```text
GET    /api/:table
POST   /api/:table
PUT    /api/:table
DELETE /api/:table
```

Bảng được phép gồm: `books`, `study_sessions`, `journal_entries`, `schedule_entries`, `settings`, `weekly_goals`, `instrument_practices`, `weekly_reviews`, `tasks`, `fixed_activities`, `study_subjects`, `daily_progress`, `monthly_goals`, `semester_goals`, `monthly_reviews`.

GET hỗ trợ `select`, `filter_field` + `filter_value`, `filter_in`, `order`, `limit`, `single=true`, `maybe_single=true`. PUT/DELETE dùng query filter tương ứng. Route `/api/seed` được đăng ký trước route CRUD tổng quát để không bị hiểu nhầm là bảng `seed`.

## Cấu trúc chính

```text
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── auth/
│   ├── common/
│   ├── crud/
│   ├── data/
│   └── seed/
├── supabase/migrations/
├── package.json
└── .env.example
```

## Triển khai

```bash
npm install
npm run build
npm start
```

Trên Render, Railway, Fly.io hoặc VPS, đặt build command `npm run build`, start command `npm start` và khai báo toàn bộ biến môi trường production.
