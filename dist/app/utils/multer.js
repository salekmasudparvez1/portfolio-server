"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = void 0;
const multer_1 = __importDefault(require("multer"));
// Use memory storage to be compatible with serverless (read-only FS)
const storage = multer_1.default.memoryStorage();
exports.uploadMultiple = (0, multer_1.default)({ storage }).array('images', 10);
//# sourceMappingURL=multer.js.map