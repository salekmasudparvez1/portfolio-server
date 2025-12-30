"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pay_controller_1 = require("./pay.controller");
const express_2 = __importDefault(require("express"));
const verifyUser_1 = __importDefault(require("../../middlewares/verifyUser"));
const verifyTenant_copy_1 = __importDefault(require("../../middlewares/verifyTenant copy"));
const payRouter = (0, express_1.Router)();
payRouter.post("/create-checkout-session", pay_controller_1.paymentControler.createPaymentIntent);
// Stripe webhook (must receive raw body for signature verification)
payRouter.post('/webhook', express_2.default.raw({ type: 'application/json' }), pay_controller_1.paymentControler.Webhook);
// Get all transactions
payRouter.get('/transactions', verifyUser_1.default, pay_controller_1.paymentControler.getAllTransactions);
// Get single tenant transactions by id
payRouter.get('/transactions/:id', verifyUser_1.default, pay_controller_1.paymentControler.getSingleTenantTransactions);
//get single tenant transactions without id by paid status
payRouter.get('/transactions/status', verifyTenant_copy_1.default, pay_controller_1.paymentControler.getSingleTransactionsByStatus);
exports.default = payRouter;
//# sourceMappingURL=pay.routes.js.map