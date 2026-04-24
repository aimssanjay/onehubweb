import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { ArrowRight, Instagram, Youtube, Users, Star, Shield, Zap } from 'lucide-react';
import { InfluencerCarousel } from '../components/InfluencerCarousel';
import { UGCCreatorCarousel } from '../components/UGCCreatorCarousel';
import { SpotlightCarousel } from '../components/SpotlightCarousel';
import { InstagramGridSection } from '../components/InstagramGridSection';
import { SearchBar } from '../components/SearchBar';
import { CategoryCarousel } from '../components/CategoryCarousel';
import { useCategories } from '../hooks/useCategories';
import { categories as mockCategories, influencers } from '../../data/mockData';
import type { Influencer } from '../../data/mockData';
import { API_BASE_URL } from '../../services/api';

interface InfluencerListResponse {
  success?: boolean;
  data?: unknown;
  message?: string;
}

function parseNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : fallback;
  }
  if (typeof value === 'string') {
    const raw = value.trim().toLowerCase().replace(/,/g, '');
    if (!raw) return fallback;
    const multiplier = raw.endsWith('k') ? 1_000 : raw.endsWith('m') ? 1_000_000 : 1;
    const numericPart = multiplier === 1 ? raw : raw.slice(0, -1);
    const parsed = Number(numericPart);
    return Number.isFinite(parsed) ? parsed * multiplier : fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function parseJsonSafely(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
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
      const parsed = parseJsonSafely(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => parseNumber(item, NaN))
          .filter((num) => Number.isFinite(num));
      }
    }
    return value
      .split(',')
      .map((part) => parseNumber(part.replace(/[\[\]\s]/g, ''), NaN))
      .filter((num) => Number.isFinite(num));
  }
  return [];
}

function extractCategoriesFromRow(
  row: Record<string, unknown>,
  categoryNameById?: Map<number, string>
): string[] {
  const categories = new Set<string>();

  const addCategory = (value: unknown) => {
    const name = String(value ?? '').trim();
    if (name) categories.add(name);
  };

  const collect = (input: unknown) => {
    if (!input) return;

    if (Array.isArray(input)) {
      input.forEach((item) => collect(item));
      return;
    }

    if (typeof input === 'string') {
      const trimmed = input.trim();
      if (!trimmed) return;

      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        const parsed = parseJsonSafely(trimmed);
        if (parsed) {
          collect(parsed);
          return;
        }
      }

      trimmed
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((item) => {
          const asId = parseNumber(item, NaN);
          if (Number.isFinite(asId) && categoryNameById?.has(asId)) {
            addCategory(categoryNameById.get(asId));
          } else {
            addCategory(item);
          }
        });
      return;
    }

    if (typeof input === 'object') {
      const obj = input as Record<string, unknown>;
      addCategory(obj.name ?? obj.category_name ?? obj.title ?? obj.label ?? obj.slug);
      const categoryId = parseNumber(obj.id ?? obj.category_id ?? obj.categoryId, NaN);
      if (Number.isFinite(categoryId) && categoryNameById?.has(categoryId)) {
        addCategory(categoryNameById.get(categoryId));
      }
      if (obj.category) collect(obj.category);
      if (obj.categories) collect(obj.categories);
    }
  };

  [
    row.categories,
    row.category,
    row.category_name,
    row.category_names,
    row.influencer_categories,
    row.niche,
    row.niches,
    row.tags,
    row.specialization,
    row.specializations,
    row.interests,
  ].forEach((source) => collect(source));

  const categoryIdsFromApi = toNumberArray(row.category_ids ?? row.categories_ids ?? row.category_id);
  categoryIdsFromApi.forEach((categoryId) => {
    const mappedName = categoryNameById?.get(categoryId);
    if (mappedName) addCategory(mappedName);
  });

  return Array.from(categories);
}

