"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.authMiddleware, async (req, res) => {
    const client = req.userClient;
    const userId = req.userId;
    try {
        const { data: existingSettings } = await client
            .from('settings')
            .select('id')
            .limit(1)
            .maybeSingle();
        if (existingSettings) {
            res.json({ seeded: false, message: 'Data already exists' });
            return;
        }
        await client.from('settings').insert({
            user_id: userId,
            wake_time: '04:25',
            sleep_time: '21:45',
            mass_time_start: '04:45',
            mass_time_end: '06:00',
            breakfast_start: '06:00',
            breakfast_end: '08:00',
            lunch_start: '11:30',
            lunch_end: '12:00',
            nap_start: '12:00',
            nap_end: '13:45',
            sports_start: '16:30',
            sports_end: '18:00',
            dinner_start: '18:00',
            dinner_end: '18:45',
            evening_prayer_time: '19:15',
            study_block1_start: '08:00',
            study_block1_end: '11:00',
            study_block2_start: '14:30',
            study_block2_end: '16:25',
            self_study_start: '19:30',
            self_study_end: '21:20',
            session_duration_min: 45,
            break_duration_min: 10,
            english_target_pct: 50,
            journal_min_min: 15,
            notifications_enabled: true,
            notify_before_study_min: 10,
            notify_before_end_min: 5,
            notify_journal: true,
            notify_sleep: true,
            notify_incomplete: true,
            notify_weekly_review: true,
        });
        const fixedActivities = [
            { name: 'Thức dậy, vệ sinh cá nhân', start_time: '04:25', end_time: '04:45', category: 'fixed', sort_order: 1, user_id: userId },
            { name: 'Thánh lễ', start_time: '04:45', end_time: '06:00', category: 'mass', sort_order: 2, user_id: userId },
            { name: 'Ăn sáng + Lao tác + Sinh hoạt chung', start_time: '06:00', end_time: '08:00', category: 'meal', sort_order: 3, user_id: userId },
            { name: 'Học chính khóa (sáng)', start_time: '08:00', end_time: '11:00', category: 'class', sort_order: 4, user_id: userId },
            { name: 'Kinh trưa', start_time: '11:15', end_time: '11:30', category: 'prayer', sort_order: 5, user_id: userId },
            { name: 'Cơm trưa', start_time: '11:30', end_time: '12:00', category: 'meal', sort_order: 6, user_id: userId },
            { name: 'Nghỉ trưa', start_time: '12:00', end_time: '13:45', category: 'rest', sort_order: 7, user_id: userId },
            { name: 'Thức dậy, vệ sinh', start_time: '13:45', end_time: '14:00', category: 'fixed', sort_order: 8, user_id: userId },
            { name: 'Viếng Chúa', start_time: '14:00', end_time: '14:30', category: 'prayer', sort_order: 9, user_id: userId },
            { name: 'Học chính khóa / Tự học (chiều)', start_time: '14:30', end_time: '16:25', category: 'class', sort_order: 10, user_id: userId },
            { name: 'Thể thao + Vệ sinh cá nhân', start_time: '16:30', end_time: '18:00', category: 'sports', sort_order: 11, user_id: userId },
            { name: 'Ăn tối', start_time: '18:00', end_time: '18:45', category: 'meal', sort_order: 12, user_id: userId },
            { name: 'Thời gian chuyển tiếp / Nghỉ', start_time: '18:45', end_time: '19:15', category: 'rest', sort_order: 13, user_id: userId },
            { name: 'Kinh tối', start_time: '19:15', end_time: '19:30', category: 'prayer', sort_order: 14, user_id: userId },
            { name: 'Tự học cá nhân (tối)', start_time: '19:30', end_time: '21:20', category: 'self_study', sort_order: 15, user_id: userId },
            { name: 'Nhật ký thiêng liêng', start_time: '21:20', end_time: '21:35', category: 'journal', sort_order: 16, user_id: userId },
            { name: 'Chuẩn bị ngủ', start_time: '21:35', end_time: '21:45', category: 'fixed', sort_order: 17, user_id: userId },
        ];
        await client.from('fixed_activities').insert(fixedActivities);
        const subjects = [
            { name: 'Tiếng Anh', code: 'english', color: '#3b82f6', is_in_english_ratio: true, weekly_goal_min: 315, monthly_goal_min: 1260, sort_order: 1, user_id: userId },
            { name: 'Việt văn', code: 'vietnamese', color: '#10b981', is_in_english_ratio: true, weekly_goal_min: 105, monthly_goal_min: 420, sort_order: 2, user_id: userId },
            { name: 'Đàn', code: 'instrument', color: '#f59e0b', is_in_english_ratio: true, weekly_goal_min: 105, monthly_goal_min: 420, sort_order: 3, user_id: userId },
            { name: 'Đọc sách', code: 'reading', color: '#8b5cf6', is_in_english_ratio: true, weekly_goal_min: 105, monthly_goal_min: 420, sort_order: 4, user_id: userId },
            { name: 'Ôn bài / Bài tập', code: 'homework', color: '#ef4444', is_in_english_ratio: false, weekly_goal_min: 210, monthly_goal_min: 840, sort_order: 5, user_id: userId },
            { name: 'Nhật ký thiêng liêng', code: 'journal', color: '#ec4899', is_in_english_ratio: false, weekly_goal_min: 105, monthly_goal_min: 420, sort_order: 6, user_id: userId },
        ];
        await client.from('study_subjects').insert(subjects);
        const scheduleEntries = [
            { weekday: 1, start_time: '08:00', end_time: '08:40', subject_name: 'Phụng vụ và Bí tích Tổng quát', session_type: 'class', sort_order: 1, user_id: userId },
            { weekday: 1, start_time: '08:45', end_time: '09:25', subject_name: 'PP. Suy niệm & Viết Suy Niệm Lời Chúa', session_type: 'class', sort_order: 2, user_id: userId },
            { weekday: 1, start_time: '09:35', end_time: '10:15', subject_name: 'Giáo lý HTCG 1', session_type: 'class', sort_order: 3, user_id: userId },
            { weekday: 1, start_time: '10:20', end_time: '11:00', subject_name: 'Giáo lý HTCG 1', session_type: 'class', sort_order: 4, user_id: userId },
            { weekday: 1, start_time: '14:15', end_time: '14:55', subject_name: 'Đọc sách chung / Lao động tùy tuần', session_type: 'reading', sort_order: 5, user_id: userId },
            { weekday: 2, start_time: '08:00', end_time: '08:40', subject_name: 'Tiếng Việt thực hành 1 & Văn nghị luận 1', session_type: 'class', sort_order: 1, user_id: userId },
            { weekday: 2, start_time: '08:45', end_time: '09:25', subject_name: 'Tiếng Việt thực hành 1 & Văn nghị luận 1', session_type: 'class', sort_order: 2, user_id: userId },
            { weekday: 2, start_time: '09:35', end_time: '10:15', subject_name: 'Giáo lý HTCG 1', session_type: 'class', sort_order: 3, user_id: userId },
            { weekday: 2, start_time: '10:20', end_time: '11:00', subject_name: 'Giáo lý HTCG 1', session_type: 'class', sort_order: 4, user_id: userId },
            { weekday: 2, start_time: '14:30', end_time: '16:25', subject_name: 'Xướng âm, Nhạc lý căn bản & Thực hành đàn Organ 1', session_type: 'class', sort_order: 5, user_id: userId },
            { weekday: 3, start_time: '08:00', end_time: '08:40', subject_name: 'Kỹ năng mềm & Phương pháp đọc sách', session_type: 'class', sort_order: 1, user_id: userId },
            { weekday: 3, start_time: '08:45', end_time: '09:25', subject_name: 'Kỹ năng mềm & Phương pháp đọc sách', session_type: 'class', sort_order: 2, user_id: userId },
            { weekday: 3, start_time: '09:35', end_time: '10:15', subject_name: 'Language Skills 1A/1B', session_type: 'class', sort_order: 3, user_id: userId },
            { weekday: 3, start_time: '10:20', end_time: '11:00', subject_name: 'Language Skills 1A/1B', session_type: 'class', sort_order: 4, user_id: userId },
            { weekday: 3, start_time: '14:30', end_time: '15:10', subject_name: 'Grammar 1', session_type: 'class', sort_order: 5, user_id: userId },
            { weekday: 3, start_time: '15:15', end_time: '15:55', subject_name: 'Basic Translation 1', session_type: 'class', sort_order: 6, user_id: userId },
            { weekday: 3, start_time: '16:00', end_time: '16:25', subject_name: 'Language Skills 1B', session_type: 'class', sort_order: 7, user_id: userId },
            { weekday: 4, start_time: '08:00', end_time: '08:40', subject_name: 'Pronunciation', session_type: 'class', sort_order: 1, user_id: userId },
            { weekday: 4, start_time: '08:45', end_time: '09:25', subject_name: 'Pronunciation', session_type: 'class', sort_order: 2, user_id: userId },
            { weekday: 4, start_time: '09:35', end_time: '10:15', subject_name: 'Language Skills 1B', session_type: 'class', sort_order: 3, user_id: userId },
            { weekday: 4, start_time: '10:20', end_time: '11:00', subject_name: 'Language Skills 1B', session_type: 'class', sort_order: 4, user_id: userId },
            { weekday: 4, start_time: '14:30', end_time: '15:10', subject_name: 'Grammar 1', session_type: 'class', sort_order: 5, user_id: userId },
            { weekday: 4, start_time: '15:15', end_time: '16:25', subject_name: 'Basic Translation 1', session_type: 'class', sort_order: 6, user_id: userId },
            { weekday: 5, start_time: '08:00', end_time: '08:40', subject_name: 'Phân định ơn gọi & Tổng quát Đấng, Linh đạo ĐSTF', session_type: 'class', sort_order: 1, user_id: userId },
            { weekday: 5, start_time: '08:45', end_time: '09:25', subject_name: 'Phân định ơn gọi & Tổng quát Đấng, Linh đạo ĐSTF', session_type: 'class', sort_order: 2, user_id: userId },
            { weekday: 5, start_time: '09:35', end_time: '10:15', subject_name: 'Đọc sách', session_type: 'reading', sort_order: 3, user_id: userId },
            { weekday: 5, start_time: '10:20', end_time: '11:00', subject_name: 'Đọc sách', session_type: 'reading', sort_order: 4, user_id: userId },
            { weekday: 5, start_time: '14:30', end_time: '15:10', subject_name: 'English Vocabulary in Use 1', session_type: 'class', sort_order: 5, user_id: userId },
            { weekday: 5, start_time: '15:15', end_time: '16:25', subject_name: 'Basic Translation 1', session_type: 'class', sort_order: 6, user_id: userId },
        ];
        await client.from('schedule_entries').insert(scheduleEntries);
        const today = new Date();
        const day = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - day + (day === 0 ? -6 : 1));
        const weekStart = monday.toISOString().split('T')[0];
        const englishSkills = [
            { skill: 'vocabulary', target: 60 },
            { skill: 'grammar', target: 75 },
            { skill: 'reading', target: 45 },
            { skill: 'listening', target: 50 },
            { skill: 'speaking', target: 40 },
            { skill: 'pronunciation', target: 20 },
            { skill: 'translation', target: 25 },
        ];
        await client.from('weekly_goals').insert(englishSkills.map((s) => ({
            user_id: userId,
            week_start: weekStart,
            subject_code: 'english',
            target_min: s.target,
            skill: s.skill,
        })));
        await client.from('books').insert({
            user_id: userId,
            title: 'Gương Chúa Giêsu',
            author: 'Thomas à Kempis',
            total_pages: 300,
            current_page: 0,
            daily_goal_pages: 10,
            start_date: weekStart,
            status: 'reading',
        });
        await client.from('semester_goals').insert({
            user_id: userId,
            name: 'Học kỳ 1 2026',
            start_date: '2026-09-01',
            end_date: '2027-01-31',
            english_target_min: 5040,
            vietnamese_target_min: 1680,
            instrument_target_min: 1680,
            reading_target_min: 1680,
            target_books: 6,
            target_essays: 10,
            target_tasks: 100,
            target_journal_days: 120,
        });
        res.json({ seeded: true });
    }
    catch (err) {
        console.error('Seed error:', err);
        res.status(500).json({ error: 'Failed to seed data' });
    }
});
exports.default = router;
//# sourceMappingURL=seed.js.map