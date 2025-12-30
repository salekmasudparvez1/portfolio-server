"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const admin_service_1 = require("./admin.service");
const getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
    const result = await admin_service_1.adminService.getAllUsersFunc(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'All users fetched successfully',
        data: result,
        statusCode: http_status_codes_1.StatusCodes.OK,
    });
});
const deleteUser = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.params.id;
    const result = await admin_service_1.adminService.deleteUserFunc(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'User deleted successfully',
        data: result,
        statusCode: http_status_codes_1.StatusCodes.OK,
    });
});
const updateRole = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.params.id;
    const { role } = req.body;
    const result = await admin_service_1.adminService.updateRoleFunc(userId, role);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'User role updated successfully',
        data: result,
        statusCode: http_status_codes_1.StatusCodes.OK,
    });
});
exports.adminController = {
    getAllUsers,
    deleteUser,
    updateRole
};
//# sourceMappingURL=admin.controller.js.map