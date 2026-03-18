import { Search, ChevronDown, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface SearchBarProps {
  onSearch?: (platforms: string[], categories: string[]) => void;
  onPlatformChange?: (values: string[]) => void;
  onCategoryChange?: (values: string[]) => void;
}

const platforms = [
  'Instagram',
  'TikTok',
  'User Generated Content',
  'YouTube',
  'Twitter',
  'Twitch',
];

const categoryData = [
  { 
    name: 'Lifestyle', 
    image: 'https://images.unsplash.com/photo-1613053342567-924891457d16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGUlMjBpbmZsdWVuY2VyJTIwY2FzdWFsfGVufDF8fHx8MTc3MzgxNDA5NHww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    name: 'Beauty', 
    image: 'https://images.unsplash.com/photo-1605474082506-21d31d9d95e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBtYWtldXAlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzM3NzU3MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    name: 'Fashion', 
    image: 'https://images.unsplash.com/photo-1762430815620-fcca603c240c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBydW53YXl8ZW58MXx8fHwxNzczODE0MDk1fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    name: 'Travel', 
    image: 'https://images.unsplash.com/photo-1619467416348-6a782839e95f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmUlMjB3b3JsZHxlbnwxfHx8fDE3NzM3OTM4NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    name: 'Health & Fitness', 
    image: 'https://images.unsplash.com/photo-1584827386916-b5351d3ba34b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwd29ya291dCUyMGd5bXxlbnwxfHx8fDE3NzM3NDI4OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    name: 'Food & Drink', 
    image: 'https://images.unsplash.com/photo-1676272650338-faaea8e5e5fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwY29va2luZyUyMGN1bGluYXJ5fGVufDF8fHx8MTc3MzgxNDA5N3ww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    name: 'Family & Children', 
    image: 'https://images.unsplash.com/photo-1771924488441-fcd9bb0f3ff5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBjaGlsZHJlbiUyMHBhcmVudGluZ3xlbnwxfHx8fDE3NzM4MTQwOTd8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    name: 'Comedy & Entertainment', 
    image: 'https://images.unsplash.com/photo-1770413186279-cddf39ca13c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjBlbnRlcnRhaW5tZW50JTIwcGVyZm9ybWVyfGVufDF8fHx8MTc3MzgxNDA5N3ww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    name: 'Art & Photography', 
    image: 'https://images.unsplash.com/photo-1584534570458-15eda6d0330c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBwaG90b2dyYXBoeSUyMGNyZWF0aXZlfGVufDF8fHx8MTc3MzgxNDA5N3ww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    name: 'Music & Dance', 
    image: 'https://images.unsplash.com/photo-1766368490994-dcb0decd4d3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGRhbmNlJTIwcGVyZm9ybWFuY2V8ZW58MXx8fHwxNzczODE0MDk3fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    name: 'Model', 
    image: 'https://images.unsplash.com/photo-1676810052606-a1664d2d5dfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2RlbCUyMHByb2Zlc3Npb25hbCUyMHBob3Rvc2hvb3R8ZW58MXx8fHwxNzczODE0MDk4fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    name: 'Animals & Pets', 
    image: 'https://images.unsplash.com/photo-1712316146767-610c37aa62a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYWxzJTIwcGV0cyUyMGN1dGV8ZW58MXx8fHwxNzczODE0MDk4fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    name: 'Adventure & Outdoors', 
    image: 'https://images.unsplash.com/photo-1603199940387-cf2c8368d84a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlbnR1cmUlMjBvdXRkb29ycyUyMGhpa2luZ3xlbnwxfHx8fDE3NzM4MTQwOTh8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    name: 'Entrepreneur & Business', 
    image: 'https://images.unsplash.com/photo-1542558891698-6a3a72d5859a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGVudHJlcHJlbmV1ciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzM3OTY2OTN8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    name: 'Education', 
    image: 'https://images.unsplash.com/photo-1721468184185-214871ec4411?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBsZWFybmluZyUyMHN0dWRlbnR8ZW58MXx8fHwxNzczNzE3Nzg0fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    name: 'Athlete & Sports', 
    image: 'https://images.unsplash.com/photo-1667791275929-5701d83734c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRlJTIwc3BvcnRzJTIwZml0bmVzc3xlbnwxfHx8fDE3NzM4MTQxMDB8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    name: 'Gaming', 
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBlc3BvcnRzJTIwZ2FtZXJ8ZW58MXx8fHwxNzczODE0MTAwfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    name: 'Technology', 
    image: 'https://images.unsplash.com/photo-1614081989290-bcdba07cd9d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwdGVjaCUyMGRpZ2l0YWx8ZW58MXx8fHwxNzczODE0MTAwfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    name: 'LGBTQ2+', 
    image: 'https://images.unsplash.com/photo-1686059794038-b9bfa83d5680?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZ2J0cSUyMHByaWRlJTIwZGl2ZXJzaXR5fGVufDF8fHx8MTc3MzgxNDEwMXww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    name: 'Healthcare', 
    image: 'https://images.unsplash.com/photo-1708596082136-9bbf99609df7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMHdlbGxuZXNzfGVufDF8fHx8MTc3MzgxNDEwMXww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    name: 'Actor', 
    image: 'https://images.unsplash.com/photo-1764763181076-62d433e72aa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3RvciUyMHRoZWF0ZXIlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NzM4MTQxMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    name: 'Automotive', 
    image: 'https://images.unsplash.com/photo-1668764340764-89ec96bc2a3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwY2FyJTIwdmVoaWNsZXxlbnwxfHx8fDE3NzM4MTQxMDF8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
];

export function SearchBar({ onSearch, onPlatformChange, onCategoryChange }: SearchBarProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  const platformRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (platformRef.current && !platformRef.current.contains(event.target as Node)) {
        setShowPlatformDropdown(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePlatformToggle = (platform: string) => {
    const newSelection = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter((p) => p !== platform)
      : [...selectedPlatforms, platform];
    
    setSelectedPlatforms(newSelection);
    onPlatformChange?.(newSelection);
  };

  const handleCategoryToggle = (category: string) => {
    const newSelection = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newSelection);
    onCategoryChange?.(newSelection);
  };

  const removePlatform = (platform: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelection = selectedPlatforms.filter((p) => p !== platform);
    setSelectedPlatforms(newSelection);
    onPlatformChange?.(newSelection);
  };

  const removeCategory = (category: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelection = selectedCategories.filter((c) => c !== category);
    setSelectedCategories(newSelection);
    onCategoryChange?.(newSelection);
  };

  const handleSearch = () => {
    onSearch?.(selectedPlatforms, selectedCategories);
  };

  const getPlatformDisplayText = () => {
    if (selectedPlatforms.length === 0) return 'Choose platforms';
    if (selectedPlatforms.length === 1) return selectedPlatforms[0];
    return `${selectedPlatforms.length} platforms selected`;
  };

  const getCategoryDisplayText = () => {
    if (selectedCategories.length === 0) return 'Choose categories';
    if (selectedCategories.length === 1) return selectedCategories[0];
    return `${selectedCategories.length} categories selected`;
  };

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-0">
      {/* Mobile: Stacked Layout */}
      <div className="block md:hidden space-y-3">
        {/* Platform Dropdown - Mobile */}
        <div className="relative" ref={platformRef}>
          <button
            onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
            className="w-full min-h-[56px] rounded-2xl flex flex-col justify-center px-5 py-3 text-left focus:outline-none cursor-pointer"
            style={{
              backgroundColor: '#ffffff',
              border: '2px solid #000000',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            <span 
              className="text-[12px] font-semibold leading-tight block mb-2"
              style={{ color: '#D4AF37' }}
            >
              Platform
            </span>
            {selectedPlatforms.length === 0 ? (
              <span 
                className="text-[14px] font-normal leading-tight block"
                style={{ color: '#737373' }}
              >
                Choose platforms
              </span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedPlatforms.map((platform) => (
                  <span
                    key={platform}
                    className="inline-flex items-center gap-1 px-2 py-1 text-[12px] rounded-lg"
                    style={{
                      backgroundColor: 'rgba(212, 175, 55, 0.15)',
                      color: '#D4AF37',
                      border: '1px solid #D4AF37',
                    }}
                  >
                    {platform}
                    <button
                      onClick={(e) => removePlatform(platform, e)}
                      className="hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </button>

          {/* Platform Dropdown */}
          {showPlatformDropdown && (
            <div 
              className="absolute top-full left-0 right-0 mt-3 rounded-2xl overflow-hidden z-50"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              }}
            >
              {platforms.map((platform) => (
                <button
                  key={platform}
                  onClick={() => handlePlatformToggle(platform)}
                  className="w-full px-5 py-3 text-left text-[14px] hover:bg-[#f5f5f7] transition-colors flex items-center justify-between"
                  style={{ 
                    color: selectedPlatforms.includes(platform) ? '#D4AF37' : '#1a1a1a',
                    backgroundColor: selectedPlatforms.includes(platform) ? 'rgba(212, 175, 55, 0.1)' : 'transparent'
                  }}
                >
                  <span>{platform}</span>
                  {selectedPlatforms.includes(platform) && (
                    <Check className="w-4 h-4" style={{ color: '#D4AF37' }} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Input - Mobile */}
        <div className="relative" ref={categoryRef}>
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="w-full min-h-[56px] rounded-2xl flex flex-col justify-center px-5 py-3 text-left focus:outline-none cursor-pointer"
            style={{
              backgroundColor: '#ffffff',
              border: '2px solid #000000',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            <span 
              className="text-[12px] font-semibold leading-tight block mb-2"
              style={{ color: '#D4AF37' }}
            >
              Category
            </span>
            {selectedCategories.length === 0 ? (
              <span 
                className="text-[14px] font-normal leading-tight block"
                style={{ color: '#737373' }}
              >
                Choose categories
              </span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center gap-1 px-2 py-1 text-[12px] rounded-lg"
                    style={{
                      backgroundColor: 'rgba(212, 175, 55, 0.15)',
                      color: '#D4AF37',
                      border: '1px solid #D4AF37',
                    }}
                  >
                    {category}
                    <button
                      onClick={(e) => removeCategory(category, e)}
                      className="hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </button>

          {/* Category Dropdown */}
          {showCategoryDropdown && (
            <div 
              className="absolute top-full left-0 right-0 mt-2 rounded-2xl p-4 z-50 max-h-[300px] overflow-y-auto"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              }}
            >
              <div className="mb-2">
                <span className="text-[12px] font-semibold" style={{ color: '#737373' }}>
                  Popular
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categoryData.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryToggle(category.name)}
                    className="px-3 py-1.5 text-[13px] rounded-lg border transition-all hover:border-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)]"
                    style={{
                      backgroundColor: selectedCategories.includes(category.name) ? 'rgba(212, 175, 55, 0.15)' : '#f5f5f7',
                      borderColor: selectedCategories.includes(category.name) ? '#D4AF37' : 'rgba(212, 175, 55, 0.2)',
                      color: selectedCategories.includes(category.name) ? '#D4AF37' : '#1a1a1a',
                    }}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Button - Mobile */}
        <button
          onClick={handleSearch}
          className="w-full h-[56px] rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 font-semibold text-[16px] cursor-pointer"
          style={{ backgroundColor: '#D4AF37', color: '#ffffff' }}
        >
          <Search className="w-5 h-5" />
          Search
        </button>
      </div>

      {/* Desktop: Horizontal Pill Layout */}
      <div 
        className="hidden md:flex relative min-h-[64px] rounded-full items-center justify-between gap-4"
        style={{
          backgroundColor: '#ffffff',
          border: '2px solid #000000',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          paddingLeft: '20px',
          paddingRight: '12px',
          paddingTop: '12px',
          paddingBottom: '12px',
        }}
      >
        {/* Platform Input Block */}
        <div className="flex-1 relative" ref={platformRef}>
          <button
            onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
            className="w-full min-h-[40px] flex flex-col justify-start px-[10px] text-left focus:outline-none group"
          >
            <div className="flex items-center justify-between mb-1">
              <span 
                className="text-[12px] font-semibold leading-tight"
                style={{ color: '#D4AF37' }}
              >
                Platform
              </span>
              <ChevronDown 
                className="w-4 h-4 transition-transform"
                style={{ 
                  color: '#D4AF37',
                  transform: showPlatformDropdown ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              />
            </div>
            {selectedPlatforms.length === 0 ? (
              <span 
                className="text-[14px] font-normal leading-tight"
                style={{ color: '#737373' }}
              >
                Choose platforms
              </span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {selectedPlatforms.map((platform) => (
                  <span
                    key={platform}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded"
                    style={{
                      backgroundColor: 'rgba(212, 175, 55, 0.15)',
                      color: '#D4AF37',
                      border: '1px solid #D4AF37',
                    }}
                  >
                    {platform}
                    <button
                      onClick={(e) => removePlatform(platform, e)}
                      className="hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </button>

          {/* Platform Dropdown */}
          {showPlatformDropdown && (
            <div 
              className="absolute top-full left-0 right-0 mt-3 rounded-2xl overflow-hidden z-50"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              }}
            >
              {platforms.map((platform) => (
                <button
                  key={platform}
                  onClick={() => handlePlatformToggle(platform)}
                  className="w-full px-5 py-3 text-left text-[14px] hover:bg-[#f5f5f7] transition-colors"
                  style={{ 
                    color: selectedPlatforms.includes(platform) ? '#D4AF37' : '#1a1a1a',
                    backgroundColor: selectedPlatforms.includes(platform) ? 'rgba(212, 175, 55, 0.1)' : 'transparent'
                  }}
                >
                  {platform}
                  {selectedPlatforms.includes(platform) && <Check className="w-4 h-4 ml-2" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div 
          className="w-[1px] h-[40px] flex-shrink-0"
          style={{ backgroundColor: 'rgba(212, 175, 55, 0.18)' }}
        />

        {/* Category Input Block */}
        <div className="flex-1 relative" ref={categoryRef}>
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="w-full min-h-[40px] flex flex-col justify-start px-[10px] text-left focus:outline-none group"
          >
            <div className="flex items-center justify-between mb-1">
              <span 
                className="text-[12px] font-semibold leading-tight"
                style={{ color: '#D4AF37' }}
              >
                Category
              </span>
              <ChevronDown 
                className="w-4 h-4 transition-transform"
                style={{ 
                  color: '#D4AF37',
                  transform: showCategoryDropdown ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              />
            </div>
            {selectedCategories.length === 0 ? (
              <span 
                className="text-[14px] font-normal leading-tight"
                style={{ color: '#737373' }}
              >
                Choose categories
              </span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {selectedCategories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded"
                    style={{
                      backgroundColor: 'rgba(212, 175, 55, 0.15)',
                      color: '#D4AF37',
                      border: '1px solid #D4AF37',
                    }}
                  >
                    {category}
                    <button
                      onClick={(e) => removeCategory(category, e)}
                      className="hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </button>

          {/* Category Dropdown */}
          {showCategoryDropdown && (
            <div 
              className="absolute top-full left-0 right-0 mt-3 rounded-2xl p-5 z-50 max-h-[400px] overflow-y-auto"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              }}
            >
              <div className="mb-3">
                <span className="text-[12px] font-semibold" style={{ color: '#737373' }}>
                  Popular
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categoryData.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryToggle(category.name)}
                    className="px-3 py-1.5 text-[13px] rounded-lg border transition-all hover:border-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)]"
                    style={{
                      backgroundColor: selectedCategories.includes(category.name) ? 'rgba(212, 175, 55, 0.15)' : '#f5f5f7',
                      borderColor: selectedCategories.includes(category.name) ? '#D4AF37' : 'rgba(212, 175, 55, 0.2)',
                      color: selectedCategories.includes(category.name) ? '#D4AF37' : '#1a1a1a',
                    }}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-[56px] h-[56px] rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          style={{ backgroundColor: '#D4AF37' }}
        >
          <Search className="w-5 h-5" style={{ color: '#ffffff' }} />
        </button>
      </div>
    </div>
  );
}