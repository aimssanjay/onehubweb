import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Instagram, Youtube, Video, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { Logo } from '../components/Logo';
import { usePlatforms } from '../hooks/usePlatforms';
import { useCategories } from '../hooks/useCategories';
import { API_BASE_URL, API_ENDPOINTS } from '../../services/api';

const platformMeta: Record<string, { icon: React.ComponentType<any>; placeholder: string; color: string }> = {
  Instagram: { icon: Instagram, placeholder: 'https://instagram.com/yourusername', color: 'from-purple-600 to-pink-600' },
  YouTube: { icon: Youtube, placeholder: 'https://youtube.com/channel/yourchannelname', color: 'from-red-600 to-red-500' },
  TikTok: { icon: Video, placeholder: 'https://tiktok.com/@yourusername', color: 'from-black to-gray-800' },
};

export function InfluencerSignup() {
  const navigate = useNavigate();
  const { platforms: apiPlatforms } = usePlatforms();
  const { categories: apiCategories } = useCategories();

  const categories = apiCategories.map((c) => ({
    id: c.id,
    name: c.name,
    icon: '🏷️',
  }));

  const socialPlatforms = apiPlatforms.map((p) => ({
    id: p.name.toLowerCase(),
    name: p.name,
    ...(platformMeta[p.name] ?? { icon: Video, placeholder: 'https://example.com/yourprofile', color: 'from-gray-600 to-gray-500' }),
  }));

  const [step, setStep] = useState(1);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [socialAccounts, setSocialAccounts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
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
  };

   // ── STEP 1: Register and save token ──
  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          user_type_id: 3,
        }),
      });
      const data = await response.json();
      console.log('Register Response:', data);
      if (response.ok) {
        const token = data.token || data.access_token || data.data?.token || data.data?.access_token;
        if (!token) {
          alert('Registration succeeded but no token found. Check console.');
          return;
        }
        localStorage.setItem('influencer_token', token);
        setAuthToken(token);
        setStep(2);
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Register Error:', error);
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

 // ── STEP 2: Save categories with token ──
  const handleSaveCategories = async () => {
    if (!authToken) {
      alert('Session expired. Please restart signup.');
      setStep(1);
      return;
    }
    console.log('Category IDs being sent:', selectedCategories);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/influencers/update-categories`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ category_ids: selectedCategories }),
      });
      const data = await response.json();
      console.log('Categories Response:', data);
      if (response.ok) {
        setStep(3);
      } else {
        alert(data.message || 'Failed to save categories');
      }
    } catch (error) {
      console.error('Categories Error:', error);
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 3: Save social accounts with token ──
  const handleSubmit = async () => {
    console.log('Token at submit:', authToken);
    console.log('Social accounts:', socialAccounts);

    if (!authToken) {
      alert('Session expired. Please restart signup.');
      setStep(1);
      return;
    }

    const accountsArray = Object.entries(socialAccounts)
      .filter(([_, url]) => url.trim() !== '')
      .map(([platformId, url]) => {
        const platform = apiPlatforms.find(
          p => p.name.toLowerCase() === platformId.toLowerCase()
        );
        console.log(`platformId: ${platformId}, matched:`, platform);
        return {
          platform_id: platform?.id,
          profile_url: url,
          username: url,
        };
      })
      .filter(item => item.platform_id);

    console.log('Final accountsArray:', accountsArray);

    if (accountsArray.length === 0) {
      alert('Please add at least one social account');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/influencers/add-social-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ accounts: accountsArray }),
      });
      const data = await response.json();
      console.log('Socials Response:', data);
      if (response.ok) {
        navigate('/influencer/dashboard');
      } else {
        alert(data.message || 'Failed to save social accounts');
      }
    } catch (error) {
      console.error('Socials Error:', error);
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > 1 ? <Check className="w-5 h-5" /> : '1'}
            </div>
            <div className={`h-1 w-20 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > 2 ? <Check className="w-5 h-5" /> : '2'}
            </div>
            <div className={`h-1 w-20 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
              3
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span className="w-24 text-center">Account</span>
            <span className="w-24 text-center">Categories</span>
            <span className="w-24 text-center">Connect</span>
          </div>
        </div>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="bg-black rounded-2xl p-8 border border-gray-800">
            <h1 className="text-3xl font-bold text-white mb-2">Create Your Influencer Account</h1>
            <p className="text-gray-400 mb-8">Join thousands of creators earning with brands</p>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Email Address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Password</label>
                <Input
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <Button
                onClick={handleRegister}
                disabled={loading || !formData.fullName || !formData.email || !formData.password || formData.password !== formData.confirmPassword}
                className="w-full bg-primary hover:bg-secondary text-white gap-2"
              >
                {loading ? 'Creating Account...' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-center text-sm text-gray-400">
                Already have an account?{' '}
                <a href="/influencer/login" className="text-primary hover:underline">Sign in</a>
              </p>
            </div>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div className="bg-black rounded-2xl p-8 border border-gray-800">
            <h1 className="text-3xl font-bold text-white mb-2">Select Your Primary Categories</h1>
            <p className="text-gray-400 mb-8">Choose all categories that apply (select multiple)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedCategories.includes(category.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-800 text-2xl">
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{category.name}</p>
                  </div>
                  <Checkbox
                    checked={selectedCategories.includes(category.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1 bg-gray-800 border-2 border-gray-700 text-white hover:bg-gray-700 gap-2 font-semibold"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button
                onClick={handleSaveCategories}
                disabled={loading || selectedCategories.length === 0}
                className="flex-1 bg-primary hover:bg-secondary text-black gap-2 font-semibold"
              >
                {loading ? 'Saving...' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <div className="bg-black rounded-2xl p-8 border border-gray-800">
            <h1 className="text-3xl font-bold text-white mb-2">Connect Your Accounts</h1>
            <p className="text-gray-400 mb-8">Link your social media profiles or add UGC portfolio</p>
            <div className="space-y-4 mb-8">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <div key={platform.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${platform.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{platform.name}</h3>
                        <p className="text-sm text-gray-400">Add your profile URL</p>
                      </div>
                    </div>
                    <Input
                      type="url"
                      placeholder={platform.placeholder}
                      value={socialAccounts[platform.id] || ''}
                      onChange={(e) => handleSocialAccountChange(platform.id, e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="flex-1 bg-gray-800 border-2 border-gray-700 text-white hover:bg-gray-700 gap-2 font-semibold"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-primary hover:bg-secondary text-black gap-2 font-semibold"
              >
                {loading ? 'Completing...' : 'Complete Signup'}
                <Check className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-center text-sm text-gray-400 mt-4">
              You can always add more platforms later in your dashboard
            </p>
          </div>
        )}

      </div>
    </div>
  );
}