"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidationSchema = exports.signupValidationSchema = void 0;
const zod_1 = require("zod");
exports.signupValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: 'Name is required' }),
        username: zod_1.z.string().min(1, { message: 'Username is required' }),
        email: zod_1.z.string().email({ message: 'Invalid email address' }),
        phoneNumber: zod_1.z
            .string()
            .min(10, { message: 'Phone number must be at least 10 digits' })
            .regex(/^\d+$/, { message: 'Phone number must contain only digits' }),
        password: zod_1.z.string().min(6, { message: 'Password must be at least 6 characters' }).optional(),
        // role is optional for public signup and will default to 'user'
        role: zod_1.z.enum(['admin', 'user']).optional().default('user'),
        // optional secret to allow admin registration when matched with server env var
        adminKey: zod_1.z.string().optional(),
        isBlocked: zod_1.z.boolean().optional().default(false),
        photoURL: zod_1.z.string().url({ message: 'Invalid photo URL' }).optional(),
        region: zod_1.z.string().optional(),
        status: zod_1.z.enum(['pending', 'approved', 'rejected']).optional().default('pending'),
        subscriptionPlan: zod_1.z.enum(['free', 'premium']).optional().default('free'),
        isEmailVerified: zod_1.z.boolean().optional().default(false),
        emailVerifyCode: zod_1.z.string().optional(),
        emailVerifyExpire: zod_1.z.date().optional(),
        address: zod_1.z.string().optional(),
    }),
});
exports.loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address').optional(),
        username: zod_1.z.string().min(1, 'Username is required').optional(),
        identifier: zod_1.z.string().min(1, 'Identifier is required').optional(),
        password: zod_1.z.string().min(1, 'Password is required'),
    }).refine((data) => data.email || data.username || data.identifier, {
        message: 'Either email, username, or identifier is required',
        path: ['email'],
    }),
});
//# sourceMappingURL=auth.validations.js.map