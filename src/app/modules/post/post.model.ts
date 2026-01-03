import { Schema, model, HydratedDocument } from "mongoose";
import { IPost } from "./post.interface";

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    type: {
      type: String,
      enum: ["project", "blog"],
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    gallery: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
      required: true,
    },
    projectLinks: {
      live: String,
      githubClient: String,
      githubServer: String,
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
      canonicalUrl: String,
      ogImage: String,
    },
    author: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    readingTime: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
// Note: slug index is already created by unique: true in schema, so we don't need to add it here
postSchema.index({ type: 1, isPublished: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ isFeatured: 1 });


postSchema.pre("save", function (this: HydratedDocument<IPost>) {
  if (this.isModified("content") || this.isNew) {
    const content = this.content || "";

    const textOnly = content.replace(/<[^>]*>?/gm, "");
    const wordCount = textOnly
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    const wpm = 225;
    this.readingTime = Math.ceil(wordCount / wpm);
  }
});

export const Post = model<IPost>("Post", postSchema);
