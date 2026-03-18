import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { 
  ArrowLeft,
  MapPin,
  Globe,
  Instagram,
  Twitter,
  Youtube,
  Edit,
  Building2,
  Star,
  Users,
  CheckCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';

export function BrandPublicProfile() {
  const navigate = useNavigate();
  
  // This would come from the logged-in brand's data
  const brandData = {
    companyName: 'Acme Corporation',
    email: 'sanjay.almstormcesolutions@gmail.com',
    industry: 'Technology',
    location: 'San Francisco, CA',
    description: 'Leading technology company specializing in innovative solutions for modern businesses.',
    website: 'www.acmecorp.com',
    instagram: '@acmecorp',
    twitter: '@acmecorp',
    youtube: 'acmecorp',
    coverPhoto: '',
    profilePhoto: '',
    categories: ['Travel', 'Technology', 'Business'],
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/dashboard-brand')}
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
          <Link to="/dashboard-brand">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border-2 border-gray-300 hover:border-primary hover:bg-gray-50 text-gray-700 hover:text-black transition-all duration-200 shadow-sm">
              <Edit className="w-5 h-5" />
              <span className="font-semibold">Edit Profile</span>
            </button>
          </Link>
        </div>

        {/* Cover Photo & Profile Section */}
        <div className="bg-gray-100 rounded-2xl overflow-hidden mb-8 relative" style={{ height: '400px' }}>
          {/* Cover Photo Placeholder */}
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
          
          {/* Profile Avatar - Positioned at bottom center */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-black text-5xl font-bold border-8 border-white shadow-xl">
              {brandData.companyName.charAt(0)}
            </div>
          </div>
        </div>

        {/* Brand Name & Info */}
        <div className="text-center mt-20 mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">{brandData.companyName}</h1>
          <div className="flex items-center justify-center gap-4 text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>{brandData.industry}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{brandData.location}</span>
            </div>
          </div>

          {/* Categories */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {brandData.categories.map((category, index) => (
              <span
                key={index}
                className="px-4 py-1.5 bg-black text-white rounded-full text-sm font-medium"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* Description & Social Links */}
        <div className="max-w-4xl mx-auto">
          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
            <h3 className="text-lg font-semibold mb-4">About</h3>
            {brandData.description ? (
              <p className="text-gray-700 leading-relaxed">{brandData.description}</p>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">
                  A quality description, logo and adding your social channels results in 3x more influencer collaborations on Collabstr.
                </p>
                <Link to="/dashboard-brand">
                  <button className="text-primary hover:text-secondary font-medium">
                    Complete your profile now.
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Social Media Links */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="space-y-3">
              {brandData.website && (
                <a
                  href={`https://${brandData.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-black transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  <span>{brandData.website}</span>
                </a>
              )}
              {brandData.instagram && (
                <a
                  href={`https://instagram.com/${brandData.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-black transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  <span>{brandData.instagram}</span>
                </a>
              )}
              {brandData.twitter && (
                <a
                  href={`https://twitter.com/${brandData.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-black transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                  <span>{brandData.twitter}</span>
                </a>
              )}
              {brandData.youtube && (
                <a
                  href={`https://youtube.com/${brandData.youtube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-black transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                  <span>{brandData.youtube}</span>
                </a>
              )}
              {!brandData.website && !brandData.instagram && !brandData.twitter && !brandData.youtube && (
                <div className="text-center py-4">
                  <p className="text-gray-400 mb-2">No social media links added yet</p>
                  <Link to="/dashboard-brand">
                    <button className="text-primary hover:text-secondary font-medium text-sm">
                      Add social links
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-black mb-1">8</div>
              <div className="text-sm text-gray-600">Active Campaigns</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-black mb-1">24</div>
              <div className="text-sm text-gray-600">Hired Creators</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-black mb-1">4.8</div>
              <div className="text-sm text-gray-600">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}