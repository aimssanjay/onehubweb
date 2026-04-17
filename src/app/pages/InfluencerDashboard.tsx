import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  LayoutDashboard, User, Briefcase, MessageSquare, Settings, LogOut,
  Instagram, Youtube, Video, TrendingUp, DollarSign, Eye, Heart,
  Edit, Camera, BarChart3, Menu, X, Bell,
  ChevronDown, MapPin, Mail, Phone, Check,
  ExternalLink, Search, Send,
} from 'lucide-react';
import { API_BASE_URL } from '../../services/api';
import { useCategories } from '../hooks/useCategories';
import { toast } from 'sonner';
import { InfluencerAnalytics } from '../components/InfluencerAnalytics';
import {
  clearInfluencerClientData,
  getInfluencerAnalyticsStorageKey,
} from '../utils/influencerStorage';

type TabType = 'overview' | 'profile' | 'campaigns' | 'earnings' | 'messages' |
  'notifications' | 'analytics' | 'settings';

type SharedAnalyticsData = {
  instagram: { followers: string; avgViews: string; engagement: string };
  tiktok: { followers: string; avgViews: string; engagement: string };
  youtube: { followers: string; avgViews: string; engagement: string };
  others: { followers: string; avgViews: string; engagement: string };
  audienceLocation: Array<{ country: string; percentage: string }>;
  audienceAge: Array<{ range: string; percentage: string }>;
  audienceGender: { female: string; male: string; other?: string };
};

type PlatformFormItem = {
  username: string;
  profile_url: string;
  followers: string;
  engagement_rate: string;
  total_reach: string;
};

const PLATFORM_CONFIG = [
  { platformId: 1, name: 'Instagram', icon: Instagram, color: 'from-purple-600 to-pink-600' },
  { platformId: 3, name: 'TikTok', icon: Video, color: 'from-gray-800 to-gray-700' },
  { platformId: 2, name: 'YouTube', icon: Youtube, color: 'from-red-600 to-red-500' },
  { platformId: 4, name: 'UGC / Other', icon: Video, color: 'from-primary to-secondary' },
];

// Country list
const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria',
  'Bangladesh', 'Belgium', 'Brazil', 'Canada', 'Chile', 'China', 'Colombia',
  'Czech Republic', 'Denmark', 'Egypt', 'Ethiopia', 'Finland', 'France',
  'Germany', 'Ghana', 'Greece', 'Hungary', 'India', 'Indonesia', 'Iran',
  'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan', 'Kenya',
  'Malaysia', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand', 'Nigeria',
  'Norway', 'Pakistan', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Romania', 'Russia', 'Saudi Arabia', 'Singapore', 'South Africa',
  'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Thailand',
  'Turkey', 'UAE', 'Ukraine', 'United Kingdom', 'United States', 'Vietnam',
];

// Mock data
const mockCampaigns: Array<{
  id: string;
  brand: string;
  logo: string;
  budget: string;
  category: string;
  platform: string;
  status: 'available' | 'applied' | 'ongoing' | 'completed';
  description: string;
  matchCategory: string;
}> = [];

const mockMessages = [
  { id: '1', brand: 'Nike', brandInitial: 'N', brandColor: 'bg-black', lastMessage: 'Sounds great! Looking forward to it!', time: 'Now', unread: 1, online: true,
    messages: [
      { id: 1, sender: 'brand', text: 'Hi! Your recent Instagram post is fantastic! We\'ve approved it.', time: 'Thu · 2:20 PM' },
      { id: 2, sender: 'me', text: 'Thank you! I\'m glad you liked it. Let me know if there\'s anything else.', time: 'Thu · 2:34 PM' },
      { id: 3, sender: 'brand', text: 'We\'d love to collaborate again. Please post a new reel by May 30th.', time: 'Today · 10:15 AM' },
      { id: 4, sender: 'me', text: 'Absolutely! I\'ll create a new reel featuring your latest collection.', time: 'Today · 10:18 AM' },
      { id: 5, sender: 'brand', text: 'Sounds great! Looking forward to it!', time: 'Now' },
    ]
  },
  { id: '2', brand: 'TechBrand', brandInitial: 'T', brandColor: 'bg-blue-600', lastMessage: 'Got it! We\'ll review your vid...', time: '5h ago', unread: 0, online: false, messages: [] },
  { id: '3', brand: 'Lakme', brandInitial: 'L', brandColor: 'bg-pink-500', lastMessage: 'We\'re looking forward to your...', time: '1d ago', unread: 0, online: false, messages: [] },
  { id: '4', brand: 'UrbanTaste', brandInitial: 'U', brandColor: 'bg-red-500', lastMessage: 'Your content has been approved!', time: '2d ago', unread: 0, online: false, messages: [] },
];

const mockNotifications = [
  { id: '1', brand: 'TechBrand', brandInitial: 'T', brandColor: 'bg-blue-600', message: '2 new campaign invites for your YouTube channel!', time: '2h ago', isNew: true },
  { id: '2', brand: 'TechBrand', brandInitial: 'T', brandColor: 'bg-blue-700', message: '₹7,000 payment received! Check your earnings now.', time: '3h ago', isNew: true },
  { id: '3', brand: 'Nike', brandInitial: 'N', brandColor: 'bg-black', message: 'Congrats! Your latest post has been approved.', time: '5h ago', isNew: true },
  { id: '4', brand: 'Lakme', brandInitial: 'L', brandColor: 'bg-pink-500', message: 'Lakme campaign approved! Time to get started.', time: '1d ago', isNew: false },
  { id: '5', brand: 'BeautyPlus', brandInitial: 'B', brandColor: 'bg-purple-500', message: '@llabeauty mentioned you in a post.', time: '2d ago', isNew: false },
];

const DEFAULT_ANALYTICS_DATA: SharedAnalyticsData = {
  instagram: { followers: '', avgViews: '', engagement: '' },
  tiktok: { followers: '', avgViews: '', engagement: '' },
  youtube: { followers: '', avgViews: '', engagement: '' },
  others: { followers: '', avgViews: '', engagement: '' },
  audienceLocation: [],
  audienceAge: [],
  audienceGender: { female: '', male: '', other: '' },
};

const isLegacySeededAnalytics = (data: any) =>
  data?.instagram?.followers === '1.5M' ||
  data?.tiktok?.followers === '850k' ||
  data?.youtube?.followers === '2.3M';

