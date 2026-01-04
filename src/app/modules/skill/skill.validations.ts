import { z } from "zod";

// Sub schema for individual skill items
const skillItemSchema = z.object({
  skill: z.string().min(1, "Skill name is required"),
  color: z.string().min(1, "Color is required").regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Color must be a valid hex color code"),
});

export const createSkillValidation = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    type: z.enum(["backend", "frontend"], { message: "Type must be either backend or frontend" }),
    skills: z.array(skillItemSchema).min(1, "At least one skill is required"),
  }),
});

export const updateSkillValidation = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    type: z.enum(["backend", "frontend"], { message: "Type must be either backend or frontend" }).optional(),
    skills: z.array(skillItemSchema).min(1, "At least one skill is required").optional(),
  }),
});

export const SkillValidations = {
  createSkillValidation,
  updateSkillValidation,
};
