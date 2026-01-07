import { z } from "zod";
export declare const createContactValidation: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        phone: z.ZodString;
        subject: z.ZodString;
        message: z.ZodString;
        isScheduling: z.ZodBoolean;
        meetingDate: z.ZodOptional<z.ZodString>;
        meetingTime: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateContactValidation: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        subject: z.ZodOptional<z.ZodString>;
        message: z.ZodOptional<z.ZodString>;
        isScheduling: z.ZodOptional<z.ZodBoolean>;
        meetingDate: z.ZodOptional<z.ZodString>;
        meetingTime: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<{
            pending: "pending";
            responded: "responded";
            scheduled: "scheduled";
            completed: "completed";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const ContactValidations: {
    createContactValidation: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            email: z.ZodString;
            phone: z.ZodString;
            subject: z.ZodString;
            message: z.ZodString;
            isScheduling: z.ZodBoolean;
            meetingDate: z.ZodOptional<z.ZodString>;
            meetingTime: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateContactValidation: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            email: z.ZodOptional<z.ZodString>;
            phone: z.ZodOptional<z.ZodString>;
            subject: z.ZodOptional<z.ZodString>;
            message: z.ZodOptional<z.ZodString>;
            isScheduling: z.ZodOptional<z.ZodBoolean>;
            meetingDate: z.ZodOptional<z.ZodString>;
            meetingTime: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodEnum<{
                pending: "pending";
                responded: "responded";
                scheduled: "scheduled";
                completed: "completed";
            }>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=contact.validations.d.ts.map