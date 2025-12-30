"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const auth_model_1 = require("../auth/auth.model");
const getAllUsersFunc = async (req) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const data = await auth_model_1.Auth.find({ role: { $ne: 'admin' } }).skip(skip).limit(limit);
    const total = await auth_model_1.Auth.countDocuments({ role: { $ne: 'admin' } });
    return {
        data,
        meta: {
            page,
            limit,
            total,
        }
    };
};
const deleteUserFunc = async (userId) => {
    const user = await auth_model_1.Auth.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    if (user?.role === "admin") {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, `Admin's can not be deleted`);
    }
    const res = await auth_model_1.Auth.findByIdAndDelete(userId);
    return res;
};
const updateRoleFunc = async (userId, role) => {
    const user = await auth_model_1.Auth.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    if (user?.role === "admin") {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, `Admin's role can not be changed`);
    }
    ;
    const res = await auth_model_1.Auth.findByIdAndUpdate(userId, { role });
    return res;
};
exports.adminService = {
    getAllUsersFunc,
    deleteUserFunc,
    updateRoleFunc
};
//# sourceMappingURL=admin.service.js.map