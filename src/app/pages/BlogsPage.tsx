import { Link, useSearchParams } from 'react-router';
import { useEffect, useMemo } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { blogPosts } from '@/data/blogData';
import { BLOGS_PER_PAGE, formatBlogDate, getAllCategories, getCleanCategories, getPostImage, normalizeCategory } from '@/app/utils/blog';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/app/components/ui/pagination';

function buildPageNumbers(current: number, total: number): Array<number | 'ellipsis'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: Array<number | 'ellipsis'> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push('ellipsis');
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < total - 1) pages.push('ellipsis');
  pages.push(total);

  return pages;
}

export function BlogsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || 'All';
  const currentPage = Math.max(1, Number(searchParams.get('page') || '1'));
  const categories = useMemo(() => getAllCategories(), []);

  const filteredPosts = useMemo(() => {
    if (category === 'All') return blogPosts;
    return blogPosts.filter((post) =>
      getCleanCategories(post.categories).some((item) => item.toLowerCase() === category.toLowerCase())
    );
  }, [category]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / BLOGS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const pagedPosts = useMemo(() => {
    const start = (safePage - 1) * BLOGS_PER_PAGE;
    return filteredPosts.slice(start, start + BLOGS_PER_PAGE);
  }, [filteredPosts, safePage]);

  const updateSearch = (nextPage: number, nextCategory = category) => {
    const params = new URLSearchParams();
    if (nextCategory !== 'All') params.set('category', nextCategory);
    if (nextPage > 1) params.set('page', String(nextPage));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageItems = buildPageNumbers(safePage, totalPages);

  useEffect(() => {
    document.title = 'Blogs | One Hub';
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute(
      'content',
      'Explore One Hub blog posts on influencer marketing, creator strategy, and campaign growth.'
    );
  }, []);

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="bg-black py-14 md:py-18">
        <div className="max-w-[1320px] mx-auto px-4">
          <h1 className="text-center text-primary text-4xl md:text-6xl font-bold tracking-tight">Blogs</h1>
        </div>
      </section>

      <section className="max-w-[1320px] mx-auto px-4 py-10 md:py-14">
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => updateSearch(1, item)}
              className={`px-4 py-2 rounded-full border text-sm cursor-pointer transition-colors ${
                item === category
                  ? 'bg-primary text-black border-primary font-semibold'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-black'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {pagedPosts.map((post) => (
            <article key={post.id} className="group">
              <Link to={`/blogs/${post.slug}`} className="block overflow-hidden bg-white">
                <img
                  src={getPostImage(post)}
                  alt={post.title}
                  className="w-full aspect-[16/10] object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </Link>

              <h2 className="text-2xl leading-tight mt-5 font-medium text-black">
                <Link to={`/blogs/${post.slug}`} className="hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </h2>

              <p className="text-gray-500 mt-2 text-[22px] hidden" aria-hidden>
                {formatBlogDate(post.publishedAt)}
              </p>
              <div className="mt-2 flex items-center gap-2 text-gray-500 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{formatBlogDate(post.publishedAt)}</span>
              </div>

              <p className="text-gray-600 mt-4 text-[19px] leading-8 line-clamp-3">{post.excerpt}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {getCleanCategories(post.categories).slice(0, 2).map((item) => (
                  <span key={`${post.id}-${item}`} className="text-xs px-2.5 py-1 rounded-full border border-gray-300 text-gray-600">
                    {normalizeCategory(item)}
                  </span>
                ))}
              </div>

              <Link
                to={`/blogs/${post.slug}`}
                className="inline-flex items-center gap-1 mt-5 text-lg text-black hover:text-primary transition-colors"
              >
                Read More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    if (safePage > 1) updateSearch(safePage - 1);
                  }}
                  className={safePage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {pageItems.map((item, index) => (
                <PaginationItem key={`${item}-${index}`}>
                  {item === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      isActive={item === safePage}
                      onClick={(event) => {
                        event.preventDefault();
                        updateSearch(item);
                      }}
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    if (safePage < totalPages) updateSearch(safePage + 1);
                  }}
                  className={safePage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>
    </div>
  );
}
