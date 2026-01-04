"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostValidations = exports.updatePostValidation = exports.createPostValidation = exports.basePostSchema = void 0;
const zod_1 = require("zod");
/* -----------------------------------------------------
   1. REUSABLE HELPERS
----------------------------------------------------- */
// Empty string → undefined (useful for optional URL inputs)
const emptyStringUrl = zod_1.z.preprocess((val) => (val === "" ? undefined : val), zod_1.z.string().url({ message: "Invalid URL format" }).optional());
// "true" | "false" | boolean → boolean
const booleanString = zod_1.z.preprocess((val) => {
    if (typeof val === "string") {
        if (val === "true")
            return true;
        if (val === "false")
            return false;
    }
    return val;
}, zod_1.z.boolean());
// string → number
const numberString = zod_1.z.preprocess((val) => {
    if (val === "" || val === undefined || val === null)
        return undefined;
    const num = Number(val);
    return isNaN(num) ? val : num;
}, zod_1.z.number().nonnegative().optional());
// Parse JSON strings safely
const jsonPreprocess = (schema) => zod_1.z.preprocess((val) => {
    if (typeof val === "string") {
        try {
            return JSON.parse(val);
        }
        catch {
            return val;
        }
    }
    return val;
}, schema);
// Convert string or array to array (for form-data fields like keywords, tags)
const stringToArray = zod_1.z.preprocess((val) => {
    if (typeof val === "string") {
        try {
            // Try parsing as JSON array first
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed))
                return parsed;
        }
        catch {
            // If not JSON, split by comma
            return val.split(",").map((item) => item.trim()).filter(Boolean);
        }
    }
    if (Array.isArray(val))
        return val;
    return undefined;
}, zod_1.z.array(zod_1.z.string()).optional());
/* -----------------------------------------------------
   2. SUB SCHEMAS
----------------------------------------------------- */
const projectLinksSchema = zod_1.z.object({
    live: emptyStringUrl,
    githubClient: emptyStringUrl,
    githubServer: emptyStringUrl,
});
const seoSchema = zod_1.z.object({
    metaTitle: zod_1.z.string().optional(),
    metaDescription: zod_1.z
        .string()
        .max(160, "Description cannot exceed 160 characters")
        .optional(),
    keywords: stringToArray,
    canonicalUrl: emptyStringUrl,
    ogImage: emptyStringUrl,
});
/* -----------------------------------------------------
   3. BASE POST SCHEMA
----------------------------------------------------- */
exports.basePostSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    slug: zod_1.z.string().min(1, "Slug is required").trim(),
    type: zod_1.z.enum(["project", "blog"]),
    excerpt: zod_1.z
        .string()
        .min(1, "Excerpt is required")
        .max(300, "Excerpt cannot exceed 300 characters"),
    content: zod_1.z.string().min(1, "Content is required"),
    author: zod_1.z.string().min(1, "Author is required"),
    // Media
    coverImage: emptyStringUrl,
    gallery: jsonPreprocess(zod_1.z.array(zod_1.z.string().url()).optional()),
    // Tags
    tags: jsonPreprocess(zod_1.z.array(zod_1.z.string()).min(1, "At least one tag is required")),
    // Nested objects
    projectLinks: jsonPreprocess(projectLinksSchema).optional(),
    seo: jsonPreprocess(seoSchema).optional(),
    // Flags
    isFeatured: booleanString.default(false),
    isPublished: booleanString.default(false),
    // Publishing
    publishedAt: zod_1.z.string().optional(),
    readingTime: numberString,
});
/* -----------------------------------------------------
   4. REQUEST VALIDATIONS
----------------------------------------------------- */
exports.createPostValidation = zod_1.z.object({
    body: exports.basePostSchema,
});
exports.updatePostValidation = zod_1.z.object({
    body: exports.basePostSchema.partial(),
});
/* -----------------------------------------------------
   5. EXPORT
----------------------------------------------------- */
exports.PostValidations = {
    createPostValidation: exports.createPostValidation,
    updatePostValidation: exports.updatePostValidation,
};
//# sourceMappingURL=post.validations.js.map