"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_controller_1 = require("../controllers/ai.controller");
const validate_middleware_1 = require("../middleware/validate.middleware");
const ai_schema_1 = require("../schemas/ai.schema");
const router = (0, express_1.Router)();
router.post("/ai/draft-email", (0, validate_middleware_1.validate)(ai_schema_1.draftEmailSchema), ai_controller_1.draftEmailHandler);
exports.default = router;
