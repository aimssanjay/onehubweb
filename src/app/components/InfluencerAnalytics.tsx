import { useEffect, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Instagram, Music, Youtube, Edit, Save, Plus, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { toast } from 'sonner';
import { API_BASE_URL } from '../../services/api';

type PlatformType = 'instagram' | 'tiktok' | 'youtube';

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
  audienceLocation: LocationData[];
  audienceAge: AgeData[];
  audienceGender: {
    female: string;
    male: string;
    other: string;
  };
}

const ANALYTICS_STORAGE_KEY = 'influencer_analytics';
const PLATFORM_ID_TO_KEY: Record<number, PlatformType> = {
  1: 'instagram',
  2: 'youtube',
  3: 'tiktok',
};
const PLATFORM_KEY_TO_ID: Record<PlatformType, number> = {
  instagram: 1,
  youtube: 2,
  tiktok: 3,
};

type PlatformMeta = {
  username: string;
  profile_url: string;
};

const DEFAULT_ANALYTICS_DATA: AnalyticsState = {
  instagram: {
    followers: '1.5M',
    avgViews: '250k',
    engagement: '5.0%',
  },
  tiktok: {
    followers: '850k',
    avgViews: '500k',
    engagement: '7.2%',
  },
  youtube: {
    followers: '2.3M',
    avgViews: '1.2M',
    engagement: '4.5%',
  },
  audienceLocation: [
    { country: 'United States', percentage: '60' },
    { country: 'United Kingdom', percentage: '16' },
    { country: 'Brazil', percentage: '62' },
    { country: 'Other', percentage: '10' },
  ],
  audienceAge: [
    { range: '13-17', percentage: '60' },
    { range: '18-24', percentage: '62' },
    { range: '25-34', percentage: '18' },
    { range: '35-44', percentage: '4' },
    { range: '45-64', percentage: '1' },
  ],
  audienceGender: {
    female: '70',
    male: '30',
    other: '0',
  },
};

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
  });

  const toStringValue = (value: unknown, fallback = '') => {
    if (value === null || value === undefined) return fallback;
    return String(value);
  };

  const mergeApiProfileIntoAnalytics = (profile: any, current: AnalyticsState): AnalyticsState => {
    const merged: AnalyticsState = {
      ...current,
      instagram: { ...current.instagram },
      tiktok: { ...current.tiktok },
      youtube: { ...current.youtube },
      audienceLocation: [...current.audienceLocation],
      audienceAge: [...current.audienceAge],
      audienceGender: { ...current.audienceGender },
    };

    const socialAccounts = Array.isArray(profile?.social_accounts) ? profile.social_accounts : [];
    socialAccounts.forEach((account: any) => {
      const platformKey = PLATFORM_ID_TO_KEY[Number(account?.platform_id)];
      if (!platformKey) return;

      merged[platformKey] = {
        followers: toStringValue(account?.followers, merged[platformKey].followers),
        avgViews: toStringValue(
          account?.total_reach ?? account?.avg_views ?? account?.average_views,
          merged[platformKey].avgViews
        ),
        engagement: toStringValue(account?.engagement_rate, merged[platformKey].engagement),
      };
    });

    const audienceLocations = profile?.audience_locations || profile?.audienceLocation;
    if (Array.isArray(audienceLocations) && audienceLocations.length > 0) {
      merged.audienceLocation = audienceLocations.map((item: any) => ({
        country: toStringValue(item?.country),
        percentage: toStringValue(item?.percentage, '0'),
      }));
    }

    const audienceAge = profile?.audience_age || profile?.audienceAge;
    if (Array.isArray(audienceAge) && audienceAge.length > 0) {
      merged.audienceAge = audienceAge.map((item: any) => ({
        range: toStringValue(item?.age_range ?? item?.range),
        percentage: toStringValue(item?.percentage, '0'),
      }));
    }

    const audienceGender = profile?.audience_gender || profile?.audienceGender;
    if (audienceGender && typeof audienceGender === 'object') {
      merged.audienceGender = {
        female: toStringValue(audienceGender?.female, merged.audienceGender.female),
        male: toStringValue(audienceGender?.male, merged.audienceGender.male),
        other: toStringValue(audienceGender?.other, merged.audienceGender.other),
      };
    }

    return merged;
  };

  const extractPlatformMeta = (profile: any): Record<PlatformType, PlatformMeta> => {
    const socialAccounts = Array.isArray(profile?.social_accounts) ? profile.social_accounts : [];
    const meta: Record<PlatformType, PlatformMeta> = {
      instagram: { username: '', profile_url: '' },
      tiktok: { username: '', profile_url: '' },
      youtube: { username: '', profile_url: '' },
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

  useEffect(() => {
    const savedAnalytics = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (!savedAnalytics) {
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(DEFAULT_ANALYTICS_DATA));
      return;
    }

    try {
      const parsed = JSON.parse(savedAnalytics);
      setAnalyticsData({
        instagram: parsed.instagram || DEFAULT_ANALYTICS_DATA.instagram,
        tiktok: parsed.tiktok || DEFAULT_ANALYTICS_DATA.tiktok,
        youtube: parsed.youtube || DEFAULT_ANALYTICS_DATA.youtube,
        audienceLocation: parsed.audienceLocation || DEFAULT_ANALYTICS_DATA.audienceLocation,
        audienceAge: parsed.audienceAge || DEFAULT_ANALYTICS_DATA.audienceAge,
        audienceGender: {
          female: parsed.audienceGender?.female ?? DEFAULT_ANALYTICS_DATA.audienceGender.female,
          male: parsed.audienceGender?.male ?? DEFAULT_ANALYTICS_DATA.audienceGender.male,
          other: parsed.audienceGender?.other ?? DEFAULT_ANALYTICS_DATA.audienceGender.other,
        },
      });
    } catch {
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(DEFAULT_ANALYTICS_DATA));
      setAnalyticsData(DEFAULT_ANALYTICS_DATA);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('influencer_token');
    if (!token) return;

    const loadAnalyticsFromApi = async () => {
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

        setAnalyticsData((prev) => {
          const merged = mergeApiProfileIntoAnalytics(result.data || {}, prev);
          localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(merged));
          window.dispatchEvent(new Event('influencer-analytics-updated'));
          return merged;
        });
        setPlatformMeta(extractPlatformMeta(result.data || {}));
      } catch {
        // Keep existing local analytics state if API fetch fails.
      }
    };

    loadAnalyticsFromApi();
  }, []);

  const handleSaveMetrics = async () => {
    const token = localStorage.getItem('influencer_token');
    if (!token) {
      toast.error('Please login again');
      return;
    }

    const platformsPayload = (Object.keys(PLATFORM_KEY_TO_ID) as PlatformType[]).map((platformKey) => ({
      platform_id: PLATFORM_KEY_TO_ID[platformKey],
      username: platformMeta[platformKey]?.username || '',
      profile_url: platformMeta[platformKey]?.profile_url || '',
      followers: parseMetricToNumber(analyticsData[platformKey].followers),
      engagement_rate: parseFloat(String(analyticsData[platformKey].engagement || '').replace('%', '')) || 0,
      total_reach: String(parseMetricToNumber(analyticsData[platformKey].avgViews)),
    }));

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

      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analyticsData));
      window.dispatchEvent(new Event('influencer-analytics-updated'));
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
      const parsed = Number(value);
      if (!Number.isFinite(parsed)) return 0;
      return Math.max(0, Math.min(100, parsed));
    };

    const genderPayload = {
      male: toPercentage(analyticsData.audienceGender.male),
      female: toPercentage(analyticsData.audienceGender.female),
      other: toPercentage(analyticsData.audienceGender.other),
    };

    const audienceAgePayload = {
      audience_age: analyticsData.audienceAge.map((age) => ({
        age_range: age.range,
        percentage: toPercentage(age.percentage),
      })),
    };

    const audienceLocationsPayload = {
      audience_locations: analyticsData.audienceLocation
        .filter((location) => location.country.trim())
        .map((location) => ({
          country: location.country.trim(),
          percentage: toPercentage(location.percentage),
        })),
    };

    try {
      setIsSavingDemographics(true);

      const [genderResponse, ageResponse, locationResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/influencers/update-audience-gender`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(genderPayload),
        }),
        fetch(`${API_BASE_URL}/influencers/update-audience-age`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(audienceAgePayload),
        }),
        fetch(`${API_BASE_URL}/influencers/update-audience-locations`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(audienceLocationsPayload),
        }),
      ]);

      const [genderResult, ageResult, locationResult] = await Promise.all([
        genderResponse.json(),
        ageResponse.json(),
        locationResponse.json(),
      ]);

      if (!(genderResponse.ok || genderResult.success)) {
        toast.error(genderResult.message || 'Failed to update audience gender');
        return;
      }

      if (!(ageResponse.ok || ageResult.success)) {
        toast.error(ageResult.message || 'Failed to update audience age');
        return;
      }

      if (!(locationResponse.ok || locationResult.success)) {
        toast.error(locationResult.message || 'Failed to update audience locations');
        return;
      }

      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analyticsData));
      window.dispatchEvent(new Event('influencer-analytics-updated'));
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
  ];

  const currentMetrics = analyticsData[activePlatform];

  // Prepare data for charts
  const ageChartData = analyticsData.audienceAge.map(item => ({
    age: item.range,
    value: parseInt(item.percentage) || 0,
  }));

  const genderChartData = [
    { name: 'Female', value: parseInt(analyticsData.audienceGender.female) || 0 },
    { name: 'Male', value: parseInt(analyticsData.audienceGender.male) || 0 },
    { name: 'Other', value: parseInt(analyticsData.audienceGender.other) || 0 },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Followers */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Followers</label>
            {isEditingMetrics ? (
              <Input
                value={currentMetrics.followers}
                onChange={(e) => updateMetric(activePlatform, 'followers', sanitizeNumericInput(e.target.value))}
                className="bg-gray-800 border-gray-700 text-white text-xl md:text-2xl font-bold"
                placeholder="e.g., 1200"
                type="text"
                inputMode="numeric"
              />
            ) : (
              <p className="text-2xl md:text-4xl font-bold text-white">{currentMetrics.followers}</p>
            )}
          </div>

          {/* Average Views */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Average Views</label>
            {isEditingMetrics ? (
              <Input
                value={currentMetrics.avgViews}
                onChange={(e) => updateMetric(activePlatform, 'avgViews', sanitizeNumericInput(e.target.value))}
                className="bg-gray-800 border-gray-700 text-white text-xl md:text-2xl font-bold"
                placeholder="e.g., 11000"
                type="text"
                inputMode="numeric"
              />
            ) : (
              <p className="text-2xl md:text-4xl font-bold text-white">{currentMetrics.avgViews}</p>
            )}
          </div>

          {/* Engagement */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Engagement</label>
            {isEditingMetrics ? (
              <Input
                value={currentMetrics.engagement}
                onChange={(e) => updateMetric(activePlatform, 'engagement', sanitizeNumericInput(e.target.value, true))}
                className="bg-gray-800 border-gray-700 text-white text-xl md:text-2xl font-bold"
                placeholder="e.g., 4.90"
                type="text"
                inputMode="decimal"
              />
            ) : (
              <p className="text-2xl md:text-4xl font-bold text-white">{currentMetrics.engagement}</p>
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
                {analyticsData.audienceLocation.map((location, index) => (
                  <div key={index}>
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
                ))}
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
                        <Cell fill={COLORS.female} />
                        <Cell fill={COLORS.male} />
                        <Cell fill={COLORS.other} />
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
                </div>
                <div className="space-y-3 md:space-y-4 md:min-w-[220px]">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-full" style={{ backgroundColor: COLORS.female }} />
                    <span className="text-white text-sm md:text-base">Female</span>
                    <span className="text-purple-400 font-bold ml-auto text-sm md:text-base">{analyticsData.audienceGender.female}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-full" style={{ backgroundColor: COLORS.male }} />
                    <span className="text-white text-sm md:text-base">Male</span>
                    <span className="text-blue-400 font-bold ml-auto text-sm md:text-base">{analyticsData.audienceGender.male}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-full" style={{ backgroundColor: COLORS.other }} />
                    <span className="text-white text-sm md:text-base">Other</span>
                    <span className="text-amber-400 font-bold ml-auto text-sm md:text-base">{analyticsData.audienceGender.other}%</span>
                  </div>
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
