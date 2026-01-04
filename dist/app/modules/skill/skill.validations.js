"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillValidations = exports.updateSkillValidation = exports.createSkillValidation = void 0;
const zod_1 = require("zod");
// Sub schema for individual skill items
const skillItemSchema = zod_1.z.object({
    skill: zod_1.z.string().min(1, "Skill name is required"),
    color: zod_1.z.string().min(1, "Color is required").regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Color must be a valid hex color code"),
});
exports.createSkillValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required"),
        description: zod_1.z.string().min(1, "Description is required"),
        type: zod_1.z.enum(["backend", "frontend"], { message: "Type must be either backend or frontend" }),
        skills: zod_1.z.array(skillItemSchema).min(1, "At least one skill is required"),
    }),
});
exports.updateSkillValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required").optional(),
        description: zod_1.z.string().min(1, "Description is required").optional(),
        type: zod_1.z.enum(["backend", "frontend"], { message: "Type must be either backend or frontend" }).optional(),
        skills: zod_1.z.array(skillItemSchema).min(1, "At least one skill is required").optional(),
    }),
});
exports.SkillValidations = {
    createSkillValidation: exports.createSkillValidation,
    updateSkillValidation: exports.updateSkillValidation,
};
//# sourceMappingURL=skill.validations.js.map