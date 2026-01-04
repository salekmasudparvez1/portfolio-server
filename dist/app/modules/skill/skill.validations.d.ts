import { z } from "zod";
export declare const createSkillValidation: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        type: z.ZodEnum<{
            backend: "backend";
            frontend: "frontend";
        }>;
        skills: z.ZodArray<z.ZodObject<{
            skill: z.ZodString;
            color: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateSkillValidation: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodEnum<{
            backend: "backend";
            frontend: "frontend";
        }>>;
        skills: z.ZodOptional<z.ZodArray<z.ZodObject<{
            skill: z.ZodString;
            color: z.ZodString;
        }, z.core.$strip>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const SkillValidations: {
    createSkillValidation: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            type: z.ZodEnum<{
                backend: "backend";
                frontend: "frontend";
            }>;
            skills: z.ZodArray<z.ZodObject<{
                skill: z.ZodString;
                color: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateSkillValidation: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            type: z.ZodOptional<z.ZodEnum<{
                backend: "backend";
                frontend: "frontend";
            }>>;
            skills: z.ZodOptional<z.ZodArray<z.ZodObject<{
                skill: z.ZodString;
                color: z.ZodString;
            }, z.core.$strip>>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=skill.validations.d.ts.map