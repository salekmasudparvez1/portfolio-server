"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoleValidationSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.updateRoleValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        role: zod_1.default.enum(["tenant", "landlord"]),
    }),
});
//# sourceMappingURL=admin.validations.js.map