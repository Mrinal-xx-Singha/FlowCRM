"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const auth_middleware_1 = __importDefault(require("./middleware/auth.middleware"));
const customer_route_1 = __importDefault(require("./routes/customer.route"));
const jobs_route_1 = __importDefault(require("./routes/jobs.route"));
const dashboard_route_1 = __importDefault(require("./routes/dashboard.route"));
const reminder_route_1 = __importDefault(require("./routes/reminder.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
    message: {
        message: "Too many requests from this IP, please try again after 15 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === "test", // Bypass during tests
});
app.use(globalLimiter);
app.use("/auth", auth_route_1.default);
app.use("/api", auth_middleware_1.default, user_route_1.default);
app.use("/api", auth_middleware_1.default, customer_route_1.default);
app.use("/api", auth_middleware_1.default, jobs_route_1.default);
app.use("/api", auth_middleware_1.default, reminder_route_1.default);
app.use("/api", auth_middleware_1.default, dashboard_route_1.default);
exports.default = app;
