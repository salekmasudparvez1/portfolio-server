import { z } from "zod";
export declare const basePostSchema: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodString;
    type: z.ZodEnum<{
        project: "project";
        blog: "blog";
    }>;
    excerpt: z.ZodString;
    content: z.ZodString;
    author: z.ZodString;
    coverImage: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
    gallery: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodArray<z.ZodString>>>;
    tags: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodArray<z.ZodString>>;
    projectLinks: z.ZodOptional<z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodObject<{
        live: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
        githubClient: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
        githubServer: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>>>;
    seo: z.ZodOptional<z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodObject<{
        metaTitle: z.ZodOptional<z.ZodString>;
        metaDescription: z.ZodOptional<z.ZodString>;
        keywords: z.ZodPipe<z.ZodTransform<any[] | undefined, unknown>, z.ZodOptional<z.ZodArray<z.ZodString>>>;
        canonicalUrl: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
        ogImage: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>>>;
    isFeatured: z.ZodDefault<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodBoolean>>;
    isPublished: z.ZodDefault<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodBoolean>>;
    publishedAt: z.ZodOptional<z.ZodString>;
    readingTime: z.ZodPipe<z.ZodTransform<{} | undefined, unknown>, z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export declare const createPostValidation: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        slug: z.ZodString;
        type: z.ZodEnum<{
            project: "project";
            blog: "blog";
        }>;
        excerpt: z.ZodString;
        content: z.ZodString;
        author: z.ZodString;
        coverImage: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
        gallery: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodArray<z.ZodString>>>;
        tags: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodArray<z.ZodString>>;
        projectLinks: z.ZodOptional<z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodObject<{
            live: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
            githubClient: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
            githubServer: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
        }, z.core.$strip>>>;
        seo: z.ZodOptional<z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodObject<{
            metaTitle: z.ZodOptional<z.ZodString>;
            metaDescription: z.ZodOptional<z.ZodString>;
            keywords: z.ZodPipe<z.ZodTransform<any[] | undefined, unknown>, z.ZodOptional<z.ZodArray<z.ZodString>>>;
            canonicalUrl: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
            ogImage: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
        }, z.core.$strip>>>;
        isFeatured: z.ZodDefault<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodBoolean>>;
        isPublished: z.ZodDefault<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodBoolean>>;
        publishedAt: z.ZodOptional<z.ZodString>;
        readingTime: z.ZodPipe<z.ZodTransform<{} | undefined, unknown>, z.ZodOptional<z.ZodNumber>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updatePostValidation: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        slug: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodEnum<{
            project: "project";
            blog: "blog";
        }>>;
        excerpt: z.ZodOptional<z.ZodString>;
        content: z.ZodOptional<z.ZodString>;
        author: z.ZodOptional<z.ZodString>;
        coverImage: z.ZodOptional<z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>>;
        gallery: z.ZodOptional<z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodArray<z.ZodString>>>>;
        tags: z.ZodOptional<z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodArray<z.ZodString>>>;
        projectLinks: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodObject<{
            live: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
            githubClient: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
            githubServer: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
        }, z.core.$strip>>>>;
        seo: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodObject<{
            metaTitle: z.ZodOptional<z.ZodString>;
            metaDescription: z.ZodOptional<z.ZodString>;
            keywords: z.ZodPipe<z.ZodTransform<any[] | undefined, unknown>, z.ZodOptional<z.ZodArray<z.ZodString>>>;
            canonicalUrl: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
            ogImage: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
        }, z.core.$strip>>>>;
        isFeatured: z.ZodOptional<z.ZodDefault<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodBoolean>>>;
        isPublished: z.ZodOptional<z.ZodDefault<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodBoolean>>>;
        publishedAt: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        readingTime: z.ZodOptional<z.ZodPipe<z.ZodTransform<{} | undefined, unknown>, z.ZodOptional<z.ZodNumber>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const PostValidations: {
    createPostValidation: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodString;
            slug: z.ZodString;
            type: z.ZodEnum<{
                project: "project";
                blog: "blog";
            }>;
            excerpt: z.ZodString;
            content: z.ZodString;
            author: z.ZodString;
            coverImage: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
            gallery: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodArray<z.ZodString>>>;
            tags: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodArray<z.ZodString>>;
            projectLinks: z.ZodOptional<z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodObject<{
                live: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
                githubClient: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
                githubServer: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
            }, z.core.$strip>>>;
            seo: z.ZodOptional<z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodObject<{
                metaTitle: z.ZodOptional<z.ZodString>;
                metaDescription: z.ZodOptional<z.ZodString>;
                keywords: z.ZodPipe<z.ZodTransform<any[] | undefined, unknown>, z.ZodOptional<z.ZodArray<z.ZodString>>>;
                canonicalUrl: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
                ogImage: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
            }, z.core.$strip>>>;
            isFeatured: z.ZodDefault<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodBoolean>>;
            isPublished: z.ZodDefault<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodBoolean>>;
            publishedAt: z.ZodOptional<z.ZodString>;
            readingTime: z.ZodPipe<z.ZodTransform<{} | undefined, unknown>, z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updatePostValidation: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            slug: z.ZodOptional<z.ZodString>;
            type: z.ZodOptional<z.ZodEnum<{
                project: "project";
                blog: "blog";
            }>>;
            excerpt: z.ZodOptional<z.ZodString>;
            content: z.ZodOptional<z.ZodString>;
            author: z.ZodOptional<z.ZodString>;
            coverImage: z.ZodOptional<z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>>;
            gallery: z.ZodOptional<z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodArray<z.ZodString>>>>;
            tags: z.ZodOptional<z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodArray<z.ZodString>>>;
            projectLinks: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodObject<{
                live: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
                githubClient: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
                githubServer: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
            }, z.core.$strip>>>>;
            seo: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodObject<{
                metaTitle: z.ZodOptional<z.ZodString>;
                metaDescription: z.ZodOptional<z.ZodString>;
                keywords: z.ZodPipe<z.ZodTransform<any[] | undefined, unknown>, z.ZodOptional<z.ZodArray<z.ZodString>>>;
                canonicalUrl: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
                ogImage: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodOptional<z.ZodString>>;
            }, z.core.$strip>>>>;
            isFeatured: z.ZodOptional<z.ZodDefault<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodBoolean>>>;
            isPublished: z.ZodOptional<z.ZodDefault<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodBoolean>>>;
            publishedAt: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            readingTime: z.ZodOptional<z.ZodPipe<z.ZodTransform<{} | undefined, unknown>, z.ZodOptional<z.ZodNumber>>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=post.validations.d.ts.map