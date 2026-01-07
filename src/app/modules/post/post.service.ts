import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IPost } from "./post.interface";
import { Post } from "./post.model";
import { Request, Response } from "express";
import config from "../../config";
import crypto from "crypto";
import { redis } from "../../../redis";

// Helper to clean empty objects and convert to undefined
const cleanValue = (value: any): any => {
  if (value === null || value === undefined || value === "") return undefined;
  if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) return undefined;
  return value;
};

// Helper to generate unique viewer identifier
const generateViewerHash = (ip: string, userAgent: string, slug: string): string => {
  const data = `${ip}-${userAgent}-${slug}`;
  return crypto.createHash("sha256").update(data).digest("hex");
};

const createPost = async (req: Request) => {
  
  const payload: IPost = req.body;
  const user = (req as any)?.user;


  // Parse and normalize seo object
  let seoData: any = {};
  if (payload.seo) {

    const parsedSeo = typeof payload.seo === "string" ? JSON.parse(payload.seo) : payload.seo;

    
    // Handle keywords - can be string (comma-separated) or array
    let keywordsArray;
    if (parsedSeo.keywords) {
      if (Array.isArray(parsedSeo.keywords)) {
        keywordsArray = parsedSeo.keywords;
      } else if (typeof parsedSeo.keywords === "string") {
        keywordsArray = parsedSeo.keywords.split(",").map((k: string) => k.trim()).filter(Boolean);
      }
    }
    
    seoData = {
      metaTitle: cleanValue(parsedSeo.metaTitle),
      metaDescription: cleanValue(parsedSeo.metaDescription),
      keywords: keywordsArray || undefined,
      canonicalUrl: cleanValue(parsedSeo.canonicalUrl),
      ogImage: cleanValue(parsedSeo.ogImage),
    };
    
    // Remove undefined fields
    Object.keys(seoData).forEach(key => {
      if (seoData[key] === undefined) delete seoData[key];
    });
    
    
  } else {
    
  }

  const finalDocument = {
    title: payload.title,
    slug: payload.slug,
    type: payload.type,
    excerpt: payload.excerpt,
    content: payload.content,

    // convert string → boolean (if coming from multipart/form-data) or use directly
    isPublished: typeof payload.isPublished === "string"
      ? payload.isPublished === "true"
      : payload.isPublished,

    author: payload.author,

    // parse JSON string → array
    tags: payload.tags
      ? (typeof payload.tags === "string" ? JSON.parse(payload.tags) : payload.tags)
      : [],

    // parse JSON string → object
    projectLinks: payload.projectLinks
      ? (typeof payload.projectLinks === "string" ? JSON.parse(payload.projectLinks) : payload.projectLinks)
      : {},

    // Use cleaned SEO data
    seo: Object.keys(seoData).length > 0 ? seoData : undefined,

    coverImage: payload.coverImage,
  };

 
  const existingPost = await Post.findOne({ slug: payload.slug });

  if (existingPost) {
    throw new AppError(httpStatus.CONFLICT, "Slug already exists");
  }

  const result = await Post.create(finalDocument);
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

const updatePost = async (id: string, req: Request) => {

  
  const payload: Partial<IPost> = req.body;
 

  // Parse and normalize seo object if it exists
  let processedPayload: any = { ...payload };
  
  if (payload.seo) {
    const parsedSeo = typeof payload.seo === "string" ? JSON.parse(payload.seo) : payload.seo;
    
    // Handle keywords - can be string (comma-separated) or array
    let keywordsArray;
    if (parsedSeo.keywords) {
      if (Array.isArray(parsedSeo.keywords)) {
        keywordsArray = parsedSeo.keywords;
      } else if (typeof parsedSeo.keywords === "string") {
        keywordsArray = parsedSeo.keywords.split(",").map((k: string) => k.trim()).filter(Boolean);
      }
    }
    
    const seoData: any = {
      metaTitle: cleanValue(parsedSeo.metaTitle),
      metaDescription: cleanValue(parsedSeo.metaDescription),
      keywords: keywordsArray || undefined,
      canonicalUrl: cleanValue(parsedSeo.canonicalUrl),
      ogImage: cleanValue(parsedSeo.ogImage),
    };
    
    
    // Remove undefined fields
    Object.keys(seoData).forEach(key => {
      if (seoData[key] === undefined) delete seoData[key];
    });
    
    
    processedPayload.seo = Object.keys(seoData).length > 0 ? seoData : undefined;
  }

  // Parse other fields if they're strings
  if (payload.tags && typeof payload.tags === "string") {
    processedPayload.tags = JSON.parse(payload.tags);
   
  }

  if (payload.projectLinks && typeof payload.projectLinks === "string") {
    processedPayload.projectLinks = JSON.parse(payload.projectLinks);

  }

  if (typeof payload.isPublished === "string") {
    processedPayload.isPublished = payload.isPublished === "true";
    
  }

 

  // If slug is being updated, check for duplicates
  if (processedPayload.slug) {
    const existingPost = await Post.findOne({
      slug: processedPayload.slug,
      _id: { $ne: id },
    });
    if (existingPost) {
      throw new AppError(httpStatus.CONFLICT, "Slug already exists");
    }
  }

  const result = await Post.findByIdAndUpdate(id, processedPayload, {
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

const incrementViews = async (slug: any, req: Request, res: Response) => {
  if (!slug) {
    throw new AppError(httpStatus.BAD_REQUEST, "Slug is required");
  }

  // Get client IP (handle proxies)
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "unknown";

  const userAgent = req.headers["user-agent"] || "unknown";

  // Generate unique hash for this viewer + slug combination
  const viewerHash = generateViewerHash(ip, userAgent, slug);
  const redisKey = `post_view:${viewerHash}`;
  const cookieKey = `views_${slug}`;
  const isProduction = config.NODE_ENV === "production";

  try {
    // Check Redis first (most reliable)
    const hasViewed = await redis.get(redisKey);

    if (hasViewed) {
      return {
        counted: false,
        message: "View already counted",
      };
    }

    // Increment view count in database
    const result = await Post.findOneAndUpdate(
      { slug, isPublished: true },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, "Post not found or not published");
    }

    // Store in Redis with 24-hour TTL
    await redis.setex(redisKey, 24 * 60 * 60, "1");

    // Set cookie as backup
    res.cookie(cookieKey, "1", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return {
      counted: true,
      views: result.views,
      message: "View counted successfully",
    };

  } catch (error) {
    // If Redis fails, fall back to cookie-only check
    if (req.cookies && req.cookies[cookieKey]) {
      return {
        counted: false,
        message: "View already counted (cookie fallback)",
      };
    }

    // Increment anyway if both Redis and cookie check fail
    const result = await Post.findOneAndUpdate(
      { slug, isPublished: true },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, "Post not found or not published");
    }

    // Set cookie
    res.cookie(cookieKey, "1", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      counted: true,
      views: result.views,
      message: "View counted (fallback mode)",
    };
  }
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
