import { z } from "zod";
export declare const createMediaValidation: z.ZodObject<{
    body: z.ZodObject<{
        public_id: z.ZodString;
        folder: z.ZodDefault<z.ZodString>;
        filename: z.ZodString;
        format: z.ZodOptional<z.ZodString>;
        version: z.ZodOptional<z.ZodNumber>;
        url: z.ZodString;
        secure_url: z.ZodString;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        bytes: z.ZodOptional<z.ZodNumber>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateMediaValidation: z.ZodObject<{
    body: z.ZodObject<{
        folder: z.ZodOptional<z.ZodString>;
        filename: z.ZodOptional<z.ZodString>;
        format: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const MediaValidations: {
    createMediaValidation: z.ZodObject<{
        body: z.ZodObject<{
            public_id: z.ZodString;
            folder: z.ZodDefault<z.ZodString>;
            filename: z.ZodString;
            format: z.ZodOptional<z.ZodString>;
            version: z.ZodOptional<z.ZodNumber>;
            url: z.ZodString;
            secure_url: z.ZodString;
            width: z.ZodOptional<z.ZodNumber>;
            height: z.ZodOptional<z.ZodNumber>;
            bytes: z.ZodOptional<z.ZodNumber>;
            tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateMediaValidation: z.ZodObject<{
        body: z.ZodObject<{
            folder: z.ZodOptional<z.ZodString>;
            filename: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodString>;
            tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=media.validations.d.ts.map