import { useEffect, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Instagram, Music, Youtube, Edit, Save, Plus, Trash2, Globe } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { API_BASE_URL } from '../../services/api';
import {
  getInfluencerAnalyticsSavedKey,
  getInfluencerAnalyticsStorageKey,
} from '../utils/influencerStorage';

type PlatformType = 'instagram' | 'tiktok' | 'youtube' | 'others';

interface PlatformMetrics {
  followers: string;
  avgViews: string;
  engagement: string;
}

interface LocationData {
  country: string;
  percentage: string;
}

interface AgeData {
  range: string;
  percentage: string;
}

interface AnalyticsState {
  instagram: PlatformMetrics;
  tiktok: PlatformMetrics;
  youtube: PlatformMetrics;
  others: PlatformMetrics;
  audienceLocation: LocationData[];
  audienceAge: AgeData[];
  audienceGender: {
    female: string;
    male: string;
    other: string;
  };
}

const PLATFORM_ID_TO_KEY: Record<number, PlatformType> = {
  1: 'instagram',
  2: 'youtube',
  3: 'tiktok',
  4: 'others',
};
const PLATFORM_KEY_TO_ID: Record<PlatformType, number> = {
  instagram: 1,
  youtube: 2,
  tiktok: 3,
  others: 4,
};

type PlatformMeta = {
  username: string;
  profile_url: string;
};

const DEFAULT_ANALYTICS_DATA: AnalyticsState = {
  instagram: { followers: '', avgViews: '', engagement: '' },
  tiktok: { followers: '', avgViews: '', engagement: '' },
  youtube: { followers: '', avgViews: '', engagement: '' },
  others: { followers: '', avgViews: '', engagement: '' },
  audienceLocation: [],
  audienceAge: [
    { range: '13-17', percentage: '' },
    { range: '18-24', percentage: '' },
    { range: '25-34', percentage: '' },
    { range: '35-44', percentage: '' },
    { range: '45-64', percentage: '' },
  ],
  audienceGender: {
    female: '',
    male: '',
    other: '',
  },
};

const isLegacySeededAnalytics = (data: any) =>
  data?.instagram?.followers === '1.5M' ||
  data?.tiktok?.followers === '850k' ||
  data?.youtube?.followers === '2.3M';

