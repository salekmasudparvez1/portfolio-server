import { Schema, model } from "mongoose";
import { IMedia } from "./media.interface";

const mediaSchema = new Schema<IMedia>(
  {
    // The unique identifier from Cloudinary (e.g., "my-folder/sub-folder/my-image")
    public_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // The actual folder name/path (e.g., "my-folder/sub-folder")
    folder: {
      type: String,
      default: "root", // Files not in a folder go to 'root'
      index: true,
    },

    // File Details
    filename: {
      type: String,
      required: true,
    },
    format: {
      type: String,
    },
    version: {
      type: Number,
    },

    // URLs
    url: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },

    // Metadata for UI (Size, Dimensions)
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    bytes: {
      type: Number,
    },

    // Optional: Tags for searching
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Index for getting list of folders quickly
mediaSchema.index({ folder: 1 });

export const Media = model<IMedia>("Media", mediaSchema);
