import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import { Calendar } from 'lucide-react';
import { getBlogBySlug, formatBlogDate, getCleanCategories, getPostImage } from '@/app/utils/blog';

export function BlogDetailsPage() {
  const { slug = '' } = useParams();
  const post = getBlogBySlug(slug);

  useEffect(() => {
    if (!post) return;

    document.title = post.metaTitle;
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', post.metaDescription);
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
