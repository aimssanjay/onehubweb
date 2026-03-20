import { Search, ChevronDown, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { usePlatforms } from '../hooks/usePlatforms';
import { useCategories } from '../hooks/useCategories';


interface SearchBarProps {
  onSearch?: (platforms: string[], categories: string[]) => void;
  onPlatformChange?: (values: string[]) => void;
  onCategoryChange?: (values: string[]) => void;
}

export function SearchBar({ onSearch, onPlatformChange, onCategoryChange }: SearchBarProps) {
  const { platforms } = usePlatforms();
  const { categories: categoryData } = useCategories();
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
                  key={platform.id}
                  onClick={() => handlePlatformToggle(platform.name)}
                  className="w-full px-5 py-3 text-left text-[14px] hover:bg-[#f5f5f7] transition-colors flex items-center justify-between"
                  style={{
                    color: selectedPlatforms.includes(platform.name) ? '#D4AF37' : '#1a1a1a',
                    backgroundColor: selectedPlatforms.includes(platform.name) ? 'rgba(212, 175, 55, 0.1)' : 'transparent'
                  }}
                >
                  <span>{platform.name}</span>
                  {selectedPlatforms.includes(platform.name) && (
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
                    key={category.id}
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
                  key={platform.id}
                  onClick={() => handlePlatformToggle(platform.name)}
                  className="w-full px-5 py-3 text-left text-[14px] hover:bg-[#f5f5f7] transition-colors"
                  style={{
                    color: selectedPlatforms.includes(platform.name) ? '#D4AF37' : '#1a1a1a',
                    backgroundColor: selectedPlatforms.includes(platform.name) ? 'rgba(212, 175, 55, 0.1)' : 'transparent'
                  }}
                >
                  {platform.name}
                  {selectedPlatforms.includes(platform.name) && <Check className="w-4 h-4 ml-2" />}
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
                    key={category.id}
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