import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IPost } from "./post.interface";
import { Post } from "./post.model";
import { Request } from "express";

const safeParse = <T>(value: unknown, fallback: T): T => {
  if (value === undefined || value === null) return fallback;
  if (typeof value !== "string") return value as T;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};
const createPost = async (req: Request) => {
  const payload: IPost = req.body;
  const user = (req as any)?.user;

  const seoDoc = safeParse<Record<string, any>>(payload?.seo, {});

  const finalDocument = {
    title: payload?.title,
    slug: payload?.slug,
    type: payload?.type,
    excerpt: payload?.excerpt,
    content: payload?.content,

    tags: safeParse<string[]>(payload?.tags, []),
    projectLinks: safeParse<Record<string, any>>(payload?.projectLinks, {}),

    isPublished: safeParse<boolean>(payload?.isPublished, false),
    isFeatured: safeParse<boolean>(payload?.isFeatured, false),

    seo: {
      ...seoDoc,
      ...(payload?.seo?.ogImage && { ogImage: payload?.seo?.ogImage }),
    },

    author: payload?.author,
    coverImage: payload?.coverImage,
    gallery: payload?.gallery,

    publishedAt: payload?.publishedAt
      ? new Date(payload.publishedAt)
      : undefined,

    readingTime: payload?.readingTime
      ? Number(payload.readingTime)
      : undefined,
  };

  const existingPost = await Post.findOne({ slug: payload.slug });

  if (existingPost) {
    throw new AppError(httpStatus.CONFLICT, "Slug already exists");
  }

  const result = await Post.create(payload);
  return result;
};

const getAllPosts = async (query: Record<string, any>) => {
  const {
    type,
    isPublished,
    isFeatured,
    tags,
    author,
    search,
    page = 1,
    limit = 10,
    sort = "-createdAt",
  } = query;
  const filter: Record<string, any> = {};

  if (type) filter.type = type;
  if (isPublished !== undefined) filter.isPublished = isPublished === "true";
  if (isFeatured !== undefined) filter.isFeatured = isFeatured === "true";
  if (tags) filter.tags = { $in: Array.isArray(tags) ? tags : [tags] };
  if (author) filter.author = author;

  // Search in title, excerpt, and content
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { excerpt: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Post.countDocuments(filter),
  ]);

  return {
    posts,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

const getPostById = async (id: string) => {
  const result = await Post.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }
  return result;
};

const getPostBySlug = async (slug: string) => {
  const result = await Post.findOne({ slug });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }
  return result;
};

const updatePost = async (id: string, payload: Partial<IPost>) => {
  // If slug is being updated, check for duplicates
  if (payload.slug) {
    const existingPost = await Post.findOne({
      slug: payload.slug,
      _id: { $ne: id },
    });
    if (existingPost) {
      throw new AppError(httpStatus.CONFLICT, "Slug already exists");
    }
  }
 
  const result = await Post.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
 
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }


  return result;
};

const deletePost = async (id: string) => {
  const result = await Post.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }
  return result;
};

const incrementViews = async (id: string) => {
  const result = await Post.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }
  return result;
};

const getFeaturedPosts = async (type?: "project" | "blog") => {
  const filter: Record<string, any> = {
    isFeatured: true,
    isPublished: true,
  };

  if (type) filter.type = type;

  const result = await Post.find(filter)
    .sort("-publishedAt")
    .limit(6)
    .lean();

  return result;
};

const getRelatedPosts = async (id: string, limit = 3) => {
  const post = await Post.findById(id);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  const result = await Post.find({
    _id: { $ne: id },
    type: post.type,
    tags: { $in: post.tags },
    isPublished: true,
  })
    .sort("-publishedAt")
    .limit(limit)
    .lean();

  return result;
};

export const PostService = {
  createPost,
  getAllPosts,
  getPostById,
  getPostBySlug,
  updatePost,
  deletePost,
  incrementViews,
  getFeaturedPosts,
  getRelatedPosts,
};