// List of countries for dropdown
const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Brazil',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Mexico',
  'India',
  'Japan',
  'South Korea',
  'China',
  'Netherlands',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Switzerland',
  'Austria',
  'Belgium',
  'Poland',
  'Russia',
  'Turkey',
  'Argentina',
  'Chile',
  'Colombia',
  'Peru',
  'Venezuela',
  'South Africa',
  'Nigeria',
  'Egypt',
  'Kenya',
  'Morocco',
  'Thailand',
  'Vietnam',
  'Philippines',
  'Indonesia',
  'Malaysia',
  'Singapore',
  'New Zealand',
  'Ireland',
  'Portugal',
  'Greece',
  'Czech Republic',
  'Hungary',
  'Romania',
  'Ukraine',
  'Saudi Arabia',
  'UAE',
  'Israel',
  'Pakistan',
  'Bangladesh',
  'Other',
];
const toSlug = (value: string) =>
  String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export function InfluencerAnalytics() {
  const [activePlatform, setActivePlatform] = useState<PlatformType>('instagram');
  const [isEditingMetrics, setIsEditingMetrics] = useState(false);
  const [isEditingDemographics, setIsEditingDemographics] = useState(false);
  const [isSavingMetrics, setIsSavingMetrics] = useState(false);
  const [isSavingDemographics, setIsSavingDemographics] = useState(false);

  const [analyticsData, setAnalyticsData] = useState<AnalyticsState>(DEFAULT_ANALYTICS_DATA);
  const [platformMeta, setPlatformMeta] = useState<Record<PlatformType, PlatformMeta>>({
    instagram: { username: '', profile_url: '' },
    tiktok: { username: '', profile_url: '' },
    youtube: { username: '', profile_url: '' },
    others: { username: '', profile_url: '' },
  });
  const analyticsStorageKey = getInfluencerAnalyticsStorageKey();
  const analyticsUserSavedKey = getInfluencerAnalyticsSavedKey();
  const persistAnalytics = (nextData: AnalyticsState) => {
    localStorage.setItem(analyticsStorageKey, JSON.stringify(nextData));
    localStorage.setItem(analyticsUserSavedKey, '1');
  };

  const toStringValue = (value: unknown, fallback = '') => {
    if (value === null || value === undefined) return fallback;
    return String(value);
  };
  const parseJsonSafely = (value: string) => {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };
  const toArrayData = (value: unknown): any[] => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      const parsed = parseJsonSafely(value);
      if (Array.isArray(parsed)) return parsed;
    }
    return [];
  };
  const toObjectData = (value: unknown): Record<string, any> | null => {
    if (value && typeof value === 'object' && !Array.isArray(value)) return value as Record<string, any>;
    if (typeof value === 'string') {
      const parsed = parseJsonSafely(value);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, any>;
      }
    }
    return null;
  };
  const toPositiveString = (value: unknown, fallback = '') => {
    const str = toStringValue(value, '').trim();
    if (!str) return fallback;
    const numeric = parseFloat(str.replace(/,/g, '').replace('%', ''));
    if (Number.isFinite(numeric) && numeric <= 0) return fallback;
    return str;
  };
  const pickGenderValue = (
    source: Record<string, any>,
    keys: string[],
    fallback = ''
  ) => {
    for (const key of keys) {
      if (!(key in source)) continue;
      return toPositiveString(source[key], fallback);
    }
    return fallback;
  };
  const parseAudienceGender = (
    raw: unknown,
    current: AnalyticsState['audienceGender']
  ): AnalyticsState['audienceGender'] => {
    const next = { ...current };
    const obj = toObjectData(raw);

    if (obj) {
      const normalized = Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [String(key).toLowerCase(), value])
      ) as Record<string, any>;

      next.female = pickGenderValue(
        normalized,
        ['female', 'females', 'women', 'woman', 'female_percentage', 'female_pct', 'f'],
        next.female
      );
      next.male = pickGenderValue(
        normalized,
        ['male', 'males', 'men', 'man', 'male_percentage', 'male_pct', 'm'],
        next.male
      );
      next.other = pickGenderValue(
        normalized,
        ['other', 'others', 'non_binary', 'non-binary', 'other_percentage', 'other_pct', 'o'],
        next.other
      );
    }

    const asArray = toArrayData(raw);
    if (asArray.length > 0) {
      asArray.forEach((entry: any) => {
        const row = toObjectData(entry);
        if (!row) return;
        const rowNormalized = Object.fromEntries(
          Object.entries(row).map(([key, value]) => [String(key).toLowerCase(), value])
        ) as Record<string, any>;
        next.female = pickGenderValue(
          rowNormalized,
          ['female', 'females', 'women', 'woman', 'female_percentage', 'female_pct', 'f'],
          next.female
        );
        next.male = pickGenderValue(
          rowNormalized,
          ['male', 'males', 'men', 'man', 'male_percentage', 'male_pct', 'm'],
          next.male
        );
        next.other = pickGenderValue(
          rowNormalized,
          ['other', 'others', 'non_binary', 'non-binary', 'other_percentage', 'other_pct', 'o'],
          next.other
        );
        const key = String(
          row.gender ??
            row.sex ??
            row.name ??
            row.label ??
            row.type ??
            row.segment ??
            row.category ??
            row.key ??
            row.title ??
            ''
        ).trim().toLowerCase();
        const value =
          row.percentage ??
          row.percent ??
          row.pct ??
          row.value ??
          row.count ??
          row.total ??
          row.share ??
          row.ratio;
        if (!key) return;
        if (key.includes('female') || key.includes('woman') || key.includes('women') || key === 'f') {
          next.female = toPositiveString(value, next.female);
        } else if (key.includes('male') || key.includes('man') || key.includes('men') || key === 'm') {
          next.male = toPositiveString(value, next.male);
        } else if (key.includes('other') || key.includes('non')) {
          next.other = toPositiveString(value, next.other);
        }
      });
    }

    return next;
  };

  const mergeAudienceGenderFromProfile = (
    profile: any,
    current: AnalyticsState['audienceGender']
  ): AnalyticsState['audienceGender'] => {
    let next = { ...current };
    const candidates: unknown[] = [
      profile?.influencer_audience_genders,
      profile?.influencer_audience_gender,
      profile?.audience_genders,
      profile?.audience_gender,
      profile?.audienceGender,
      profile?.gender,
      profile?.genders,
      profile?.sex,
      profile?.demographics?.gender,
      profile?.demographics?.genders,
      profile?.audience_demographics?.gender,
      profile?.audience_demographics?.genders,
      profile?.influencer?.influencer_audience_genders,
      profile?.influencer?.influencer_audience_gender,
      profile?.influencer?.audience_genders,
      profile?.influencer?.audience_gender,
      profile?.influencer?.audienceGender,
      profile?.influencer?.demographics?.gender,
      profile?.influencer?.audience_demographics?.gender,
    ];

    const seen = new WeakSet<object>();
    const walk = (value: unknown, depth = 0) => {
      if (depth > 3 || value == null) return;
      if (Array.isArray(value)) {
        value.forEach((item) => walk(item, depth + 1));
        return;
      }
      const obj = toObjectData(value);
      if (!obj) return;
      if (seen.has(obj)) return;
      seen.add(obj);
      Object.entries(obj).forEach(([key, val]) => {
        const normalizedKey = String(key).toLowerCase();
        if (
          normalizedKey.includes('gender') ||
          normalizedKey.includes('genders') ||
          normalizedKey === 'sex'
        ) {
          candidates.push(val);
        }
        if (val && (Array.isArray(val) || typeof val === 'object')) {
          walk(val, depth + 1);
        }
      });
    };

    walk(profile);

    candidates
      .filter((candidate) => candidate !== undefined && candidate !== null)
      .forEach((candidate) => {
        next = parseAudienceGender(candidate, next);
      });

    return next;
  };

  const mergeApiProfileIntoAnalytics = (profile: any, current: AnalyticsState): AnalyticsState => {
    const merged: AnalyticsState = {
      ...current,
      instagram: { ...current.instagram },
      tiktok: { ...current.tiktok },
      youtube: { ...current.youtube },
      others: { ...current.others },
      audienceLocation: [...current.audienceLocation],
      audienceAge: [...current.audienceAge],
      audienceGender: { ...current.audienceGender },
    };

    const socialAccounts =
      toArrayData(profile?.social_accounts).length > 0
        ? toArrayData(profile?.social_accounts)
        : toArrayData(profile?.influencer_social_accounts);
    socialAccounts.forEach((account: any) => {
      const platformKey = PLATFORM_ID_TO_KEY[Number(account?.platform_id)];
      if (!platformKey) return;

      merged[platformKey] = {
        followers: toPositiveString(account?.followers, merged[platformKey].followers),
        avgViews: toPositiveString(
          account?.total_reach ?? account?.avg_views ?? account?.average_views,
          merged[platformKey].avgViews
        ),
        engagement: toPositiveString(account?.engagement_rate, merged[platformKey].engagement),
      };
    });

    const audienceLocations =
      profile?.influencer_audience_locations ??
      profile?.audience_locations ??
      profile?.audienceLocation;
    const audienceLocationArray = toArrayData(audienceLocations);
    if (audienceLocationArray.length > 0) {
      merged.audienceLocation = audienceLocationArray.map((item: any) => ({
        country: toStringValue(item?.country),
        percentage: toPositiveString(item?.percentage, ''),
      }));
    } else {
      const locationObject = toObjectData(audienceLocations);
      if (locationObject) {
        merged.audienceLocation = Object.entries(locationObject).map(([country, percentage]) => ({
          country: toStringValue(country),
          percentage: toPositiveString(percentage, ''),
        }));
      }
    }

    const audienceAge =
      profile?.influencer_audience_ages ??
      profile?.audience_age ??
      profile?.audienceAge;
    const audienceAgeArray = toArrayData(audienceAge);
    if (audienceAgeArray.length > 0) {
      merged.audienceAge = audienceAgeArray.map((item: any) => ({
        range: toStringValue(item?.age_range ?? item?.range),
        percentage: toPositiveString(item?.percentage, ''),
      }));
    } else {
      const ageObject = toObjectData(audienceAge);
      if (ageObject) {
        merged.audienceAge = Object.entries(ageObject).map(([range, percentage]) => ({
          range: toStringValue(range),
          percentage: toPositiveString(percentage, ''),
        }));
      }
    }

    merged.audienceGender = mergeAudienceGenderFromProfile(profile, merged.audienceGender);

    return merged;
  };

  const extractPlatformMeta = (profile: any): Record<PlatformType, PlatformMeta> => {
    const socialAccounts =
      toArrayData(profile?.social_accounts).length > 0
        ? toArrayData(profile?.social_accounts)
        : toArrayData(profile?.influencer_social_accounts);
    const meta: Record<PlatformType, PlatformMeta> = {
      instagram: { username: '', profile_url: '' },
      tiktok: { username: '', profile_url: '' },
      youtube: { username: '', profile_url: '' },
      others: { username: '', profile_url: '' },
    };

    socialAccounts.forEach((account: any) => {
      const platformKey = PLATFORM_ID_TO_KEY[Number(account?.platform_id)];
      if (!platformKey) return;
      meta[platformKey] = {
        username: toStringValue(account?.username),
        profile_url: toStringValue(account?.profile_url),
      };
    });

    return meta;
  };

  const parseMetricToNumber = (value: string) => {
    const raw = String(value ?? '').trim().toLowerCase().replace(/,/g, '');
    if (!raw) return 0;
    const numeric = parseFloat(raw.replace('%', ''));
    if (!Number.isFinite(numeric)) return 0;
    if (raw.endsWith('k')) return Math.round(numeric * 1000);
    if (raw.endsWith('m')) return Math.round(numeric * 1000000);
    if (raw.endsWith('b')) return Math.round(numeric * 1000000000);
    return Math.round(numeric);
  };
  const hasGenderValues = (gender: AnalyticsState['audienceGender']) => {
    const female = parseFloat(String(gender.female ?? '').replace(/,/g, '').replace('%', '')) || 0;
    const male = parseFloat(String(gender.male ?? '').replace(/,/g, '').replace('%', '')) || 0;
    const other = parseFloat(String(gender.other ?? '').replace(/,/g, '').replace('%', '')) || 0;
    return female > 0 || male > 0 || other > 0;
  };
  const buildProfileIdentityCandidates = (profile: any): string[] => {
    const user = toObjectData(profile?.user);
    const influencer = toObjectData(profile?.influencer);
    const cachedUser = (() => {
      try {
        const raw = localStorage.getItem('influencer_user');
        if (!raw) return null;
        return JSON.parse(raw);
      } catch {
        return null;
      }
    })();
    const candidates = [
      profile?.slug,
      profile?.username,
      String(profile?.username ?? '').replace(/^@/, ''),
      profile?.handle,
      profile?.name,
      toSlug(profile?.name),
      profile?.id,
      profile?.user_id,
      profile?.influencer_id,
      user?.slug,
      user?.username,
      String(user?.username ?? '').replace(/^@/, ''),
      user?.name,
      toSlug(user?.name),
      user?.id,
      influencer?.slug,
      influencer?.username,
      String(influencer?.username ?? '').replace(/^@/, ''),
      influencer?.name,
      toSlug(influencer?.name),
      influencer?.id,
      cachedUser?.slug,
      cachedUser?.username,
      String(cachedUser?.username ?? '').replace(/^@/, ''),
      cachedUser?.name,
      toSlug(cachedUser?.name),
      cachedUser?.id,
      cachedUser?.user_id,
      cachedUser?.influencer_id,
      String(cachedUser?.email ?? '').split('@')[0],
    ]
      .map((item) => String(item ?? '').trim())
      .filter(Boolean);
    return Array.from(new Set(candidates));
  };
  const fetchPublicProfileFromListFallback = async (token: string, profile: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/influencers/list?page=1&limit=200`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      const items = Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result?.data?.data)
          ? result.data.data
          : [];
      if (!items.length) return null;

      const identityCandidates = buildProfileIdentityCandidates(profile).map((value) =>
        String(value).toLowerCase()
      );
      const currentNameSlug = toSlug(profile?.name ?? profile?.influencer?.name ?? '');
      const currentName = String(profile?.name ?? profile?.influencer?.name ?? '').toLowerCase();
      const currentUserId = String(profile?.user_id ?? profile?.user?.id ?? '').trim();
      const currentInfluencerId = String(profile?.influencer_id ?? profile?.id ?? '').trim();

      const matched = items.find((row: any) => {
        const rowCandidates = [
          row?.slug,
          row?.username,
          String(row?.username ?? '').replace(/^@/, ''),
          row?.id,
          row?.user_id,
          row?.influencer_id,
          row?.name,
          toSlug(row?.name),
          row?.user?.id,
          row?.user?.username,
          String(row?.user?.username ?? '').replace(/^@/, ''),
          row?.influencer?.id,
          row?.influencer?.username,
          String(row?.influencer?.username ?? '').replace(/^@/, ''),
        ]
          .map((item) => String(item ?? '').toLowerCase().trim())
          .filter(Boolean);

        if (rowCandidates.some((value) => identityCandidates.includes(value))) return true;
        if (currentNameSlug && rowCandidates.includes(currentNameSlug)) return true;
        if (currentName && rowCandidates.includes(currentName)) return true;
        if (currentUserId && rowCandidates.includes(currentUserId.toLowerCase())) return true;
        if (currentInfluencerId && rowCandidates.includes(currentInfluencerId.toLowerCase())) return true;
        return false;
      });

      if (!matched) return null;
      const lookupKey =
        matched?.slug ||
        matched?.username ||
        matched?.id ||
        matched?.influencer_id ||
        matched?.user_id;
      if (!lookupKey) return null;

      return await fetchPublicProfileFallback({ ...profile, ...matched, slug: matched?.slug ?? profile?.slug });
    } catch {
      return null;
    }
  };
  const fetchPublicProfileFallback = async (profile: any) => {
    const candidates = buildProfileIdentityCandidates(profile);
    for (const candidate of candidates) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/influencers/public-profile/${encodeURIComponent(candidate)}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        const result = await response.json();
        if (!(result?.success || response.ok) || !result?.data) continue;
        const payload =
          (result.data?.influencer && typeof result.data.influencer === 'object'
            ? result.data.influencer
            : result.data) || {};
        if (payload && typeof payload === 'object') return payload;
      } catch {
        // Try next candidate
      }
    }
    return null;
  };

  useEffect(() => {
    const savedAnalytics = localStorage.getItem(analyticsStorageKey);
    const hasUserSavedAnalytics = localStorage.getItem(analyticsUserSavedKey) === '1';
    if (!savedAnalytics) {
      setAnalyticsData(DEFAULT_ANALYTICS_DATA);
      return;
    }

    try {
      const parsed = JSON.parse(savedAnalytics);
      if (!hasUserSavedAnalytics) {
        localStorage.removeItem(analyticsStorageKey);
        setAnalyticsData(DEFAULT_ANALYTICS_DATA);
        return;
      }
      if (isLegacySeededAnalytics(parsed)) {
        localStorage.removeItem(analyticsStorageKey);
        setAnalyticsData(DEFAULT_ANALYTICS_DATA);
        return;
      }
      setAnalyticsData({
        instagram: parsed.instagram || DEFAULT_ANALYTICS_DATA.instagram,
        tiktok: parsed.tiktok || DEFAULT_ANALYTICS_DATA.tiktok,
        youtube: parsed.youtube || DEFAULT_ANALYTICS_DATA.youtube,
        others: parsed.others || DEFAULT_ANALYTICS_DATA.others,
        audienceLocation: parsed.audienceLocation || DEFAULT_ANALYTICS_DATA.audienceLocation,
        audienceAge: parsed.audienceAge || DEFAULT_ANALYTICS_DATA.audienceAge,
        audienceGender: {
          female: parsed.audienceGender?.female ?? DEFAULT_ANALYTICS_DATA.audienceGender.female,
          male: parsed.audienceGender?.male ?? DEFAULT_ANALYTICS_DATA.audienceGender.male,
          other: parsed.audienceGender?.other ?? DEFAULT_ANALYTICS_DATA.audienceGender.other,
        },
      });
    } catch {
      setAnalyticsData(DEFAULT_ANALYTICS_DATA);
    }
  }, [analyticsStorageKey, analyticsUserSavedKey]);

  const syncAnalyticsFromApi = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/influencers/get-profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (!(result.success || response.ok)) return;

      const profileData = result.data || {};
      setPlatformMeta(extractPlatformMeta(profileData));
      let merged: AnalyticsState = DEFAULT_ANALYTICS_DATA;
      setAnalyticsData((prev) => {
        merged = mergeApiProfileIntoAnalytics(profileData, prev);
        persistAnalytics(merged);
        return merged;
      });

      if (!hasGenderValues(merged.audienceGender)) {
        let publicProfileData = await fetchPublicProfileFallback(profileData);
        if (!publicProfileData) {
          publicProfileData = await fetchPublicProfileFromListFallback(token, profileData);
        }
        if (publicProfileData) {
          merged = mergeApiProfileIntoAnalytics(publicProfileData, merged);
          setAnalyticsData(merged);
          persistAnalytics(merged);
        }
      }
      window.dispatchEvent(new Event('influencer-analytics-updated'));
      window.dispatchEvent(new Event('influencer-profile-updated'));
    } catch {
      // Keep existing local analytics state if API fetch fails.
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('influencer_token');
    if (!token) return;
    syncAnalyticsFromApi(token);
  }, []);

  const handleSaveMetrics = async () => {
    const token = localStorage.getItem('influencer_token');
    if (!token) {
      toast.error('Please login again');
      return;
    }

    const platformsPayload = (Object.keys(PLATFORM_KEY_TO_ID) as PlatformType[])
      .map((platformKey) => {
        const followers = parseMetricToNumber(analyticsData[platformKey].followers);
        const engagementRate = parseFloat(String(analyticsData[platformKey].engagement || '').replace('%', '')) || 0;
        const totalReach = parseMetricToNumber(analyticsData[platformKey].avgViews);
        return {
          platform_id: PLATFORM_KEY_TO_ID[platformKey],
          username: platformMeta[platformKey]?.username || '',
          profile_url: platformMeta[platformKey]?.profile_url || '',
          followers,
          engagement_rate: engagementRate,
          total_reach: String(totalReach),
        };
      })
      .filter((item) => item.profile_url.trim() || item.followers > 0 || item.engagement_rate > 0 || Number(item.total_reach) > 0);

    if (platformsPayload.length === 0) {
      toast.error('Enter values greater than 0 before saving');
      return;
    }

    try {
      setIsSavingMetrics(true);
      const response = await fetch(`${API_BASE_URL}/influencers/update-platforms`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ platforms: platformsPayload }),
      });
      const result = await response.json();

      if (!(result.success || response.ok)) {
        toast.error(result.message || 'Failed to update platform metrics');
        return;
      }

      persistAnalytics(analyticsData);
      window.dispatchEvent(new Event('influencer-analytics-updated'));
      await syncAnalyticsFromApi(token);
      toast.success('Platform metrics updated');
      setIsEditingMetrics(false);
    } catch {
      toast.error('Server error while saving platform metrics');
    } finally {
      setIsSavingMetrics(false);
    }
  };

  const handleSaveDemographics = async () => {
    const token = localStorage.getItem('influencer_token');
    if (!token) {
      toast.error('Please login again');
      return;
    }

    const toPercentage = (value: string) => {
      const raw = String(value ?? '').trim();
      const parsed = Number(raw.replace(/,/g, '').replace('%', ''));
      if (!Number.isFinite(parsed)) return 0;
      if (!raw.includes('%') && raw.includes('.') && parsed > 0 && parsed <= 1) {
        return Math.max(0, Math.min(100, parsed * 100));
      }
      return Math.max(0, Math.min(100, parsed));
    };

    const genderPayload = {
      male: toPercentage(analyticsData.audienceGender.male),
      female: toPercentage(analyticsData.audienceGender.female),
      other: toPercentage(analyticsData.audienceGender.other),
    };
    const hasGenderValues = Object.values(genderPayload).some((value) => value > 0);
    const genderRequestPayload = {
      ...genderPayload,
      audience_gender: genderPayload,
      audience_genders: genderPayload,
      influencer_audience_gender: genderPayload,
      influencer_audience_genders: genderPayload,
      gender: genderPayload,
    };

    const audienceAgePayload = {
      audience_age: analyticsData.audienceAge
        .map((age) => ({
          age_range: age.range,
          percentage: toPercentage(age.percentage),
        }))
        .filter((age) => age.percentage > 0),
    };

    const audienceLocationsPayload = {
      audience_locations: analyticsData.audienceLocation
        .filter((location) => location.country.trim())
        .map((location) => ({
          country: location.country.trim(),
          percentage: toPercentage(location.percentage),
        }))
        .filter((location) => location.percentage > 0),
    };

    try {
      setIsSavingDemographics(true);

      const requests: Promise<Response>[] = [];
      const requestKinds: Array<'gender' | 'age' | 'location'> = [];

      if (hasGenderValues) {
        requests.push(
          fetch(`${API_BASE_URL}/influencers/update-audience-gender`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(genderRequestPayload),
          })
        );
        requestKinds.push('gender');
      }

      if (audienceAgePayload.audience_age.length > 0) {
        requests.push(
          fetch(`${API_BASE_URL}/influencers/update-audience-age`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(audienceAgePayload),
          })
        );
        requestKinds.push('age');
      }

      if (audienceLocationsPayload.audience_locations.length > 0) {
        requests.push(
          fetch(`${API_BASE_URL}/influencers/update-audience-locations`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(audienceLocationsPayload),
          })
        );
        requestKinds.push('location');
      }

      if (requests.length === 0) {
        toast.error('Enter values greater than 0 before saving');
        return;
      }

      const responses = await Promise.all(requests);
      const results = await Promise.all(responses.map((response) => response.json()));

      for (let i = 0; i < responses.length; i += 1) {
        if (responses[i].ok || results[i].success) continue;

        const kind = requestKinds[i];
        if (kind === 'gender') {
          toast.error(results[i].message || 'Failed to update audience gender');
        } else if (kind === 'age') {
          toast.error(results[i].message || 'Failed to update audience age');
        } else {
          toast.error(results[i].message || 'Failed to update audience locations');
        }
        return;
      }

      persistAnalytics(analyticsData);
      window.dispatchEvent(new Event('influencer-analytics-updated'));
      await syncAnalyticsFromApi(token);
      setIsEditingDemographics(false);
      toast.success('Audience demographics updated successfully');
    } catch {
      toast.error('Server error while saving demographics');
    } finally {
      setIsSavingDemographics(false);
    }
  };

  const updateMetric = (platform: PlatformType, field: keyof PlatformMetrics, value: string) => {
    setAnalyticsData(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value,
      },
    }));
  };
  const updatePlatformMeta = (platform: PlatformType, field: keyof PlatformMeta, value: string) => {
    setPlatformMeta((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value,
      },
    }));
  };

  const sanitizeNumericInput = (value: string, allowDecimal = false) => {
    if (allowDecimal) {
      const cleaned = value.replace(/[^\d.]/g, '');
      const firstDot = cleaned.indexOf('.');
      if (firstDot === -1) return cleaned;
      return cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, '');
    }
    return value.replace(/\D/g, '');
  };

  const updateLocation = (index: number, field: keyof LocationData, value: string) => {
    setAnalyticsData(prev => {
      const newLocations = [...prev.audienceLocation];
      newLocations[index] = { ...newLocations[index], [field]: value };
      return { ...prev, audienceLocation: newLocations };
    });
  };

  const addLocation = () => {
    setAnalyticsData(prev => ({
      ...prev,
      audienceLocation: [...prev.audienceLocation, { country: '', percentage: '' }],
    }));
  };

  const removeLocation = (index: number) => {
    setAnalyticsData(prev => ({
      ...prev,
      audienceLocation: prev.audienceLocation.filter((_, i) => i !== index),
    }));
  };

  const updateAge = (index: number, value: string) => {
    setAnalyticsData(prev => {
      const newAges = [...prev.audienceAge];
      newAges[index] = { ...newAges[index], percentage: value };
      return { ...prev, audienceAge: newAges };
    });
  };

  const updateGender = (field: 'female' | 'male' | 'other', value: string) => {
    setAnalyticsData(prev => ({
      ...prev,
      audienceGender: {
        ...prev.audienceGender,
        [field]: value,
      },
    }));
  };

  const platforms = [
    { id: 'instagram' as PlatformType, name: 'Instagram', icon: Instagram },
    { id: 'tiktok' as PlatformType, name: 'TikTok', icon: Music },
    { id: 'youtube' as PlatformType, name: 'YouTube', icon: Youtube },
    { id: 'others' as PlatformType, name: 'Others', icon: Globe },
  ];

  const currentMetrics = analyticsData[activePlatform];
  const toInputValue = (value: string) => {
    const normalized = String(value ?? '').trim();
    if (!normalized) return '';
    const asNumber = Number(normalized);
    if (Number.isFinite(asNumber) && asNumber <= 0) return '';
    return normalized;
  };
  const toChartPercent = (value: unknown) => {
    const raw = String(value ?? '').trim();
    if (!raw) return 0;
    const numeric = Number(raw.replace(/,/g, '').replace('%', ''));
    if (!Number.isFinite(numeric)) return 0;
    if (!raw.includes('%') && raw.includes('.') && numeric > 0 && numeric <= 1) {
      return Math.round(numeric * 1000) / 10;
    }
    return Math.max(0, Math.min(100, numeric));
  };

  // Prepare data for charts
  const ageChartData = analyticsData.audienceAge
    .map((item) => ({
      age: item.range,
      value: toChartPercent(item.percentage),
    }))
    .filter((item) => item.value > 0);

  const genderChartData = [
    { name: 'Female', value: toChartPercent(analyticsData.audienceGender.female) },
    { name: 'Male', value: toChartPercent(analyticsData.audienceGender.male) },
    { name: 'Other', value: toChartPercent(analyticsData.audienceGender.other) },
  ].filter((item) => item.value > 0);
  const totalGenderValue = genderChartData.reduce((sum, item) => sum + item.value, 0);
  const visibleLocations = analyticsData.audienceLocation.filter(
    (location) => location.country.trim() && toChartPercent(location.percentage) > 0
  );

  const COLORS = {
    female: '#8B7BE8',
    male: '#3B82F6',
    other: '#F59E0B',
    bars: '#6B8EFF',
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Analytics</h1>
      </div>

      {/* Platform Metrics Section */}
      <div className="bg-gray-900 rounded-xl p-4 md:p-8 border border-gray-800 mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white">Platform Metrics</h2>
          {isEditingMetrics ? (
            <Button
              onClick={handleSaveMetrics}
              disabled={isSavingMetrics}
              className="bg-primary hover:bg-secondary text-black font-medium w-full sm:w-auto text-sm md:text-base"
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSavingMetrics ? 'Saving...' : 'Save Changes'}
            </Button>
          ) : (
            <Button
              onClick={() => setIsEditingMetrics(true)}
              className="bg-white hover:bg-gray-100 text-black font-medium w-full sm:w-auto text-sm md:text-base"
              size="sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        {/* Platform Tabs */}
        <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 border-b border-gray-800 overflow-x-auto">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <button
                key={platform.id}
                onClick={() => setActivePlatform(platform.id)}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activePlatform === platform.id
                    ? 'border-primary text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-medium text-sm md:text-base">{platform.name}</span>
              </button>
            );
          })}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          {/* Profile URL */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Profile URL</label>
            {isEditingMetrics ? (
              <Input
                value={platformMeta[activePlatform]?.profile_url || ''}
                onChange={(e) => updatePlatformMeta(activePlatform, 'profile_url', e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="https://..."
                type="url"
              />
            ) : (
              <p className="text-base md:text-lg font-medium text-white break-all">{platformMeta[activePlatform]?.profile_url || '-'}</p>
            )}
          </div>

          {/* Followers */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Followers</label>
            {isEditingMetrics ? (
              <Input
                value={toInputValue(currentMetrics.followers)}
                onChange={(e) => updateMetric(activePlatform, 'followers', sanitizeNumericInput(e.target.value))}
                className="bg-gray-800 border-gray-700 text-white text-xl md:text-2xl font-bold"
                placeholder="e.g., 1200"
                type="text"
                inputMode="numeric"
              />
            ) : (
              <p className="text-2xl md:text-4xl font-bold text-white">{currentMetrics.followers || '-'}</p>
            )}
          </div>

          {/* Average Views */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Average Views</label>
            {isEditingMetrics ? (
              <Input
                value={toInputValue(currentMetrics.avgViews)}
                onChange={(e) => updateMetric(activePlatform, 'avgViews', sanitizeNumericInput(e.target.value))}
                className="bg-gray-800 border-gray-700 text-white text-xl md:text-2xl font-bold"
                placeholder="e.g., 11000"
                type="text"
                inputMode="numeric"
              />
            ) : (
              <p className="text-2xl md:text-4xl font-bold text-white">{currentMetrics.avgViews || '-'}</p>
            )}
          </div>

          {/* Engagement */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Engagement</label>
            {isEditingMetrics ? (
              <Input
                value={toInputValue(currentMetrics.engagement)}
                onChange={(e) => updateMetric(activePlatform, 'engagement', sanitizeNumericInput(e.target.value, true))}
                className="bg-gray-800 border-gray-700 text-white text-xl md:text-2xl font-bold"
                placeholder="e.g., 4.90"
                type="text"
                inputMode="decimal"
              />
            ) : (
              <p className="text-2xl md:text-4xl font-bold text-white">{currentMetrics.engagement || '-'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Demographics Section */}
      <div className="bg-gray-900 rounded-xl p-4 md:p-8 border border-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-white">Audience Demographics</h2>
          {isEditingDemographics ? (
            <Button
              onClick={handleSaveDemographics}
              className="bg-primary hover:bg-secondary text-black font-medium w-full sm:w-auto text-sm md:text-base"
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          ) : (
            <Button
              onClick={() => setIsEditingDemographics(true)}
              className="bg-white hover:bg-gray-100 text-black font-medium w-full sm:w-auto text-sm md:text-base"
              size="sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Audience Location */}
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">Audience Location</h3>
            
            {isEditingDemographics ? (
              <div className="space-y-3 md:space-y-4">
                {analyticsData.audienceLocation.map((location, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
                    <select
                      value={location.country}
                      onChange={(e) => updateLocation(index, 'country', e.target.value)}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 md:px-4 py-2 md:py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base"
                    >
                      <option value="">Select country...</option>
                      {COUNTRIES.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2">
                      <Input
                        value={location.percentage}
                        onChange={(e) => updateLocation(index, 'percentage', e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white w-20 md:w-24 text-sm md:text-base"
                        placeholder="60"
                        type="number"
                      />
                      <span className="text-gray-400">%</span>
                      {analyticsData.audienceLocation.length > 1 && (
                        <button
                          onClick={() => removeLocation(index)}
                          className="p-2 text-red-400 hover:bg-red-950 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  onClick={addLocation}
                  className="w-full bg-transparent border-2 border-gray-700 text-white hover:bg-gray-800 rounded-lg px-3 md:px-4 py-2 md:py-3 flex items-center justify-center gap-2 font-medium transition-colors text-sm md:text-base"
                >
                  <Plus className="w-4 h-4" />
                  Add Country
                </button>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {visibleLocations.length === 0 ? (
                  <p className="text-sm text-gray-400">No location data yet</p>
                ) : (
                  visibleLocations.map((location, index) => (
                    <div key={`${location.country}-${index}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium text-sm md:text-base">{location.country}</span>
                        <span className="text-primary font-bold text-sm md:text-base">{location.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${location.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Audience Age */}
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">Audience Age</h3>
            
            {isEditingDemographics ? (
              <div className="space-y-3 md:space-y-4">
                {analyticsData.audienceAge.map((age, index) => (
                  <div key={index} className="flex items-center gap-3 md:gap-4">
                    <span className="text-white w-16 md:w-20 text-sm md:text-base">{age.range}</span>
                    <Input
                      value={age.percentage}
                      onChange={(e) => updateAge(index, e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white text-sm md:text-base"
                      placeholder="60"
                      type="number"
                    />
                    <span className="text-gray-400">%</span>
                  </div>
                ))}
              </div>
            ) : (
              ageChartData.length === 0 ? (
                <p className="text-sm text-gray-400">No age data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={ageChartData}>
                    <XAxis 
                      dataKey="age" 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                      }}
                    />
                    <Bar dataKey="value" fill={COLORS.bars} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )
            )}
          </div>

          {/* Audience Gender */}
          <div className="lg:col-span-2">
            <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">Audience Gender</h3>
            
            {isEditingDemographics ? (
              <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Female</label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={analyticsData.audienceGender.female}
                      onChange={(e) => updateGender('female', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white text-sm md:text-base"
                      placeholder="70"
                      type="number"
                    />
                    <span className="text-gray-400">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Male</label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={analyticsData.audienceGender.male}
                      onChange={(e) => updateGender('male', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white text-sm md:text-base"
                      placeholder="30"
                      type="number"
                    />
                    <span className="text-gray-400">%</span>
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Other</label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={analyticsData.audienceGender.other}
                      onChange={(e) => updateGender('other', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white text-sm md:text-base"
                      placeholder="0"
                      type="number"
                    />
                    <span className="text-gray-400">%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
                <div className="w-full md:w-2/5 h-[200px]">
                  {totalGenderValue === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-sm text-gray-400">No gender data yet</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genderChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {genderChartData.map((entry) => (
                            <Cell
                              key={entry.name}
                              fill={
                                entry.name === 'Female'
                                  ? COLORS.female
                                  : entry.name === 'Male'
                                    ? COLORS.male
                                    : COLORS.other
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#FFFFFF',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div className="space-y-3 md:space-y-4 md:min-w-[220px]">
                  {totalGenderValue === 0 ? (
                    <p className="text-sm text-gray-400">No gender data yet</p>
                  ) : (
                    <>
                      {genderChartData.map((item) => (
                        <div key={item.name} className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 md:w-4 md:h-4 rounded-full"
                            style={{
                              backgroundColor:
                                item.name === 'Female'
                                  ? COLORS.female
                                  : item.name === 'Male'
                                    ? COLORS.male
                                    : COLORS.other,
                            }}
                          />
                          <span className="text-white text-sm md:text-base">{item.name}</span>
                          <span className="font-bold ml-auto text-sm md:text-base">
                            {item.value}%
                          </span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {isEditingDemographics && (
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-800">
            <Button
              onClick={handleSaveDemographics}
              disabled={isSavingDemographics}
              className="bg-primary hover:bg-secondary text-black font-medium text-sm md:text-base"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSavingDemographics ? 'Saving...' : 'Save Demographics'}
            </Button>
            <Button
              onClick={() => setIsEditingDemographics(false)}
              className="bg-white hover:bg-gray-100 text-black font-medium text-sm md:text-base"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
