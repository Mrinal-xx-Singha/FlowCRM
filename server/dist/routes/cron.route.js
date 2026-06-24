"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cron_service_1 = require("../services/cron.service");
const router = (0, express_1.Router)();
router.post("/cron/reminders", async (req, res) => {
    // Check the secret token in the heades
    const authHeader = req.headers.authorization;
    const expectedSecret = process.env.CRON_SECRET;
    if (!expectedSecret) {
        console.error("CRON_SECRET is not configured in environment variable");
        return res.status(500).json({ error: "Server configuration error" });
    }
    if (authHeader !== `Bearer ${expectedSecret}`) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    // if authorized run the job
    try {
        const result = await (0, cron_service_1.processReminders)();
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error during cron execution" });
    }
});
exports.default = router;