function getPlatformFollowersFromRow(row: Record<string, unknown>): Influencer['platforms'] {
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
      const nestedPlatform =
        item.platform && typeof item.platform === 'object'
          ? (item.platform as Record<string, unknown>)
          : null;
      const platformId = parseNumber(item.platform_id ?? item.id ?? nestedPlatform?.id, 0);
      const name = String(item.platform_name || item.name || nestedPlatform?.name || '').toLowerCase();
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

      if (name.includes('instagram')) result.instagram = followers;
      if (name.includes('youtube')) result.youtube = followers;
      if (name.includes('tiktok')) result.tiktok = followers;
      if (platformId === 1 && (result.instagram || 0) === 0) result.instagram = followers;
      if (platformId === 2 && (result.youtube || 0) === 0) result.youtube = followers;
      if (platformId === 3 && (result.tiktok || 0) === 0) result.tiktok = followers;
    });
  } else if (rawPlatforms && typeof rawPlatforms === 'object') {
    const obj = rawPlatforms as Record<string, unknown>;
    result.instagram = parseNumber(obj.instagram ?? obj.instagram_followers ?? obj.instagramFollowers, 0);
    result.youtube = parseNumber(obj.youtube ?? obj.youtube_followers ?? obj.youtubeFollowers, 0);
    result.tiktok = parseNumber(obj.tiktok ?? obj.tiktok_followers ?? obj.tiktokFollowers, 0);
  }

  if ((result.instagram || 0) === 0) result.instagram = parseNumber(row.instagram_followers, 0);
  if ((result.youtube || 0) === 0) result.youtube = parseNumber(row.youtube_followers, 0);
  if ((result.tiktok || 0) === 0) result.tiktok = parseNumber(row.tiktok_followers, 0);
  if ((result.instagram || 0) + (result.youtube || 0) + (result.tiktok || 0) === 0) {
    const combinedFollowers = parseNumber(row.followers_count ?? row.total_followers ?? row.followers, 0);
    const platformId = parseNumber(row.platform_id, 0);
    if (platformId === 2) result.youtube = combinedFollowers;
    else if (platformId === 3) result.tiktok = combinedFollowers;
    else result.instagram = combinedFollowers;
  }

  return result;
}

function getEngagementFromRow(row: Record<string, unknown>): string | undefined {
  const rawPlatforms =
    row.platforms ||
    row.social_accounts ||
    row.platform_accounts ||
    row.influencer_platforms;

  let platformEngagement = 0;
  if (Array.isArray(rawPlatforms)) {
    for (const platformItem of rawPlatforms) {
      if (!platformItem || typeof platformItem !== 'object') continue;
      const item = platformItem as Record<string, unknown>;
      const value = parseNumber(
        item.engagement_rate ??
          item.engagementRate ??
          item.avg_engagement ??
          item.average_engagement_rate ??
          (item.pivot && typeof item.pivot === 'object'
            ? (item.pivot as Record<string, unknown>).engagement_rate
            : undefined),
        0
      );
      if (value > 0) {
        platformEngagement = value;
        break;
      }
    }
  }

  const engagement = parseNumber(
    row.engagement_rate ??
      row.engagement ??
      row.avg_engagement ??
      row.average_engagement_rate,
    platformEngagement
  );

  return engagement > 0 ? engagement.toFixed(1) : undefined;
}

function mapApiInfluencer(
  row: Record<string, unknown>,
  index: number,
  categoryNameById?: Map<number, string>
): Influencer {
  const categories = extractCategoriesFromRow(row, categoryNameById);
  const category = categories[0] || 'General';
  const name = String(row.name || row.full_name || 'Influencer');
  const usernameRaw = String(row.username || row.handle || toSlug(name));
  const username = usernameRaw.startsWith('@') ? usernameRaw : `@${usernameRaw}`;
  const profileImage = String(
    row.profile_pic ||
      row.profile_image ||
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
  );

  return {
    id: String(row.id || row.user_id || row.influencer_id || `api-${index + 1}`),
    slug: String(row.slug || row.influencer_slug || row.username || toSlug(name)),
    name,
    username,
    category,
    categories: categories.length > 0 ? categories : [category],
    location: String(row.city_name || row.city || row.country_name || row.country || 'Not specified'),
    bio: String(row.bio || ''),
    profileImage,
    coverImage: String(row.cover_image || profileImage),
    verified: Boolean(row.is_verified),
    featured: Boolean(row.is_featured),
    platforms: getPlatformFollowersFromRow(row),
    startingPrice: parseNumber(row.price_start ?? row.base_price, 0),
    packages: [],
    portfolio: [],
    rating: parseNumber(row.rating, 4.5),
    totalOrders: parseNumber(row.total_orders, 0),
    engagement: getEngagementFromRow(row),
    rawApiData: row,
  };
}

