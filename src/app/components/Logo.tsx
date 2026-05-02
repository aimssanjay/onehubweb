import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import logo from "../../assets/logo.webp";

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

export function Logo({ className = "h-16", onClick }: LogoProps) {
  const [imageError, setImageError] = useState(false);

  // ✅ Try image first
  if (!imageError) {
    return (
      <img 
        src={logo}
        alt="Logo"
        className={className}
        style={{ objectFit: 'contain' }}
        onError={() => setImageError(true)}
        onClick={onClick}
      />
    );
  }

  // ✅ Fallback custom logo
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