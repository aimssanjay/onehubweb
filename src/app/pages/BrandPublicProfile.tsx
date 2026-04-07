import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  ArrowLeft, MapPin, Globe, Instagram, Twitter, Youtube,
  Edit, Building2, Star, Users, CheckCircle, Camera, Upload
} from 'lucide-react';
import { API_BASE_URL } from '../../services/api';

export function BrandPublicProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageSaving, setImageSaving] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const fetchProfile = async () => {
    const token = localStorage.getItem('brand_token');
    if (!token) {
      navigate('/brand/login');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/brands/get-profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      console.log('Brand Public Profile Response:', result);

      if (result.success) {
        setUserData(result.data);
        setProfileImagePreview(result.data.profile_pic || null);
        setCoverImagePreview(result.data.cover_image || result.data.brand_profile?.cover_image || null);
      } else {
        localStorage.removeItem('brand_token');
        navigate('/brand/login');
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch real profile from API
  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'profile' | 'cover',
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      if (type === 'profile') {
        setProfileImageFile(file);
        setProfileImagePreview(imageUrl);
      } else {
        setCoverImageFile(file);
        setCoverImagePreview(imageUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveImages = async () => {
    const token = localStorage.getItem('brand_token');
    if (!token) {
      navigate('/brand/login');
      return;
    }
    if (!profileImageFile && !coverImageFile) {
      alert('Please select at least one image to upload');
      return;
    }

    setImageSaving(true);
    try {
      const formData = new FormData();
      if (profileImageFile) formData.append('profile_pic', profileImageFile);
      if (coverImageFile) formData.append('cover_image', coverImageFile);

      const response = await fetch(`${API_BASE_URL}/brands/update-profile-images`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const result = await response.json();

      if (result.success || response.ok) {
        setProfileImageFile(null);
        setCoverImageFile(null);
        await fetchProfile();
        alert('Profile images updated successfully!');
      } else {
        alert(result.message || 'Failed to update profile images');
      }
    } catch (error) {
      alert('Server error');
    } finally {
      setImageSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  // ✅ Extract real data from API response
  const companyName = userData.brand_profile?.company_name || userData.name || 'Brand';
  const industry = userData.brand_profile?.industry || '';
  const location = userData.city && userData.country
    ? `${userData.city}, ${userData.country}`
    : userData.city || userData.country || '';
  const description = userData.bio || userData.brand_profile?.description || '';
  const website = userData.brand_profile?.website || '';
  const instagram = userData.brand_profile?.instagram || '';
  const twitter = userData.brand_profile?.twitter || '';
  const youtube = userData.brand_profile?.youtube || '';
  const categories = userData.categories?.map((c: any) => c.name || c) || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/brand-dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Edit Button */}
        <div className="flex justify-end mb-4">
          <Link to="/brand-dashboard">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border-2 border-gray-300 hover:border-primary hover:bg-gray-50 text-gray-700 hover:text-black transition-all duration-200 shadow-sm">
              <Edit className="w-5 h-5" />
              <span className="font-semibold">Edit Profile</span>
            </button>
          </Link>
        </div>

        {/* Cover Photo & Profile Section */}
        <div className="bg-gray-100 rounded-2xl overflow-hidden mb-8 relative" style={{ height: '400px' }}>
          {coverImagePreview ? (
            <img src={coverImagePreview} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
          )}
          <button
            onClick={() => coverInputRef.current?.click()}
            className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-white"
          >
            <Upload className="w-4 h-4" />
            Change Cover
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => handleImageSelect(e, 'cover')}
            className="hidden"
          />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="relative">
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt={companyName}
                  className="w-32 h-32 rounded-full object-cover border-8 border-white shadow-xl"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-black text-5xl font-bold border-8 border-white shadow-xl">
                  {companyName.charAt(0).toUpperCase()}
                </div>
              )}
              <button
                onClick={() => profileInputRef.current?.click()}
                className="absolute bottom-2 right-2 rounded-full bg-black p-2 text-white shadow-md hover:bg-gray-800"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={profileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleImageSelect(e, 'profile')}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {(profileImageFile || coverImageFile) && (
          <div className="mb-8 flex justify-center">
            <button
              onClick={handleSaveImages}
              disabled={imageSaving}
              className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {imageSaving ? 'Saving Images...' : 'Save Images'}
            </button>
          </div>
        )}

        {/* Brand Name & Info */}
        <div className="text-center mt-20 mb-8">
          {/* ✅ Real company name */}
          <h1 className="text-4xl font-bold text-black mb-2">{companyName}</h1>
          <div className="flex items-center justify-center gap-4 text-gray-600 mb-4">
            {industry && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>{industry}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            )}
          </div>

          {/* ✅ Real categories */}
          {categories.length > 0 && (
            <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
              {categories.map((category: string, index: number) => (
                <span key={index} className="px-4 py-1.5 bg-black text-white rounded-full text-sm font-medium">
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Description & Social Links */}
        <div className="max-w-4xl mx-auto">
          {/* About */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
            <h3 className="text-lg font-semibold mb-4">About</h3>
            {description ? (
              <p className="text-gray-700 leading-relaxed">{description}</p>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">
                  A quality description results in more influencer collaborations.
                </p>
                <Link to="/brand-dashboard">
                  <button className="text-primary hover:text-secondary font-medium">
                    Complete your profile now.
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* ✅ Real social links */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="space-y-3">
              {website && (
                <a href={website.startsWith('http') ? website : `https://${website}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-black transition-colors">
                  <Globe className="w-5 h-5" />
                  <span>{website}</span>
                </a>
              )}
              {instagram && (
                <a href={instagram.startsWith('http') ? instagram : `https://instagram.com/${instagram.replace('@', '')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-black transition-colors">
                  <Instagram className="w-5 h-5" />
                  <span>{instagram}</span>
                </a>
              )}
              {twitter && (
                <a href={twitter.startsWith('http') ? twitter : `https://twitter.com/${twitter.replace('@', '')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-black transition-colors">
                  <Twitter className="w-5 h-5" />
                  <span>{twitter}</span>
                </a>
              )}
              {youtube && (
                <a href={youtube.startsWith('http') ? youtube : `https://youtube.com/${youtube}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-black transition-colors">
                  <Youtube className="w-5 h-5" />
                  <span>{youtube}</span>
                </a>
              )}
              {!website && !instagram && !twitter && !youtube && (
                <div className="text-center py-4">
                  <p className="text-gray-400 mb-2">No social media links added yet</p>
                  <Link to="/brand-dashboard">
                    <button className="text-primary hover:text-secondary font-medium text-sm">
                      Add social links
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          {/*<div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-black mb-1">
                {userData.brand_profile?.total_campaigns || 0}
              </div>
              <div className="text-sm text-gray-600">Active Campaigns</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-black mb-1">
                {userData.brand_profile?.total_hired || 0}
              </div>
              <div className="text-sm text-gray-600">Hired Creators</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-black mb-1">
                {userData.brand_profile?.rating_avg || 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Rating</div>
            </div>
          </div>*/}
        </div>
      </div>
    </div>
  );
}
