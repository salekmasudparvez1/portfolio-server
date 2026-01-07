"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const post_model_1 = require("./post.model");
const safeParse = (value, fallback) => {
    if (value === undefined || value === null)
        return fallback;
    if (typeof value !== "string")
        return value;
    try {
        return JSON.parse(value);
    }
    catch {
        return fallback;
    }
};
const createPost = async (req) => {
    const payload = req.body;
    const user = req?.user;
    const seoDoc = safeParse(payload?.seo, {});
    const finalDocument = {
        title: payload?.title,
        slug: payload?.slug,
        type: payload?.type,
        excerpt: payload?.excerpt,
        content: payload?.content,
        tags: safeParse(payload?.tags, []),
        projectLinks: safeParse(payload?.projectLinks, {}),
        isPublished: safeParse(payload?.isPublished, false),
        isFeatured: safeParse(payload?.isFeatured, false),
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
    const existingPost = await post_model_1.Post.findOne({ slug: payload.slug });
    if (existingPost) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Slug already exists");
    }
    const result = await post_model_1.Post.create(payload);
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
const updatePost = async (id, payload) => {
    // If slug is being updated, check for duplicates
    if (payload.slug) {
        const existingPost = await post_model_1.Post.findOne({
            slug: payload.slug,
            _id: { $ne: id },
        });
        if (existingPost) {
            throw new AppError_1.default(http_status_1.default.CONFLICT, "Slug already exists");
        }
    }
    const result = await post_model_1.Post.findByIdAndUpdate(id, payload, {
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
const incrementViews = async (id) => {
    const result = await post_model_1.Post.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
    }
    return result;
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