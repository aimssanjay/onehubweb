import { Star } from 'lucide-react';
import { Card } from './ui/card';
import type { Influencer } from '../../data/mockData';

interface UnifiedInfluencerCardProps {
  influencer: Influencer;
  onViewProfile: (slugOrId: string) => void;
}

export function UnifiedInfluencerCard({ influencer, onViewProfile }: UnifiedInfluencerCardProps) {
  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  // Get total followers from all platforms
  const totalFollowers = Object.values(influencer.platforms).reduce((a, b) => a + b, 0);
  
  // Mock data for demo
  const isTopCreator = influencer.featured || Math.random() > 0.7;
  const isVerified = influencer.verified || Math.random() > 0.7;

  return (
    <Card 
      onClick={() => onViewProfile(influencer.slug || influencer.id)}
      className="overflow-hidden transition-all duration-300 hover:shadow-xl border-zinc-200 bg-white group cursor-pointer w-full mx-auto text-card-foreground flex flex-col gap-0"
    >
      {/* Profile Image with Overlays */}
      <div className="w-full aspect-square relative overflow-hidden bg-gray-100">
        <img
          src={influencer.profileImage}
          alt={influencer.name}
          className="w-full h-full object-cover object-[center_30%] group-hover:scale-105 transition-transform duration-300"
          style={{ objectPosition: 'center 30%' }}
        />
        
        {/* Top Badges - Top Creator, Verified */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isTopCreator && (
            <span className="px-2.5 py-1 bg-[#D4AF37] text-black text-xs font-semibold rounded-md flex items-center gap-1">
              ⭐ Top Creator
            </span>
          )}
          {isVerified && (
            <span className="px-2.5 py-1 bg-blue-500 text-white text-xs font-semibold rounded-md flex items-center gap-1">
              ✓ Verified
            </span>
          )}
        </div>

        {/* Social Media Icons - Bottom Left */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          {influencer.platforms.instagram > 0 && (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
          )}
          {influencer.platforms.youtube > 0 && (
            <div className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
          )}
          {influencer.platforms.tiktok > 0 && (
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Content - White section at bottom */}
      <div className="px-4 pt-3 pb-3 bg-white">
        {/* Name with Rating */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-gray-900 text-base">{influencer.name}</h3>
            <div className="flex items-center gap-0.5 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-semibold text-gray-900">{influencer.rating?.toFixed(1) || '4.5'}</span>
            </div>
          </div>
        </div>

        {/* Category with Border */}
        <div className="mb-2 flex flex-wrap gap-1.5">
          {influencer.categories && influencer.categories.length > 0 ? (
            influencer.categories.slice(0, 3).map((cat, idx) => (
              <span key={idx} className="inline-block px-3 py-1 text-xs font-medium text-gray-700 border border-gray-300 rounded-full">
                {cat}
              </span>
            ))
          ) : (
            <span className="inline-block px-3 py-1 text-xs font-medium text-gray-700 border border-gray-300 rounded-full">
              {influencer.category}
            </span>
          )}
        </div>

        {/* Followers and Engagement with White Background */}
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2">
            <div className="text-xs text-gray-500 mb-0.5">Followers</div>
            <div className="text-gray-900 font-semibold">{formatFollowers(totalFollowers)}</div>
          </div>
          <div className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2">
            <div className="text-xs text-gray-500 mb-0.5">Engagement</div>
            <div className="text-gray-900 font-semibold">{influencer.engagement || '4.5'}%</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
