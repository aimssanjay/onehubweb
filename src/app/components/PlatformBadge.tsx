import { Instagram, Youtube } from 'lucide-react';
import { Badge } from './ui/badge';

interface PlatformBadgeProps {
  platform: string;
  size?: 'sm' | 'md' | 'lg';
}

const platformConfig: Record<string, { icon: React.ComponentType<any>; color: string; bgColor: string }> = {
  Instagram: { icon: Instagram, color: 'text-pink-600', bgColor: 'bg-pink-50' },
  TikTok: { icon: () => <span>🎵</span>, color: 'text-gray-900', bgColor: 'bg-gray-50' },
  YouTube: { icon: Youtube, color: 'text-red-600', bgColor: 'bg-red-50' },
  Twitch: { icon: () => <span>🎮</span>, color: 'text-purple-600', bgColor: 'bg-purple-50' },
};

export function PlatformBadge({ platform, size = 'sm' }: PlatformBadgeProps) {
  const config = platformConfig[platform] || { icon: () => null, color: 'text-gray-600', bgColor: 'bg-gray-50' };
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2',
  };

  return (
    <Badge 
      variant="outline" 
      className={`${config.bgColor} border-transparent ${config.color} ${sizeClasses[size]} gap-1.5`}
    >
      <Icon className="w-3 h-3" />
      <span>{platform}</span>
    </Badge>
  );
}
