"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const post_service_1 = require("./post.service");
const createPost = (0, catchAsync_1.default)(async (req, res) => {
    const result = await post_service_1.PostService.createPost(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Post created successfully",
        data: result,
    });
});
const getAllPosts = (0, catchAsync_1.default)(async (req, res) => {
    const result = await post_service_1.PostService.getAllPosts(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Posts retrieved successfully",
        data: result,
    });
});
const getPostById = (0, catchAsync_1.default)(async (req, res) => {
    const result = await post_service_1.PostService.getPostById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Post retrieved successfully",
        data: result,
    });
});
const getPostBySlug = (0, catchAsync_1.default)(async (req, res) => {
    const result = await post_service_1.PostService.getPostBySlug(req.params.slug);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Post retrieved successfully",
        data: result,
    });
});
const updatePost = (0, catchAsync_1.default)(async (req, res) => {
    const result = await post_service_1.PostService.updatePost(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Post updated successfully",
        data: result,
    });
});
const deletePost = (0, catchAsync_1.default)(async (req, res) => {
    await post_service_1.PostService.deletePost(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Post deleted successfully",
        data: null,
    });
});
const incrementViews = (0, catchAsync_1.default)(async (req, res) => {
    const result = await post_service_1.PostService.incrementViews(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Views incremented successfully",
        data: result,
    });
});
const getFeaturedPosts = (0, catchAsync_1.default)(async (req, res) => {
    const result = await post_service_1.PostService.getFeaturedPosts(req.query.type);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Featured posts retrieved successfully",
        data: result,
    });
});
const getRelatedPosts = (0, catchAsync_1.default)(async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : 3;
    const result = await post_service_1.PostService.getRelatedPosts(req.params.id, limit);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Related posts retrieved successfully",
        data: result,
    });
});
exports.PostController = {
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
//# sourceMappingURL=post.controller.js.map