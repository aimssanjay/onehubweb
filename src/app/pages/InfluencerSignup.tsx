import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Instagram, Youtube, Linkedin, Video, Check, ArrowRight, ArrowLeft, Eye, EyeOff, Search, Tag,
  Clapperboard, Mountain, PawPrint, Camera, Palette, PersonStanding, Car, Flower2, Newspaper, Music,
  Smile, GraduationCap, Briefcase, CalendarDays, Users, Shirt, Utensils, Coffee, Gamepad2, Dumbbell,
  HeartPulse, ShieldPlus, Mic, Leaf, Sparkles, User, Music2, Podcast, Star, Droplet, Cpu, Plane,
  Crown, Zap, BarChart3, Mail, Phone, Lock,
} from 'lucide-react';
import { usePlatforms } from '../hooks/usePlatforms';
import { useCategories } from '../hooks/useCategories';
import { API_BASE_URL, API_ENDPOINTS } from '../../services/api';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;

const isEmail = (value: string) => EMAIL_REGEX.test(value.trim());
const isPhone = (value: string) => PHONE_REGEX.test(value.trim());

// lucide has no TikTok logo, so draw it inline
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

type PlatformStyle = {
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
  subtitle: string;
  tile: string;    // background of the logo tile
};

const platformMeta: Record<string, PlatformStyle> = {
  Instagram: {
    icon: Instagram,
    placeholder: 'https://instagram.com/yourusername',
    subtitle: 'Add your profile URL',
    tile: 'bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5]',
  },
  YouTube: {
    icon: Youtube,
    placeholder: 'https://youtube.com/channel/yourchannelname',
    subtitle: 'Add your channel URL',
    tile: 'bg-[#FF0000]',
  },
  TikTok: {
    icon: TikTokIcon,
    placeholder: 'https://tiktok.com/@yourusername',
    subtitle: 'Add your profile URL',
    tile: 'bg-black',
  },
  LinkedIn: {
    icon: Linkedin,
    placeholder: 'https://linkedin.com/in/yourusername',
    subtitle: 'Add your profile URL',
    tile: 'bg-[#0A66C2]',
  },
};
const defaultPlatformMeta: PlatformStyle = {
  icon: Video,
  placeholder: 'https://example.com/yourprofile',
  subtitle: 'Add your portfolio URL',
  tile: 'bg-slate-500',
};

