import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import { Calendar } from 'lucide-react';
import { getBlogBySlug, formatBlogDate, getCleanCategories, getPostImage } from '@/app/utils/blog';

export function BlogDetailsPage() {
  const { slug = '' } = useParams();
  const post = getBlogBySlug(slug);

  useEffect(() => {
    if (!post) return;

    const upsertMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
      let element = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const upsertCanonical = (href: string) => {
      let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    const origin = window.location.origin;
    const canonicalUrl = `${origin}/blogs/${post.slug}`;
    const title = post.metaTitle || `${post.title} | One Hub Blog`;
    const description = post.metaDescription || post.excerpt || '';
    const image = getPostImage(post) || `${origin}/onehubfav.png`;

    document.title = title;
    upsertMeta('meta[name="description"]', 'name', 'description', description);

    upsertMeta('meta[property="og:type"]', 'property', 'og:type', 'article');
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', title);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', image);
    upsertMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'One Hub');

    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);

    upsertCanonical(canonicalUrl);
  }, [post]);

  if (!post) {
    return <Navigate to="/blogs" replace />;
  }

  return (
    <section className="bg-white min-h-screen py-10 md:py-14">
      <div className="max-w-[980px] mx-auto px-4">
        <Link to="/blogs" className="text-sm text-gray-500 hover:text-primary transition-colors">
          Back to Blogs
        </Link>

        <h1 className="text-3xl md:text-5xl font-semibold mt-4 leading-tight text-black">{post.title}</h1>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="inline-flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{formatBlogDate(post.publishedAt)}</span>
          </div>
          <span>By {post.author}</span>
          <div className="flex flex-wrap gap-2">
            {getCleanCategories(post.categories).map((category) => (
              <Link
                key={category}
                to={`/blogs?category=${encodeURIComponent(category)}`}
                className="text-xs px-2.5 py-1 rounded-full border border-gray-300 hover:border-primary hover:text-primary"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        <img
          src={getPostImage(post)}
          alt={post.title}
          className="w-full mt-7 rounded-md object-cover"
        />

        <article
          className="prose prose-neutral max-w-none mt-8 [&_h2]:text-4xl [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-3xl [&_p]:text-lg [&_p]:leading-8 [&_ul]:text-lg"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </div>
    </section>
  );
}
