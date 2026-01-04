
import { z } from "zod";
import { de } from "zod/v4/locales";


export const signupValidationSchema = z.object({
    body: z.object({
        name: z.string().min(1, { message: 'Name is required' }),
        username: z.string().min(1, { message: 'Username is required' }),
        email: z.string().email({ message: 'Invalid email address' }),
        phoneNumber: z
            .string()
            .min(10, { message: 'Phone number must be at least 10 digits' })
            .regex(/^\+?\d+$/, { message: "Phone number must contain only digits and may start with '+'" }).optional(),
        password: z.string().min(6, { message: 'Password must be at least 6 characters' }).optional(),
        // role is optional for public signup and will default to 'user'z
        role: z.enum(['admin', 'user']).optional().default('user'),
        signInMethod: z.enum(['email', 'google', 'github']).optional().default('email'),
        // optional secret to allow admin registration when matched with server env var
        adminKey: z.string().optional(),
        isBlocked: z.boolean().optional().default(false),
        photoURL: z.string().url({ message: 'Invalid photo URL' }).optional(),
        region: z.string().optional(),
        device: z.string().optional(),
        status: z.enum(['pending', 'approved', 'rejected']).optional().default('pending'),
        subscriptionPlan: z.enum(['free', 'premium']).optional().default('free'),
        bio: z.string().max(500).optional().default(''),

        isEmailVerified: z.boolean().optional().default(false),
        emailVerifyCode: z.string().optional(),
        emailVerifyExpire: z.date().optional(),
        address: z.string().optional(),
    }),
});
export const loginValidationSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address').optional(),
        username: z.string().min(1, 'Username is required').optional(),
        identifier: z.string().min(1, 'Identifier is required').optional(),
        password: z.string().min(1, 'Password is required'),
    }).refine((data) => data.email || data.username || data.identifier, {
        message: 'Either email, username, or identifier is required',
        path: ['email'],
    }),
});