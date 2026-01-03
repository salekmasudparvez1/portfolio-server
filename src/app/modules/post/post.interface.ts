export type PostType = "project" | "blog";

export interface IPost {
  _id: string;
  title: string;
  slug: string; // url-friendly-name (e.g., "my-awesome-project")
  type: PostType;
  
  // Content
  excerpt: string;
  content: string; // Markdown/MDX/HTML
  coverImage: string;
  gallery?: string[]; // Extra project screenshots
  
  // Taxonomy
  tags: string[];
  
  // --- PROJECT SPECIFIC LINKS ---
  projectLinks?: {
    live?: string;        // The deployed URL (e.g., Vercel link)
    githubClient?: string; // Frontend Repository
    githubServer?: string; // Backend Repository (Optional)
  };

  // --- PRO SEO METADATA ---
  seo: {
    metaTitle?: string;       // Overrides main title for Browser Tab/Google Search
    metaDescription?: string; // 150-160 chars for Google snippet
    keywords?: string[];      // Specific keywords for search indexing
    canonicalUrl?: string;    // Crucial for avoiding duplicate content penalties
    ogImage?: string;         // Custom social card image (defaults to coverImage if empty)
  };

  // Stats & Status
  author: string; // User ID
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt: Date;
  readingTime?: number;
  views: number;
  
  createdAt: Date;
  updatedAt: Date;
}
