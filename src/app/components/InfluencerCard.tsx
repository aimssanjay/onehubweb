import { MapPin, BadgeCheck, Instagram, Youtube, Star } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CreatorBadge } from './CreatorBadge';
import type { Influencer } from '../../data/mockData';

interface InfluencerCardProps {
  influencer: Influencer;
  onViewProfile: (id: string) => void;
}

export function InfluencerCard({ influencer, onViewProfile }: InfluencerCardProps) {
  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  const totalFollowers = Object.values(influencer.platforms).reduce((a, b) => a + b, 0);
  
  // Mock engagement rate
  const engagementRate = (Math.random() * 6 + 2).toFixed(1);

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-zinc-800 bg-black group">
      {/* Profile Image */}
      <div className="aspect-[3/4] relative overflow-hidden bg-black">
        <img
          src={influencer.profileImage}
          alt={influencer.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {influencer.featured && (
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground shadow-lg">
            Featured
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4 bg-black">
        {/* Platforms Row */}
        <div className="flex items-center gap-2 mb-3">
          {influencer.platforms.instagram && (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
              <Instagram className="w-3.5 h-3.5 text-white" />
            </div>
          )}
          {influencer.platforms.youtube && (
            <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
              <Youtube className="w-3.5 h-3.5 text-white" />
            </div>
          )}
          {influencer.platforms.tiktok && (
            <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </div>
          )}
        </div>

        {/* Name & Verification */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold truncate text-white">{influencer.name}</h3>
              {influencer.verified && (
                <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />
              )}
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {influencer.featured && <CreatorBadge type="top" />}
          {influencer.verified && <CreatorBadge type="verified" />}
          {Math.random() > 0.5 && <CreatorBadge type="fast" />}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="bg-zinc-900 rounded-lg px-2 py-1.5">
            <p className="text-gray-400 text-xs">Followers</p>
            <p className="font-semibold text-white">{formatFollowers(totalFollowers)}</p>
          </div>
          <div className="bg-zinc-900 rounded-lg px-2 py-1.5">
            <p className="text-gray-400 text-xs">Engagement</p>
            <p className="font-semibold text-white">{engagementRate}%</p>
          </div>
        </div>

        {/* Category Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <Badge variant="secondary" className="text-xs bg-zinc-900 text-gray-300 border-zinc-800">
            {influencer.category}
          </Badge>
        </div>

        {/* View Profile Button */}
        <Button
          onClick={() => onViewProfile(influencer.id)}
          className="w-full bg-primary hover:bg-secondary text-black font-semibold cursor-pointer"
        >
          View Profile
        </Button>
      </div>
    </Card>
  );
}