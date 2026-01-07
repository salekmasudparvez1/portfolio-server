import { IPost } from "./post.interface";
import { Request, Response } from "express";
export declare const PostService: {
    createPost: (req: Request) => Promise<import("mongoose").Document<unknown, {}, IPost, {}, import("mongoose").DefaultSchemaOptions> & IPost & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    getAllPosts: (query: Record<string, any>) => Promise<{
        posts: (IPost & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getPostById: (id: string) => Promise<import("mongoose").Document<unknown, {}, IPost, {}, import("mongoose").DefaultSchemaOptions> & IPost & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    getPostBySlug: (slug: string) => Promise<import("mongoose").Document<unknown, {}, IPost, {}, import("mongoose").DefaultSchemaOptions> & IPost & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    updatePost: (id: string, req: Request) => Promise<import("mongoose").Document<unknown, {}, IPost, {}, import("mongoose").DefaultSchemaOptions> & IPost & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    deletePost: (id: string) => Promise<import("mongoose").Document<unknown, {}, IPost, {}, import("mongoose").DefaultSchemaOptions> & IPost & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    incrementViews: (slug: any, req: Request, res: Response) => Promise<{
        counted: boolean;
        message: string;
        views?: never;
    } | {
        counted: boolean;
        views: number;
        message: string;
    }>;
    getFeaturedPosts: (type?: "project" | "blog") => Promise<(IPost & Required<{
        _id: string;
    }> & {
        __v: number;
    })[]>;
    getRelatedPosts: (id: string, limit?: number) => Promise<(IPost & Required<{
        _id: string;
    }> & {
        __v: number;
    })[]>;
};
//# sourceMappingURL=post.service.d.ts.map