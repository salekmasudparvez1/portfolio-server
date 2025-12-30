"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const verifyAdmin_1 = __importDefault(require("../../middlewares/verifyAdmin"));
const admin_controller_1 = require("./admin.controller");
const admin_validations_1 = require("./admin.validations");
const adminRouter = (0, express_1.Router)();
adminRouter.get('/users', verifyAdmin_1.default, admin_controller_1.adminController.getAllUsers);
adminRouter.delete('/user/:id', verifyAdmin_1.default, admin_controller_1.adminController.deleteUser);
adminRouter.put('/users/:id', verifyAdmin_1.default, (0, validateRequest_1.default)(admin_validations_1.updateRoleValidationSchema), admin_controller_1.adminController.updateRole);
exports.default = adminRouter;
//# sourceMappingURL=admin.routes.js.map