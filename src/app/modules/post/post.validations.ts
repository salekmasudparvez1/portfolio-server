import { z } from "zod";

// --- HELPERS ---

// 1. Handle JSON Strings (e.g. '{"live": "..."}' -> Object)
const processJson = (schema: z.ZodTypeAny) =>
  z.preprocess((value) => {
    if (typeof value === "string" && value.trim().length > 0) {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
    return value;
  }, schema);

// 2. Handle Boolean Strings ("true" -> true)
const booleanString = z.preprocess((val) => {
    if (typeof val === "string") return val === "true";
    return Boolean(val);
}, z.boolean());

// 3. Handle Empty Strings for URLs ("" -> undefined) so .url() validation doesn't fail
const emptyStringUrl = z.preprocess(
  (val) => (val === "" ? undefined : val),
  z.string().url({ message: "Invalid URL format" }).optional()
);

// --- SUB SCHEMAS ---

const projectLinksSchema = z.object({
  live: emptyStringUrl,
  githubClient: emptyStringUrl,
  githubServer: emptyStringUrl,
});

const seoSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().max(160, "Description cannot exceed 160 characters").optional(),
  keywords: z.array(z.string()).optional(),
  canonicalUrl: emptyStringUrl,
  ogImage: emptyStringUrl, 
});

// --- MAIN SCHEMAS ---

export const createPostValidation = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required").trim(),
    type: z.enum(["project", "blog"]),
    excerpt: z.string().min(1, "Excerpt is required"),
    content: z.string().min(1, "Content is required"),
    
    // Allow empty string or valid URL
    coverImage: emptyStringUrl,
    
    // Expect array of strings, ensure URLs
    gallery: z.array(z.string().url()).optional(),
    
    // Handle tags (could be array or stringified array)
    tags: z.preprocess((val) => {
        if (typeof val === 'string') {
            try { return JSON.parse(val); } catch { return [val]; } 
        }
        return val;
    }, z.array(z.string()).min(1, "At least one tag is required")),

    // Process JSON strings for nested objects
    projectLinks: processJson(projectLinksSchema).optional(),
    seo: processJson(seoSchema).optional(),

    // Author is usually a MongoDB ID string
    author: z.string().min(1, "Author is required"),

    // Process booleans
    isFeatured: booleanString.optional().default(false),
    isPublished: booleanString.optional().default(false),
    
    publishedAt: z.string().optional(), // ISO String preferred
    readingTime: z.preprocess(
        (val) => Number(val), 
        z.number().nonnegative().optional()
    ).optional(),
  }),
});

export const updatePostValidation = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    type: z.enum(["project", "blog"]).optional(),
    excerpt: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    coverImage: emptyStringUrl,
    gallery: z.array(z.string().url()).optional(),
    
    tags: z.preprocess((val) => {
        if (typeof val === 'string') {
            try { return JSON.parse(val); } catch { return [val]; }
        } 
        return val;
    }, z.array(z.string()).optional()),

    projectLinks: processJson(projectLinksSchema).optional(),
    seo: processJson(seoSchema).optional(),
    
    author: z.string().min(1).optional(),
    isFeatured: booleanString.optional(),
    isPublished: booleanString.optional(),
    publishedAt: z.string().optional(),
    readingTime: z.preprocess(
        (val) => (val ? Number(val) : undefined),
        z.number().nonnegative().optional()
    ),
  }),
});

export const PostValidations = {
  createPostValidation,
  updatePostValidation,
};