const isValidUrl = (value: string) => {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

// Icon and colour for each category card, matched by category name; unknown names fall back to a tag icon
const categoryMeta: Record<string, { icon: React.ComponentType<any>; color: string }> = {
  'Actor': { icon: Clapperboard, color: 'bg-violet-50 text-violet-600' },
  'Adventure & Outdoors': { icon: Mountain, color: 'bg-green-50 text-green-600' },
  'Animals & Pets': { icon: PawPrint, color: 'bg-orange-50 text-orange-500' },
  'Art & Photography': { icon: Camera, color: 'bg-pink-50 text-pink-500' },
  'Art Educator': { icon: Palette, color: 'bg-purple-50 text-purple-600' },
  'Athlete & Sports': { icon: PersonStanding, color: 'bg-blue-50 text-blue-600' },
  'Automotive': { icon: Car, color: 'bg-red-50 text-red-500' },
  'Beauty': { icon: Flower2, color: 'bg-rose-50 text-rose-500' },
  'Blogger': { icon: Newspaper, color: 'bg-sky-50 text-sky-600' },
  'Choreography': { icon: Music, color: 'bg-fuchsia-50 text-fuchsia-600' },
  'Comedy & Entertainment': { icon: Smile, color: 'bg-yellow-50 text-yellow-500' },
  'Content Creator': { icon: Video, color: 'bg-red-50 text-red-500' },
  'Education': { icon: GraduationCap, color: 'bg-blue-50 text-blue-600' },
  'Entrepreneur & Business': { icon: Briefcase, color: 'bg-amber-50 text-amber-700' },
  'Events': { icon: CalendarDays, color: 'bg-violet-50 text-violet-600' },
  'Family & Children': { icon: Users, color: 'bg-green-50 text-green-600' },
  'Fashion': { icon: Shirt, color: 'bg-pink-50 text-pink-500' },
  'Food': { icon: Utensils, color: 'bg-orange-50 text-orange-500' },
  'Food & Drink': { icon: Coffee, color: 'bg-amber-50 text-amber-700' },
  'Gaming': { icon: Gamepad2, color: 'bg-blue-50 text-blue-600' },
  'Gym': { icon: Dumbbell, color: 'bg-teal-50 text-teal-600' },
  'Health & Fitness': { icon: HeartPulse, color: 'bg-red-50 text-red-500' },
  'Healthcare': { icon: ShieldPlus, color: 'bg-emerald-50 text-emerald-600' },
  'Journalist': { icon: Mic, color: 'bg-purple-50 text-purple-600' },
  'Lifestyle': { icon: Leaf, color: 'bg-green-50 text-green-600' },
  'Makeup': { icon: Sparkles, color: 'bg-pink-50 text-pink-500' },
  'Model': { icon: User, color: 'bg-violet-50 text-violet-600' },
  'Music & Dance': { icon: Music2, color: 'bg-blue-50 text-blue-600' },
  'Podcast': { icon: Podcast, color: 'bg-amber-50 text-amber-500' },
  'Public Figure': { icon: Star, color: 'bg-yellow-50 text-yellow-500' },
  'Skincare': { icon: Droplet, color: 'bg-teal-50 text-teal-600' },
  'Technology': { icon: Cpu, color: 'bg-indigo-50 text-indigo-600' },
  'Travel': { icon: Plane, color: 'bg-sky-50 text-sky-600' },
};
const defaultCategoryMeta = { icon: Tag, color: 'bg-gray-100 text-gray-600' };

export function InfluencerSignup() {
  const navigate = useNavigate();
  const { platforms: apiPlatforms } = usePlatforms();
  const { categories: apiCategories } = useCategories();
  const [categorySearch, setCategorySearch] = useState('');

  const categories = apiCategories.map((c) => ({
    id: c.id,
    name: c.name,
    ...(categoryMeta[c.name] ?? defaultCategoryMeta),
  }));
  const categoryQuery = categorySearch.trim().toLowerCase();
  const visibleCategories = categoryQuery
    ? categories.filter((c) => c.name.toLowerCase().includes(categoryQuery))
    : categories;

  // Keep the catch-all "UGC / Other" card last, after any newly added platforms
  const isOtherPlatform = (name: string) => name.toLowerCase().includes('other');
  // LinkedIn is shown even before it exists in the platforms table; the backend creates it on final submit
  const platformList: { id: number | null; name: string }[] = [...apiPlatforms];
  if (!platformList.some((p) => p.name.toLowerCase() === 'linkedin')) {
    platformList.push({ id: null, name: 'LinkedIn' });
  }
  const socialPlatforms = platformList
    .sort((a, b) => Number(isOtherPlatform(a.name)) - Number(isOtherPlatform(b.name)))
    .map((p) => ({
    id: p.name.toLowerCase(),
    name: p.name,
    ...(platformMeta[p.name] ?? defaultPlatformMeta),
  }));

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [socialAccounts, setSocialAccounts] = useState<Record<string, string>>({});
  const [primaryPlatform, setPrimaryPlatform] = useState<string | null>(null);
  const [urlErrors, setUrlErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  // Both consents are mandatory before Complete Signup
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePromotional, setAgreePromotional] = useState(false);
  // Set once the account is created on final submit, so a retry doesn't register twice
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSocialAccountChange = (platformId: string, value: string) => {
    setSocialAccounts(prev => ({ ...prev, [platformId]: value }));
    setUrlErrors(prev => ({ ...prev, [platformId]: '' }));
    // The first account filled in becomes primary unless one was already chosen
    if (value.trim() && !primaryPlatform) setPrimaryPlatform(platformId);
  };

  // Only one account can be primary; it needs a URL first
  const handleSetPrimary = (platformId: string) => {
    if (!(socialAccounts[platformId] || '').trim()) {
      setUrlErrors(prev => ({ ...prev, [platformId]: 'Add a URL before setting this as primary' }));
      document.getElementById(`social-url-${platformId}`)?.focus();
      return;
    }
    setPrimaryPlatform(platformId);
  };


  // ── STEP 1: Validate account details (kept in state, nothing saved yet) ──
  const handleAccountNext = () => {
    if (!isEmail(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }
    if (!isPhone(formData.phone)) {
      alert('Please enter a valid phone number');
      return;
    }
    setStep(2);
  };

  // ── STEP 2: Validate categories (kept in state, nothing saved yet) ──
  const handleCategoriesNext = () => {
    if (selectedCategories.length === 0) {
      alert('Please select at least one category');
      return;
    }
    setStep(3);
  };

  // ── STEP 3: Final submit — only now is anything saved (register → categories → social accounts) ──
  const handleSubmit = async () => {
    if (!agreeTerms || !agreePromotional) {
      alert('Please accept the NOC Agreement and Promotional Updates to complete signup.');
      return;
    }

    const filledAccounts = Object.entries(socialAccounts)
      .filter(([_, url]) => url.trim() !== '')
      .map(([platformId, url]) => ({
        platformId,
        platform: platformList.find(p => p.name.toLowerCase() === platformId.toLowerCase()),
        url: url.trim(),
      }));

    const invalid = filledAccounts.find(({ url }) => !isValidUrl(url));
    if (invalid) {
      setUrlErrors(prev => ({ ...prev, [invalid.platformId]: 'Enter a full URL starting with https://' }));
      alert(`Please enter a valid ${invalid.platform?.name ?? ''} URL (starting with https://)`);
      return;
    }

    if (primaryPlatform && !filledAccounts.some(({ platformId }) => platformId === primaryPlatform)) {
      alert('Please add a URL for your primary account, or choose a different primary account.');
      return;
    }

    const accountsArray = filledAccounts
      .filter(({ platform }) => platform?.id)
      // Primary account goes first in the list as well
      .sort((a, b) => Number(b.platformId === primaryPlatform) - Number(a.platformId === primaryPlatform))
      .map(({ platform, url }) => ({
        platform_id: platform!.id,
        profile_url: url,
        username: url,
      }));

    if (accountsArray.length === 0) {
      alert(
        filledAccounts.length > 0
          ? 'LinkedIn cannot be saved yet. Please add at least one other social account.'
          : 'Please add at least one social account'
      );
      return;
    }

    // LinkedIn is not in the live platforms list yet, so it has no platform_id to save with
    const unsupported = filledAccounts.filter(({ platform }) => !platform?.id);
    if (
      unsupported.length > 0 &&
      !confirm(`${unsupported.map(({ platform }) => platform?.name).join(', ')} cannot be saved yet. Continue without it?`)
    ) {
      return;
    }

    // Saved on the user as primary_platform_id; falls back to the first saved account if none was chosen
    const primaryPlatformId =
      platformList.find(p => p.name.toLowerCase() === primaryPlatform)?.id ?? accountsArray[0].platform_id;
    if (primaryPlatform && !platformList.find(p => p.name.toLowerCase() === primaryPlatform)?.id) {
      alert('This platform cannot be set as primary yet. Please choose another primary account.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create the user (skipped on retry if it already succeeded)
      let token = authToken;
      if (!token) {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTER}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            password: formData.password,
            user_type_id: 3,
            terms_accepted: agreeTerms ? 1 : 0,
            promotional_updates_consent: agreePromotional ? 1 : 0,
            primary_platform_id: primaryPlatformId,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          alert(data.message || 'Signup failed');
          return;
        }
        token = data.token || data.access_token || data.data?.token || data.data?.access_token;
        if (!token) {
          alert('Registration succeeded but no token was returned. Please sign in.');
          navigate('/influencer/login');
          return;
        }
        localStorage.setItem('influencer_token', token);
        setAuthToken(token);
      }

      const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      // 2. Save categories
      const categoriesResponse = await fetch(`${API_BASE_URL}/influencers/update-categories`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ category_ids: selectedCategories }),
      });
      if (!categoriesResponse.ok) {
        const data = await categoriesResponse.json();
        alert(`${data.message || 'Failed to save categories'}. Your account was created — please click Complete Signup again.`);
        return;
      }

      // 3. Save social accounts
      const socialsResponse = await fetch(`${API_BASE_URL}/influencers/add-social-account`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ accounts: accountsArray }),
      });
      if (!socialsResponse.ok) {
        const data = await socialsResponse.json();
        alert(`${data.message || 'Failed to save social accounts'}. Your account was created — please click Complete Signup again.`);
        return;
      }

      navigate('/influencer/dashboard');
    } catch (error) {
      console.error('Signup Error:', error);
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Soft background shapes on the account step */}
      {step === 1 && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border-[48px] border-amber-50" />
          <div className="absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full border-[56px] border-amber-50" />
        </div>
      )}

      <div className={`relative ${step === 2 ? 'max-w-7xl' : step === 3 ? 'max-w-6xl' : 'max-w-3xl'} mx-auto px-4 sm:px-6 lg:px-8 py-10`}>

        {/* Progress Indicator (step 3 shows its own inside the card) */}
        <div className={`mx-auto mb-6 flex max-w-sm items-start justify-between ${step === 3 ? 'hidden' : ''}`}>
          {['Account', 'Categories', 'Connect'].map((label, index) => {
            const stepNumber = index + 1;
            const done = step > stepNumber;
            const active = step === stepNumber;
            return (
              <div key={label} className="relative flex flex-1 flex-col items-center">
                {index > 0 && (
                  <span className={`absolute right-1/2 top-4 h-0.5 w-full -translate-y-1/2 ${step >= stepNumber ? 'bg-primary' : 'bg-gray-200'}`} />
                )}
                <span
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    done || active ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {done ? <Check className="h-4 w-4" strokeWidth={3} /> : stepNumber}
                </span>
                <span className={`mt-1.5 text-xs ${active ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>{label}</span>
              </div>
            );
          })}
        </div>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Create Your Influencer Account</h1>
                <p className="mt-1 text-sm text-gray-500">Join thousands of creators earning with brands.</p>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 sm:max-w-[260px]">
                <Crown className="h-7 w-7 shrink-0 fill-amber-400 text-amber-500" />
                <p className="text-xs leading-snug text-gray-700">Create your profile and start collaborating with top brands.</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { key: 'fullName', label: 'Full Name', type: 'text', icon: User, placeholder: 'Enter your full name', autoComplete: 'name' },
                { key: 'email', label: 'Email Address', type: 'email', icon: Mail, placeholder: 'you@example.com', autoComplete: 'email' },
                { key: 'phone', label: 'Phone Number', type: 'tel', icon: Phone, placeholder: '+91 9876543210', autoComplete: 'tel' },
              ].map(({ key, label, type, icon: FieldIcon, placeholder, autoComplete }) => (
                <div key={key}>
                  <label htmlFor={`signup-${key}`} className="mb-1.5 block text-sm font-medium text-gray-800">{label}</label>
                  <div className="relative">
                    <FieldIcon className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                    <Input
                      id={`signup-${key}`}
                      type={type}
                      autoComplete={autoComplete}
                      placeholder={placeholder}
                      value={formData[key as 'fullName' | 'email' | 'phone']}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className="h-11 border-gray-200 bg-white pl-11 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              ))}

              {[
                { key: 'password', label: 'Password', placeholder: 'Create a strong password', show: showPassword, toggle: setShowPassword },
                { key: 'confirmPassword', label: 'Confirm Password', placeholder: 'Re-enter your password', show: showConfirmPassword, toggle: setShowConfirmPassword },
              ].map(({ key, label, placeholder, show, toggle }) => (
                <div key={key}>
                  <label htmlFor={`signup-${key}`} className="mb-1.5 block text-sm font-medium text-gray-800">{label}</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                    <Input
                      id={`signup-${key}`}
                      type={show ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder={placeholder}
                      value={formData[key as 'password' | 'confirmPassword']}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className="h-11 border-gray-200 bg-white pl-11 pr-11 text-gray-900 placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => toggle((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition-colors hover:text-gray-700"
                      aria-label={show ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
                    >
                      {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              ))}

              <Button
                onClick={handleAccountNext}
                disabled={!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password || formData.password !== formData.confirmPassword}
                className="mt-2 h-11 w-full gap-2 bg-primary font-semibold text-white hover:bg-secondary"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-3 pt-1">
                <span className="h-px flex-1 bg-gray-200" />
                <p className="whitespace-nowrap text-sm text-gray-500">
                  Already have an account?{' '}
                  <a href="/influencer/login" className="font-semibold text-primary hover:underline">Sign in</a>
                </p>
                <span className="h-px flex-1 bg-gray-200" />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-4 sm:p-5">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Select Your Primary Categories</h1>
              <p className="mt-1 text-[13px] text-gray-500">
                Choose all categories that apply to your content. This helps us show your profile to the right audience.
              </p>

              <div className="relative mt-4 mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder="Search categories... (e.g. Fashion, Travel, Fitness, Beauty)"
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>

              {visibleCategories.length === 0 ? (
                <p className="py-8 text-center text-[13px] text-gray-500">No categories match "{categorySearch}"</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2">
                  {visibleCategories.map((category) => {
                    const Icon = category.icon;
                    const selected = selectedCategories.includes(category.id);
                    return (
                      <button
                        type="button"
                        key={category.id}
                        onClick={() => toggleCategory(category.id)}
                        aria-pressed={selected}
                        title={category.name}
                        className={`flex items-center gap-2 min-h-11 py-1.5 px-2.5 rounded-lg border text-left cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                          selected
                            ? 'border-amber-300 bg-amber-50/70'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <span className={`flex items-center justify-center w-7 h-7 shrink-0 rounded-md ${category.color}`}>
                          <Icon className="w-[18px] h-[18px]" />
                        </span>
                        {/* Long names wrap to a second line instead of being cut off */}
                        <span className="flex-1 min-w-0 text-[12.5px] font-medium leading-tight text-gray-800 break-words">
                          {category.name}
                        </span>
                        <span
                          className={`flex items-center justify-center w-4 h-4 shrink-0 rounded border transition-colors ${
                            selected ? 'bg-primary border-primary text-white' : 'border-gray-300 bg-white'
                          }`}
                        >
                          {selected && <Check className="w-3 h-3" strokeWidth={3} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-gray-100">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="h-10 px-5 sm:px-10 bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 gap-2 text-sm font-semibold"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <p className="text-[13px] text-gray-500 whitespace-nowrap">
                <span className="font-bold text-primary">{selectedCategories.length}</span>{' '}
                {selectedCategories.length === 1 ? 'category' : 'categories'} selected
              </p>
              <Button
                onClick={handleCategoriesNext}
                disabled={selectedCategories.length === 0}
                className="h-10 px-5 sm:px-12 bg-primary hover:bg-secondary text-white gap-2 text-sm font-semibold"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <div className="grid lg:grid-cols-[300px_1fr] rounded-2xl border border-gray-200 bg-white overflow-hidden">

            {/* Left: intro panel */}
            <aside className="hidden lg:flex flex-col bg-gradient-to-b from-amber-50 to-violet-50 p-7 border-r border-gray-100">
              <span className="self-start rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                Step 3 of 3
              </span>
              <h2 className="mt-4 text-2xl font-bold leading-tight text-gray-900">Connect Your Social Accounts</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-gray-500">
                Link your social media profiles or add UGC portfolio to start creating and managing content from one place.
              </p>

              <ul className="mt-6 space-y-4">
                {[
                  { icon: Zap, title: 'Save Time', text: 'Manage all your platforms in one dashboard.', color: 'bg-red-50 text-red-500' },
                  { icon: BarChart3, title: 'Better Analytics', text: 'Track performance across all channels.', color: 'bg-blue-50 text-blue-500' },
                  { icon: Users, title: 'Grow Faster', text: 'Reach more people with consistent content.', color: 'bg-violet-50 text-violet-500' },
                ].map(({ icon: FeatureIcon, title, text, color }) => (
                  <li key={title} className="flex gap-3">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${color}`}>
                      <FeatureIcon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{title}</p>
                      <p className="text-[13px] text-gray-500">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Illustration: floating platform logos */}
              <div className="relative mt-auto h-44" aria-hidden="true">
                <div className="absolute left-1/2 top-6 h-40 w-28 -translate-x-1/2 -rotate-6 rounded-3xl border-4 border-white bg-white/60" />
                <span className="absolute left-[44%] top-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5] shadow-md">
                  <Instagram className="h-6 w-6 text-white" />
                </span>
                <span className="absolute left-[10%] top-14 flex h-9 w-9 -rotate-12 items-center justify-center rounded-lg bg-[#FF0000] shadow-md">
                  <Youtube className="h-5 w-5 text-white" />
                </span>
                <span className="absolute right-[8%] top-20 flex h-10 w-10 rotate-6 items-center justify-center rounded-xl bg-black shadow-md">
                  <TikTokIcon className="h-5 w-5 text-white" />
                </span>
                <span className="absolute left-[30%] top-28 flex h-10 w-10 -rotate-6 items-center justify-center rounded-xl bg-[#0A66C2] shadow-md">
                  <Linkedin className="h-6 w-6 text-white" />
                </span>
                <span className="absolute right-[24%] top-32 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-500 shadow-md">
                  <Video className="h-4 w-4 text-white" />
                </span>
              </div>
            </aside>

            {/* Right: progress + accounts */}
            <div className="min-w-0">
              <div className="border-b border-gray-100 px-4 py-4 sm:px-6">
                <div className="mx-auto flex max-w-sm items-start justify-between">
                  {['Account', 'Categories', 'Connect'].map((label, index) => (
                    <div key={label} className="relative flex flex-1 flex-col items-center">
                      {index > 0 && <span className="absolute right-1/2 top-3.5 h-0.5 w-full -translate-y-1/2 bg-primary" />}
                      <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                        {index < 2 ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : 3}
                      </span>
                      <span className={`mt-1.5 text-xs ${index === 2 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Connect Your Accounts</h1>
                    <p className="mt-1 text-[13px] text-gray-500">Link your social media profiles or add UGC portfolio</p>
                  </div>
                  <div className="flex max-w-xs gap-2.5 rounded-lg bg-amber-50 px-3 py-2.5">
                    <Crown className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                    <div>
                      <p className="text-[13px] font-semibold text-gray-900">Set a primary account</p>
                      <p className="text-xs leading-snug text-gray-500">Choose one main account to be displayed as your primary profile on your public page.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {socialPlatforms.map((platform) => {
                    const Icon = platform.icon;
                    const isPrimary = primaryPlatform === platform.id;
                    const error = urlErrors[platform.id];
                    return (
                      <div
                        key={platform.id}
                        className={`flex flex-col gap-2.5 rounded-xl border px-3 py-2.5 transition-colors md:flex-row md:items-center md:gap-4 ${
                          isPrimary ? 'border-amber-300 bg-amber-50/60' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex flex-1 items-center gap-3 md:flex-none md:shrink-0 md:w-52">
                          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${platform.tile}`}>
                            <Icon className="h-6 w-6 text-white" />
                          </span>
                          <span className="min-w-0">
                            <span className="flex items-center gap-1.5">
                              <span className="whitespace-nowrap text-sm font-semibold text-gray-900">{platform.name}</span>
                              {isPrimary && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700">
                                  <Crown className="h-3 w-3" /> Primary
                                </span>
                              )}
                            </span>
                            <span className="block whitespace-nowrap text-xs text-gray-500">
                              {isPrimary ? 'Set as your main profile' : platform.subtitle}
                            </span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-start gap-2 sm:flex-nowrap min-w-0 md:flex-1">
                          <div className="w-full sm:w-auto sm:flex-1 min-w-0">
                            <Input
                              id={`social-url-${platform.id}`}
                              type="url"
                              placeholder={platform.placeholder}
                              value={socialAccounts[platform.id] || ''}
                              onChange={(e) => handleSocialAccountChange(platform.id, e.target.value)}
                              aria-invalid={!!error}
                              className={`h-10 bg-white text-[13px] text-gray-900 placeholder:text-gray-400 ${error ? 'border-red-400' : 'border-gray-200'}`}
                            />
                            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(platform.id)}
                            aria-pressed={isPrimary}
                            className={`inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-semibold transition-colors ${
                              isPrimary
                                ? 'border-amber-400 bg-amber-400 text-white'
                                : 'border-amber-300 bg-white text-gray-900 hover:bg-amber-50'
                            }`}
                          >
                            <Crown className={`h-4 w-4 ${isPrimary ? 'fill-white' : 'fill-amber-400 text-amber-500'}`} />
                            {isPrimary ? 'Primary' : 'Set as Primary'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Consent — both are required before Complete Signup */}
                <div className="mt-4 space-y-3 rounded-xl border border-amber-100 bg-amber-50/50 p-3 sm:p-4">
                  {[
                    {
                      id: 'consent-noc',
                      checked: agreeTerms,
                      onChange: setAgreeTerms,
                      title: 'NOC Agreement',
                      text: (
                        <>
                          I agree to the{' '}
                          {/* New tab, so the signup form keeps what's been entered */}
                          <a
                            href="/influencer-nda"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="font-medium text-amber-600 underline-offset-2 hover:underline"
                          >
                            Terms &amp; Conditions
                          </a>{' '}
                          and
                          authorize OneHub to process my information for platform services.
                        </>
                      ),
                    },
                    {
                      id: 'consent-promotional',
                      checked: agreePromotional,
                      onChange: setAgreePromotional,
                      title: 'Promotional Updates',
                      text: (
                        <>
                          I would like to receive future promotional offers, campaign opportunities, updates, and
                          marketing communications via WhatsApp, SMS, email, or phone.
                        </>
                      ),
                    },
                  ].map(({ id, checked, onChange, title, text }) => (
                    <label key={id} htmlFor={id} className="flex cursor-pointer items-start gap-3">
                      <input
                        id={id}
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => onChange(e.target.checked)}
                        required
                        className="peer sr-only"
                      />
                      <span
                        className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30 ${
                          checked ? 'border-primary bg-primary text-white' : 'border-gray-300 bg-white'
                        }`}
                      >
                        {checked && <Check className="h-3 w-3" strokeWidth={3} />}
                      </span>
                      <span>
                        <span className="block text-[13px] font-semibold text-gray-900">
                          {title} <span className="text-red-500">*</span>
                        </span>
                        <span className="block text-xs leading-relaxed text-gray-600">{text}</span>
                      </span>
                    </label>
                  ))}
                </div>

                <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
                  <Button
                    onClick={() => setStep(2)}
                    variant="outline"
                    className="h-11 gap-2 border border-gray-300 bg-white text-sm font-semibold text-gray-800 hover:bg-gray-50 sm:w-44"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !agreeTerms || !agreePromotional}
                    className="h-11 flex-1 gap-2 bg-primary text-sm font-semibold text-white hover:bg-secondary"
                  >
                    {loading ? 'Completing...' : 'Complete Signup'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                {(!agreeTerms || !agreePromotional) && (
                  <p className="mt-2 text-center text-xs text-gray-500">Please accept both agreements to complete signup.</p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
