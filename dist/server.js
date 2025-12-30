"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
async function connectDatabase() {
    try {
        await mongoose_1.default.connect(config_1.default.database_url);
        // Only start a listener when running locally (not serverless)
        if (!process.env.VERCEL) {
            app_1.default.listen(config_1.default.port, () => {
                console.log(`Server running on port ${config_1.default.port} `);
            });
        }
    }
    catch (err) {
        console.error(`❌ Database Connection Error:`, err);
    }
}
// Call connectDatabase only in non-serverless dev
if (!process.env.VERCEL) {
    connectDatabase();
}
async function handler(req, res) {
    // Ensure DB connected before handling request in serverless
    if (mongoose_1.default.connection.readyState !== 1) {
        try {
            await mongoose_1.default.connect(config_1.default.database_url);
        }
        catch (err) {
            console.error('DB connect failed in handler', err);
            return res.status(500).send('Database connection error');
        }
    }
    return (0, app_1.default)(req, res);
}
//# sourceMappingURL=server.js.map