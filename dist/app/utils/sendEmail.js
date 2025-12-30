"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationCodeEmail = void 0;
const resend_1 = require("resend");
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
/**
 * Validate config ONCE at module load
 */
if (!config_1.default.RESEND_API_KEY) {
    throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "RESEND_API_KEY is missing");
}
if (!config_1.default.EMAIL_TEMPLATE_ID) {
    throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "EMAIL_TEMPLATE_ID is missing");
}
/**
 * Singleton Resend client
 */
const resend = new resend_1.Resend(config_1.default.RESEND_API_KEY);
/**
 * Send verification email using Resend template
 */
const sendVerificationCodeEmail = async (email, code, name) => {
    console.info("➡️ sendVerificationCodeEmail called for:", email);
    // TypeScript knows EMAIL_TEMPLATE_ID exists now, use !
    const templateId = config_1.default.EMAIL_TEMPLATE_ID;
    const { data, error } = await resend.emails.send({
        from: "Support <support@parvez.dev>",
        to: email,
        template: {
            id: templateId,
            variables: {
                NAME: name,
                CODE: code,
                YEAR: new Date().getFullYear(),
            },
        },
    });
    if (error) {
        console.error("❌ Resend email error:", error);
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to send verification email");
    }
    console.info("✅ Verification email sent. ID:", data?.id);
    return data; // { id: string }
};
exports.sendVerificationCodeEmail = sendVerificationCodeEmail;
//# sourceMappingURL=sendEmail.js.map