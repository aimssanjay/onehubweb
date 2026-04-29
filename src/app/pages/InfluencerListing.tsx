import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { usePlatforms } from '../hooks/usePlatforms';
import { useNavigate } from 'react-router';
import { SlidersHorizontal, X, Grid3x3, LayoutList, ChevronDown, ChevronUp, Shield, Zap, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { UnifiedInfluencerCard } from '../components/UnifiedInfluencerCard';
import type { Influencer } from '../../data/mockData';
import { useCategories } from '../hooks/useCategories';
import { API_BASE_URL } from '../../services/api';

interface InfluencerListResponse {
  success?: boolean;
  data?: unknown;
  message?: string;
}

const DEFAULT_LIMIT = 12;
const DEFAULT_FOLLOWER_RANGE: [number, number] = [0, 1000000];
const DEFAULT_PRICE_RANGE: [number, number] = [0, 10000];
const DEFAULT_ENGAGEMENT_RANGE: [number, number] = [0, 10];

function parseNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value === 'string') {
    const raw = value.trim().toLowerCase().replace(/,/g, '');
    if (!raw) return fallback;

    const multiplier = raw.endsWith('k') ? 1_000 : raw.endsWith('m') ? 1_000_000 : raw.endsWith('b') ? 1_000_000_000 : 1;
    const numericPart = multiplier === 1 ? raw : raw.slice(0, -1);
    const parsed = Number(numericPart);
    return Number.isFinite(parsed) ? parsed * multiplier : fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function extractPagination(data: Record<string, unknown>, fallbackPage: number, fallbackLimit: number, fallbackTotal: number) {
  const meta = (data.pagination as Record<string, unknown>) || (data.meta as Record<string, unknown>) || {};
  const page = parseNumber(meta.page ?? meta.current_page ?? data.page ?? data.current_page, fallbackPage);
  const limit = parseNumber(meta.limit ?? meta.per_page ?? data.limit ?? data.per_page, fallbackLimit);
  const total = parseNumber(
    meta.total ??
      meta.total_count ??
      meta.count ??
      data.total ??
      data.total_count ??
      data.count,
    fallbackTotal
  );
  const rawTotalPages = parseNumber(
    meta.total_pages ??
      meta.totalPages ??
      meta.last_page ??
      data.total_pages ??
      data.totalPages ??
      data.last_page,
    0
  );

  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, rawTotalPages || Math.ceil(total / Math.max(limit, 1))),
  };
}

function normalizePlatformName(name: string) {
  return name.trim().toLowerCase();
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function hasExplicitPaginationMeta(data: Record<string, unknown>) {
  const meta = (data.pagination as Record<string, unknown>) || (data.meta as Record<string, unknown>) || {};
  return Boolean(
    meta.total_pages ??
      meta.totalPages ??
      meta.last_page ??
      meta.total ??
      meta.total_count ??
      data.total_pages ??
      data.totalPages ??
      data.last_page ??
      data.total ??
      data.total_count
  );
}

function toNumberArray(value: unknown): number[] {
  if (Array.isArray(value)) {
    return value.map((item) => parseNumber(item, NaN)).filter((num) => Number.isFinite(num));
  }
  if (typeof value === 'number') {
    const parsed = parseNumber(value, NaN);
    return Number.isFinite(parsed) ? [parsed] : [];
  }
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const parsed = parseNumber(obj.id ?? obj.category_id ?? obj.categoryId, NaN);
    return Number.isFinite(parsed) ? [parsed] : [];
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed
            .map((item) => parseNumber(item, NaN))
            .filter((num) => Number.isFinite(num));
        }
      } catch {
        // fallback to comma parser below
      }
    }
    return value
      .split(',')
      .map((part) => parseNumber(part.replace(/[\[\]\s]/g, ''), NaN))
      .filter((num) => Number.isFinite(num));
  }
  return [];
}

