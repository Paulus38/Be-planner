"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authMiddleware, async (req, res) => {
    const client = req.userClient;
    try {
        const [settingsRes, fixedRes, scheduleRes, subjectsRes, tasksRes, sessionsRes, journalRes, goalsRes, progressRes,] = await Promise.all([
            client.from('settings').select('*').limit(1).maybeSingle(),
            client.from('fixed_activities').select('*').order('sort_order'),
            client.from('schedule_entries').select('*').order('weekday, sort_order'),
            client.from('study_subjects').select('*').order('sort_order'),
            client.from('tasks').select('*').order('due_date'),
            client.from('study_sessions').select('*').order('date, start_time'),
            client.from('journal_entries').select('*').order('entry_date', { ascending: false }).limit(30),
            client.from('weekly_goals').select('*'),
            client.from('daily_progress').select('*').order('progress_date', { ascending: false }).limit(60),
        ]);
        res.json({
            settings: settingsRes.data || null,
            fixedActivities: fixedRes.data || [],
            scheduleEntries: scheduleRes.data || [],
            subjects: subjectsRes.data || [],
            tasks: tasksRes.data || [],
            sessions: sessionsRes.data || [],
            journalEntries: journalRes.data || [],
            weeklyGoals: goalsRes.data || [],
            dailyProgress: progressRes.data || [],
        });
    }
    catch (err) {
        console.error('Bulk data error:', err);
        res.status(500).json({ error: 'Failed to load data' });
    }
});
exports.default = router;
//# sourceMappingURL=data.js.map