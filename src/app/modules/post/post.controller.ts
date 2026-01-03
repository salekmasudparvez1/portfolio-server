import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PostService } from "./post.service";

const createPost = catchAsync(async (req, res) => {
  const result = await PostService.createPost(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Post created successfully",
    data: result,
  });
});

const getAllPosts = catchAsync(async (req, res) => {
 
  const result = await PostService.getAllPosts(req.query);
 
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Posts retrieved successfully",
    data: result,
  });
});

const getPostById = catchAsync(async (req, res) => {
  const result = await PostService.getPostById(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post retrieved successfully",
    data: result,
  });
});

const getPostBySlug = catchAsync(async (req, res) => {
  const result = await PostService.getPostBySlug(req.params.slug as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post retrieved successfully",
    data: result,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const result = await PostService.updatePost(req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post updated successfully",
    data: result,
  });
});

const deletePost = catchAsync(async (req, res) => {
  await PostService.deletePost(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post deleted successfully",
    data: null,
  });
});

const incrementViews = catchAsync(async (req, res) => {
  const result = await PostService.incrementViews(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Views incremented successfully",
    data: result,
  });
});

const getFeaturedPosts = catchAsync(async (req, res) => {
  const result = await PostService.getFeaturedPosts(
    req.query.type as "project" | "blog" | undefined
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Featured posts retrieved successfully",
    data: result,
  });
});

const getRelatedPosts = catchAsync(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 3;
  const result = await PostService.getRelatedPosts(req.params.id as string, limit);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Related posts retrieved successfully",
    data: result,
  });
});

export const PostController = {
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