function parseJsonSafely(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function InfluencerListing() {
  const navigate = useNavigate();
  const { platforms: apiPlatforms } = usePlatforms();
  const { categories } = useCategories();

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recommended');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [influencerResults, setInfluencerResults] = useState<Influencer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(DEFAULT_LIMIT);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>([]);
  const [followerRange, setFollowerRange] = useState<number[]>([...DEFAULT_FOLLOWER_RANGE]);
  const [priceRange, setPriceRange] = useState<number[]>([...DEFAULT_PRICE_RANGE]);
  const [engagementRange, setEngagementRange] = useState<number[]>([...DEFAULT_ENGAGEMENT_RANGE]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  
  // Collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    platform: true,
    category: true,
    location: false,
    price: true,
    followers: true,
    engagement: false,
    badges: false,
    rating: false,
    deliverables: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setShowFilters(true);
      } else {
        setShowFilters(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const platforms = apiPlatforms.map((p) => ({
    id: p.id,
    key: p.name.toLowerCase(),
    label: p.name,
  }));

  const categoryNameById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories]
  );

  const platformNameById = useMemo(
    () => new Map(apiPlatforms.map((platform) => [platform.id, normalizePlatformName(platform.name)])),
    [apiPlatforms]
  );

  const apiInfluencers = useMemo(
    () => {
      const sorted = [...influencerResults];
      if (sortBy === 'price-low') {
        sorted.sort((a, b) => a.startingPrice - b.startingPrice);
      } else if (sortBy === 'price-high') {
        sorted.sort((a, b) => b.startingPrice - a.startingPrice);
      } else if (sortBy === 'followers') {
        sorted.sort((a, b) => Object.values(b.platforms).reduce((x, y) => x + (y || 0), 0) - Object.values(a.platforms).reduce((x, y) => x + (y || 0), 0));
      } else if (sortBy === 'engagement') {
        sorted.sort((a, b) => parseNumber(b.engagement) - parseNumber(a.engagement));
      } else if (sortBy === 'rating') {
        sorted.sort((a, b) => b.rating - a.rating);
      }
      return sorted;
    },
    [influencerResults, sortBy]
  );

  const badges = [
    { id: 'top', label: 'Top Creator' },
    { id: 'fast', label: 'Responds Fast' },
    { id: 'verified', label: 'Verified' },
    { id: 'ugc', label: 'UGC Specialist' },
  ];

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId]
    );
  };

  const togglePlatform = (platformId: number) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((p) => p !== platformId) : [...prev, platformId]
    );
  };

  const toggleBadge = (badge: string) => {
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedPlatforms([]);
    setFollowerRange([...DEFAULT_FOLLOWER_RANGE]);
    setPriceRange([...DEFAULT_PRICE_RANGE]);
    setEngagementRange([...DEFAULT_ENGAGEMENT_RANGE]);
    setSelectedBadges([]);
    setMinRating(0);
    setCurrentPage(1);
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  const getPlatformFollowersFromRow = (row: Record<string, unknown>) => {
    const result: Influencer['platforms'] = { instagram: 0, youtube: 0, tiktok: 0 };
    const rawPlatforms =
      row.platforms ||
      row.social_accounts ||
      row.platform_accounts ||
      row.influencer_platforms;

    if (Array.isArray(rawPlatforms)) {
      rawPlatforms.forEach((platformItem) => {
        if (!platformItem || typeof platformItem !== 'object') return;
        const item = platformItem as Record<string, unknown>;
        const nestedPlatform = item.platform && typeof item.platform === 'object'
          ? (item.platform as Record<string, unknown>)
          : null;
        const platformId = parseNumber(
          item.platform_id ?? item.id ?? nestedPlatform?.id,
          0
        );
        const platformName = normalizePlatformName(
          String(
            item.platform_name ||
            item.name ||
            nestedPlatform?.name ||
            platformNameById.get(platformId) ||
            ''
          )
        );
        const followers = parseNumber(
          item.followers ??
          item.follower_count ??
          item.followers_count ??
          item.followersCount ??
          item.total_followers ??
          item.totalFollowers ??
          (item.pivot && typeof item.pivot === 'object'
            ? (item.pivot as Record<string, unknown>).followers
            : undefined),
          0
        );

        if (platformName.includes('instagram')) result.instagram = followers;
        if (platformName.includes('youtube')) result.youtube = followers;
        if (platformName.includes('tiktok')) result.tiktok = followers;
        if (platformId === 1 && result.instagram === 0) result.instagram = followers;
        if (platformId === 2 && result.youtube === 0) result.youtube = followers;
        if (platformId === 3 && result.tiktok === 0) result.tiktok = followers;
      });
    } else if (rawPlatforms && typeof rawPlatforms === 'object') {
      const obj = rawPlatforms as Record<string, unknown>;
      result.instagram = parseNumber(obj.instagram ?? obj.instagram_followers ?? obj.instagramFollowers, 0);
      result.youtube = parseNumber(obj.youtube ?? obj.youtube_followers ?? obj.youtubeFollowers, 0);
      result.tiktok = parseNumber(obj.tiktok ?? obj.tiktok_followers ?? obj.tiktokFollowers, 0);
    }

    // Top-level fallbacks from API row
    if (result.instagram === 0) result.instagram = parseNumber(row.instagram_followers, 0);
    if (result.youtube === 0) result.youtube = parseNumber(row.youtube_followers, 0);
    if (result.tiktok === 0) result.tiktok = parseNumber(row.tiktok_followers, 0);
    if (result.instagram === 0) result.instagram = parseNumber(row.followers_count, 0);

    // If backend gives one combined followers count, map to selected/known platform for display.
    const combinedFollowers = parseNumber(row.total_followers ?? row.followers, 0);
    if (combinedFollowers > 0 && result.instagram + result.youtube + result.tiktok === 0) {
      const platformId = parseNumber(row.platform_id, 0);
      if (platformId === 2) result.youtube = combinedFollowers;
      else if (platformId === 3) result.tiktok = combinedFollowers;
      else result.instagram = combinedFollowers;
    }

    return result;
  };

  const mapApiInfluencer = (row: Record<string, unknown>, index: number): Influencer => {
    const categoriesFromApiSet = new Set<string>();
    const addCategoryId = (rawId: unknown) => {
      const id = parseNumber(rawId, NaN);
      if (!Number.isFinite(id)) return;
      const mapped = categoryNameById.get(id);
      if (mapped) categoriesFromApiSet.add(mapped);
    };
    const addCategoryName = (rawName: unknown) => {
      const name = String(rawName ?? '').trim();
      if (name) categoriesFromApiSet.add(name);
    };
    const collectCategories = (input: unknown) => {
      if (!input) return;
      if (Array.isArray(input)) {
        input.forEach((item) => collectCategories(item));
        return;
      }
      if (typeof input === 'string') {
        const trimmed = input.trim();
        if (!trimmed) return;
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
          const parsed = parseJsonSafely(trimmed);
          if (parsed) {
            collectCategories(parsed);
            return;
          }
        }
        trimmed
          .split(',')
          .map((part) => part.trim())
          .filter(Boolean)
          .forEach((part) => {
            const asId = parseNumber(part, NaN);
            if (Number.isFinite(asId)) addCategoryId(asId);
            else addCategoryName(part);
          });
        return;
      }
      if (typeof input === 'object') {
        const obj = input as Record<string, unknown>;
        addCategoryName(obj.name ?? obj.category_name ?? obj.title ?? obj.label ?? obj.slug);
        addCategoryId(obj.id ?? obj.category_id ?? obj.categoryId ?? obj.categoryID);
        if (obj.category) collectCategories(obj.category);
        if (obj.categories) collectCategories(obj.categories);
        if (obj.niche) collectCategories(obj.niche);
        if (obj.niches) collectCategories(obj.niches);
      }
    };

    const categorySources = [
      row.categories,
      row.category,
      row.category_names,
      row.category_name,
      row.category_title,
      row.categoryType,
      row.influencer_categories,
      row.niche,
      row.niches,
      row.tags,
      row.specialization,
      row.specializations,
      row.interests,
    ];

    categorySources.forEach((source) => collectCategories(source));

    const categoryIdsFromApi = toNumberArray(row.category_ids ?? row.categories_ids ?? row.category_id);
    categoryIdsFromApi.forEach((categoryId) => {
      const mappedName = categoryNameById.get(categoryId);
      if (mappedName) categoriesFromApiSet.add(mappedName);
    });

    const categoriesFromApi = Array.from(categoriesFromApiSet);
    const fallbackCategoryName =
      (selectedCategories.length > 0 ? categoryNameById.get(selectedCategories[0]) : '') ||
      '';

    const rawCategory =
      typeof row.category === 'string'
        ? row.category
        : (row.category_name || '');
    const category = categoriesFromApi[0] || String(rawCategory || fallbackCategoryName || 'General');
    const name = String(row.name || row.full_name || 'Influencer');
    const usernameRaw = String(row.username || row.handle || row.slug || name.toLowerCase().replace(/\s+/g, ''));
    const username = usernameRaw.startsWith('@') ? usernameRaw : `@${usernameRaw}`;
    const platforms = getPlatformFollowersFromRow(row);
    const rawPlatforms =
      row.platforms ||
      row.social_accounts ||
      row.platform_accounts ||
      row.influencer_platforms;
    const profileImage = String(
      row.profile_pic ||
      row.profile_image ||
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
    );
    const coverImage = String(row.cover_image || profileImage);
    const city = String(row.city_name || row.city || '').trim();
    const country = String(row.country_name || row.country || '').trim();
    const location = [city, country].filter(Boolean).join(', ') || 'Not specified';
    const startingPrice = parseNumber(row.price_start ?? row.base_price, 0);
    const engagementFromPlatforms = Array.isArray(rawPlatforms)
      ? parseNumber(
          (rawPlatforms[0] as Record<string, unknown> | undefined)?.engagement_rate ??
          (rawPlatforms[0] as Record<string, unknown> | undefined)?.engagementRate ??
          (rawPlatforms[0] as Record<string, unknown> | undefined)?.avg_engagement,
          0
        )
      : 0;
    const engagement = parseNumber(
      row.engagement_rate ??
      row.engagement ??
      row.avg_engagement ??
      row.average_engagement_rate,
      engagementFromPlatforms
    );
    const rating = parseNumber(row.rating, 4.5);
    const id = String(row.id || row.user_id || row.influencer_id || `api-${index + 1}`);
    const slug = String(
      row.slug ||
      row.influencer_slug ||
      row.public_slug ||
      row.profile_slug ||
      row.creator_slug ||
      row.user_slug ||
      (row.user && typeof row.user === 'object' ? (row.user as Record<string, unknown>).slug : undefined) ||
      row.username ||
      row.handle ||
      toSlug(name) ||
      id
    ).replace(/^@/, '').trim();

    return {
      id,
      slug,
      name,
      username,
      category,
      categories: categoriesFromApi.length > 0 ? categoriesFromApi : [category],
      location,
      bio: String(row.bio || ''),
      profileImage,
      coverImage,
      verified: Boolean(row.is_verified),
      featured: Boolean(row.is_featured),
      platforms,
      startingPrice,
      packages: [],
      portfolio: [],
      rating,
      totalOrders: parseNumber(row.total_orders, 0),
      engagement: engagement > 0 ? engagement.toFixed(1) : undefined,
      rawApiData: row,
    };
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, selectedPlatforms, followerRange, priceRange, engagementRange, minRating]);

  useEffect(() => {
    const fetchInfluencers = async () => {
      setIsLoading(true);
      setFetchError('');

      try {
        const allPlatformIds = apiPlatforms.map((platform) => platform.id).filter((id) => Number.isFinite(id));
        const allCategoryIds = categories.map((category) => category.id).filter((id) => Number.isFinite(id));
        const effectivePlatformIds =
          selectedPlatforms.length > 0
            ? selectedPlatforms
            : (allPlatformIds.length > 0 ? allPlatformIds : [1, 2, 3, 4]);
        const effectiveCategoryIds =
          selectedCategories.length > 0
            ? selectedCategories
            : (allCategoryIds.length > 0 ? allCategoryIds : undefined);
        const hasPriceFilter =
          priceRange[0] !== DEFAULT_PRICE_RANGE[0] || priceRange[1] !== DEFAULT_PRICE_RANGE[1];
        const hasFollowerFilter =
          followerRange[0] !== DEFAULT_FOLLOWER_RANGE[0] || followerRange[1] !== DEFAULT_FOLLOWER_RANGE[1];
        const hasEngagementFilter =
          engagementRange[0] !== DEFAULT_ENGAGEMENT_RANGE[0] || engagementRange[1] !== DEFAULT_ENGAGEMENT_RANGE[1];

        const payload: Record<string, unknown> = {
          platform_id: effectivePlatformIds,
          category_id: effectiveCategoryIds,
          keyword: searchQuery.trim(),
          page: currentPage,
          limit,
        };
        if (hasPriceFilter) {
          payload.min_price = priceRange[0];
          payload.max_price = priceRange[1];
        }
        if (hasFollowerFilter) {
          payload.min_followers = followerRange[0];
          payload.max_followers = followerRange[1];
        }
        if (hasEngagementFilter) {
          payload.min_engagement = engagementRange[0];
          payload.max_engagement = engagementRange[1];
        }

        const response = await fetch(`${API_BASE_URL}/influencers/get-influencers-list`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result: InfluencerListResponse = await response.json();
        if (!response.ok) {
          throw new Error(result?.message || 'Failed to load influencers');
        }

        const responseData = (result?.data && typeof result.data === 'object' ? result.data : {}) as Record<string, unknown>;
        const rawRows =
          (Array.isArray(responseData.influencers) && responseData.influencers) ||
          (Array.isArray(responseData.list) && responseData.list) ||
          (Array.isArray(responseData.rows) && responseData.rows) ||
          (Array.isArray(result.data) && result.data) ||
          [];

        let mapped = rawRows
          .filter((row): row is Record<string, unknown> => !!row && typeof row === 'object')
          .map((row, index) => mapApiInfluencer(row, index));

        let pagination = extractPagination(responseData, currentPage, limit, mapped.length);
        const explicitPagination = hasExplicitPaginationMeta(responseData);

        const hasNoExplicitFilters =
          !searchQuery.trim() &&
          selectedCategories.length === 0 &&
          selectedPlatforms.length === 0;

        // Safety retry: some backends return empty for full filter payload when filters are not explicitly selected.
        if (mapped.length === 0 && hasNoExplicitFilters) {
          const fallbackPayload = {
            platform_id: effectivePlatformIds,
            category_id: effectiveCategoryIds,
            keyword: '',
            page: currentPage,
            limit,
          };

          const fallbackResponse = await fetch(`${API_BASE_URL}/influencers/get-influencers-list`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fallbackPayload),
          });

          if (fallbackResponse.ok) {
            const fallbackResult: InfluencerListResponse = await fallbackResponse.json();
            const fallbackData = (fallbackResult?.data && typeof fallbackResult.data === 'object'
              ? fallbackResult.data
              : {}) as Record<string, unknown>;
            const fallbackRows =
              (Array.isArray(fallbackData.influencers) && fallbackData.influencers) ||
              (Array.isArray(fallbackData.list) && fallbackData.list) ||
              (Array.isArray(fallbackData.rows) && fallbackData.rows) ||
              (Array.isArray(fallbackResult.data) && fallbackResult.data) ||
              [];

            mapped = fallbackRows
              .filter((row): row is Record<string, unknown> => !!row && typeof row === 'object')
              .map((row, index) => mapApiInfluencer(row, index));
            pagination = extractPagination(fallbackData, currentPage, limit, mapped.length);
          }
        }

        // If backend omits pagination meta, keep pagination usable with a progressive fallback.
        if (!explicitPagination) {
          if (mapped.length === 0 && currentPage > 1) {
            // Prevent dead-end blank page when "next" was optimistic.
            setCurrentPage((prev) => Math.max(1, prev - 1));
            setIsLoading(false);
            return;
          }

          const reachedEnd = mapped.length < limit;
          pagination.totalPages = reachedEnd ? currentPage : currentPage + 1;
          pagination.total = (currentPage - 1) * limit + mapped.length;
        }

        setInfluencerResults(mapped);
        setTotalCount(pagination.total);
        setTotalPages(pagination.totalPages);
      } catch (error) {
        setInfluencerResults([]);
        setTotalCount(0);
        setTotalPages(1);
        setFetchError(error instanceof Error ? error.message : 'Unable to load influencers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInfluencers();
  }, [searchQuery, selectedCategories, selectedPlatforms, followerRange, priceRange, engagementRange, currentPage, limit, minRating, apiPlatforms, categories]);

  useEffect(() => {
    if (totalPages < 1) return;
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginationPages = useMemo(() => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }
    return pages;
  }, [currentPage, totalPages]);

  const FilterSection = ({ 
    title, 
    section, 
    children 
  }: { 
    title: string; 
    section: keyof typeof expandedSections; 
    children: ReactNode 
  }) => (
    <div className="border-b border-border pb-4 mb-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full mb-3 hover:text-primary transition-colors"
      >
        <Label className="cursor-pointer">{title}</Label>
        {expandedSections[section] ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {expandedSections[section] && <div>{children}</div>}
    </div>
  );

  const renderFiltersContent = () => (
    <div className="h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-card z-10 pb-4">
        <h3 className="font-semibold text-foreground">Filters</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-primary hover:text-secondary"
          >
            Clear all
          </Button>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFilters(false)}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Keyword Search */}
      <div className="mb-6">
        <Label className="mb-2 text-foreground">Keyword Search</Label>
        <Input
          placeholder="Name, niche, keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-input-background border-border text-foreground"
        />
      </div>

      {/* Platform Filter */}
      <FilterSection title="Platform" section="platform">
        <div className="flex flex-wrap gap-2">
          {platforms.map((platform) => (
            <Badge
              key={platform.id}
              variant={selectedPlatforms.includes(platform.id) ? "default" : "outline"}
              className={`cursor-pointer transition-all ${
                selectedPlatforms.includes(platform.id)
                  ? 'bg-primary text-primary-foreground hover:bg-secondary'
                  : 'bg-muted text-foreground hover:bg-accent'
              }`}
              onClick={() => togglePlatform(platform.id)}
            >
              {platform.label}
            </Badge>
          ))}
        </div>
      </FilterSection>

      {/* Category Filter */}
      <FilterSection title="Category / Niche" section="category">
        <div className="space-y-2">
          {categories.slice(0, 8).map((category) => (
            <div key={category.id} className="flex items-center">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <label
                htmlFor={`category-${category.id}`}
                className="ml-3 text-sm cursor-pointer flex-1 text-foreground"
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range" section="price">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">${priceRange[0]}</span>
            <span className="text-primary font-semibold">${priceRange[1]}</span>
          </div>
          <Slider
            min={0}
            max={10000}
            step={50}
            value={priceRange}
            onValueChange={setPriceRange}
          />
        </div>
      </FilterSection>

      {/* Follower Count */}
      <FilterSection title="Follower Count" section="followers">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 mb-3">
            {[
              { label: '1-10K', range: [1000, 10000] },
              { label: '10-50K', range: [10000, 50000] },
              { label: '50-250K', range: [50000, 250000] },
              { label: '250K+', range: [250000, 1000000] },
            ].map((preset) => (
              <Badge
                key={preset.label}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all bg-muted text-foreground"
                onClick={() => setFollowerRange(preset.range)}
              >
                {preset.label}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{formatFollowers(followerRange[0])}</span>
            <span className="text-primary font-semibold">{formatFollowers(followerRange[1])}</span>
          </div>
          <Slider
            min={0}
            max={1000000}
            step={10000}
            value={followerRange}
            onValueChange={setFollowerRange}
          />
        </div>
      </FilterSection>

      {/* Engagement Rate */}
      <FilterSection title="Engagement Rate" section="engagement">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{engagementRange[0]}%</span>
            <span className="text-primary font-semibold">{engagementRange[1]}%</span>
          </div>
          <Slider
            min={0}
            max={10}
            step={0.1}
            value={engagementRange}
            onValueChange={setEngagementRange}
          />
        </div>
      </FilterSection>

      {/* Creator Badges */}
      <FilterSection title="Creator Badges" section="badges">
        <div className="space-y-2">
          {badges.map((badge) => (
            <div key={badge.id} className="flex items-center">
              <Checkbox
                id={`badge-${badge.id}`}
                checked={selectedBadges.includes(badge.id)}
                onCheckedChange={() => toggleBadge(badge.id)}
              />
              <label
                htmlFor={`badge-${badge.id}`}
                className="ml-3 text-sm cursor-pointer text-foreground"
              >
                {badge.label}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Rating" section="rating">
        <div className="space-y-2">
          {[4.5, 4.0].map((rating) => (
            <div key={rating} className="flex items-center">
              <Checkbox
                id={`rating-${rating}`}
                checked={minRating === rating}
                onCheckedChange={(checked) => setMinRating(checked ? rating : 0)}
              />
              <label
                htmlFor={`rating-${rating}`}
                className="ml-3 text-sm cursor-pointer text-foreground"
              >
                {rating}★ & up
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Apply Filters Button for Mobile */}
      {isMobile && (
        <div className="sticky bottom-0 bg-card pt-4 pb-2 mt-6 border-t border-border">
          <Button
            onClick={() => setShowFilters(false)}
            className="w-full bg-primary text-primary-foreground hover:bg-secondary"
          >
            Apply Filters ({totalCount} results)
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background [&_button]:cursor-pointer [&_a]:cursor-pointer [&_label]:cursor-pointer [&_[role='button']]:cursor-pointer">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col gap-4 lg:gap-0 lg:flex-row lg:items-start lg:justify-between mb-4 lg:mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-foreground">Find Creators That Fit Your Brand</h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Discover verified creators ready to collaborate with your brand
              </p>
            </div>
            
            {/* Trust Badges - Hide on mobile, show on tablet+ */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              <div className="flex items-center gap-2 bg-card px-3 lg:px-4 py-2 rounded-lg border border-border">
                <Shield className="w-3 h-3 lg:w-4 lg:h-4 text-primary" />
                <span className="text-xs lg:text-sm text-foreground whitespace-nowrap">450K+ creators</span>
              </div>
              <div className="flex items-center gap-2 bg-card px-3 lg:px-4 py-2 rounded-lg border border-border">
                <Zap className="w-3 h-3 lg:w-4 lg:h-4 text-primary" />
                <span className="text-xs lg:text-sm text-foreground whitespace-nowrap">Secure Payments</span>
              </div>
              <div className="hidden lg:flex items-center gap-2 bg-card px-4 py-2 rounded-lg border border-border">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">Vetted Profiles</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6 relative">
          {/* Desktop Filters Sidebar */}
          {!isMobile && showFilters && (
            <aside className="w-80 flex-shrink-0">
              <Card className="p-6 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto bg-card border-border">
                {renderFiltersContent()}
              </Card>
            </aside>
          )}

          {/* Mobile Filter Drawer */}
          {isMobile && showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div 
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowFilters(false)}
              />
              <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-card shadow-xl">
                <div className="h-full p-6">
                  {renderFiltersContent()}
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4 lg:mb-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2 border-border text-foreground hover:text-primary"
                  size={isMobile ? 'sm' : 'default'}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {(selectedCategories.length > 0 || selectedPlatforms.length > 0) && (
                    <Badge className="ml-1 bg-primary text-primary-foreground">
                      {selectedCategories.length + selectedPlatforms.length}
                    </Badge>
                  )}
                </Button>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  <span className="text-foreground font-semibold">{totalCount}</span> creators
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px] lg:w-[200px] border-border bg-card text-foreground text-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="followers">Followers</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>

                <div className="hidden sm:flex items-center gap-1 border border-border rounded-lg p-1 bg-card">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}
                  >
                    <LayoutList className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategories.length > 0 || selectedPlatforms.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-4 lg:mb-6">
                {selectedCategories.map((categoryId) => (
                  <Badge
                    key={categoryId}
                    variant="secondary"
                    className="gap-2 cursor-pointer bg-primary/10 text-primary hover:bg-primary/20 text-xs sm:text-sm"
                    onClick={() => toggleCategory(categoryId)}
                  >
                    {categoryNameById.get(categoryId) || `Category ${categoryId}`}
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
                {selectedPlatforms.map((platformId) => (
                  <Badge
                    key={platformId}
                    variant="secondary"
                    className="gap-2 cursor-pointer bg-primary/10 text-primary hover:bg-primary/20 text-xs sm:text-sm"
                    onClick={() => togglePlatform(platformId)}
                  >
                    {platforms.find((platform) => platform.id === platformId)?.label || `Platform ${platformId}`}
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
              </div>
            )}

            {/* Influencer Grid */}
            <div className={`grid ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            } gap-4 sm:gap-5 lg:gap-6`}>
              {apiInfluencers.map((influencer) => (
                <UnifiedInfluencerCard
                  key={influencer.id}
                  influencer={influencer}
                  onViewProfile={(slugOrId) =>
                    navigate(`/influencer/${slugOrId}`, {
                      state: { influencer },
                    })
                  }
                />
              ))}
            </div>

            {/* Empty State */}
            {!isLoading && apiInfluencers.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <p className="text-base sm:text-lg text-muted-foreground mb-4">
                  {fetchError || 'No creators found matching your filters'}
                </p>
                <Button onClick={clearFilters} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Clear all filters
                </Button>
              </div>
            )}

            {isLoading && (
              <div className="text-center py-10 text-muted-foreground">Loading creators...</div>
            )}

            {/* Pagination */}
            {!isLoading && apiInfluencers.length > 0 && totalPages > 1 && (
              <div className="flex justify-center mt-8 sm:mt-10 lg:mt-12 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="border-border text-foreground hover:bg-accent"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {paginationPages.map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`${
                      page === currentPage 
                        ? 'bg-primary text-primary-foreground' 
                        : 'border-border text-foreground hover:bg-accent'
                    } w-8 h-8 sm:w-10 sm:h-10 p-0 text-xs sm:text-sm`}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  className="border-border text-foreground hover:bg-accent"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
