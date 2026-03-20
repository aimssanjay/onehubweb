import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Instagram, Youtube, Video, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { Logo } from '../components/Logo';
import { usePlatforms } from '../hooks/usePlatforms';
import { useCategories } from '../hooks/useCategories';


const platformMeta: Record<string, { icon: React.ComponentType<any>; placeholder: string; color: string }> = {
  Instagram: { icon: Instagram, placeholder: '@username', color: 'from-purple-600 to-pink-600' },
  YouTube: { icon: Youtube, placeholder: 'Channel URL', color: 'from-red-600 to-red-500' },
  TikTok: { icon: Video, placeholder: '@username', color: 'from-black to-gray-800' },
};

export default function SignupInfluencer() {
  const navigate = useNavigate();
  const { platforms: apiPlatforms } = usePlatforms();
  const { categories: apiCategories } = useCategories();
  const categories = apiCategories.map((c) => ({ id: c.slug, name: c.name, icon: '🏷️' }));
  const socialPlatforms = apiPlatforms.map((p) => ({
    id: p.name.toLowerCase(),
    name: p.name,
    ...(platformMeta[p.name] ?? { icon: Video, placeholder: 'Username or URL', color: 'from-gray-600 to-gray-500' }),
  }));
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [socialAccounts, setSocialAccounts] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSocialAccountChange = (platformId: string, value: string) => {
    setSocialAccounts(prev => ({
      ...prev,
      [platformId]: value,
    }));
  };

  const handleSubmit = () => {
    // Store influencer data in localStorage for demo
    localStorage.setItem('influencer_user', JSON.stringify({
      ...formData,
      categories: selectedCategories,
      socialAccounts,
      role: 'influencer',
    }));
    
    // Navigate to influencer dashboard
    navigate('/influencer/dashboard');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > 1 ? <Check className="w-5 h-5" /> : '1'}
            </div>
            <div className={`h-1 w-20 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > 2 ? <Check className="w-5 h-5" /> : '2'}
            </div>
            <div className={`h-1 w-20 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span className="w-24 text-center">Account</span>
            <span className="w-24 text-center">Categories</span>
            <span className="w-24 text-center">Connect</span>
          </div>
        </div>

        {/* Step 1: Account Creation */}
        {step === 1 && (
          <div className="bg-black rounded-2xl p-8 border border-gray-800">
            <h1 className="text-3xl font-bold text-white mb-2">Create Your Influencer Account</h1>
            <p className="text-gray-400 mb-8">Join thousands of creators earning with brands</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!formData.fullName || !formData.email || !formData.password || formData.password !== formData.confirmPassword}
                className="w-full bg-primary hover:bg-secondary text-white gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>

              <p className="text-center text-sm text-gray-400">
                Already have an account?{' '}
                <a href="/influencer/login" className="text-primary hover:underline">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Category Selection */}
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
                className="flex-1 bg-gray-800 border-2 border-gray-700 text-white hover:bg-gray-700 hover:border-gray-600 gap-2 font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={selectedCategories.length === 0}
                className="flex-1 bg-primary hover:bg-secondary text-black gap-2 font-semibold"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Connect Social Accounts */}
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
                        <p className="text-sm text-gray-400">
                          {platform.id === 'ugc' ? 'Portfolio or content samples' : 'Connect your account'}
                        </p>
                      </div>
                    </div>
                    <Input
                      type="text"
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
                className="flex-1 bg-gray-800 border-2 border-gray-700 text-white hover:bg-gray-700 hover:border-gray-600 gap-2 font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={Object.keys(socialAccounts).length === 0}
                className="flex-1 bg-primary hover:bg-secondary text-black gap-2 font-semibold"
              >
                Complete Signup
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
