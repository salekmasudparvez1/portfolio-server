"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const auth_service_1 = require("./auth.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const config_1 = __importDefault(require("../../config"));
const signup = (0, catchAsync_1.default)(async (req, res) => {
    const data = req.body;
    const getDoc = {
        name: data?.name,
        username: data?.username,
        email: data?.email,
        phoneNumber: data?.phoneNumber,
        password: data?.password,
        role: data?.role || "user",
        photoURL: data?.photoURL || "https://res.cloudinary.com/dncnvqrc6/image/upload/v1740454884/untitled.png",
        isBlocked: false,
        region: data?.region || "Not Specified",
        device: data?.device || "Not Specified",
        isEmailVerified: false,
        signInMethod: 'email',
    };
    const result = await auth_service_1.authService.signupFunc(getDoc);
    res.cookie('refreshToken', result.refreshToken, {
        secure: config_1.default.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'User sign up successfully',
        data: result,
        statusCode: http_status_codes_1.default.ACCEPTED,
    });
});
const signupWithProvider = (0, catchAsync_1.default)(async (req, res) => {
    const data = req.body;
    const getDoc = {
        name: data?.name,
        username: data?.username,
        email: data?.email,
        phoneNumber: data?.phoneNumber || "Not Specified",
        password: data?.password || "Not Specified",
        role: data?.role || "user",
        photoURL: data?.photoURL || "https://res.cloudinary.com/dncnvqrc6/image/upload/v1740454884/untitled.png",
        isBlocked: false,
        region: data?.region || "Not Specified",
        device: data?.device || "Not Specified",
        isEmailVerified: true,
        signInMethod: data?.signInMethod || 'unknown',
    };
    const result = await auth_service_1.authService.signupWithProviderfunc(getDoc);
    res.cookie('refreshToken', result?.refreshToken, {
        secure: config_1.default.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'User sign up with provider successfully',
        data: result?.userInfo,
        statusCode: http_status_codes_1.default.ACCEPTED,
    });
});
const signInWithProvider = (0, catchAsync_1.default)(async (req, res) => {
    const data = req.body;
    const result = await auth_service_1.authService.signInWithProviderfunc(data);
    res.cookie('refreshToken', result?.refreshToken, {
        secure: config_1.default.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'User sign in with provider successfully',
        data: result?.userInfo,
        statusCode: http_status_codes_1.default.OK,
    });
});
const resendVerificationCode = (0, catchAsync_1.default)(async (req, res) => {
    const { email } = req.body;
    const result = await auth_service_1.authService.resendVerificationCodeFunc(email);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'Verification code resent successfully',
        data: result,
        statusCode: http_status_codes_1.default.OK,
    });
});
const verificationUserCode = (0, catchAsync_1.default)(async (req, res) => {
    const { email, emailVerifyCode } = req.body;
    const result = await auth_service_1.authService.verificationUserCodeFunc(email, emailVerifyCode);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'User verified successfully',
        data: result,
        statusCode: http_status_codes_1.default.OK,
    });
});
const login = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.authService.loginFunc(req.body);
    const { refreshToken } = result;
    res.cookie('refreshToken', refreshToken, {
        secure: config_1.default.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'User logged in successfully',
        data: result,
        statusCode: http_status_codes_1.default.OK,
    });
});
const getProfileInfo = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.authService.getProfileInfoFunc(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'User profile fetched successfully',
        data: result,
        statusCode: http_status_codes_1.default.OK,
    });
});
const updateUser = (0, catchAsync_1.default)(async (req, res) => {
    const updatedData = req.body;
    const result = await auth_service_1.authService.updateUserFunc(updatedData);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'User updated successfully',
        data: result,
        statusCode: http_status_codes_1.default.OK,
    });
});
const status = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.authService.statusFuc(req?.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'Updated user status ',
        data: result,
        statusCode: http_status_codes_1.default.OK,
    });
});
const updatePassword = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.authService.updatePasswordFunc(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'Updated user password ',
        data: result,
        statusCode: http_status_codes_1.default.OK,
    });
});
const getSingleUser = (0, catchAsync_1.default)(async (req, res) => {
    const getUserInfo = req.params.email;
    const result = await auth_service_1.authService.getSingleUserFunc(getUserInfo);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'Updated user profile ',
        data: result,
        statusCode: http_status_codes_1.default.OK,
    });
});
const updateName = (0, catchAsync_1.default)(async (req, res) => {
    const getUserInfo = req.body;
    const result = await auth_service_1.authService.updateNameFunc({
        name: getUserInfo?.name,
        email: getUserInfo?.email,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'Updated user profile ',
        data: result,
        statusCode: http_status_codes_1.default.OK,
    });
});
exports.authController = {
    signup,
    resendVerificationCode,
    verificationUserCode,
    signInWithProvider,
    login,
    signupWithProvider,
    getProfileInfo,
    updateUser,
    status,
    updatePassword,
    getSingleUser,
    updateName,
};
//# sourceMappingURL=auth.controller.js.map