"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_1 = require("../lib/supabase");
const router = (0, express_1.Router)();
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'Email and password required' });
        return;
    }
    const { data, error } = await supabase_1.supabase.auth.signUp({ email, password });
    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }
    res.json({
        user: data.user,
        session: data.session,
    });
});
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'Email and password required' });
        return;
    }
    const { data, error } = await supabase_1.supabase.auth.signInWithPassword({ email, password });
    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }
    res.json({
        user: data.user,
        session: data.session,
    });
});
router.post('/signout', async (_req, res) => {
    res.json({ success: true });
});
router.get('/session', async (req, res) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        res.json({ user: null, session: null });
        return;
    }
    const token = header.substring(7);
    const { data, error } = await supabase_1.supabase.auth.getUser(token);
    if (error || !data.user) {
        res.json({ user: null, session: null });
        return;
    }
    res.json({ user: data.user });
});
exports.default = router;
//# sourceMappingURL=auth.js.map