"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const verifyAdmin_1 = __importDefault(require("../../middlewares/verifyAdmin"));
const auth_validations_1 = require("./auth.validations");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const verifyUser_1 = __importDefault(require("../../middlewares/verifyUser"));
const authRouter = (0, express_1.Router)();
authRouter.post('/signup', (0, validateRequest_1.default)(auth_validations_1.signupValidationSchema), auth_controller_1.authController.signup); //email
authRouter.post('/signup-with-provider', auth_controller_1.authController.signupWithProvider);
authRouter.post('/sign-in-with-provider', auth_controller_1.authController.signInWithProvider);
authRouter.post('/resend-verification-code', verifyUser_1.default, auth_controller_1.authController.resendVerificationCode);
authRouter.post('/verify-user-code', verifyUser_1.default, auth_controller_1.authController.verificationUserCode);
authRouter.post('/login', (0, validateRequest_1.default)(auth_validations_1.loginValidationSchema), auth_controller_1.authController.login);
authRouter.get('/profile', verifyUser_1.default, auth_controller_1.authController.getProfileInfo);
authRouter.patch('/update-user/:id', verifyAdmin_1.default, auth_controller_1.authController.updateUser);
authRouter.get('/getSingle/:email', auth_controller_1.authController.getSingleUser);
authRouter.patch('/update', verifyAdmin_1.default, auth_controller_1.authController.status);
authRouter.patch('/update/user', auth_controller_1.authController.updateName);
authRouter.put('/update/password', verifyUser_1.default, auth_controller_1.authController.updatePassword);
exports.default = authRouter;
//# sourceMappingURL=auth.routes.js.map