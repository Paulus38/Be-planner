# Chủng Sinh Study Planner

Ứng dụng quản lý thời gian và kế hoạch tự học cá nhân dành cho chủng sinh, bao gồm theo dõi thời khóa biểu, tự học, tiếng Anh, nhật ký thiêng liêng, đọc sách, luyện đàn, và thống kê tiến độ.

## Tính năng chính

- **Dashboard** — Tổng quan hoạt động hiện tại, countdown đến hoạt động tiếp theo, tiến độ hôm nay
- **Lịch hôm nay** — Timeline chi tiết các hoạt động trong ngày (cố định + học + tự học)
- **Lịch tuần/tháng** — Xem lịch tổng quan theo tuần hoặc tháng
- **Thời khóa biểu** — Quản lý lịch học cố định T2–T6
- **Tự học** — Smart Planner tự động tạo lịch tự học buổi tối theo ưu tiên
- **Tiếng Anh** — Theo dõi 7 kỹ năng (vocabulary, grammar, reading, listening, speaking, pronunciation, translation) với mục tiêu tỷ lệ tiếng Anh 50%
- **Nhật ký thiêng liêng** — 6 câu hỏi phản tỉnh, calendar heatmap theo dõi chuỗi viết
- **Đọc sách** — Theo dõi tiến độ đọc, số trang/ngày, mục tiêu hoàn thành
- **Luyện đàn** — Ghi nhận thời gian luyện tập (xướng âm, lý thuyết, kỹ thuật, bài tập)
- **Thống kê** — Biểu đồ Recharts: thời gian học theo ngày/tuần/tháng, tỷ lệ tiếng Anh, tỷ lệ hoàn thành
- **Tổng kết tuần** — Phản tỉnh tuần, kế hoạch tuần tiếp theo
- **Cài đặt** — Tùy chỉnh giờ giấc, mục tiêu, thông báo
- **Đăng nhập/Đăng ký** — Mỗi tài khoản có dữ liệu riêng biệt, tự động tạo dữ liệu mẫu khi đăng ký mới
- **Dark mode** — Hỗ trợ chế độ tối/sáng
- **Responsive** — Tối ưu cho cả mobile và desktop

## Công nghệ sử dụng

| Công nghệ | Vai trò |
|-----------|---------|
| Next.js 13 (App Router) | Framework React, SSR/SSG |
| TypeScript | Ngôn ngữ lập trình |
| Tailwind CSS | Styling |
| shadcn/ui + Radix UI | Component library |
| Supabase | Database (PostgreSQL), Authentication, Row Level Security |
| Recharts | Biểu đồ thống kê |
| Lucide React | Icons |
| date-fns | Xử lý ngày tháng |

## Cấu trúc thư mục

```
project/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (AuthProvider + AppShell)
│   ├── page.tsx                # Dashboard
│   ├── login/page.tsx          # Đăng nhập / Đăng ký
│   ├── today/page.tsx          # Lịch hôm nay
│   ├── calendar/page.tsx       # Lịch tuần/tháng
│   ├── schedule/page.tsx       # Thời khóa biểu
│   ├── self-study/page.tsx     # Tự học (Smart Planner)
│   ├── english/page.tsx        # Tiếng Anh
│   ├── journal/page.tsx        # Nhật ký thiêng liêng
│   ├── books/page.tsx          # Đọc sách
│   ├── instrument/page.tsx     # Luyện đàn
│   ├── statistics/page.tsx     # Thống kê
│   ├── weekly-review/page.tsx  # Tổng kết tuần
│   ├── settings/page.tsx       # Cài đặt
│   └── globals.css             # Global styles + Tailwind
│
├── components/
│   ├── auth-provider.tsx       # Context quản lý phiên đăng nhập
│   ├── app-shell.tsx           # Layout wrapper (bảo vệ route, sidebar)
│   ├── sidebar.tsx             # Thanh điều hướng
│   ├── user-menu.tsx           # Menu người dùng (đăng xuất)
│   ├── theme-provider.tsx      # Dark/light mode provider
│   ├── theme-toggle.tsx        # Nút chuyển dark/light
│   └── ui/                     # shadcn/ui components (60+ components)
│
├── hooks/
│   ├── use-app-data.ts         # Hook tải tất cả dữ liệu từ Supabase theo user
│   └── use-toast.ts            # Toast notifications
│
├── lib/
│   ├── supabase.ts             # Supabase client singleton
│   ├── seed.ts                 # Tạo dữ liệu mẫu khi đăng ký tài khoản mới
│   ├── scheduler.ts            # Logic Smart Planner (tạo lịch tự học)
│   ├── constants.ts            # Hằng số (màu sắc, nhãn, cấu hình)
│   ├── types.ts                # TypeScript interfaces cho database tables
│   └── utils.ts                # Tiện ích (cn, formatDate, v.v.)
│
├── supabase/
│   └── migrations/
│       ├── 20260922092619_create_initial_schema.sql  # Tạo bảng + seed data
│       └── 20260923012252_add_multi_user_auth.sql    # Thêm user_id + RLS multi-user
│
├── public/
│   ├── icon.svg                # App icon
│   └── manifest.json           # PWA manifest
│
├── next.config.js              # Next.js config (webpack cache disabled)
├── tailwind.config.ts          # Tailwind theme (colors, fonts, animations)
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies + scripts
└── .env                        # Biến môi trường Supabase (đã cấu hình sẵn)
```

