import { z } from "zod";
export declare const signupValidationSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        username: z.ZodString;
        email: z.ZodString;
        phoneNumber: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
        role: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            admin: "admin";
            user: "user";
        }>>>;
        signInMethod: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            email: "email";
            google: "google";
            github: "github";
        }>>>;
        adminKey: z.ZodOptional<z.ZodString>;
        isBlocked: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        photoURL: z.ZodOptional<z.ZodString>;
        region: z.ZodOptional<z.ZodString>;
        device: z.ZodOptional<z.ZodString>;
        status: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            pending: "pending";
            approved: "approved";
            rejected: "rejected";
        }>>>;
        subscriptionPlan: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            free: "free";
            premium: "premium";
        }>>>;
        bio: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        isEmailVerified: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        emailVerifyCode: z.ZodOptional<z.ZodString>;
        emailVerifyExpire: z.ZodOptional<z.ZodDate>;
        address: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const loginValidationSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodOptional<z.ZodString>;
        username: z.ZodOptional<z.ZodString>;
        identifier: z.ZodOptional<z.ZodString>;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=auth.validations.d.ts.map