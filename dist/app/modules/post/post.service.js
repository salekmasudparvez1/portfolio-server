"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const post_model_1 = require("./post.model");
const config_1 = __importDefault(require("../../config"));
const crypto_1 = __importDefault(require("crypto"));
const redis_1 = require("../../../redis");
// Helper to clean empty objects and convert to undefined
const cleanValue = (value) => {
    if (value === null || value === undefined || value === "")
        return undefined;
    if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0)
        return undefined;
    return value;
};
// Helper to generate unique viewer identifier
const generateViewerHash = (ip, userAgent, slug) => {
    const data = `${ip}-${userAgent}-${slug}`;
    return crypto_1.default.createHash("sha256").update(data).digest("hex");
};
const createPost = async (req) => {
    const payload = req.body;
    const user = req?.user;
    // Parse and normalize seo object
    let seoData = {};
    if (payload.seo) {
        const parsedSeo = typeof payload.seo === "string" ? JSON.parse(payload.seo) : payload.seo;
        // Handle keywords - can be string (comma-separated) or array
        let keywordsArray;
        if (parsedSeo.keywords) {
            if (Array.isArray(parsedSeo.keywords)) {
                keywordsArray = parsedSeo.keywords;
            }
            else if (typeof parsedSeo.keywords === "string") {
                keywordsArray = parsedSeo.keywords.split(",").map((k) => k.trim()).filter(Boolean);
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
            if (seoData[key] === undefined)
                delete seoData[key];
        });
    }
    else {
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
    const existingPost = await post_model_1.Post.findOne({ slug: payload.slug });
    if (existingPost) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Slug already exists");
    }
    const result = await post_model_1.Post.create(finalDocument);
    return result;
};
const getAllPosts = async (query) => {
    const { type, isPublished, isFeatured, tags, author, search, page = 1, limit = 10, sort = "-createdAt", } = query;
    const filter = {};
    if (type)
        filter.type = type;
    if (isPublished !== undefined)
        filter.isPublished = isPublished === "true";
    if (isFeatured !== undefined)
        filter.isFeatured = isFeatured === "true";
    if (tags)
        filter.tags = { $in: Array.isArray(tags) ? tags : [tags] };
    if (author)
        filter.author = author;
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
        post_model_1.Post.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        post_model_1.Post.countDocuments(filter),
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
const getPostById = async (id) => {
    const result = await post_model_1.Post.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
    }
    return result;
};
const getPostBySlug = async (slug) => {
    const result = await post_model_1.Post.findOne({ slug });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
    }
    return result;
};
const updatePost = async (id, req) => {
    const payload = req.body;
    // Parse and normalize seo object if it exists
    let processedPayload = { ...payload };
    if (payload.seo) {
        const parsedSeo = typeof payload.seo === "string" ? JSON.parse(payload.seo) : payload.seo;
        // Handle keywords - can be string (comma-separated) or array
        let keywordsArray;
        if (parsedSeo.keywords) {
            if (Array.isArray(parsedSeo.keywords)) {
                keywordsArray = parsedSeo.keywords;
            }
            else if (typeof parsedSeo.keywords === "string") {
                keywordsArray = parsedSeo.keywords.split(",").map((k) => k.trim()).filter(Boolean);
            }
        }
        const seoData = {
            metaTitle: cleanValue(parsedSeo.metaTitle),
            metaDescription: cleanValue(parsedSeo.metaDescription),
            keywords: keywordsArray || undefined,
            canonicalUrl: cleanValue(parsedSeo.canonicalUrl),
            ogImage: cleanValue(parsedSeo.ogImage),
        };
        // Remove undefined fields
        Object.keys(seoData).forEach(key => {
            if (seoData[key] === undefined)
                delete seoData[key];
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
        const existingPost = await post_model_1.Post.findOne({
            slug: processedPayload.slug,
            _id: { $ne: id },
        });
        if (existingPost) {
            throw new AppError_1.default(http_status_1.default.CONFLICT, "Slug already exists");
        }
    }
    const result = await post_model_1.Post.findByIdAndUpdate(id, processedPayload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
    }
    return result;
};
const deletePost = async (id) => {
    const result = await post_model_1.Post.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
    }
    return result;
};
const incrementViews = async (slug, req, res) => {
    if (!slug) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Slug is required");
    }
    // Get client IP (handle proxies)
    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.socket.remoteAddress ||
        "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";
    // Generate unique hash for this viewer + slug combination
    const viewerHash = generateViewerHash(ip, userAgent, slug);
    const redisKey = `post_view:${viewerHash}`;
    const cookieKey = `views_${slug}`;
    const isProduction = config_1.default.NODE_ENV === "production";
    try {
        // Check Redis first (most reliable)
        const hasViewed = await redis_1.redis.get(redisKey);
        if (hasViewed) {
            return {
                counted: false,
                message: "View already counted",
            };
        }
        // Increment view count in database
        const result = await post_model_1.Post.findOneAndUpdate({ slug, isPublished: true }, { $inc: { views: 1 } }, { new: true });
        if (!result) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Post not found or not published");
        }
        // Store in Redis with 24-hour TTL
        await redis_1.redis.setex(redisKey, 24 * 60 * 60, "1");
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
    }
    catch (error) {
        // If Redis fails, fall back to cookie-only check
        if (req.cookies && req.cookies[cookieKey]) {
            return {
                counted: false,
                message: "View already counted (cookie fallback)",
            };
        }
        // Increment anyway if both Redis and cookie check fail
        const result = await post_model_1.Post.findOneAndUpdate({ slug, isPublished: true }, { $inc: { views: 1 } }, { new: true });
        if (!result) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Post not found or not published");
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
const getFeaturedPosts = async (type) => {
    const filter = {
        isFeatured: true,
        isPublished: true,
    };
    if (type)
        filter.type = type;
    const result = await post_model_1.Post.find(filter)
        .sort("-publishedAt")
        .limit(6)
        .lean();
    return result;
};
const getRelatedPosts = async (id, limit = 3) => {
    const post = await post_model_1.Post.findById(id);
    if (!post) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
    }
    const result = await post_model_1.Post.find({
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
exports.PostService = {
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
//# sourceMappingURL=post.service.js.map