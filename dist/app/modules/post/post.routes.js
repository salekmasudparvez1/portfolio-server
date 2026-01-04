"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRouter = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const post_controller_1 = require("./post.controller");
const verifyAdmin_1 = __importDefault(require("../../middlewares/verifyAdmin"));
const ImageUpload_1 = require("../../middlewares/ImageUpload");
const post_validations_1 = require("./post.validations");
const router = (0, express_1.Router)();
// Public routes
router.get("/", post_controller_1.PostController.getAllPosts);
router.get("/featured", post_controller_1.PostController.getFeaturedPosts);
router.get("/slug/:slug", post_controller_1.PostController.getPostBySlug);
router.get("/:id", post_controller_1.PostController.getPostById);
router.get("/:id/related", post_controller_1.PostController.getRelatedPosts);
router.patch("/:id/views", post_controller_1.PostController.incrementViews);
// Admin protected routes
router.post("/", verifyAdmin_1.default, ImageUpload_1.uploadMixed, ImageUpload_1.processPostImages, (0, validateRequest_1.default)(post_validations_1.PostValidations.createPostValidation), post_controller_1.PostController.createPost);
router.patch("/:id", verifyAdmin_1.default, verifyAdmin_1.default, ImageUpload_1.uploadMixed, ImageUpload_1.processPostImages, (0, validateRequest_1.default)(post_validations_1.PostValidations.updatePostValidation), post_controller_1.PostController.updatePost);
router.delete("/:id", verifyAdmin_1.default, post_controller_1.PostController.deletePost);
exports.PostRouter = router;
//# sourceMappingURL=post.routes.js.map