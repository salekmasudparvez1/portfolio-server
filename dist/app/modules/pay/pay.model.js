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
exports.PayModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const tenent_model_1 = require("../tenent/tenent.model");
const findBasaDB = mongoose_1.default.connection.useDb(config_1.default.database_name);
const paySchema = new mongoose_1.Schema({
    transactionId: { type: String },
    amount: { type: Number },
    amountCents: { type: Number },
    paymentMethod: { type: String },
    requestId: { type: mongoose_1.Schema.Types.ObjectId, ref: tenent_model_1.TenantApplicationModel },
    currency: { type: String, required: true },
    paymentStatus: {
        status: { type: String, enum: ['failed', 'success'], required: true },
        message: { type: String }
    }
}, { timestamps: true, versionKey: false, collection: 'transaction' });
exports.PayModel = findBasaDB.model('transaction', paySchema);
//# sourceMappingURL=pay.model.js.map