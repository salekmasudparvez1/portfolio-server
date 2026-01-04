"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaValidations = exports.updateMediaValidation = exports.createMediaValidation = void 0;
const zod_1 = require("zod");
exports.createMediaValidation = zod_1.z.object({
    body: zod_1.z.object({
        public_id: zod_1.z.string().min(1, "Public ID is required"),
        folder: zod_1.z.string().default("root"),
        filename: zod_1.z.string().min(1, "Filename is required"),
        format: zod_1.z.string().optional(),
        version: zod_1.z.number().optional(),
        url: zod_1.z.string().url("Invalid URL format"),
        secure_url: zod_1.z.string().url("Invalid secure URL format"),
        width: zod_1.z.number().optional(),
        height: zod_1.z.number().optional(),
        bytes: zod_1.z.number().optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.updateMediaValidation = zod_1.z.object({
    body: zod_1.z.object({
        folder: zod_1.z.string().optional(),
        filename: zod_1.z.string().min(1, "Filename is required").optional(),
        format: zod_1.z.string().optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.MediaValidations = {
    createMediaValidation: exports.createMediaValidation,
    updateMediaValidation: exports.updateMediaValidation,
};
//# sourceMappingURL=media.validations.js.map