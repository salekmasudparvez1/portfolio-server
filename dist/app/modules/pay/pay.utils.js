"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.totatlAmountCalculate = exports.getStripe = void 0;
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const stripe_1 = __importDefault(require("stripe"));
const getStripe = () => {
    let stripeInstance = null;
    if (!stripeInstance) {
        if (!config_1.default.STRIPE_SECRET_KEY) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Stripe secret-key is not configured');
        }
        stripeInstance = new stripe_1.default(config_1.default.STRIPE_SECRET_KEY);
    }
    return stripeInstance;
};
exports.getStripe = getStripe;
const totatlAmountCalculate = (date, rentAmount) => {
    const rentAmountPerMonth = Number(rentAmount);
    const startingDate = new Date(date?.from);
    const endingDate = new Date(date?.to);
    const timeDifference = endingDate.getTime() - startingDate.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    const totalRent = (daysDifference / 30) * rentAmountPerMonth;
    return totalRent;
};
exports.totatlAmountCalculate = totatlAmountCalculate;
//# sourceMappingURL=pay.utils.js.map