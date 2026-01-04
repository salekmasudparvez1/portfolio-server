import { z } from "zod";

export const createMediaValidation = z.object({
  body: z.object({
    public_id: z.string().min(1, "Public ID is required"),
    folder: z.string().default("root"),
    filename: z.string().min(1, "Filename is required"),
    format: z.string().optional(),
    version: z.number().optional(),
    url: z.string().url("Invalid URL format"),
    secure_url: z.string().url("Invalid secure URL format"),
    width: z.number().optional(),
    height: z.number().optional(),
    bytes: z.number().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateMediaValidation = z.object({
  body: z.object({
    folder: z.string().optional(),
    filename: z.string().min(1, "Filename is required").optional(),
    format: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const MediaValidations = {
  createMediaValidation,
  updateMediaValidation,
};
