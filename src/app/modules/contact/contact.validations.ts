import { z } from "zod";

export const createContactValidation = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(1, "Message is required"),
    isScheduling: z.boolean(),
    meetingDate: z.string().optional(),
    meetingTime: z.string().optional(),
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

export const updateContactValidation = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().min(1, "Phone number is required").optional(),
    subject: z.string().min(1, "Subject is required").optional(),
    message: z.string().min(1, "Message is required").optional(),
    isScheduling: z.boolean().optional(),
    meetingDate: z.string().optional(),
    meetingTime: z.string().optional(),
    status: z.enum(["pending", "responded", "scheduled", "completed"]).optional(),
  }),
});

export const ContactValidations = {
  createContactValidation,
  updateContactValidation,
};
