import { Request, Response } from "express";
export declare const PostController: {
    createPost: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllPosts: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getPostById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getPostBySlug: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updatePost: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deletePost: (req: Request, res: Response, next: import("express").NextFunction) => void;
    incrementViews: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getFeaturedPosts: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getRelatedPosts: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=post.controller.d.ts.map