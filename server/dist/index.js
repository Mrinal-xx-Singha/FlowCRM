"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbConnect_1 = require("./db/dbConnect");
const app_1 = __importDefault(require("./app"));
const startServer = async () => {
    await (0, dbConnect_1.connectDB)();
    const PORT = process.env.PORT || 8000;
    app_1.default.listen(PORT, () => {
        console.log(`Server running on PORT: ${PORT}`);
    });
};
startServer();
