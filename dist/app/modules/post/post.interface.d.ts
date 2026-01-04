export type PostType = "project" | "blog";
export interface IPost {
    _id: string;
    title: string;
    slug: string;
    type: PostType;
    excerpt: string;
    content: string;
    coverImage: string;
    gallery?: string[];
    tags: string[];
    projectLinks?: {
        live?: string;
        githubClient?: string;
        githubServer?: string;
    };
    seo: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string[];
        canonicalUrl?: string;
        ogImage?: string;
    };
    author: string;
    isFeatured: boolean;
    isPublished: boolean;
    publishedAt: Date;
    readingTime?: number;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=post.interface.d.ts.map