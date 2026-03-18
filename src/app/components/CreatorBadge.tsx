import { Crown, Zap, BadgeCheck, Video } from 'lucide-react';

interface CreatorBadgeProps {
  type: 'top' | 'fast' | 'verified' | 'ugc';
  className?: string;
}

export function CreatorBadge({ type, className = '' }: CreatorBadgeProps) {
  const badges = {
    top: {
      icon: Crown,
      label: 'Top Creator',
      className: 'bg-primary/10 text-primary border-primary/20',
    },
    fast: {
      icon: Zap,
      label: 'Responds Fast',
      className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    verified: {
      icon: BadgeCheck,
      label: 'Verified',
      className: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    ugc: {
      icon: Video,
      label: 'UGC',
      className: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    },
  };

  const badge = badges[type];
  const Icon = badge.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium ${badge.className} ${className}`}
    >
      <Icon className="w-3 h-3" />
      {badge.label}
    </span>
  );
}
