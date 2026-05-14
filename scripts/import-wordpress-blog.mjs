import fs from 'node:fs';
import path from 'node:path';

const inputPath = process.argv[2];

if (!inputPath) {
  console.error('Usage: node scripts/import-wordpress-blog.mjs <path-to-wordpress-xml>');
  process.exit(1);
}

const xml = fs.readFileSync(inputPath, 'utf8');

const decodeEntities = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '-');

const normalizeCategory = (value) =>
  decodeEntities(String(value || ''))
    .replace(/^<!\[CDATA\[/i, '')
    .replace(/\]\]>$/i, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+,/g, ',')
    .replace(/,+$/g, '')
    .trim();

const stripHtml = (html) =>
  decodeEntities(
    html
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );

const getTag = (source, tagName) => {
  const cdataRegex = new RegExp(`<${tagName}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tagName}>`, 'i');
  const plainRegex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  return (source.match(cdataRegex)?.[1] ?? source.match(plainRegex)?.[1] ?? '').trim();
};

const extractFeaturedImage = (contentHtml) => {
  const imageMatch = contentHtml.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/i);
  return imageMatch?.[1] ?? 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200';
};

const toSlug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const itemBlocks = [...xml.matchAll(/<item>[\s\S]*?<\/item>/g)].map((match) => match[0]);

const posts = [];

for (const block of itemBlocks) {
  const postType = getTag(block, 'wp:post_type');
  const status = getTag(block, 'wp:status');

  if (postType !== 'post' || status !== 'publish') {
    continue;
  }

  const id = getTag(block, 'wp:post_id') || getTag(block, 'guid');
  const titleRaw = decodeEntities(getTag(block, 'title'));
  const title = titleRaw || 'Untitled Post';

  const slugRaw = getTag(block, 'wp:post_name');
  const slug = (slugRaw || toSlug(title)).trim();

  const contentHtml = getTag(block, 'content:encoded');
  const excerptHtml = getTag(block, 'excerpt:encoded');
  const description = getTag(block, 'description');

  const plainFromContent = stripHtml(contentHtml);
  const excerptSource = stripHtml(excerptHtml) || stripHtml(description) || plainFromContent;
  const excerpt = excerptSource.slice(0, 210).trim() + (excerptSource.length > 210 ? '...' : '');

  const author = decodeEntities(getTag(block, 'dc:creator') || 'admin');
  const publishedAt = getTag(block, 'wp:post_date_gmt') || getTag(block, 'pubDate');

  const categoryMatches = [
    ...block.matchAll(/<category[^>]*domain="category"[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g),
    ...block.matchAll(/<category[^>]*domain="category"[^>]*>([\s\S]*?)<\/category>/g),
  ];

  const categories = Array.from(
    new Set(categoryMatches.map((m) => normalizeCategory(m[1] || '')).filter(Boolean))
  );

  const fallbackDescription = stripHtml(contentHtml).slice(0, 155).trim();
  const metaDescription = (stripHtml(excerptHtml) || fallbackDescription || `Read ${title} on One Hub blog.`).slice(0, 160);

  posts.push({
    id: String(id),
    slug,
    title,
    excerpt,
    contentHtml,
    publishedAt,
    author,
    categories: categories.length > 0 ? categories : ['Uncategorized'],
    featuredImage: extractFeaturedImage(contentHtml),
    metaTitle: `${title} | One Hub Blog`,
    metaDescription,
  });
}

posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

const outputPath = path.resolve('src/data/blogData.ts');

const fileContents = `import type { BlogPost } from '@/app/types/blog';\n\nexport const blogPosts: BlogPost[] = ${JSON.stringify(posts, null, 2)};\n`;

fs.writeFileSync(outputPath, fileContents, 'utf8');

console.log(`Imported ${posts.length} published blog posts to ${outputPath}`);
