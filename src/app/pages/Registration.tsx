import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';
import { usePlatforms } from '../hooks/usePlatforms';

export default function Registration() {
  const navigate = useNavigate();
  const { platforms } = usePlatforms();

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    social: false,
    professional: false,
    logistics: false,
    additional: false,
  });

  const [formData, setFormData] = useState({
    // Basic Information
    fullName: '',
    location: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    // Social Media
    primaryPlatform: '',
    instagramHandle: '',
    instagramFollowers: '',
    youtubeChannel: '',
    youtubeFollowers: '',
    tiktokHandle: '',
    tiktokFollowers: '',
    // Professional
    contentCategory: '',
    rateExpectation: '',
    experience: '',
    collaborations: '',
    contentTypes: [] as string[],
    // Logistics
    transportation: '',
    accommodation: '',
    travelPreferences: '',
    // Additional
    message: '',
    agreeToTerms: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch("http://187.124.147.79:4000/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registration Successful ✅");
      console.log(data);
    } else {
      alert("Something went wrong ❌");
      console.log(data);
    }

  } catch (error) {
    console.log("Error:", error);
    alert("Server error ❌");
  }
};

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Join OneHub's<br />Creator Network
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            Partner with premium brands, amplify your influence. It's not just fame, it's how to get brands.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information Section */}
          <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800">
            <button
              type="button"
              onClick={() => toggleSection('basic')}
              className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-[#222] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-primary text-xl">01</span>
                <span className="font-semibold text-lg">Basic Information</span>
              </div>
              {expandedSections.basic ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            {expandedSections.basic && (
              <div className="px-6 pb-6 space-y-4 border-t border-gray-800 pt-6">
                {/* Full Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Full Name *</label>
                    <Input
                      required
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="bg-black border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Location *</label>
                    <Input
                      required
                      placeholder="City, Country"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="bg-black border-gray-700 text-white"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Email *</label>
                    <Input
                      required
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-black border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Phone *</label>
                    <Input
                      required
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-black border-gray-700 text-white"
                    />
                  </div>
                </div>

                {/* Date of Birth & Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Date of Birth *</label>
                    <Input
                      required
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="bg-black border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Gender *</label>
                    <select
                      required
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full h-10 px-3 bg-black border border-gray-700 rounded-md text-white"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Social Media Information Section */}
          <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800">
            <button
              type="button"
              onClick={() => toggleSection('social')}
              className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-[#222] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-primary text-xl">02</span>
                <span className="font-semibold text-lg">Social Media Information</span>
              </div>
              {expandedSections.social ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            {expandedSections.social && (
              <div className="px-6 pb-6 space-y-4 border-t border-gray-800 pt-6">
                {/* Primary Platform */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Primary Platform *</label>
                  <select
                    required
                    value={formData.primaryPlatform}
                    onChange={(e) => setFormData({ ...formData, primaryPlatform: e.target.value })}
                    className="w-full h-10 px-3 bg-black border border-gray-700 rounded-md text-white"
                  >
                    <option value="">Select platform</option>
                    {platforms.map((p) => (
                      <option key={p.id} value={p.name.toLowerCase()}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Instagram */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Instagram Handle</label>
                    <Input
                      placeholder="@username"
                      value={formData.instagramHandle}
                      onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                      className="bg-black border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Followers Count</label>
                    <Input
                      type="number"
                      placeholder="10000"
                      value={formData.instagramFollowers}
                      onChange={(e) => setFormData({ ...formData, instagramFollowers: e.target.value })}
                      className="bg-black border-gray-700 text-white"
                    />
                  </div>
                </div>

                {/* YouTube */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">YouTube Channel</label>
                    <Input
                      placeholder="Channel URL or @handle"
                      value={formData.youtubeChannel}
                      onChange={(e) => setFormData({ ...formData, youtubeChannel: e.target.value })}
                      className="bg-black border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Subscribers Count</label>
                    <Input
                      type="number"
                      placeholder="5000"
                      value={formData.youtubeFollowers}
                      onChange={(e) => setFormData({ ...formData, youtubeFollowers: e.target.value })}
                      className="bg-black border-gray-700 text-white"
                    />
                  </div>
                </div>

                {/* TikTok */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">TikTok Handle</label>
                    <Input
                      placeholder="@username"
                      value={formData.tiktokHandle}
                      onChange={(e) => setFormData({ ...formData, tiktokHandle: e.target.value })}
                      className="bg-black border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Followers Count</label>
                    <Input
                      type="number"
                      placeholder="15000"
                      value={formData.tiktokFollowers}
                      onChange={(e) => setFormData({ ...formData, tiktokFollowers: e.target.value })}
                      className="bg-black border-gray-700 text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Professional Information Section */}
          <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800">
            <button
              type="button"
              onClick={() => toggleSection('professional')}
              className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-[#222] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-primary text-xl">03</span>
                <span className="font-semibold text-lg">Professional Information</span>
              </div>
              {expandedSections.professional ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            {expandedSections.professional && (
              <div className="px-6 pb-6 space-y-4 border-t border-gray-800 pt-6">
                {/* Content Category */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Content Category *</label>
                  <select
                    required
                    value={formData.contentCategory}
                    onChange={(e) => setFormData({ ...formData, contentCategory: e.target.value })}
                    className="w-full h-10 px-3 bg-black border border-gray-700 rounded-md text-white"
                  >
                    <option value="">Select category</option>
                    <option value="fashion">Fashion & Style</option>
                    <option value="beauty">Beauty & Makeup</option>
                    <option value="fitness">Fitness & Health</option>
                    <option value="food">Food & Cooking</option>
                    <option value="travel">Travel & Lifestyle</option>
                    <option value="tech">Technology</option>
                    <option value="gaming">Gaming</option>
                    <option value="music">Music & Dance</option>
                    <option value="education">Education</option>
                  </select>
                </div>

                {/* Rate & Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Rate Expectation (USD) *</label>
                    <Input
                      required
                      type="number"
                      placeholder="500"
                      value={formData.rateExpectation}
                      onChange={(e) => setFormData({ ...formData, rateExpectation: e.target.value })}
                      className="bg-black border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Years of Experience *</label>
                    <Input
                      required
                      type="number"
                      placeholder="2"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="bg-black border-gray-700 text-white"
                    />
                  </div>
                </div>

                {/* Previous Collaborations */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Previous Brand Collaborations</label>
                  <textarea
                    placeholder="List brands you've worked with..."
                    value={formData.collaborations}
                    onChange={(e) => setFormData({ ...formData, collaborations: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white resize-none"
                  />
                </div>

                {/* Content Types */}
                <div>
                  <label className="block text-sm text-gray-400 mb-3">Content Types You Create *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Photos', 'Videos', 'Reels', 'Stories', 'Live Streams', 'Blog Posts'].map((type) => (
                      <label key={type} className="flex items-center gap-2 text-white cursor-pointer">
                        <Checkbox
                          checked={formData.contentTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                contentTypes: [...formData.contentTypes, type],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                contentTypes: formData.contentTypes.filter((t) => t !== type),
                              });
                            }
                          }}
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Logistics Section */}
          <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800">
            <button
              type="button"
              onClick={() => toggleSection('logistics')}
              className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-[#222] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-primary text-xl">04</span>
                <span className="font-semibold text-lg">Logistics</span>
              </div>
              {expandedSections.logistics ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            {expandedSections.logistics && (
              <div className="px-6 pb-6 space-y-4 border-t border-gray-800 pt-6">
                {/* Transportation */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Transportation Preference</label>
                  <select
                    value={formData.transportation}
                    onChange={(e) => setFormData({ ...formData, transportation: e.target.value })}
                    className="w-full h-10 px-3 bg-black border border-gray-700 rounded-md text-white"
                  >
                    <option value="">Select preference</option>
                    <option value="own">Own Transportation</option>
                    <option value="provided">Need Transportation Provided</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                {/* Accommodation */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Accommodation Needs</label>
                  <select
                    value={formData.accommodation}
                    onChange={(e) => setFormData({ ...formData, accommodation: e.target.value })}
                    className="w-full h-10 px-3 bg-black border border-gray-700 rounded-md text-white"
                  >
                    <option value="">Select needs</option>
                    <option value="not-needed">Not Needed</option>
                    <option value="needed">Accommodation Required</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                {/* Travel Preferences */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Travel Preferences</label>
                  <textarea
                    placeholder="Any specific travel requirements or preferences..."
                    value={formData.travelPreferences}
                    onChange={(e) => setFormData({ ...formData, travelPreferences: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Additional Info Section */}
          <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800">
            <button
              type="button"
              onClick={() => toggleSection('additional')}
              className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-[#222] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-primary text-xl">05</span>
                <span className="font-semibold text-lg">Additional Info</span>
              </div>
              {expandedSections.additional ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            {expandedSections.additional && (
              <div className="px-6 pb-6 space-y-4 border-t border-gray-800 pt-6">
                {/* Message */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Tell us more about yourself and your content
                  </label>
                  <textarea
                    placeholder="Share your story, unique style, or why you want to join OneHub..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white resize-none"
                  />
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    required
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, agreeToTerms: checked as boolean })
                    }
                    className="mt-1"
                  />
                  <label className="text-sm text-gray-400">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => navigate('terms')}
                      className="text-primary hover:underline"
                    >
                      Terms & Conditions
                    </button>{' '}
                    and understand my data will be used to match me with brand opportunities.
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-black"
            >
              Submit Registration
            </Button>
            <p className="text-center text-sm text-gray-500 mt-4">
              We'll review your application and get back to you within 48 hours.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}