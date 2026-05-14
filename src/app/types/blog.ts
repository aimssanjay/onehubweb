export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  publishedAt: string;
  author: string;
  categories: string[];
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
}
