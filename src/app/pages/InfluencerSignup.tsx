import { useState } from 'react';
import { usePlatforms } from '../hooks/usePlatforms';
import { useCategories } from '../hooks/useCategories';
import { User, Mail, Lock, Instagram, Youtube, DollarSign, Upload, Check, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { categories } from '../../data/mockData';

interface InfluencerSignupProps {
  onNavigate: (page: string, data?: any) => void;
}

const platformIconMap: Record<string, React.ComponentType<any>> = {
  Instagram,
  YouTube: Youtube,
};


export function InfluencerSignup({ onNavigate }: InfluencerSignupProps) {
  const { platforms: apiPlatforms } = usePlatforms();
  const { categories: apiCategories } = useCategories();
  const categoryOptions = apiCategories.map((c) => c.name);
  const platformOptions = apiPlatforms.map((p) => ({
    id: p.name.toLowerCase(),
    name: p.name,
    icon: platformIconMap[p.name],
  }));
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    name: '',
    email: '',
    password: '',
    categories: [] as string[],
    platforms: [] as string[],
    location: '',
    bio: '',
    // Step 2: Social Accounts
    instagram: '',
    youtube: '',
    tiktok: '',
    // Step 3: Packages
    package1Price: '',
    package2Price: '',
    package3Price: '',
    // Step 4: Portfolio (mock)
    portfolioUploaded: false,
  });

  const progress = (currentStep / totalSteps) * 100;

  const togglePlatform = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const toggleCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Mock submission - navigate to influencer dashboard
    onNavigate('dashboard-influencer');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold">InfluenceHub</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Join as a Creator</h1>
          <p className="text-muted-foreground">
            Complete your profile to start receiving brand collaborations
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="p-8">
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
                <p className="text-muted-foreground">Tell us about yourself</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Sarah Johnson"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Platform Selection */}
              <div className="space-y-2">
                <Label>Platforms</Label>
                <p className="text-sm text-muted-foreground mb-3">Select all platforms where you're active</p>
                <div className="flex flex-wrap gap-2">
                  {platformOptions.map((platform) => (
                    <Badge
                      key={platform.id}
                      variant={formData.platforms.includes(platform.id) ? 'default' : 'outline'}
                      className={`cursor-pointer px-4 py-2 text-sm ${
                        formData.platforms.includes(platform.id)
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => togglePlatform(platform.id)}
                    >
                      {platform.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <Label>Categories</Label>
                <p className="text-sm text-muted-foreground mb-3">Select your content categories</p>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Popular</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {categoryOptions.slice(0, 11).map((category) => (
                      <Badge
                        key={category}
                        variant={formData.categories.includes(category) ? 'default' : 'outline'}
                        className={`cursor-pointer px-3 py-1.5 text-sm ${
                          formData.categories.includes(category)
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => toggleCategory(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categoryOptions.slice(11).map((category) => (
                      <Badge
                        key={category}
                        variant={formData.categories.includes(category) ? 'default' : 'outline'}
                        className={`cursor-pointer px-3 py-1.5 text-sm ${
                          formData.categories.includes(category)
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => toggleCategory(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Los Angeles, CA"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell brands about yourself and what makes you unique..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Step 2: Social Accounts */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Connect Your Social Accounts</h2>
                <p className="text-muted-foreground">Link at least one platform to continue</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram Username</Label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-600" />
                  <Input
                    id="instagram"
                    placeholder="@yourusername"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">We'll verify your account and follower count</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube Channel URL</Label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                  <Input
                    id="youtube"
                    placeholder="youtube.com/@yourchannel"
                    value={formData.youtube}
                    onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tiktok">TikTok Username</Label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  <Input
                    id="tiktok"
                    placeholder="@yourusername"
                    value={formData.tiktok}
                    onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Packages & Pricing */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Set Your Packages</h2>
                <p className="text-muted-foreground">
                  Create packages that brands can purchase (you can edit these later)
                </p>
              </div>

              <Card className="p-6 bg-gray-50">
                <h3 className="font-semibold mb-4">Basic Package</h3>
                <div className="space-y-2">
                  <Label htmlFor="package1">Starting Price (USD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="package1"
                      type="number"
                      placeholder="500"
                      value={formData.package1Price}
                      onChange={(e) => setFormData({ ...formData, package1Price: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Example: Single Instagram post or story set
                  </p>
                </div>
              </Card>

              <Card className="p-6 bg-gray-50">
                <h3 className="font-semibold mb-4">Standard Package</h3>
                <div className="space-y-2">
                  <Label htmlFor="package2">Price (USD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="package2"
                      type="number"
                      placeholder="1000"
                      value={formData.package2Price}
                      onChange={(e) => setFormData({ ...formData, package2Price: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Example: Video content or multiple posts
                  </p>
                </div>
              </Card>

              <Card className="p-6 bg-gray-50">
                <h3 className="font-semibold mb-4">Premium Package</h3>
                <div className="space-y-2">
                  <Label htmlFor="package3">Price (USD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="package3"
                      type="number"
                      placeholder="2000"
                      value={formData.package3Price}
                      onChange={(e) => setFormData({ ...formData, package3Price: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Example: Full campaign with multiple deliverables
                  </p>
                </div>
              </Card>
            </div>
          )}

          {/* Step 4: Portfolio Upload */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Upload Your Portfolio</h2>
                <p className="text-muted-foreground">
                  Showcase your best work to attract brands
                </p>
              </div>

              <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Click to upload or drag and drop</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  PNG, JPG, or MP4 up to 10MB each
                </p>
                <Button
                  variant="outline"
                  onClick={() => setFormData({ ...formData, portfolioUploaded: true })}
                >
                  Select Files
                </Button>
              </div>

              {formData.portfolioUploaded && (
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">Files uploaded successfully</p>
                      <p className="text-sm text-green-700">4 portfolio items added</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Review Your Profile</h2>
                <p className="text-muted-foreground">
                  Almost done! Review your information before submitting
                </p>
              </div>

              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Personal Information</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Name: {formData.name || 'Not provided'}</p>
                    <p>Email: {formData.email || 'Not provided'}</p>
                    <p>Platforms: {formData.platforms.length > 0 ? formData.platforms.join(', ') : 'Not provided'}</p>
                    <p>Categories: {formData.categories.length > 0 ? formData.categories.join(', ') : 'Not provided'}</p>
                    <p>Location: {formData.location || 'Not provided'}</p>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Social Accounts</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {formData.instagram && <p>Instagram: {formData.instagram}</p>}
                    {formData.youtube && <p>YouTube: {formData.youtube}</p>}
                    {formData.tiktok && <p>TikTok: {formData.tiktok}</p>}
                    {!formData.instagram && !formData.youtube && !formData.tiktok && <p>No accounts connected</p>}
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Packages</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {formData.package1Price && <p>Basic: ${formData.package1Price}</p>}
                    {formData.package2Price && <p>Standard: ${formData.package2Price}</p>}
                    {formData.package3Price && <p>Premium: ${formData.package3Price}</p>}
                    {!formData.package1Price && !formData.package2Price && !formData.package3Price && <p>No packages set</p>}
                  </div>
                </Card>

                <Card className="p-4 bg-blue-50 border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> Your profile will be reviewed by our team within 24-48 hours. You'll receive an email once it's approved.
                  </p>
                </Card>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
            )}
            {currentStep < totalSteps ? (
              <Button onClick={handleNext} className="flex-1">
                Continue
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="flex-1">
                Submit Application
              </Button>
            )}
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-primary hover:underline font-semibold"
              >
                Log in
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}