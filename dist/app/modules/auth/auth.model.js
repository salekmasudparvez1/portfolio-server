"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importStar(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const authSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    role: { type: String, enum: ['admin', 'user'], required: true },
    isBlocked: { type: Boolean, default: false, required: true },
    subscriptionPlan: { type: String, enum: ['free', 'premium'], default: 'free' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    photoURL: { type: String, required: true },
    region: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerifyCode: String,
    emailVerifyExpire: Date
}, {
    timestamps: true,
    versionKey: false,
    collection: 'users',
});
authSchema.pre('save', async function () {
    const data = this;
    if (!data.password) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Password is required');
    }
    data.password = await bcrypt_1.default.hash(data.password, Number(config_1.default.bcrypt_salt_rounds));
});
authSchema.statics.isPasswordMatched = async function (plainTextPassword, hashedPassword) {
    return await bcrypt_1.default.compare(plainTextPassword, hashedPassword);
};
authSchema.statics.isUserExistsByCustomId = async function (email) {
    return await exports.Auth.findOne({ email }).select('+password');
};
exports.Auth = mongoose_1.default.model('user', authSchema);
//# sourceMappingURL=auth.model.js.map