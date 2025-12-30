"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const auth_model_1 = require("../modules/auth/auth.model");
const verifyLogin = (0, catchAsync_1.default)(async (req, res, next) => {
    const bearerToken = req.headers.authorization;
    const token = bearerToken?.split(" ")[1];
    if (token) {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        const { role, email } = decoded;
        const user = await auth_model_1.Auth.isUserExistsByCustomId(email);
        const id = user?._id;
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
        }
        const isBlock = user?.isBlocked;
        if (isBlock) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked !🤮');
        }
        if (role === "tenant" || role === "admin" || role === "landlord") {
            // Use a safe cast to attach custom props without fighting typings
            req.user = decoded;
            req.userId = id;
            next();
        }
    }
    else {
        res.userid = null;
        req.userId = null;
        next();
    }
});
exports.default = verifyLogin;
//# sourceMappingURL=verifyLogin.js.map