export default function InfluencerDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { categories: apiCategories } = useCategories();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [campaignsSubTab, setCampaignsSubTab] = useState<'available' | 'applied' | 'ongoing' | 'completed'>('available');
  const [selectedConversation, setSelectedConversation] = useState(mockMessages[0]);
  const [messageText, setMessageText] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [analyticsData, setAnalyticsData] = useState<SharedAnalyticsData>(DEFAULT_ANALYTICS_DATA);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', password: '', confirmPassword: '' });
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [platformForm, setPlatformForm] = useState<Record<number, PlatformFormItem>>({});
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const analyticsStorageKey = getInfluencerAnalyticsStorageKey();

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '', phone: '', country: '', city: '', bio: '', gender: '', date_of_birth: '', price_start: '',
  });

  const normalizeDateInput = (value: string) => {
    if (!value) return '';
    const raw = value.includes('T') ? value.split('T')[0] : value;
    const trimmed = raw.trim();

    // Convert DD-MM-YYYY to YYYY-MM-DD when needed
    const ddMmYyyyMatch = trimmed.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (ddMmYyyyMatch) {
      const [, dd, mm, yyyy] = ddMmYyyyMatch;
      return `${yyyy}-${mm}-${dd}`;
    }

    return trimmed;
  };

  const parseMaybeNumber = (value: string) => {
    const trimmed = String(value ?? '').trim();
    if (!trimmed) return undefined;
    const num = Number(trimmed);
    return Number.isFinite(num) ? num : undefined;
  };

  const parseMaybeFloat = (value: string) => {
    const trimmed = String(value ?? '').trim();
    if (!trimmed) return undefined;
    const num = Number(trimmed);
    return Number.isFinite(num) ? num : undefined;
  };

  const getJoinedDateLabel = (data: any) => {
    const rawDate =
      data?.created_at ||
      data?.createdAt ||
      data?.signup_date ||
      data?.joined_at ||
      data?.join_date;

    if (!rawDate) return 'Joined recently';

    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return 'Joined recently';
    return `Joined ${date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;
  };

  const buildPlatformForm = (socialAccounts: any[] = []): Record<number, PlatformFormItem> => {
    const byPlatform: Record<number, PlatformFormItem> = {};

    PLATFORM_CONFIG.forEach((platform) => {
      const account = socialAccounts.find((acc: any) => Number(acc.platform_id) === platform.platformId) || {};
      byPlatform[platform.platformId] = {
        username: account.username || '',
        profile_url: account.profile_url || '',
        followers: account.followers != null ? String(account.followers) : '',
        engagement_rate: account.engagement_rate != null ? String(account.engagement_rate) : '',
        total_reach: account.total_reach != null ? String(account.total_reach) : '',
      };
    });

    return byPlatform;
  };

  const buildNormalizedPlatformsPayload = (source: Record<number, PlatformFormItem>) => {
    return PLATFORM_CONFIG.map((platform) => {
      const item = source[platform.platformId] || {
        username: '',
        profile_url: '',
        followers: '',
        engagement_rate: '',
        total_reach: '',
      };

      return {
        platform_id: platform.platformId,
        username: item.username.trim(),
        profile_url: item.profile_url.trim(),
        followers: parseMaybeNumber(item.followers) ?? 0,
        engagement_rate: parseMaybeFloat(item.engagement_rate) ?? 0,
        total_reach: item.total_reach.trim(),
      };
    }).filter((item) =>
      item.username || item.profile_url || item.followers > 0 || item.engagement_rate > 0 || item.total_reach
    );
  };

  const arePlatformsEqual = (
    a: Array<{ platform_id: number; username: string; profile_url: string; followers: number; engagement_rate: number; total_reach: string }>,
    b: Array<{ platform_id: number; username: string; profile_url: string; followers: number; engagement_rate: number; total_reach: string }>
  ) => {
    if (a.length !== b.length) return false;
    const sortFn = (x: { platform_id: number }, y: { platform_id: number }) => x.platform_id - y.platform_id;
    const aa = [...a].sort(sortFn);
    const bb = [...b].sort(sortFn);
    return aa.every((item, idx) => {
      const other = bb[idx];
      return (
        item.platform_id === other.platform_id &&
        item.username === other.username &&
        item.profile_url === other.profile_url &&
        item.followers === other.followers &&
        item.engagement_rate === other.engagement_rate &&
        item.total_reach === other.total_reach
      );
    });
  };

  const applyProfileData = (data: any) => {
    setUserData((prev: any) => ({
      ...(prev || {}),
      ...(data || {}),
      price_start:
        data?.price_start ??
        data?.base_price ??
        prev?.price_start ??
        prev?.base_price ??
        '',
    }));
    setProfileImagePreview(data.profile_pic || null);
    setPlatformForm(buildPlatformForm(data.social_accounts || []));
    setEditForm((prev) => ({
      name: data.name || '',
      phone: data.phone || '',
      country: data.country || '',
      city: data.city || '',
      bio: data.bio || '',
      gender: data.gender || '',
      date_of_birth: normalizeDateInput(data.date_of_birth || data.dob || ''),
      price_start:
        data.price_start != null
          ? String(data.price_start)
          : data.base_price != null
            ? String(data.base_price)
            : prev.price_start || '',
    }));
    setSelectedCategoryIds(
      (data.categories || [])
        .map((cat: any) => cat.id || cat.category_id)
        .filter(Boolean)
    );
  };

  const updatePlatformField = (platformId: number, field: keyof PlatformFormItem, value: string) => {
    setPlatformForm((prev) => ({
      ...prev,
      [platformId]: {
        ...(prev[platformId] || {
          username: '',
          profile_url: '',
          followers: '',
          engagement_rate: '',
          total_reach: '',
        }),
        [field]: value,
      },
    }));
  };

  const resetEditState = () => {
    if (!userData) return;
    applyProfileData(userData);
    setIsEditing(false);
  };

  // Fetch profile
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const allowedTabs: TabType[] = ['overview', 'profile', 'analytics', 'campaigns', 'earnings', 'messages', 'notifications', 'settings'];
    if (tabParam && allowedTabs.includes(tabParam as TabType)) {
      setActiveTab(tabParam as TabType);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('influencer_token');
      if (!token) { navigate('/influencer/login'); return; }
      const cachedUser = localStorage.getItem('influencer_user');
      const parsedCachedUser = (() => {
        if (!cachedUser) return null;
        try {
          return JSON.parse(cachedUser);
        } catch {
          return null;
        }
      })();
      try {
        const response = await fetch(`${API_BASE_URL}/influencers/get-profile`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });

        if (response.status === 401 || response.status === 403) {
          clearInfluencerClientData();
          navigate('/influencer/login');
          return;
        }

        const result = await response.json();
        if (result.success && result.data) {
          applyProfileData(result.data);
          localStorage.setItem('influencer_user', JSON.stringify(result.data));
        } else if (parsedCachedUser) {
          applyProfileData(parsedCachedUser);
          toast.error('Live profile load failed. Showing cached profile.');
        } else {
          toast.error(result?.message || 'Unable to load dashboard profile');
          navigate('/influencer/login');
        }
      } catch (error) {
        if (parsedCachedUser) {
          applyProfileData(parsedCachedUser);
          toast.error('Network issue. Showing cached profile.');
        } else {
          navigate('/influencer/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadAnalyticsData = () => {
      const savedAnalytics = localStorage.getItem(analyticsStorageKey);
      if (!savedAnalytics) {
        setAnalyticsData(DEFAULT_ANALYTICS_DATA);
        return;
      }

      try {
        const parsed = JSON.parse(savedAnalytics);
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
          audienceGender: parsed.audienceGender || DEFAULT_ANALYTICS_DATA.audienceGender,
        });
      } catch {
        setAnalyticsData(DEFAULT_ANALYTICS_DATA);
      }
    };

    loadAnalyticsData();
    window.addEventListener('influencer-analytics-updated', loadAnalyticsData as EventListener);
    window.addEventListener('focus', loadAnalyticsData);

    return () => {
      window.removeEventListener('influencer-analytics-updated', loadAnalyticsData as EventListener);
      window.removeEventListener('focus', loadAnalyticsData);
    };
  }, [analyticsStorageKey]);

  const refreshProfile = async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/influencers/get-profile`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    });
    const result = await response.json();
    if (result.success) {
      applyProfileData(result.data);
      localStorage.setItem('influencer_user', JSON.stringify(result.data));
      window.dispatchEvent(new Event('auth-state-changed'));
    }
  };

  const toggleCategory = (id: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((categoryId) => categoryId !== id) : [...prev, id]
    );
  };

  // Save profile to API
  const handleSaveProfile = async () => {
    if (isSavingProfile) return;
    const token = localStorage.getItem('influencer_token');
    if (!token) return;
    try {
      setIsSavingProfile(true);
      if (profileImageFile) {
        const formData = new FormData();
        formData.append('profile_pic', profileImageFile);
        const imageResponse = await fetch(`${API_BASE_URL}/users/update-profile-picture`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });
        const imageResult = await imageResponse.json();
        if (!(imageResult.success || imageResponse.ok)) {
          toast.error(imageResult.message || 'Failed to update profile image');
          return;
        }
      }

      const phoneValue = parseMaybeNumber(editForm.phone);
      const countryValue = parseMaybeNumber(editForm.country);
      const cityValue = parseMaybeNumber(editForm.city);
      const priceStartValue = parseMaybeFloat(editForm.price_start);

      const profilePayload: Record<string, unknown> = {
        name: editForm.name.trim(),
        bio: editForm.bio.trim(),
        gender: editForm.gender || undefined,
        dob: editForm.date_of_birth || undefined,
        category_ids: selectedCategoryIds,
      };

      if (phoneValue !== undefined) {
        profilePayload.phone = phoneValue;
      } else if (editForm.phone.trim()) {
        profilePayload.phone = editForm.phone.trim();
      }

      if (countryValue !== undefined) {
        profilePayload.country = countryValue;
      } else if (editForm.country.trim()) {
        profilePayload.country = editForm.country.trim();
      }

      if (cityValue !== undefined) {
        profilePayload.city = cityValue;
      } else if (editForm.city.trim()) {
        profilePayload.city = editForm.city.trim();
      }

      if (priceStartValue !== undefined) {
        profilePayload.price_start = priceStartValue;
      }

      const profileResponse = await fetch(`${API_BASE_URL}/influencers/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(profilePayload),
      });

      const profileResult = await profileResponse.json();
      if (!(profileResult.success || profileResponse.ok)) {
        toast.error(profileResult.message || 'Failed to update profile');
        return;
      }

      const platformsPayload = buildNormalizedPlatformsPayload(platformForm);
      const existingPlatformsPayload = buildNormalizedPlatformsPayload(buildPlatformForm(userData?.social_accounts || []));
      const hasPlatformChanges = !arePlatformsEqual(platformsPayload, existingPlatformsPayload);

      if (hasPlatformChanges && platformsPayload.length > 0) {
        const platformsResponse = await fetch(`${API_BASE_URL}/influencers/update-platforms`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ platforms: platformsPayload }),
        });
        const platformsResult = await platformsResponse.json();
        if (!(platformsResult.success || platformsResponse.ok)) {
          toast.error(platformsResult.message || 'Failed to update influencer platforms');
          return;
        }
      }

      await refreshProfile(token);
      setProfileImageFile(null);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Server error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLogout = () => {
    clearInfluencerClientData();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('influencer_token');
    if (!token) {
      toast.error('Please login again');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmed) return;

    try {
      setIsDeletingAccount(true);
      const response = await fetch(`${API_BASE_URL}/users/delete-account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success || response.ok) {
        toast.success(result.message || 'Account deleted successfully');
        clearInfluencerClientData();
        navigate('/');
      } else {
        toast.error(result.message || 'Failed to delete account');
      }
    } catch {
      toast.error('Server error');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleProfileImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setProfileImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setProfileImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleChangePassword = async () => {
    const token = localStorage.getItem('influencer_token');
    if (!token) {
      toast.error('Please login again');
      return;
    }

    if (!passwordForm.currentPassword || !passwordForm.password || !passwordForm.confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    if (passwordForm.password !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setIsPasswordUpdating(true);
      const response = await fetch(`${API_BASE_URL}/users/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: passwordForm.currentPassword,
          new_password: passwordForm.password,
        }),
      });

      const result = await response.json();
      if (result.success || response.ok) {
        toast.success(result.message || 'Password changed successfully');
        setShowChangePasswordModal(false);
        setPasswordForm({ currentPassword: '', password: '', confirmPassword: '' });
      } else {
        toast.error(result.message || 'Failed to change password');
      }
    } catch {
      toast.error('Server error');
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  const filteredCountries = COUNTRIES.filter(c =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );
  const femalePct = Number(analyticsData.audienceGender.female) || 0;
  const malePct = Number(analyticsData.audienceGender.male) || 0;
  const otherPct = Number(analyticsData.audienceGender.other) || 0;
  const totalGenderPct = femalePct + malePct + otherPct;
  const joinedDateLabel = getJoinedDateLabel(userData);
  const overviewLocations = analyticsData.audienceLocation
    .filter((loc) => loc.country && (Number(loc.percentage) || 0) > 0)
    .slice(0, 4)
    .map((loc, index) => ({
      country: loc.country,
      pct: Number(loc.percentage) || 0,
      color: ['bg-yellow-400', 'bg-blue-400', 'bg-purple-400', 'bg-gray-400'][index] || 'bg-gray-400',
    }));
  const profileLocations = analyticsData.audienceLocation
    .filter((loc) => loc.country && (Number(loc.percentage) || 0) > 0)
    .slice(0, 4)
    .map((loc) => ({
      country: loc.country,
      pct: Number(loc.percentage) || 0,
      color: 'bg-primary',
    }));
  const profileAgeDistribution = analyticsData.audienceAge
    .filter((age) => age.range && (Number(age.percentage) || 0) > 0)
    .map((age) => ({
      range: age.range,
      pct: Number(age.percentage) || 0,
    }));
  const formatOverviewFollowers = (value: string | number) => {
    const raw = String(value ?? '').trim();
    if (!raw) return '-';
    if (/[kKmM]$/.test(raw)) return raw.replace('K', 'k').replace('M', 'M');
    const parsed = Number(raw.replace(/,/g, ''));
    if (!Number.isFinite(parsed)) return '-';
    if (parsed <= 0) return '-';
    if (parsed >= 1000000) return `${(parsed / 1000000).toFixed(1)}M`;
    if (parsed >= 1000) return `${Math.round(parsed / 1000)}k`;
    return String(Math.round(parsed));
  };
  const formatOverviewEngagement = (value: string | number) => {
    const raw = String(value ?? '').trim();
    if (!raw) return '-';
    return raw.endsWith('%') ? raw : `${raw}%`;
  };
  const socialPerformanceStats = [
    {
      name: 'Instagram',
      followers: formatOverviewFollowers(analyticsData.instagram.followers),
      engagement: formatOverviewEngagement(analyticsData.instagram.engagement),
      icon: Instagram,
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'YouTube',
      followers: formatOverviewFollowers(analyticsData.youtube.followers),
      engagement: formatOverviewEngagement(analyticsData.youtube.engagement),
      icon: Youtube,
      color: 'from-red-600 to-red-500',
    },
    {
      name: 'TikTok',
      followers: formatOverviewFollowers(analyticsData.tiktok.followers),
      engagement: formatOverviewEngagement(analyticsData.tiktok.engagement),
      icon: Video,
      color: 'from-gray-700 to-gray-800',
    },
    {
      name: 'Others',
      followers: formatOverviewFollowers(analyticsData.others.followers),
      engagement: formatOverviewEngagement(analyticsData.others.engagement),
      icon: ExternalLink,
      color: 'from-amber-500 to-yellow-500',
    },
  ];
  const parseEngagementValue = (value: string | number) => {
    const raw = String(value ?? '').trim().replace('%', '');
    if (!raw) return 0;
    const numeric = Number(raw);
    return Number.isFinite(numeric) && numeric > 0 ? numeric : 0;
  };
  const engagementValues = [
    parseEngagementValue(analyticsData.instagram.engagement),
    parseEngagementValue(analyticsData.youtube.engagement),
    parseEngagementValue(analyticsData.tiktok.engagement),
    parseEngagementValue(analyticsData.others.engagement),
  ].filter((value) => value > 0);
  const overviewEngagementRate = engagementValues.length
    ? `${(engagementValues.reduce((sum, value) => sum + value, 0) / engagementValues.length).toFixed(2)}%`
    : '0%';

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'campaigns', label: 'Campaigns', icon: Briefcase },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-950 pb-16 md:pb-0 [&_a]:cursor-pointer [&_button]:cursor-pointer">
      <Navbar />

      {/* Portal bar */}
      <div className="bg-black border-b border-gray-800 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-1 hover:bg-gray-800 rounded-lg">
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
            <span className="text-primary text-sm font-semibold">Influencers Portal</span>
          </div>
          <span className="text-gray-400 text-xs">Welcome, {userData?.name}</span>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-72 h-full bg-gray-950 border-r border-gray-800 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-800">
              <span className="text-primary font-bold text-lg">Influencers Portal</span>
            </div>
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} onClick={() => handleTabChange(item.id as TabType)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg transition-colors ${
                      activeTab === item.id ? 'bg-primary text-black' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                    }`}>
                    <Icon className="w-5 h-5" />
                    <span className="font-medium flex-1 text-left">{item.label}</span>
                  </button>
                );
              })}
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-red-400 hover:bg-gray-900 transition-colors mt-6">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className="w-56 min-h-[calc(100vh-88px)] bg-black border-r border-gray-800 py-6 px-3 flex-shrink-0">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} onClick={() => {
                    handleTabChange(item.id as TabType);
                  }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id ? 'bg-primary text-black font-semibold' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                    }`}>
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium flex-1 text-left text-sm">{item.label}</span>
                  </button>
                );
              })}
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-900 transition-colors mt-4">
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">

          {activeTab === 'overview' && (
  <div className="text-white">

    {/* ── TOP SECTION ── */}
    <div className="flex gap-4">

      {/* Left + Middle Content */}
      <div className="flex-1 min-w-0">

        {/* Welcome Header */}
        <div className="mb-5">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Welcome back, {userData.name}! 👋
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
            <span className="text-primary font-semibold">Beauty Creator</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">Skincare & Makeup Influencer</span>
            {userData.city && (
              <>
                <span className="text-gray-500">•</span>
                <span className="flex items-center gap-1 text-gray-400">
                  <MapPin className="w-3 h-3" />
                  {userData.city}{userData.country ? `, ${userData.country}` : ''}
                </span>
              </>
            )}
          </div>
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-400 text-sm">Categories:</span>
            {(userData.categories?.length > 0 ? userData.categories : [
              { name: 'Beauty' }, { name: 'Skincare' }, { name: 'Makeup' }, { name: 'Lifestyle' }
            ]).map((cat: any, i: number) => (
              <span key={i} className="px-3 py-1 bg-gray-800 border border-gray-700 text-white rounded-full text-xs font-medium">
                {cat.name || cat}
              </span>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Total Earnings', value: '$0', change: '0%', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10' },
            { label: 'Active Campaigns', value: '0', change: '0%', icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            { label: 'Total Reach', value: '0', change: '0%', icon: Eye, color: 'text-purple-400', bg: 'bg-purple-400/10' },
            { label: 'Engagement Rate', value: overviewEngagementRate, change: '0%', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-400/10' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className="text-xl font-bold text-white mb-0.5">{stat.value}</p>
                <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> {stat.change} vs last month
                </p>
              </div>
            );
          })}
        </div>

        {/* Recent Campaigns + Social Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

          {/* Recent Campaigns */}
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">Recent Campaigns</h2>
              <button onClick={() => setActiveTab('campaigns')} className="text-primary text-xs hover:underline flex items-center gap-1">
                View All →
              </button>
            </div>
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-white font-medium mb-1">No recent campaigns</p>
              <p className="text-xs text-gray-400">Campaign activity will appear here.</p>
            </div>
          </div>

          {/* Social Media Performance */}
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">Social Media Performance</h2>
              <button onClick={() => setActiveTab('analytics')} className="text-primary text-xs hover:underline">View All →</button>
            </div>
            {/* Platform Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
              {socialPerformanceStats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.name} className="bg-gray-800 rounded-lg p-3 text-center">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-2`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xs font-medium text-white mb-1">{s.name}</p>
                    <p className="text-base font-bold text-white">{s.followers}</p>
                    <p className="text-xs text-gray-500">Followers</p>
                    <p className="text-xs text-green-400 mt-1">↑ {s.engagement}</p>
                  </div>
                );
              })}
            </div>
            {/* Mini Chart */}
            <div className="relative h-28">
              <svg viewBox="0 0 300 80" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#eab308" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,60 C30,55 60,45 90,50 C120,55 150,35 180,30 C210,25 240,20 270,15 L300,10 L300,80 L0,80 Z"
                  fill="url(#chartGrad)" />
                <path d="M0,60 C30,55 60,45 90,50 C120,55 150,35 180,30 C210,25 240,20 270,15 L300,10"
                  fill="none" stroke="#eab308" strokeWidth="2" />
                {[[0,60],[90,50],[150,35],[180,30],[240,20],[300,10]].map(([x,y], i) => (
                  <circle key={i} cx={x} cy={y} r="3" fill="#eab308" />
                ))}
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-1">
                {['Jan','Feb','Mar','Apr','May','Jun'].map(m => <span key={m}>{m}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row — Messages + Earnings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Recent Messages */}
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">Recent Messages</h2>
              <button onClick={() => setActiveTab('messages')} className="text-primary text-xs hover:underline">View All →</button>
            </div>
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-white font-medium mb-1">No recent messages</p>
              <p className="text-xs text-gray-400">New conversations will appear here.</p>
            </div>
          </div>

          {/* Earnings Overview */}
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">Earnings Overview</h2>
              <button onClick={() => setActiveTab('earnings')} className="text-primary text-xs hover:underline">View All →</button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Total Earnings</p>
                <p className="text-xl font-bold text-white">$0</p>
                <p className="text-xs text-green-400 mt-1">↑ 0% this month</p>
              </div>
              <div className="space-y-2">
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-yellow-400 font-medium">Pending</p>
                  <p className="text-lg font-bold text-white">$0</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-blue-400 font-medium">Available</p>
                  <p className="text-lg font-bold text-white">$0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDEBAR — Profile Card + Audience ── */}
      <div className="w-72 flex-shrink-0 space-y-4 hidden lg:block">

        {/* Profile Card */}
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 text-center">
          {/* Avatar */}
          <div className="relative w-20 h-20 mx-auto mb-3">
            {profileImagePreview || userData.profile_pic ? (
              <img
                src={profileImagePreview || userData.profile_pic}
                alt={userData.name || 'Influencer'}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-700"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-black text-3xl font-bold">
                {userData.name?.[0]?.toUpperCase()}
              </div>
            )}
            <button onClick={() => setActiveTab('profile')}
              className="absolute bottom-0 right-0 w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center">
              <Edit className="w-3 h-3 text-white" />
            </button>
          </div>

          {/* Name + badge */}
          <div className="flex items-center justify-center gap-1 mb-1">
            <p className="font-bold text-white text-lg">{userData.name}</p>
            <span className="text-blue-400 text-sm">✓</span>
          </div>
          <p className="text-gray-400 text-xs mb-2">Beauty Creator</p>
          <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium mb-3">
            ▶ Beauty Influencer
          </span>
          <p className="text-gray-400 text-xs leading-relaxed mb-4">
            {userData.bio || 'I create content around beauty, skincare, makeup & lifestyle. Let\'s collaborate! ✨'}
          </p>

          {/* Info */}
          <div className="space-y-1.5 text-xs text-gray-400 text-left mb-4">
            {(userData.city || userData.country) && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-gray-500" />
                {userData.city}{userData.country ? `, ${userData.country}` : ''}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3 text-gray-500" />
              {userData.email}
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-3 h-3 text-gray-500" />
              {joinedDateLabel}
            </div>
          </div>

          {/* Categories */}
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-400 text-left mb-2">Categories</p>
            <div className="flex flex-wrap gap-1">
              {(userData.categories?.length > 0 ? userData.categories : [
                { name: 'Beauty' }, { name: 'Skincare' }, { name: 'Makeup' }, { name: 'Lifestyle' }
              ]).map((cat: any, i: number) => (
                <span key={i} className="px-2 py-0.5 bg-gray-800 border border-gray-700 text-gray-300 rounded-full text-xs">
                  {cat.name || cat}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Audience Snapshot */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm">Audience Snapshot</h3>
            <button onClick={() => setActiveTab('analytics')} className="text-primary text-xs hover:underline">View All →</button>
          </div>

          {/* Gender */}
          <p className="text-xs font-medium text-gray-400 mb-3">Gender</p>
          {totalGenderPct > 0 ? (
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                  <circle cx="18" cy="18" r="13" fill="none" stroke="#374151" strokeWidth="5" />
                  <circle cx="18" cy="18" r="13" fill="none" stroke="#ec4899" strokeWidth="5"
                    strokeDasharray={`${femalePct} ${Math.max(0, 100 - femalePct)}`} strokeLinecap="round" />
                  <circle cx="18" cy="18" r="13" fill="none" stroke="#3b82f6" strokeWidth="5"
                    strokeDasharray={`${malePct} ${Math.max(0, 100 - malePct)}`} strokeDashoffset={`-${femalePct}`} strokeLinecap="round" />
                  <circle cx="18" cy="18" r="13" fill="none" stroke="#f59e0b" strokeWidth="5"
                    strokeDasharray={`${otherPct} ${Math.max(0, 100 - otherPct)}`} strokeDashoffset={`-${femalePct + malePct}`} strokeLinecap="round" />
                </svg>
              </div>
              <div className="space-y-1.5">
                {femalePct > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-pink-500"></div>
                    <span className="text-white text-xs font-medium">{femalePct}% Female</span>
                  </div>
                )}
                {malePct > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                    <span className="text-white text-xs font-medium">{malePct}% Male</span>
                  </div>
                )}
                {otherPct > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <span className="text-white text-xs font-medium">{otherPct}% Other</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500 mb-4">No gender data yet</p>
          )}

          {/* Top Locations */}
          <p className="text-xs font-medium text-gray-400 mb-3">Top Locations</p>
          {overviewLocations.length === 0 ? (
            <p className="text-xs text-gray-500">No location data yet</p>
          ) : (
            overviewLocations.map((loc) => (
              <div key={loc.country} className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">{loc.country}</span>
                  <span className="text-white font-medium">{loc.pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full">
                  <div className={`h-1.5 ${loc.color} rounded-full`} style={{ width: `${loc.pct}%` }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  </div>
)}

          {/* ── PROFILE TAB ── */}
          {activeTab === 'profile' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">My Profile</h1>
                <button
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  disabled={isSavingProfile}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    isEditing ? 'bg-primary hover:bg-secondary text-black' : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                  } ${isSavingProfile ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <Edit className="w-4 h-4" />
                  {isEditing ? (isSavingProfile ? 'Saving...' : 'Save Profile') : 'Edit Profile'}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left — Profile Info */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    {/* Avatar + Name */}
                    <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-800">
                      <div className="relative flex-shrink-0">
                        {profileImagePreview || userData.profile_pic ? (
                          <img
                            src={profileImagePreview || userData.profile_pic}
                            alt={userData.name || 'Influencer'}
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-700"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-black text-3xl font-bold">
                            {userData.name?.[0]?.toUpperCase()}
                          </div>
                        )}
                        {isEditing && (
                          <button
                            onClick={() => profileImageInputRef.current?.click()}
                            type="button"
                            className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-black"
                          >
                            <Camera className="w-3 h-3" />
                          </button>
                        )}
                        <input
                          ref={profileImageInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleProfileImageSelect}
                          className="hidden"
                        />
                      </div>
                      <div className="flex-1">
                        {isEditing ? (
                          <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white text-lg font-bold mb-2" placeholder="Full Name" />
                        ) : (
                          <h2 className="text-xl font-bold text-white mb-1">{userData.name}</h2>
                        )}
                        <p className="text-sm text-gray-400">Content Creator & Influencer</p>
                        {isEditing && profileImageFile && (
                          <p className="text-xs text-primary mt-2">{profileImageFile.name}</p>
                        )}
                      </div>
                    </div>

                    {/* Profile Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
                        <p className="text-white text-sm bg-gray-800 rounded-lg px-3 py-2.5">{userData.email}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone</label>
                        {isEditing ? (
                          <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white" placeholder="+1 (555) 000-0000" type="tel" />
                        ) : (
                          <p className="text-white text-sm bg-gray-800 rounded-lg px-3 py-2.5">{userData.phone || 'Not provided'}</p>
                        )}
                      </div>

                      {/* ✅ Country with dropdown + search */}
                      <div className="relative">
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Country</label>
                        {isEditing ? (
                          <div className="relative">
                            <Input
                              value={editForm.country}
                              onChange={(e) => {
                                setEditForm({ ...editForm, country: e.target.value });
                                setCountrySearch(e.target.value);
                                setShowCountryDropdown(true);
                              }}
                              onFocus={() => setShowCountryDropdown(true)}
                              className="bg-gray-800 border-gray-700 text-white"
                              placeholder="Type or select country"
                            />
                            {showCountryDropdown && filteredCountries.length > 0 && (
                              <div className="absolute top-full left-0 right-0 z-50 bg-gray-800 border border-gray-700 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-xl">
                                {filteredCountries.map((country) => (
                                  <button key={country} type="button"
                                    onClick={() => {
                                      setEditForm({ ...editForm, country });
                                      setCountrySearch(country);
                                      setShowCountryDropdown(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-white text-sm hover:bg-gray-700 transition-colors">
                                    {country}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-white text-sm bg-gray-800 rounded-lg px-3 py-2.5">{userData.country || 'Not provided'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">City</label>
                        {isEditing ? (
                          <Input value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white" placeholder="City" />
                        ) : (
                          <p className="text-white text-sm bg-gray-800 rounded-lg px-3 py-2.5">{userData.city || 'Not provided'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Gender</label>
                        {isEditing ? (
                          <select
                            value={editForm.gender}
                            onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        ) : (
                          <p className="text-white text-sm bg-gray-800 rounded-lg px-3 py-2.5 capitalize">
                            {userData.gender ? String(userData.gender).replaceAll('_', ' ') : 'Not provided'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Date of Birth</label>
                        {isEditing ? (
                          <Input
                            value={normalizeDateInput(editForm.date_of_birth)}
                            onChange={(e) => setEditForm({ ...editForm, date_of_birth: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-90 [&::-webkit-calendar-picker-indicator]:sepia [&::-webkit-calendar-picker-indicator]:saturate-[8] [&::-webkit-calendar-picker-indicator]:hue-rotate-[345deg]"
                            type="date"
                          />
                        ) : (
                          <p className="text-white text-sm bg-gray-800 rounded-lg px-3 py-2.5">
                            {normalizeDateInput(userData.date_of_birth || userData.dob || '') || 'Not provided'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Base Price (USD)</label>
                        {isEditing ? (
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                            <Input
                              value={editForm.price_start}
                              onChange={(e) => setEditForm({ ...editForm, price_start: e.target.value })}
                              className="bg-gray-800 border-gray-700 text-white pl-8"
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                            />
                          </div>
                        ) : (
                          <p className="text-white text-sm bg-gray-800 rounded-lg px-3 py-2.5">
                            {(userData.price_start != null && userData.price_start !== '')
                              ? `$${userData.price_start}`
                              : (userData.base_price != null && userData.base_price !== '')
                                ? `$${userData.base_price}`
                                : (editForm.price_start ? `$${editForm.price_start}` : 'Not provided')}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Bio</label>
                      {isEditing ? (
                        <textarea rows={4} value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          placeholder="Tell brands about yourself..." />
                      ) : (
                        <p className="text-white text-sm bg-gray-800 rounded-lg px-3 py-2.5 leading-relaxed">
                          {userData.bio || 'No bio added yet.'}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-400 mb-2">Categories</label>
                      {isEditing ? (
                        <div className="flex flex-wrap gap-2">
                          {apiCategories.map((category) => (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() => toggleCategory(category.id)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                selectedCategoryIds.includes(category.id)
                                  ? 'bg-primary text-black border-primary'
                                  : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500'
                              }`}
                            >
                              {category.name}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {(userData.categories?.length > 0 ? userData.categories : []).map((cat: any, i: number) => (
                            <span key={i} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                              {cat.name || cat}
                            </span>
                          ))}
                          {(!userData.categories || userData.categories.length === 0) && (
                            <p className="text-white text-sm bg-gray-800 rounded-lg px-3 py-2.5">No categories selected</p>
                          )}
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex gap-3 pt-4 border-t border-gray-800">
                        <button
                          onClick={handleSaveProfile}
                          disabled={isSavingProfile}
                          className={`flex-1 bg-primary hover:bg-secondary text-black font-semibold py-2.5 rounded-lg transition-colors text-sm ${
                            isSavingProfile ? 'opacity-60 cursor-not-allowed' : ''
                          }`}
                        >
                          {isSavingProfile ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button onClick={resetEditState}
                          disabled={isSavingProfile}
                          className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Connected Social Accounts */}
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <h3 className="font-bold text-white mb-4">Social Media Accounts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {PLATFORM_CONFIG.map((social) => {
                        const Icon = social.icon;
                        const account = userData.social_accounts?.find((s: any) => Number(s.platform_id) === social.platformId);
                        return (
                          <div key={social.platformId} className="flex items-center gap-3 bg-gray-800 rounded-lg p-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${social.color} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-white text-sm">{social.name}</p>
                              <p className="text-xs text-gray-400 truncate">{account?.profile_url || 'Not connected'}</p>
                            </div>
                            {account && (
                              <a href={account.profile_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 text-gray-400 hover:text-primary" />
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-4">
                  {/* Audience Insights */}
                  <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                    <h3 className="font-bold text-white mb-4">Audience Insights</h3>
                    {totalGenderPct > 0 ? (
                      <>
                        <div className="flex items-center justify-center mb-4">
                          <div className="relative w-24 h-24">
                            <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#374151" strokeWidth="3" />
                              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#a855f7" strokeWidth="3"
                                strokeDasharray={`${femalePct} ${Math.max(0, 100 - femalePct)}`} strokeLinecap="round" />
                              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3b82f6" strokeWidth="3"
                                strokeDasharray={`${malePct} ${Math.max(0, 100 - malePct)}`} strokeDashoffset={`-${femalePct}`} strokeLinecap="round" />
                              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f59e0b" strokeWidth="3"
                                strokeDasharray={`${otherPct} ${Math.max(0, 100 - otherPct)}`} strokeDashoffset={`-${femalePct + malePct}`} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs text-gray-400 text-center">Gender</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-center gap-4 text-sm mb-4 flex-wrap">
                          {femalePct > 0 && <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-purple-500"></div><span className="text-white">{femalePct}% Female</span></div>}
                          {malePct > 0 && <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-white">{malePct}% Male</span></div>}
                          {otherPct > 0 && <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-500"></div><span className="text-white">{otherPct}% Other</span></div>}
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500 mb-4">No gender data yet</p>
                    )}
                    <h4 className="font-medium text-white text-sm mb-3">Top Locations</h4>
                    {profileLocations.length === 0 ? (
                      <p className="text-sm text-gray-500">No location data yet</p>
                    ) : (
                      profileLocations.map((loc) => (
                        <div key={loc.country} className="mb-2">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>{loc.country}</span><span>{loc.pct}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-700 rounded-full">
                            <div className="h-1.5 bg-primary rounded-full" style={{ width: `${loc.pct}%` }} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                    <h3 className="font-bold text-white mb-4">Audience Age</h3>
                    {profileAgeDistribution.length === 0 ? (
                      <p className="text-sm text-gray-500">No age data yet</p>
                    ) : (
                      <div className="space-y-2">
                        {profileAgeDistribution.map((age) => (
                          <div key={age.range} className="mb-1">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>{age.range}</span>
                              <span>{age.pct}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-700 rounded-full">
                              <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: `${age.pct}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ── CAMPAIGNS TAB ── */}
          {activeTab === 'campaigns' && (
            <div>
              <div className="flex items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Campaigns</h1>
              </div>

              {/* Sub tabs */}
              <div className="flex gap-2 mb-6 bg-gray-900 rounded-lg p-1 w-fit">
                {(['available', 'applied', 'ongoing', 'completed'] as const).map((tab) => (
                  <button key={tab} onClick={() => setCampaignsSubTab(tab)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                      campaignsSubTab === tab ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
                    }`}>
                    {tab}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-3">
                  {mockCampaigns.filter(c =>
                    campaignsSubTab === 'available' ? c.status === 'available' :
                    campaignsSubTab === 'applied' ? c.status === 'applied' :
                    campaignsSubTab === 'ongoing' ? c.status === 'ongoing' : c.status === 'completed'
                  ).length === 0 ? (
                    <div className="bg-gray-900 rounded-xl p-12 border border-gray-800 text-center">
                      <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-white font-medium mb-2">No {campaignsSubTab} campaigns</p>
                      <p className="text-gray-400 text-sm">
                        {campaignsSubTab === 'available' ? 'Check back later for new campaigns' : 'No campaigns in this category yet'}
                      </p>
                    </div>
                  ) : (
                    mockCampaigns.filter(c => c.status === campaignsSubTab || (campaignsSubTab === 'available' && c.status === 'available')).map((campaign) => (
                      <div key={campaign.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {campaign.logo}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-bold text-white">{campaign.brand}</h3>
                                <p className="text-sm text-gray-400">{campaign.description}</p>
                              </div>
                              <p className="text-primary font-bold text-sm flex-shrink-0">{campaign.budget}</p>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              <span className="px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-xs">{campaign.category}</span>
                              <span className="px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-xs flex items-center gap-1">
                                <Instagram className="w-3 h-3" />{campaign.platform}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                          <div className="flex items-center gap-1 text-green-400 text-xs">
                            <Check className="w-3 h-3" />
                            Matches your category ({campaign.matchCategory})
                          </div>
                          {campaignsSubTab === 'available' && (
                            <button className="bg-primary hover:bg-secondary text-black text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors">
                              Apply
                            </button>
                          )}
                          {campaignsSubTab === 'ongoing' && (
                            <span className="bg-blue-900 text-blue-300 text-xs px-3 py-1 rounded-full">In Progress</span>
                          )}
                          {campaignsSubTab === 'applied' && (
                            <span className="bg-yellow-900 text-yellow-300 text-xs px-3 py-1 rounded-full">Pending Review</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Rate Card + Audience sidebar hidden for now */}
                {false && (
                <div className="space-y-4">
                  <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                    <h3 className="font-bold text-white mb-3">Rate Card</h3>
                    {[{ type: 'Reel', price: '₹5,000', icon: '▶' }, { type: 'Post', price: '₹8,000', icon: '📷' }].map((r) => (
                      <div key={r.type} className="flex items-center justify-between bg-gray-800 rounded-lg p-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{r.icon}</span>
                          <span className="text-white text-sm font-medium">{r.type}</span>
                        </div>
                        <span className="text-primary font-bold text-sm">{r.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                    <h3 className="font-bold text-white mb-3">Audience Insights</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-16 h-16 relative flex-shrink-0">
                        <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#374151" strokeWidth="4" />
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#a855f7" strokeWidth="4" strokeDasharray={`${femalePct} ${Math.max(0, 100 - femalePct)}`} />
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray={`${malePct} ${Math.max(0, 100 - malePct)}`} strokeDashoffset={`-${femalePct}`} />
                        </svg>
                      </div>
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-white mb-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div>{femalePct}% Female</div>
                        <div className="flex items-center gap-1 text-white"><div className="w-2 h-2 rounded-full bg-blue-500"></div>{malePct}% Male</div>
                      </div>
                    </div>
                    <h4 className="text-xs font-medium text-gray-400 mb-2">Top Locations</h4>
                    {profileLocations.slice(0, 3).map((loc) => (
                      <div key={loc.country} className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs text-gray-400 w-24">{loc.country}</span>
                        <div className="flex-1 h-1.5 bg-gray-700 rounded-full">
                          <div className="h-1.5 bg-primary rounded-full" style={{ width: `${loc.pct}%` }} />
                        </div>
                        <span className="text-xs text-white w-8 text-right">{loc.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                )}
              </div>
            </div>
          )}

          {/* ── EARNINGS TAB ── */}
          {activeTab === 'earnings' && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-6">Earnings</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Total Earnings', value: '$0', sub: 'No earnings yet', color: 'text-green-400' },
                  { label: 'Pending', value: '$0', sub: 'Awaiting payment', color: 'text-yellow-400' },
                  { label: 'Available', value: '$0', sub: 'Ready to withdraw', color: 'text-blue-400' },
                ].map((e) => (
                  <div key={e.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                    <p className="text-gray-400 text-sm mb-1">{e.label}</p>
                    <p className={`text-2xl font-bold ${e.color} mb-1`}>{e.value}</p>
                    <p className="text-xs text-gray-500">{e.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MESSAGES TAB ── */}
          {activeTab === 'messages' && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-4">Messages</h1>
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-10 text-center">
                <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-white font-medium mb-1">No messages yet</p>
                <p className="text-sm text-gray-400">Your chats with brands will appear here.</p>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS TAB ── */}
          {activeTab === 'notifications' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Notifications</h1>
                <button className="text-primary text-sm hover:underline opacity-50 cursor-not-allowed" disabled>
                  Mark all as read
                </button>
              </div>
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-10 text-center">
                <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-white font-medium mb-1">No notifications yet</p>
                <p className="text-sm text-gray-400">You will see new updates here.</p>
              </div>
            </div>
          )}

          {/* ── ANALYTICS TAB ── */}
          {activeTab === 'analytics' && (
            <InfluencerAnalytics />
          )}

          {/* ── SETTINGS TAB ── */}
          {activeTab === 'settings' && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Account Settings */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="font-bold text-white mb-4">Account Settings</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div><p className="text-white text-sm font-medium">Account Type</p></div>
                      <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs">Creator</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div><p className="text-white text-sm">Email Notifications</p></div>
                      <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div><p className="text-white text-sm">Campaign Updates</p></div>
                      <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Security */}
                  <h3 className="font-bold text-white mb-3">Security</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowChangePasswordModal(true)}
                      className="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <span className="text-white text-sm">Change Password</span>
                      <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                      <span className="text-white text-sm">Two-Factor Authentication</span>
                      <span className="text-green-400 text-xs">Enabled</span>
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-gray-900 rounded-xl p-6 border border-red-900">
                  <h3 className="font-bold text-red-400 mb-2 flex items-center gap-2">⚠️ Danger Zone</h3>
                  <p className="text-gray-400 text-sm mb-4">Permanent actions cannot be undone.</p>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeletingAccount}
                    className="bg-red-950 border border-red-700 text-red-400 hover:bg-red-900 font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors w-full disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isDeletingAccount ? 'Deleting...' : 'Delete Account'}
                  </button>
                </div>
              </div>

              {showChangePasswordModal && (
                <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
                    <div className="flex items-center justify-between p-6 border-b border-gray-800">
                      <h2 className="text-xl font-bold text-white">Change Password</h2>
                      <button
                        onClick={() => {
                          setShowChangePasswordModal(false);
                          setPasswordForm({ currentPassword: '', password: '', confirmPassword: '' });
                        }}
                        className="p-2 hover:bg-gray-800 rounded-lg"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                        <Input
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          type="password"
                          className="bg-gray-800 border-gray-700 text-white"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                        <Input
                          value={passwordForm.password}
                          onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                          type="password"
                          className="bg-gray-800 border-gray-700 text-white"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
                        <Input
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          type="password"
                          className="bg-gray-800 border-gray-700 text-white"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 p-6 border-t border-gray-800">
                      <button
                        onClick={handleChangePassword}
                        disabled={isPasswordUpdating}
                        className="flex-1 bg-primary hover:bg-secondary text-black font-semibold py-2.5 rounded-lg transition-colors"
                      >
                        {isPasswordUpdating ? 'Updating...' : 'Update Password'}
                      </button>
                      <button
                        onClick={() => {
                          setShowChangePasswordModal(false);
                          setPasswordForm({ currentPassword: '', password: '', confirmPassword: '' });
                        }}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
          <div className="grid grid-cols-5 gap-1">
            {[
              { id: 'overview', label: 'Home', icon: LayoutDashboard },
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'campaigns', label: 'Campaigns', icon: Briefcase },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} onClick={() => handleTabChange(item.id as TabType)}
                  className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                    activeTab === item.id ? 'text-primary' : 'text-gray-500'
                  }`}>
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
