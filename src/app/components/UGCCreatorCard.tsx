import { Instagram, Youtube, CheckCircle, Zap, Star } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import type { Influencer } from '../../data/mockData';

interface UGCCreatorCardProps {
  influencer: Influencer;
  onViewProfile: (id: string) => void;
}

export function UGCCreatorCard({ influencer, onViewProfile }: UGCCreatorCardProps) {
  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  const totalFollowers = Object.values(influencer.platforms).reduce((a, b) => a + b, 0);
  
  // Mock engagement rate
  const engagementRate = (Math.random() * 6 + 2).toFixed(1);

  // Determine if this is a featured/top creator (using random for demo)
  const isFeatured = Math.random() > 0.7;
  const isTopCreator = Math.random() > 0.6;
  const respondsfast = !influencer.verified && Math.random() > 0.5;

  return (
    <Card 
      onClick={() => onViewProfile(influencer.id)}
      className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-zinc-800 bg-black group cursor-pointer"
    >
      {/* Profile Image with Overlays */}
      <div className="aspect-square relative overflow-hidden bg-black">
        <img
          src={influencer.profileImage}
          alt={influencer.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Top Badges - Featured, Top Creator, etc. */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isFeatured && (
            <span className="px-3 py-1 bg-primary text-black text-xs font-semibold rounded-full">
              Featured
            </span>
          )}
          {isTopCreator && (
            <span className="px-3 py-1 bg-primary/90 text-black text-xs font-semibold rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" />
              Top Creator
            </span>
          )}
        </div>

        {/* Status Badges - Verified, Responds Fast on Image */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {influencer.verified && (
            <div className="px-2.5 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Verified
            </div>
          )}
          {respondsfast && (
            <div className="px-2.5 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Responds Fast
            </div>
          )}
        </div>

        {/* Social Media Icons - Bottom Left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2.5">
          {influencer.platforms.instagram && (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 p-[2px] shadow-lg hover:shadow-pink-500/50 transition-all duration-300 hover:scale-110">
              <div className="w-full h-full rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                <Instagram className="w-4.5 h-4.5 text-white drop-shadow-lg" />
              </div>
            </div>
          )}
          {influencer.platforms.youtube && (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-700 p-[2px] shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-110">
              <div className="w-full h-full rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                <Youtube className="w-4.5 h-4.5 text-white drop-shadow-lg" />
              </div>
            </div>
          )}
          {influencer.platforms.tiktok && (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-900 to-black p-[2px] shadow-lg hover:shadow-white/30 transition-all duration-300 hover:scale-110 ring-1 ring-white/50">
              <div className="w-full h-full rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content - Black overlay section at bottom */}
      <div className="px-4 pb-4 pt-0 bg-black">
        {/* Name with Verification Icon */}
        <div className="flex items-center gap-2 mb-2 pt-2">
          <h3 className="font-semibold text-white text-base">{influencer.name}</h3>
          {influencer.verified && (
            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
          )}
        </div>

        {/* Category - Dark rounded pill */}
        {influencer.categories && influencer.categories.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-3">
            {influencer.categories.slice(0, 3).map((cat) => (
              <span key={cat} className="bg-zinc-900 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                {cat}
              </span>
            ))}
          </div>
        ) : influencer.category && (
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-zinc-900 text-white text-xs px-3 py-1.5 rounded-full font-medium">
              {influencer.category}
            </span>
          </div>
        )}

        {/* Stats - Dark rounded background */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-zinc-900 rounded-lg px-3 py-2">
            <p className="text-gray-400 text-xs mb-0.5">Followers</p>
            <p className="text-white font-semibold text-sm">{formatFollowers(totalFollowers)}</p>
          </div>
          <div className="bg-zinc-900 rounded-lg px-3 py-2">
            <p className="text-gray-400 text-xs mb-0.5">Engagement</p>
            <p className="text-white font-semibold text-sm">{engagementRate}%</p>
          </div>
        </div>
      </div>
    </Card>
  );
}