export function Homepage() {
  const navigate = useNavigate();
  const { categories: categoryMaster } = useCategories();
  const [homeInfluencers, setHomeInfluencers] = useState<Influencer[]>([]);
  const [youtubeSectionInfluencers, setYoutubeSectionInfluencers] = useState<Influencer[]>([]);
  const [tiktokSectionInfluencers, setTiktokSectionInfluencers] = useState<Influencer[]>([]);
  const [isLoadingInfluencers, setIsLoadingInfluencers] = useState(false);
  const [hasLoadedApi, setHasLoadedApi] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);

  const categoryNameById = useMemo(() => {
    const map = new Map<number, string>();
    categoryMaster.forEach((category) => {
      map.set(category.id, category.name);
    });
    mockCategories.forEach((category) => {
      const id = parseNumber(category.id, NaN);
      if (Number.isFinite(id) && !map.has(id)) {
        map.set(id, category.name);
      }
    });
    return map;
  }, [categoryMaster]);

  const allCategoryIds = useMemo(
    () => Array.from(categoryNameById.keys()).filter((id) => Number.isFinite(id)),
    [categoryNameById]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchHomepageInfluencers = async () => {
      setIsLoadingInfluencers(true);

      try {
        const response = await fetch(`${API_BASE_URL}/influencers/get-influencers-list`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            platform_id: [1, 2, 3, 4],
            category_id: allCategoryIds.length > 0 ? allCategoryIds : undefined,
            keyword: '',
            page: 1,
            limit: 30,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to load influencers');
        }

        const result: InfluencerListResponse = await response.json();
        const responseData =
          result?.data && typeof result.data === 'object'
            ? (result.data as Record<string, unknown>)
            : {};
        const rows =
          (Array.isArray(responseData.influencers) && responseData.influencers) ||
          (Array.isArray(responseData.list) && responseData.list) ||
          (Array.isArray(responseData.rows) && responseData.rows) ||
          (Array.isArray(result.data) && result.data) ||
          [];

        const mapped = rows
          .filter((row): row is Record<string, unknown> => !!row && typeof row === 'object')
          .map((row, index) => mapApiInfluencer(row, index, categoryNameById));

        if (isMounted) {
          setHomeInfluencers(mapped);
          setApiFailed(false);
        }
      } catch {
        if (isMounted) {
          setHomeInfluencers([]);
          setApiFailed(true);
        }
      } finally {
        if (isMounted) {
          setIsLoadingInfluencers(false);
          setHasLoadedApi(true);
        }
      }
    };

    fetchHomepageInfluencers();
    return () => {
      isMounted = false;
    };
  }, [categoryNameById, allCategoryIds]);

  useEffect(() => {
    let isMounted = true;

    const fetchTiktokInfluencers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/influencers/get-influencers-list`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            platform_id: [3],
            category_id: allCategoryIds.length > 0 ? allCategoryIds : undefined,
            keyword: '',
            page: 1,
            limit: 60,
          }),
        });

        if (!response.ok) return;

        const result: InfluencerListResponse = await response.json();
        const responseData =
          result?.data && typeof result.data === 'object'
            ? (result.data as Record<string, unknown>)
            : {};
        const rows =
          (Array.isArray(responseData.influencers) && responseData.influencers) ||
          (Array.isArray(responseData.list) && responseData.list) ||
          (Array.isArray(responseData.rows) && responseData.rows) ||
          (Array.isArray(result.data) && result.data) ||
          [];

        const mapped = rows
          .filter((row): row is Record<string, unknown> => !!row && typeof row === 'object')
          .map((row, index) => mapApiInfluencer(row, index, categoryNameById))
          .filter((item) => (item.platforms.tiktok || 0) > 0);

        if (isMounted) {
          setTiktokSectionInfluencers(mapped);
        }
      } catch {
        if (isMounted) {
          setTiktokSectionInfluencers([]);
        }
      }
    };

    fetchTiktokInfluencers();
    return () => {
      isMounted = false;
    };
  }, [categoryNameById, allCategoryIds]);

  useEffect(() => {
    let isMounted = true;

    const fetchYoutubeInfluencers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/influencers/get-influencers-list`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            platform_id: [2],
            category_id: allCategoryIds.length > 0 ? allCategoryIds : undefined,
            keyword: '',
            page: 1,
            limit: 60,
          }),
        });

        if (!response.ok) return;

        const result: InfluencerListResponse = await response.json();
        const responseData =
          result?.data && typeof result.data === 'object'
            ? (result.data as Record<string, unknown>)
            : {};
        const rows =
          (Array.isArray(responseData.influencers) && responseData.influencers) ||
          (Array.isArray(responseData.list) && responseData.list) ||
          (Array.isArray(responseData.rows) && responseData.rows) ||
          (Array.isArray(result.data) && result.data) ||
          [];

        const mapped = rows
          .filter((row): row is Record<string, unknown> => !!row && typeof row === 'object')
          .map((row, index) => mapApiInfluencer(row, index, categoryNameById))
          .filter((item) => (item.platforms.youtube || 0) > 0);

        if (isMounted) {
          setYoutubeSectionInfluencers(mapped);
        }
      } catch {
        if (isMounted) {
          setYoutubeSectionInfluencers([]);
        }
      }
    };

    fetchYoutubeInfluencers();
    return () => {
      isMounted = false;
    };
  }, [categoryNameById, allCategoryIds]);

  const creatorSource = useMemo(() => {
    if (!hasLoadedApi) return [];
    if (homeInfluencers.length > 0) return homeInfluencers;
    return apiFailed ? influencers : [];
  }, [hasLoadedApi, homeInfluencers, apiFailed]);
  const featuredCreators = creatorSource.slice(0, 12);
  const instagramCreators = useMemo(() => {
    const fromPlatform = creatorSource.filter((item) =>
      (item.platforms.instagram || 0) > 0 &&
      (item.platforms.youtube || 0) === 0 &&
      (item.platforms.tiktok || 0) === 0
    );
    return (fromPlatform.length > 0 ? fromPlatform : creatorSource).slice(0, 12);
  }, [creatorSource]);
  const youtubeCreators = useMemo(() => {
    const source = youtubeSectionInfluencers.length > 0 ? youtubeSectionInfluencers : creatorSource;
    const fromPlatform = source.filter((item) =>
      (item.platforms.youtube || 0) > 0
    );
    return fromPlatform.slice(0, 12);
  }, [creatorSource, youtubeSectionInfluencers]);
  const tiktokCreators = useMemo(() => {
    const source = tiktokSectionInfluencers.length > 0 ? tiktokSectionInfluencers : creatorSource;
    const fromPlatform = source.filter((item) => (item.platforms.tiktok || 0) > 0);
    return fromPlatform.slice(0, 12);
  }, [creatorSource, tiktokSectionInfluencers]);
  const ugcCreators = creatorSource.slice(4, 16);

  const handleSearch = (platform: string, category: string) => {
    navigate('/browse', { state: { platform, category } });
  };

  // Navigation helper to match old onNavigate signature
  const onNavigate = (page: string, data?: any) => {
    if (page === 'profile' && data?.id) {
      const routeId = String(data.id);
      const navigationPool = [
        ...featuredCreators,
        ...instagramCreators,
        ...youtubeCreators,
        ...tiktokCreators,
        ...ugcCreators,
      ];
      const matchedInfluencer = navigationPool.find((inf) =>
        inf.id === routeId ||
        inf.slug === routeId ||
        inf.username.replace(/^@/, '') === routeId
      );
      if (matchedInfluencer) {
        navigate(`/influencer/${routeId}`, { state: { influencer: matchedInfluencer } });
      } else {
        navigate(`/influencer/${routeId}`);
      }
    } else if (page === 'browse') {
      if (data) {
        navigate('/browse', { state: data });
      } else {
        navigate('/browse');
      }
    } else if (page === 'signup-influencer') {
      navigate('/signup-influencer');
    } else {
      navigate(`/${page}`);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section with Search */}
      <section className="relative pt-6 sm:pt-8 pb-12 sm:pb-16 px-4 bg-background">
        <div className="max-w-[1350px] mx-auto">
          {/* Main Heading */}
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-3 sm:mb-4 md:mb-6 leading-tight px-2">
              Hire Influencers & Content<br className="hidden sm:block" />Creators You'll Love
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto px-4">
              The #1 Influencer Marketing Platform. Find and hire top Instagram, TikTok, YouTube, and UGC creators.
            </p>
          </div>

          {/* Premium Search Bar */}
          <div className="mb-6 sm:mb-8 md:mb-12">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Quick Stats Bar */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-8 text-center px-2">
            <div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">330,000+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Influencers</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">10,000+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Brands</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">$5M+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Paid to Creators</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">100K+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Collaborations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16 px-4 bg-background">
        <div className="max-w-[1350px] mx-auto">
          <CategoryCarousel
            onCategorySelect={(category) => onNavigate('browse', { category })}
          />
        </div>
      </section>

      {/* Featured Influencers */}
      <section className="py-12 px-4 bg-background">
        <div className="max-w-[1350px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">Featured Influencers</h2>
              <p className="text-muted-foreground text-sm md:text-base lg:text-lg">Hire top influencers across all platforms</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => onNavigate('browse')}
              className="text-foreground hover:text-primary hidden md:flex cursor-pointer"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <InfluencerCarousel
            influencers={featuredCreators}
            onViewProfile={(id) => onNavigate('profile', { id })}
          />
        </div>
      </section>

      {/* How It Works - For Brands */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Side - Content */}
            <div>
              <Badge 
                className="mb-4 md:mb-6 text-sm px-5 py-2 rounded-md font-semibold inline-block"
                style={{ backgroundColor: '#E91E63', color: '#FFFFFF', border: 'none' }}
              >
                Search
              </Badge>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-8 md:mb-12 leading-tight">
                Find and Hire Influencers in Seconds on the Marketplace
              </h2>

              {/* Steps */}
              <div className="space-y-6 md:space-y-8">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-black mb-2">
                    Search Influencers
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    Search thousands of vetted Instagram, TikTok, and YouTube influencers.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg md:text-xl font-bold text-black mb-2">
                    Purchase & Chat Securely
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    Safely purchase and communicate through Collabstr. We hold your payment until the work is completed.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg md:text-xl font-bold text-black mb-2">
                    Receive Quality Content
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    Receive your high-quality content from influencers directly through the platform.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Marketplace Visual */}
            <div className="relative hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkYXNoYm9hcmQlMjBpbnRlcmZhY2UlMjBkZXNpZ258ZW58MXx8fHwxNzM3OTg4MDg1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Marketplace Interface"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Grid Section - NEW */}
      <InstagramGridSection
        instagramInfluencers={instagramCreators}
        onViewProfile={(id) => onNavigate('profile', { id })}
      />

      {/* UGC Creators Section */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">UGC Creators</h2>
            <p className="text-gray-600 text-base md:text-lg">Meet our curated network of verified influencers across multiple categories</p>
          </div>

          <SpotlightCarousel
            creators={ugcCreators.map(inf => ({
              id: inf.id,
              name: inf.name,
              username: `@${inf.name.toLowerCase().replace(/\s+/g, '')}`,
              category: inf.category,
              platform: Object.keys(inf.platforms)[0] || 'Instagram',
              image: inf.profileImage
            }))}
            onViewProfile={(id) => onNavigate('profile', { id })}
          />
        </div>
      </section>

      {/* Analytics Feature Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <Badge 
              className="mb-4 text-xs px-4 py-1.5 rounded-full font-semibold"
              style={{ backgroundColor: '#E91E63', color: '#FFFFFF', border: 'none' }}
            >
              ANALYTICS
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Track Campaign Performance
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Monitor your influencer campaigns with real-time analytics and detailed reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
              <Zap className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">
                Real-Time Tracking
              </h3>
              <p className="text-gray-400">
                Track Instagram, TikTok, and YouTube posts automatically. Metrics update every 24 hours.
              </p>
            </Card>

            <Card className="p-8 bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
              <Zap className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">
                Advanced Insights
              </h3>
              <p className="text-gray-400">
                Analyze reach, engagement, clicks, and conversions. Export reports for stakeholders.
              </p>
            </Card>

            <Card className="p-8 bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
              <Youtube className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">
                Campaign Dashboard
              </h3>
              <p className="text-gray-400">
                Manage all campaigns from one place. Compare performance across influencers and platforms.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* YouTube Influencers Section */}
      <section className="py-12 md:py-16 px-4 bg-background">
        <div className="max-w-[1350px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">YouTube Influencers</h2>
              <p className="text-muted-foreground text-sm md:text-base lg:text-lg">Hire YouTube creators for videos and shorts</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => onNavigate('browse', { platform: 'youtube' })}
              className="text-foreground hover:text-primary hidden md:flex cursor-pointer"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <InfluencerCarousel
            influencers={youtubeCreators}
            onViewProfile={(id) => onNavigate('profile', { id })}
          />
        </div>
      </section>

      {/* For Creators Section */}
      <section className="py-16 md:py-20 px-4 bg-black">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <Badge 
              className="mb-4 text-xs px-4 py-1.5 rounded-full font-semibold"
              style={{ backgroundColor: '#E91E63', color: '#FFFFFF', border: 'none' }}
            >
              FOR CREATORS
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Get Hired for Brand Deals
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto px-4">
              Join 330,000+ creators earning money with brand collaborations. Set your rates and work on your terms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <Card className="p-8 bg-zinc-900/50 border-zinc-800 text-center backdrop-blur-sm">
              <Users className="w-12 h-12 text-primary mb-6 mx-auto" />
              <h3 className="text-xl font-bold text-white mb-4">
                Get Discovered
              </h3>
              <p className="text-gray-400">
                Brands actively search for creators like you. Build your profile and start receiving collaboration offers.
              </p>
            </Card>

            <Card className="p-8 bg-zinc-900/50 border-zinc-800 text-center backdrop-blur-sm">
              <Star className="w-12 h-12 text-primary mb-6 mx-auto" />
              <h3 className="text-xl font-bold text-white mb-4">
                Set Your Own Rates
              </h3>
              <p className="text-gray-400">
                You control your pricing and packages. No hidden fees. Keep 100% of what you earn.
              </p>
            </Card>

            <Card className="p-8 bg-zinc-900/50 border-zinc-800 text-center backdrop-blur-sm">
              <Shield className="w-12 h-12 text-primary mb-6 mx-auto" />
              <h3 className="text-xl font-bold text-white mb-4">
                Secure Payments
              </h3>
              <p className="text-gray-400">
                Payments held in escrow ensure you get paid. Fast payouts directly to your bank account.
              </p>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => onNavigate('signup-influencer')}
              className="bg-primary hover:bg-[#c19a2e] text-black px-10 cursor-pointer"
            >
              Join as a Creator
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* TikTok Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-[1350px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">TikTok Influencers</h2>
              <p className="text-muted-foreground text-lg">Hire TikTok creators for viral content</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => onNavigate('browse', { platform: 'tiktok' })}
              className="text-foreground hover:text-primary hidden md:flex cursor-pointer"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <UGCCreatorCarousel
            influencers={tiktokCreators}
            onViewProfile={(id) => onNavigate('profile', { id })}
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 px-4 bg-black">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-400 px-4">
              Everything you need to know about working with influencers
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "How does the marketplace work?",
                answer: "Browse our verified influencers, select the one that fits your brand, choose a package, and make a secure payment. The influencer will create your content and deliver it through our platform. Payment is held in escrow until you're satisfied with the work."
              },
              {
                question: "How do I know the influencer is legitimate?",
                answer: "All influencers on our platform are verified with their social media accounts. We review their profiles, engagement rates, and past work. You can also see ratings and reviews from other brands who've worked with them."
              },
              {
                question: "What if I'm not satisfied with the content?",
                answer: "Most packages include revisions. If there's an issue, you can communicate directly with the influencer through our messaging system. Our team is also available to help mediate and ensure you get the content you need."
              },
              {
                question: "How long does it take to get content?",
                answer: "Delivery times vary by package and influencer, typically ranging from 2-7 days. Rush delivery options may be available for an additional fee. You'll see the estimated delivery time before you book."
              },
              {
                question: "Do I get usage rights to the content?",
                answer: "Yes! Most packages include usage rights for your brand to use the content in your marketing. Specific rights (duration, platforms, exclusivity) are outlined in each package. You can also negotiate additional rights directly with the influencer."
              },
              {
                question: "Can I work with multiple influencers at once?",
                answer: "Absolutely! You can manage multiple campaigns simultaneously through your dashboard. Many brands work with several influencers to diversify their content and reach different audience segments."
              }
            ].map((faq, index) => (
              <Card key={index} className="p-6 bg-zinc-900/50 border-zinc-800 hover:border-primary/50 transition-colors backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 px-4 bg-background">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-[#1a1a1a] rounded-3xl overflow-hidden">
            <div className="flex flex-col md:flex-row items-center">
              {/* Left Side - Text Content */}
              <div className="flex-1 p-8 md:p-12 lg:p-16 text-center md:text-left w-full">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  Find and Hire Influencers
                </h2>
                <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-6 md:mb-8">
                  Search Instagram, TikTok, and YouTube influencers.
                </p>
                <Button
                  size="lg"
                  onClick={() => onNavigate('browse')}
                  className="bg-white hover:bg-gray-100 text-black px-6 sm:px-8 text-sm sm:text-base h-11 sm:h-12 font-semibold rounded-lg w-full sm:w-auto mb-3 md:mb-0 cursor-pointer"
                >
                  Search Influencers
                </Button>
              </div>

              {/* Right Side - Influencer Photo Grid */}
              <div className="flex-1 relative w-full py-4 pb-6 md:py-0">
                <div className="flex items-center justify-center md:justify-end gap-2 sm:gap-3 md:gap-4 px-4 md:pr-8">
                  {/* Photo 1 */}
                  <div className="w-24 h-32 sm:w-32 sm:h-44 md:w-40 md:h-52 rounded-2xl overflow-hidden transform rotate-[-4deg] shadow-xl flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1662695089339-a2c24231a3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBpbmZsdWVuY2VyJTIwc2VsZmllJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5Nzc0NTIxfDA&ixlib=rb-4.1.0&q=80&w=400"
                      alt="Influencer 1"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Photo 2 */}
                  <div className="w-24 h-32 sm:w-32 sm:h-44 md:w-40 md:h-52 rounded-2xl overflow-hidden transform rotate-[2deg] shadow-xl flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
                      alt="Influencer 2"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Photo 3 */}
                  <div className="w-24 h-32 sm:w-32 sm:h-44 md:w-40 md:h-52 rounded-2xl overflow-hidden transform rotate-[-3deg] shadow-xl flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1632765891235-d2b594870a99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGZhc2hpb24lMjBpbmZsdWVuY2VyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5Nzc0NTIyfDA&ixlib=rb-4.1.0&q=80&w=400"
                      alt="Influencer 3"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Photo 4 */}
                  <div className="hidden md:block w-40 h-52 rounded-2xl overflow-hidden transform rotate-[3deg] shadow-xl flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1655119373830-52c5de669a92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGUlMjBpbmZsdWVuY2VyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5Nzc0NTIzfDA&ixlib=rb-4.1.0&q=80&w=400"
                      alt="Influencer 4"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

