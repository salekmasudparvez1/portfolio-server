import z from "zod";
export declare const updateRoleValidationSchema: z.ZodObject<{
    body: z.ZodObject<{
        role: z.ZodEnum<{
            landlord: "landlord";
            tenant: "tenant";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=admin.validations.d.ts.map