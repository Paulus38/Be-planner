import { supabase } from '@/lib/supabase';

export async function seedDefaultDataForUser(userId: string) {
  const { data: existingSettings } = await supabase
    .from('settings')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (existingSettings) return;

  await supabase.from('settings').insert({
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
    { name: 'Thức dậy, vệ sinh cá nhân', start_time: '04:25', end_time: '04:45', category: 'fixed', sort_order: 1 },
    { name: 'Thánh lễ', start_time: '04:45', end_time: '06:00', category: 'mass', sort_order: 2 },
    { name: 'Ăn sáng + Lao tác + Sinh hoạt chung', start_time: '06:00', end_time: '08:00', category: 'meal', sort_order: 3 },
    { name: 'Học chính khóa (sáng)', start_time: '08:00', end_time: '11:00', category: 'class', sort_order: 4 },
    { name: 'Kinh trưa', start_time: '11:15', end_time: '11:30', category: 'prayer', sort_order: 5 },
    { name: 'Cơm trưa', start_time: '11:30', end_time: '12:00', category: 'meal', sort_order: 6 },
    { name: 'Nghỉ trưa', start_time: '12:00', end_time: '13:45', category: 'rest', sort_order: 7 },
    { name: 'Thức dậy, vệ sinh', start_time: '13:45', end_time: '14:00', category: 'fixed', sort_order: 8 },
    { name: 'Viếng Chúa', start_time: '14:00', end_time: '14:30', category: 'prayer', sort_order: 9 },
    { name: 'Học chính khóa / Tự học (chiều)', start_time: '14:30', end_time: '16:25', category: 'class', sort_order: 10 },
    { name: 'Thể thao + Vệ sinh cá nhân', start_time: '16:30', end_time: '18:00', category: 'sports', sort_order: 11 },
    { name: 'Ăn tối', start_time: '18:00', end_time: '18:45', category: 'meal', sort_order: 12 },
    { name: 'Thời gian chuyển tiếp / Nghỉ', start_time: '18:45', end_time: '19:15', category: 'rest', sort_order: 13 },
    { name: 'Kinh tối', start_time: '19:15', end_time: '19:30', category: 'prayer', sort_order: 14 },
    { name: 'Tự học cá nhân (tối)', start_time: '19:30', end_time: '21:20', category: 'self_study', sort_order: 15 },
    { name: 'Nhật ký thiêng liêng', start_time: '21:20', end_time: '21:35', category: 'journal', sort_order: 16 },
    { name: 'Chuẩn bị ngủ', start_time: '21:35', end_time: '21:45', category: 'fixed', sort_order: 17 },
  ];

  await supabase.from('fixed_activities').insert(
    fixedActivities.map((a) => ({ ...a, user_id: userId }))
  );

  const subjects = [
    { name: 'Tiếng Anh', code: 'english', color: '#3b82f6', is_in_english_ratio: true, weekly_goal_min: 315, monthly_goal_min: 1260, sort_order: 1 },
    { name: 'Việt văn', code: 'vietnamese', color: '#10b981', is_in_english_ratio: true, weekly_goal_min: 105, monthly_goal_min: 420, sort_order: 2 },
    { name: 'Đàn', code: 'instrument', color: '#f59e0b', is_in_english_ratio: true, weekly_goal_min: 105, monthly_goal_min: 420, sort_order: 3 },
    { name: 'Đọc sách', code: 'reading', color: '#8b5cf6', is_in_english_ratio: true, weekly_goal_min: 105, monthly_goal_min: 420, sort_order: 4 },
    { name: 'Ôn bài / Bài tập', code: 'homework', color: '#ef4444', is_in_english_ratio: false, weekly_goal_min: 210, monthly_goal_min: 840, sort_order: 5 },
    { name: 'Nhật ký thiêng liêng', code: 'journal', color: '#ec4899', is_in_english_ratio: false, weekly_goal_min: 105, monthly_goal_min: 420, sort_order: 6 },
  ];

  await supabase.from('study_subjects').insert(
    subjects.map((s) => ({ ...s, user_id: userId }))
  );

  const scheduleEntries = [
    // Monday
    { weekday: 1, start_time: '08:00', end_time: '08:40', subject_name: 'Phụng vụ và Bí tích Tổng quát', session_type: 'class', sort_order: 1 },
    { weekday: 1, start_time: '08:45', end_time: '09:25', subject_name: 'PP. Suy niệm & Viết Suy Niệm Lời Chúa', session_type: 'class', sort_order: 2 },
    { weekday: 1, start_time: '09:35', end_time: '10:15', subject_name: 'Giáo lý HTCG 1', session_type: 'class', sort_order: 3 },
    { weekday: 1, start_time: '10:20', end_time: '11:00', subject_name: 'Giáo lý HTCG 1', session_type: 'class', sort_order: 4 },
    { weekday: 1, start_time: '14:15', end_time: '14:55', subject_name: 'Đọc sách chung / Lao động tùy tuần', session_type: 'reading', sort_order: 5 },
    // Tuesday
    { weekday: 2, start_time: '08:00', end_time: '08:40', subject_name: 'Tiếng Việt thực hành 1 & Văn nghị luận 1', session_type: 'class', sort_order: 1 },
    { weekday: 2, start_time: '08:45', end_time: '09:25', subject_name: 'Tiếng Việt thực hành 1 & Văn nghị luận 1', session_type: 'class', sort_order: 2 },
    { weekday: 2, start_time: '09:35', end_time: '10:15', subject_name: 'Giáo lý HTCG 1', session_type: 'class', sort_order: 3 },
    { weekday: 2, start_time: '10:20', end_time: '11:00', subject_name: 'Giáo lý HTCG 1', session_type: 'class', sort_order: 4 },
    { weekday: 2, start_time: '14:30', end_time: '16:25', subject_name: 'Xướng âm, Nhạc lý căn bản & Thực hành đàn Organ 1', session_type: 'class', sort_order: 5 },
    // Wednesday
    { weekday: 3, start_time: '08:00', end_time: '08:40', subject_name: 'Kỹ năng mềm & Phương pháp đọc sách', session_type: 'class', sort_order: 1 },
    { weekday: 3, start_time: '08:45', end_time: '09:25', subject_name: 'Kỹ năng mềm & Phương pháp đọc sách', session_type: 'class', sort_order: 2 },
    { weekday: 3, start_time: '09:35', end_time: '10:15', subject_name: 'Language Skills 1A/1B', session_type: 'class', sort_order: 3 },
    { weekday: 3, start_time: '10:20', end_time: '11:00', subject_name: 'Language Skills 1A/1B', session_type: 'class', sort_order: 4 },
    { weekday: 3, start_time: '14:30', end_time: '15:10', subject_name: 'Grammar 1', session_type: 'class', sort_order: 5 },
    { weekday: 3, start_time: '15:15', end_time: '15:55', subject_name: 'Basic Translation 1', session_type: 'class', sort_order: 6 },
    { weekday: 3, start_time: '16:00', end_time: '16:25', subject_name: 'Language Skills 1B', session_type: 'class', sort_order: 7 },
    // Thursday
    { weekday: 4, start_time: '08:00', end_time: '08:40', subject_name: 'Pronunciation', session_type: 'class', sort_order: 1 },
    { weekday: 4, start_time: '08:45', end_time: '09:25', subject_name: 'Pronunciation', session_type: 'class', sort_order: 2 },
    { weekday: 4, start_time: '09:35', end_time: '10:15', subject_name: 'Language Skills 1B', session_type: 'class', sort_order: 3 },
    { weekday: 4, start_time: '10:20', end_time: '11:00', subject_name: 'Language Skills 1B', session_type: 'class', sort_order: 4 },
    { weekday: 4, start_time: '14:30', end_time: '15:10', subject_name: 'Grammar 1', session_type: 'class', sort_order: 5 },
    { weekday: 4, start_time: '15:15', end_time: '16:25', subject_name: 'Basic Translation 1', session_type: 'class', sort_order: 6 },
    // Friday
    { weekday: 5, start_time: '08:00', end_time: '08:40', subject_name: 'Phân định ơn gọi & Tổng quát Đấng, Linh đạo ĐSTF', session_type: 'class', sort_order: 1 },
    { weekday: 5, start_time: '08:45', end_time: '09:25', subject_name: 'Phân định ơn gọi & Tổng quát Đấng, Linh đạo ĐSTF', session_type: 'class', sort_order: 2 },
    { weekday: 5, start_time: '09:35', end_time: '10:15', subject_name: 'Đọc sách', session_type: 'reading', sort_order: 3 },
    { weekday: 5, start_time: '10:20', end_time: '11:00', subject_name: 'Đọc sách', session_type: 'reading', sort_order: 4 },
    { weekday: 5, start_time: '14:30', end_time: '15:10', subject_name: 'English Vocabulary in Use 1', session_type: 'class', sort_order: 5 },
    { weekday: 5, start_time: '15:15', end_time: '16:25', subject_name: 'Basic Translation 1', session_type: 'class', sort_order: 6 },
  ];

  await supabase.from('schedule_entries').insert(
    scheduleEntries.map((e) => ({ ...e, user_id: userId }))
  );

  // Weekly English skill goals
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

  await supabase.from('weekly_goals').insert(
    englishSkills.map((s) => ({
      user_id: userId,
      week_start: weekStart,
      subject_code: 'english',
      target_min: s.target,
      skill: s.skill,
    }))
  );

  // Sample book
  await supabase.from('books').insert({
    user_id: userId,
    title: 'Gương Chúa Giêsu',
    author: 'Thomas à Kempis',
    total_pages: 300,
    current_page: 0,
    daily_goal_pages: 10,
    start_date: weekStart,
    status: 'reading',
  });

  // Semester goal
  await supabase.from('semester_goals').insert({
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
}
