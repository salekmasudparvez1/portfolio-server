"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactValidations = exports.updateContactValidation = exports.createContactValidation = void 0;
const zod_1 = require("zod");
exports.createContactValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required"),
        email: zod_1.z.string().email("Invalid email address"),
        phone: zod_1.z.string().min(1, "Phone number is required"),
        subject: zod_1.z.string().min(1, "Subject is required"),
        message: zod_1.z.string().min(1, "Message is required"),
        isScheduling: zod_1.z.boolean(),
        meetingDate: zod_1.z.string().optional(),
        meetingTime: zod_1.z.string().optional(),
    }).refine((data) => {
        // If isScheduling is true, meetingDate and meetingTime are required
        if (data.isScheduling) {
            return !!data.meetingDate && !!data.meetingTime;
        }
        return true;
    }, {
        message: "Meeting date and time are required when scheduling is enabled",
    }),
});
exports.updateContactValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required").optional(),
        email: zod_1.z.string().email("Invalid email address").optional(),
        phone: zod_1.z.string().min(1, "Phone number is required").optional(),
        subject: zod_1.z.string().min(1, "Subject is required").optional(),
        message: zod_1.z.string().min(1, "Message is required").optional(),
        isScheduling: zod_1.z.boolean().optional(),
        meetingDate: zod_1.z.string().optional(),
        meetingTime: zod_1.z.string().optional(),
        status: zod_1.z.enum(["pending", "responded", "scheduled", "completed"]).optional(),
    }),
});
exports.ContactValidations = {
    createContactValidation: exports.createContactValidation,
    updateContactValidation: exports.updateContactValidation,
};
//# sourceMappingURL=contact.validations.js.map