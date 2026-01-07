import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { PostController } from "./post.controller";
import verifyAdmin from "../../middlewares/verifyAdmin";
import { processPostImages, uploadMixed } from "../../middlewares/ImageUpload";
import { PostValidations } from "./post.validations";

const router = Router();

// Public routes
router.get("/", PostController.getAllPosts);
router.get("/featured", PostController.getFeaturedPosts);
router.get("/slug/:slug", PostController.getPostBySlug);
router.get("/:id", PostController.getPostById);
router.get("/:id/related", PostController.getRelatedPosts);
router.patch("/:id/views", PostController.incrementViews);

// Admin protected routes
router.post(
    "/",
    verifyAdmin,
    uploadMixed, 
    processPostImages,
    PostController.createPost
);

router.patch(
    "/:id",
    verifyAdmin,
    uploadMixed, 
    processPostImages, 
    PostController.updatePost
);

router.delete("/:id", verifyAdmin, PostController.deletePost);
router.put('/view/:slug', PostController.incrementViews);

export const PostRouter = router;
