"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const data_1 = __importDefault(require("./routes/data"));
const crud_1 = __importDefault(require("./routes/crud"));
const seed_1 = __importDefault(require("./routes/seed"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
}));
app.use(express_1.default.json({ limit: '2mb' }));
app.use('/api/auth', auth_1.default);
app.use('/api/data', data_1.default);
app.use('/api/seed', seed_1.default);
app.use('/api', crud_1.default);
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});
const PORT = parseInt(process.env.PORT || '3001', 10);
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map