## Database Schema

### Các bảng chính

| Bảng | Mô tả |
|------|-------|
| `settings` | Cài đặt cá nhân (giờ giấc, mục tiêu, thông báo) |
| `fixed_activities` | Hoạt động cố định hàng ngày (thánh lễ, ăn, nghỉ...) |
| `schedule_entries` | Lịch học cố định theo thứ trong tuần |
| `study_subjects` | Môn học (Tiếng Anh, Việt văn, Đàn, Đọc sách...) |
| `tasks` | Nhiệm vụ/bài tập cần hoàn thành |
| `study_sessions` | Phiên tự học (tự động hoặc thủ công) |
| `journal_entries` | Nhật ký thiêng liêng (6 câu hỏi phản tỉnh) |
| `books` | Sách đang đọc / đã đọc |
| `instrument_practices` | Buổi luyện đàn |
| `weekly_goals` | Mục tiêu tuần (theo môn/kỹ năng) |
| `monthly_goals` | Mục tiêu tháng |
| `semester_goals` | Mục tiêu học kỳ |
| `daily_progress` | Tiến độ mỗi ngày (thời gian học, tỷ lệ tiếng Anh) |
| `weekly_reviews` | Tổng kết tuần |
| `monthly_reviews` | Tổng kết tháng |

### Bảo mật dữ liệu (Row Level Security)

- Mỗi bảng đều có cột `user_id` (tham chiếu đến `auth.users`)
- RLS được bật trên tất cả các bảng
- Mỗi user chỉ thấy và chỉnh sửa dữ liệu của chính mình
- Chính sách: `SELECT`, `INSERT`, `UPDATE`, `DELETE` riêng biệt, scoped `TO authenticated`

## Hướng dẫn cài đặt

### Yêu cầu

- Node.js 18+ 
- npm 9+

### Chạy local

```bash
# 1. Cài dependencies
npm install

# 2. Chạy dev server
npm run dev

# 3. Mở trình duyệt
# http://localhost:3000
```

### Build production

```bash
# Build
npm run build

# Chạy production server
npm start
```

### Kiểm tra TypeScript

```bash
npm run typecheck
```

## Hướng dẫn sử dụng

1. **Tạo tài khoản** — Truy cập `/login`, chọn "Đăng ký", nhập email + mật khẩu (tối thiểu 6 ký tự)
2. **Dữ liệu mẫu tự động** — Khi đăng ký, ứng dụng tự động tạo:
   - Cài đặt mặc định (giờ giấc 04:25–21:45)
   - 17 hoạt động cố định hàng ngày
   - 6 môn học với mục tiêu tuần/tháng
   - Thời khóa biểu T2–T6
   - Mục tiêu tiếng Anh 7 kỹ năng
   - Sách mẫu "Gương Chúa Giêsu"
   - Mục tiêu học kỳ
3. **Sử dụng** — Sau khi đăng nhập, bạn sẽ thấy Dashboard. Điều hướng qua sidebar bên trái.
4. **Đăng xuất** — Click vào email ở góc trên bên phải, chọn "Đăng xuất".

## Deploy lên server

### Netlify (khuyến nghị)

1. Push code lên GitHub/GitLab
2. Vào [netlify.com](https://netlify.com) → "Add new site" → "Import from Git"
3. Chọn repo, Netlify tự động nhận diện Next.js qua `netlify.toml`
4. Biến môi trường Supabase đã có sẵn trong `.env` — thêm chúng vào Netlify settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy — Netlify chạy `npm run build` tự động

### Vercel

1. Push code lên GitHub
2. Vào [vercel.com](https://vercel.com) → "Add New Project"
3. Chọn repo, Vercel tự nhận diện Next.js
4. Thêm biến môi trường Supabase (same as above)
5. Deploy

### VPS / Docker

```bash
# Build
npm run build

# Chạy với PM2
npm install -g pm2
pm2 start npm --name "study-planner" -- start

# Hoặc chạy với Docker
# (cần tạo Dockerfile riêng)
```

## Biến môi trường

Các biến đã được cấu hình sẵn trong `.env`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Không cần cấu hình thêm khi chạy local. Khi deploy, thêm các biến này vào platform settings.

## Giấy phép

Dự án nội bộ, không phân phối công khai.
