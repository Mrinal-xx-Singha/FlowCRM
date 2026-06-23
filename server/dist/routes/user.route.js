"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.get("/me", user_controller_1.getCurrentUser);
router.patch("/profile", user_controller_1.updateUserProfile);
router.patch("/password", user_controller_1.updateUserPassword);
exports.default = router;
