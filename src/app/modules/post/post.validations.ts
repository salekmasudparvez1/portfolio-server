import { z } from "zod";

/* -----------------------------------------------------
   1. REUSABLE HELPERS
----------------------------------------------------- */

// Empty string → undefined (useful for optional URL inputs)
const emptyStringUrl = z.preprocess(
  (val) => {
    // Handle both string and object cases
    if (val === "" || val === null || val === undefined) return undefined;
    // If it's already an object with secure_url (from Cloudinary), extract it
    if (typeof val === "object" && val !== null && "secure_url" in val) {
      return (val as any).secure_url;
    }
    return val;
  },
  z.string().url({ message: "Invalid URL format" }).optional()
);

// "true" | "false" | boolean → boolean
const booleanString = z.preprocess((val) => {
  if (typeof val === "string") {
    if (val === "true") return true;
    if (val === "false") return false;
  }
  return val;
}, z.boolean());

// string → number
const numberString = z.preprocess(
  (val) => {
    if (val === "" || val === undefined || val === null) return undefined;
    const num = Number(val);
    return isNaN(num) ? val : num;
  },
  z.number().nonnegative().optional()
);

// Parse JSON strings safely
const jsonPreprocess = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return val;
      }
    }
    return val;
  }, schema);

// Convert string or array to array (for form-data fields like keywords, tags)
const stringToArray = z.preprocess((val) => {
  if (typeof val === "string") {
    try {
      // Try parsing as JSON array first
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // If not JSON, split by comma
      return val.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }
  if (Array.isArray(val)) return val;
  return undefined;
}, z.array(z.string()).optional());

/* -----------------------------------------------------
   2. SUB SCHEMAS
----------------------------------------------------- */

const projectLinksSchema = z.object({
  live: emptyStringUrl,
  githubClient: emptyStringUrl,
  githubServer: emptyStringUrl,
});

const seoSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z
    .string()
    .max(160, "Description cannot exceed 160 characters")
    .optional(),
  keywords: stringToArray,
  canonicalUrl: emptyStringUrl,
  ogImage: z.preprocess(
    (val) => {
      // Handle empty values
      if (val === "" || val === null || val === undefined) return undefined;
      // If it's an object with secure_url (from Cloudinary), extract it
      if (typeof val === "object" && val !== null && "secure_url" in val) {
        return (val as any).secure_url;
      }
      // If it's already a string, return it
      return val;
    },
    z.string().url({ message: "Invalid URL format" }).optional()
  ),
});

/* -----------------------------------------------------
   3. BASE POST SCHEMA
----------------------------------------------------- */

export const basePostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").trim(),
  type: z.enum(["project", "blog"]),

  excerpt: z
    .string()
    .min(1, "Excerpt is required")
    .max(300, "Excerpt cannot exceed 300 characters"),

  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required"),

  // Media
  coverImage: emptyStringUrl,
  gallery: jsonPreprocess(z.array(z.string().url()).optional()),

  // Tags
  tags: jsonPreprocess(
    z.array(z.string()).min(1, "At least one tag is required")
  ),

  // Nested objects
  projectLinks: jsonPreprocess(projectLinksSchema).optional(),
  seo: jsonPreprocess(seoSchema).optional(),

  // Flags
  isFeatured: booleanString.default(false),
  isPublished: booleanString.default(false),

  // Publishing
  publishedAt: z.string().optional(),
  readingTime: numberString,
});

/* -----------------------------------------------------
   4. REQUEST VALIDATIONS
----------------------------------------------------- */

export const createPostValidation = z.object({
  body: basePostSchema,
});

export const updatePostValidation = z.object({
  body: basePostSchema.partial(),
});

/* -----------------------------------------------------
   5. EXPORT
----------------------------------------------------- */

export const PostValidations = {
  createPostValidation,
  updatePostValidation,
};
