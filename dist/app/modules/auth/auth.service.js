"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const auth_utils_1 = require("./auth.utils");
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const generateCodeVarification_1 = __importDefault(require("../../utils/generateCodeVarification"));
const sendEmail_1 = require("../../utils/sendEmail");
const auth_model_1 = require("./auth.model");
const signupFunc = async (registrationDoc) => {
    // 1. Role validation: only allow 'admin' signup when a valid admin key is provided
    if (registrationDoc?.role === 'admin') {
        const providedKey = registrationDoc.adminKey;
        // If the server hasn't configured an admin key, signal that admin registration is disabled
        if (!config_1.default.ADMIN_REGISTRATION_KEY) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Admin registration is disabled on this server. Set ADMIN_REGISTRATION_KEY in the environment to enable it.');
        }
        if (!providedKey || providedKey !== config_1.default.ADMIN_REGISTRATION_KEY) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Admin registration is not allowed');
        }
        // Optionally remove adminKey from the doc before storing
        delete registrationDoc.adminKey;
    }
    // 2. Username validation
    if (!registrationDoc.username) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Username is required');
    }
    registrationDoc.username = registrationDoc.username.trim();
    if (/\s/.test(registrationDoc.username)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Username cannot contain whitespace');
    }
    // 3. Email validation
    if (!registrationDoc.email) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email is required');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registrationDoc.email)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid email format');
    }
    // 4. Phone number validation
    if (!registrationDoc.phoneNumber) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Phone number is required');
    }
    const phoneRegex = /^\+?\d{10,15}$/; // optional +, 10-15 digits
    if (!phoneRegex.test(registrationDoc.phoneNumber.toString())) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid phone number');
    }
    // 5. Check uniqueness in a single DB query
    const existing = await auth_model_1.Auth.findOne({
        $or: [
            { username: registrationDoc.username },
            { email: registrationDoc.email },
            { phoneNumber: registrationDoc.phoneNumber }
        ]
    });
    if (existing) {
        if (existing.username === registrationDoc.username) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'Username already exists');
        }
        if (existing.email === registrationDoc.email) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'Email already exists');
        }
        if (existing.phoneNumber === registrationDoc.phoneNumber) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'Phone number already exists');
        }
    }
    const { code, expires } = (0, generateCodeVarification_1.default)();
    // Persist the verification code and expiry on the user document
    registrationDoc.emailVerifyCode = code;
    registrationDoc.emailVerifyExpire = expires;
    // 7. Create user
    const res = await auth_model_1.Auth.create(registrationDoc);
    // send verification email (non-blocking for signup, but surface errors if they occur)
    try {
        const sendResult = await (0, sendEmail_1.sendVerificationCodeEmail)(registrationDoc.email, code, registrationDoc.name);
        console.info("✅ Verification email send result during signup:", sendResult);
    }
    catch (err) {
        console.error("❌ Verification email failed to send during signup:", err);
        // optionally decide whether to fail signup — currently we log and continue
    }
    // 8. JWT payload
    const jwtPayload = {
        id: res._id,
        email: res?.email,
        name: res?.name,
        userName: res?.username,
        role: res?.role,
        isBlocked: res?.isBlocked,
        subscriptionPlan: res?.subscriptionPlan,
        status: res?.status,
        photoURL: res?.photoURL,
    };
    const accessToken = (0, auth_utils_1.generateToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.generateToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    // 9. Return response
    return {
        accessToken,
        refreshToken,
        userInfo: {
            username: res.username,
            name: res.name,
            email: res.email,
            isEmailVerified: res.isEmailVerified,
            role: res.role,
            photoURL: res.photoURL,
            isBlocked: res.isBlocked,
            status: res.status,
            phoneNumber: res.phoneNumber,
        },
    };
};
// Helper to safely build a case-insensitive exact-match RegExp from arbitrary input
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/**
* Allow login using either username OR email + password.
* - Accepts payload.email or payload.username or payload.identifier (preferred generic name).
* - Performs case-insensitive lookup for both username and email.
*/
const loginFunc = async (payload) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // 1️⃣ Validate input
        const rawIdentifier = (payload?.identifier ?? payload?.email ?? payload?.username)?.toString().trim();
        const password = payload?.password;
        if (!rawIdentifier || !password) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Identifier (email or username) and password are required');
        }
        // 2️⃣ Safe query: case-insensitive search
        const safe = escapeRegExp(rawIdentifier);
        const query = {
            $or: [
                { email: new RegExp(`^${safe}$`, 'i') },
                { username: new RegExp(`^${safe}$`, 'i') },
            ],
        };
        const user = await auth_model_1.Auth.findOne(query).select('+password').session(session);
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found 😒');
        }
        // if (!user.isEmailVerified) {
        //   throw new AppError(StatusCodes.FORBIDDEN, 'User email is not verified');
        // }
        if (user.isBlocked) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'User is blocked 🤡');
        }
        if (user.password === undefined) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'User is not valid 🚫');
        }
        // 3️⃣ Verify password
        const isPasswordValid = await auth_model_1.Auth.isPasswordMatched(password, user?.password);
        if (!isPasswordValid) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Incorrect Password 😵‍💫');
        }
        // 4️⃣ Prepare JWT payload (convert ObjectId to string)
        const jwtPayload = {
            id: user?._id?.toString(),
            email: user?.email,
            role: user?.role,
            userName: user?.username,
            name: user?.name,
            isEmailVerified: user?.isEmailVerified,
            isBlocked: user?.isBlocked,
            subscriptionPlan: user?.subscriptionPlan,
            status: user?.status,
            photoURL: user?.photoURL,
        };
        // 5️⃣ Ensure secrets exist
        if (!config_1.default.jwt_access_secret || !config_1.default.jwt_refresh_secret) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'JWT secrets are not configured');
        }
        // 6️⃣ Generate tokens safely
        let accessToken;
        let refreshToken;
        try {
            accessToken = (0, auth_utils_1.generateToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
            refreshToken = (0, auth_utils_1.generateToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
        }
        catch (err) {
            console.error('JWT generation error:', err);
            throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to generate tokens');
        }
        // 7️⃣ Commit transaction
        await session.commitTransaction();
        session.endSession();
        // 8️⃣ Return response
        return {
            accessToken,
            refreshToken,
            userInfo: {
                username: user.username,
                email: user.email,
                role: user.role,
                photoURL: user.photoURL,
            },
        };
    }
    catch (error) {
        // 9️⃣ Rollback transaction safely
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
const updateUserFunc = async (payload) => {
    const user = await auth_model_1.Auth.findOne({ email: payload?.email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    const res = await auth_model_1.Auth.updateOne({ email: payload?.email }, payload);
    return res;
};
const getProfileInfoFunc = async (req) => {
    const payload = req.user;
    if (!payload?.email) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User not found');
    }
    const user = await auth_model_1.Auth.findOne({ email: payload?.email }).lean().select('-password -emailVerifyCode ');
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    if (user?.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Account is blocked');
    }
    return user;
};
const statusFuc = async (payload) => {
    const users = await auth_model_1.Auth.findById(payload?.id);
    if (!users) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    if (users?.role === "admin") {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, `Admin's status can not be changed`);
    }
    if (!payload?.action) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid action');
    }
    if (payload?.action === 'block') {
        const res = await auth_model_1.Auth.findByIdAndUpdate(payload?.id, { isBlocked: true });
        return res;
    }
    if (payload?.action === 'active') {
        const res = await auth_model_1.Auth.findByIdAndUpdate(payload?.id, { isActive: true });
        return res;
    }
    if (payload?.action === 'deactive') {
        const res = await auth_model_1.Auth.findByIdAndUpdate(payload?.id, { isActive: false });
        return res;
    }
};
const updatePasswordFunc = async (payload) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const user = await auth_model_1.Auth.findOne({ email: payload?.email }).session(session);
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
        }
        if (!user?.password) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User has no password set');
        }
        const isMatchPassword = await bcrypt_1.default.compare(payload?.cpassword, user?.password);
        if (!isMatchPassword) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Incorrect current password');
        }
        const newpass = await bcrypt_1.default.hash(payload?.npassword, Number(config_1.default.bcrypt_salt_rounds));
        if (!newpass) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error in password hash');
        }
        const res = await auth_model_1.Auth.updateOne({ email: payload?.email }, { password: newpass }).session(session);
        await session.commitTransaction();
        session.endSession();
        return res;
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
const getSingleUserFunc = async (email) => {
    const res = await auth_model_1.Auth.findOne({ email });
    return res;
};
const updateNameFunc = async (payload) => {
    if (!payload?.email) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User not found');
    }
    if (!payload?.name) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NO_CONTENT, "NO name found");
    }
    try {
        const data = await auth_model_1.Auth.updateOne({ email: payload?.email }, {
            $set: {
                name: payload?.name
            }
        });
        const result = data?.modifiedCount > 0 ? { name: payload?.name } : {};
        return result;
    }
    catch (error) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Can not update Profile');
    }
};
// Resend verification code function with rate limiting
const resendVerificationCodeFunc = async (email) => {
    const user = await auth_model_1.Auth.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    if (user?.isEmailVerified) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email is already verified');
    }
    const now = Date.now();
    const expireTimeRaw = user.emailVerifyExpire;
    if (!expireTimeRaw) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'No verification code to resend');
    }
    const expireTime = new Date(expireTimeRaw).getTime();
    if (isNaN(expireTime)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid verification code expiry');
    }
    // Check if the code has expired
    if (now > expireTime) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Verification code has expired');
    }
    // Generate new verification code and expiry
    const { code, expires } = (0, generateCodeVarification_1.default)();
    // Update user: code, expiry, last sent time
    await auth_model_1.Auth.findOneAndUpdate({ email }, {
        emailVerifyCode: code,
        emailVerifyExpire: expires,
        lastVerificationSentAt: new Date()
    });
    try {
        await (0, sendEmail_1.sendVerificationCodeEmail)(email, code, user.name);
        return { success: true };
    }
    catch (err) {
        console.error("❌ Failed to resend verification code:", err);
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to send verification email');
    }
};
const verificationUserCodeFunc = async (email, emailVerifyCode) => {
    const user = await auth_model_1.Auth.findOne({
        email,
    });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    if (user?.isEmailVerified) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email is already verified');
    }
    if (user?.emailVerifyCode !== emailVerifyCode) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid verification code');
    }
    if (!user?.emailVerifyExpire) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Verification code has expired');
    }
    const expireTime = new Date(user.emailVerifyExpire).getTime();
    const now = Date.now();
    // Check if the code has expired
    if (now > expireTime) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Verification code has expired');
    }
    const updatedUser = await auth_model_1.Auth.findOneAndUpdate({ email }, {
        isEmailVerified: true,
        emailVerifyCode: null,
        emailVerifyExpire: null
    }, { new: true });
    return updatedUser;
};
exports.authService = {
    signupFunc,
    loginFunc,
    getProfileInfoFunc,
    updateUserFunc,
    statusFuc,
    updatePasswordFunc,
    getSingleUserFunc,
    updateNameFunc,
    resendVerificationCodeFunc,
    verificationUserCodeFunc,
};
//# sourceMappingURL=auth.service.js.map