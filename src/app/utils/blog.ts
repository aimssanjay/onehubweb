import { blogPosts } from '@/data/blogData';
import type { BlogPost } from '@/app/types/blog';

export const BLOGS_PER_PAGE = 21;

export const formatBlogDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getAllCategories = () => {
  const set = new Set<string>();
  for (const post of blogPosts) {
    getCleanCategories(post.categories).forEach((category) => set.add(category));
  }
  return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
};

export const getBlogBySlug = (slug: string) => blogPosts.find((post) => post.slug === slug);

export const normalizeCategory = (value: string) => {
  const trimmed = String(value || '').trim();
  const withoutCdata = trimmed
    .replace(/^<!\[CDATA\[/i, '')
    .replace(/\]\]>$/i, '')
    .trim();

  return withoutCdata
    .replace(/\s+/g, ' ')
    .replace(/\s+,/g, ',')
    .replace(/,+$/g, '')
    .trim();
};

export const getCleanCategories = (categories: string[]) => {
  const dedup = new Map<string, string>();

  categories.forEach((category) => {
    const cleaned = normalizeCategory(category);
    if (!cleaned) return;
    const key = cleaned.toLowerCase();
    if (!dedup.has(key)) dedup.set(key, cleaned);
  });

  return Array.from(dedup.values());
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200';

const localImageModules = import.meta.glob('../../assets/blog/*.{png,jpg,jpeg,webp,avif,gif}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const localImages = Object.entries(localImageModules).map(([modulePath, url]) => {
  const fileName = modulePath.split('/').pop() || '';
  return { fileName, url };
});

const localByLowerFileName = new Map(localImages.map((item) => [item.fileName.toLowerCase(), item.url]));

const normalizeForMatch = (value: string) =>
  String(value || '')
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const toTokenSet = (value: string) =>
  new Set(
    normalizeForMatch(value)
      .split(' ')
      .filter((token) => token.length > 2)
  );

const similarityScore = (left: string, right: string) => {
  const leftTokens = toTokenSet(left);
  const rightTokens = toTokenSet(right);
  if (leftTokens.size === 0 || rightTokens.size === 0) return 0;

  let overlap = 0;
  for (const token of leftTokens) {
    if (rightTokens.has(token)) overlap += 1;
  }
  return overlap / Math.max(leftTokens.size, rightTokens.size);
};

const localImageCache = new Map<string, string>();

export const getPostImage = (post: BlogPost) => {
  if (localImageCache.has(post.id)) return localImageCache.get(post.id)!;

  const featuredImage = String(post.featuredImage || '');
  const cleanUrl = featuredImage.split('?')[0];
  const baseName = cleanUrl.substring(cleanUrl.lastIndexOf('/') + 1).toLowerCase();

  const exact = localByLowerFileName.get(baseName);
  if (exact) {
    localImageCache.set(post.id, exact);
    return exact;
  }

  // For posts without a usable URL, infer best match by title/slug against local filenames.
  if (featuredImage.includes('unsplash.com/photo-1499750310107-5fef28a66643')) {
    let best: { url: string; score: number } | null = null;

    for (const item of localImages) {
      const score = Math.max(similarityScore(post.title, item.fileName), similarityScore(post.slug, item.fileName));
      if (!best || score > best.score) {
        best = { url: item.url, score };
      }
    }

    if (best && best.score >= 0.45) {
      localImageCache.set(post.id, best.url);
      return best.url;
    }
  }

  const fallback = featuredImage || FALLBACK_IMAGE;
  localImageCache.set(post.id, fallback);
  return fallback;
};
