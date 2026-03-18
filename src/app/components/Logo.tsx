import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

export function Logo({ className = "h-16", onClick }: LogoProps) {
  const [imageError, setImageError] = useState(false);

  // Try to load the One Hub logo, fallback to custom logo if it fails
  if (!imageError) {
    return (
      <img 
        src="https://onehub.ae/wp-content/uploads/2023/10/One-Hub-Logo.webp" 
        alt="One Hub" 
        className={className}
        style={{ objectFit: 'contain' }}
        onError={() => setImageError(true)}
        onClick={onClick}
      />
    );
  }

  // Fallback custom logo
  return (
    <div 
      className={`flex items-center gap-2 ${className}`}
      onClick={onClick}
      style={{ height: 'auto' }}
    >
      <div className="relative">
        <Sparkles className="h-10 w-10 text-primary fill-primary" />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-foreground leading-none">One</span>
        <span className="text-2xl font-bold text-primary leading-none">Hub</span>
      </div>
    </div>
  );
}
