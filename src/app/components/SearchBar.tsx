import { Search, ChevronDown, Check, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
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
  const [selectedCategoryKeys, setSelectedCategoryKeys] = useState<string[]>([]);
  const [selectedCategoryLabels, setSelectedCategoryLabels] = useState<Record<string, string>>({});
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  const platformRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when tapping/clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (platformRef.current && !platformRef.current.contains(event.target as Node)) {
        setShowPlatformDropdown(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const getCategoryLabel = (category: unknown) => {
    const row = (category && typeof category === 'object') ? category as Record<string, unknown> : {};
    const name = String(row.name ?? row.category_name ?? row.title ?? row.slug ?? '').trim();
    return name || `Category ${String(row.id ?? '').trim()}`;
  };

  const getCategoryKey = (id: unknown) => String(id ?? '').trim();

  const selectedCategoryNames = selectedCategoryKeys
    .map((key) => selectedCategoryLabels[key] || '')
    .filter(Boolean);

  const handlePlatformToggle = (platform: string) => {
    const newSelection = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter((p) => p !== platform)
      : [...selectedPlatforms, platform];
    
    setSelectedPlatforms(newSelection);
    onPlatformChange?.(newSelection);
  };

  const handleCategoryToggle = (category: { id: unknown; label: string }) => {
    const categoryKey = getCategoryKey(category.id);
    const newSelection = selectedCategoryKeys.includes(categoryKey)
      ? selectedCategoryKeys.filter((key) => key !== categoryKey)
      : [...selectedCategoryKeys, categoryKey];

    setSelectedCategoryKeys(newSelection);
    setSelectedCategoryLabels((prev) => ({ ...prev, [categoryKey]: category.label }));
    const names = newSelection.map((key) => selectedCategoryLabels[key] || (key === categoryKey ? category.label : '')).filter(Boolean);
    onCategoryChange?.(names);
    setShowCategoryDropdown(false);
  };

  const removePlatform = (platform: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelection = selectedPlatforms.filter((p) => p !== platform);
    setSelectedPlatforms(newSelection);
    onPlatformChange?.(newSelection);
  };

  const removeCategory = (categoryKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelection = selectedCategoryKeys.filter((key) => key !== categoryKey);
    setSelectedCategoryKeys(newSelection);
    const names = newSelection.map((key) => selectedCategoryLabels[key] || '').filter(Boolean);
    onCategoryChange?.(names);
  };

  const handleSearch = () => {
    onSearch?.(selectedPlatforms, selectedCategoryNames);
  };

  const selectMobilePlatform = (event: React.PointerEvent<HTMLButtonElement>, platformName: string) => {
    event.preventDefault();
    event.stopPropagation();
    handlePlatformToggle(platformName);
    setShowPlatformDropdown(false);
  };

  const selectMobileCategory = (event: React.PointerEvent<HTMLButtonElement>, category: { id: unknown; label: string }) => {
    // Pointer event is more reliable than click on mobile dropdown options.
    event.preventDefault();
    event.stopPropagation();
    handleCategoryToggle(category);
  };

  const getPlatformDisplayText = () => {
    if (selectedPlatforms.length === 0) return 'Choose platforms';
    if (selectedPlatforms.length === 1) return selectedPlatforms[0];
    return `${selectedPlatforms.length} platforms selected`;
  };

  const getCategoryDisplayText = () => {
    if (selectedCategoryNames.length === 0) return 'Choose categories';
    if (selectedCategoryNames.length === 1) return selectedCategoryNames[0];
    return `${selectedCategoryNames.length} categories selected`;
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
                      className="hover:opacity-70 cursor-pointer"
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
                  type="button"
                  key={platform.id}
                  onPointerDown={(event) => selectMobilePlatform(event, platform.name)}
                  className="w-full px-5 py-3 text-left text-[14px] hover:bg-[#f5f5f7] transition-colors flex items-center justify-between cursor-pointer"
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
            {selectedCategoryKeys.length === 0 ? (
              <span 
                className="text-[14px] font-normal leading-tight block"
                style={{ color: '#737373' }}
              >
                Choose categories
              </span>
            ) : (
              <div className="space-y-2">
                <span className="text-[13px] font-medium leading-tight block text-[#1a1a1a]">
                  {getCategoryDisplayText()}
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedCategoryKeys.map((categoryKey) => {
                    const selectedLabel = selectedCategoryLabels[categoryKey] || 'Category';
                    return (
                    <span
                      key={categoryKey}
                      className="inline-flex items-center gap-1 px-2 py-1 text-[12px] rounded-lg"
                      style={{
                        backgroundColor: 'rgba(212, 175, 55, 0.15)',
                        color: '#8C6A00',
                        border: '1px solid #D4AF37',
                    }}
                  >
                      {selectedLabel}
                      <button
                        onClick={(e) => removeCategory(categoryKey, e)}
                        className="hover:opacity-70 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                    );
                  })}
                </div>
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
                    type="button"
                    key={category.id}
                    onPointerDown={(event) =>
                      selectMobileCategory(event, { id: category.id, label: getCategoryLabel(category) })
                    }
                    className="px-3 py-1.5 text-[13px] rounded-lg border transition-all hover:border-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] cursor-pointer"
                    style={{
                      backgroundColor: selectedCategoryKeys.includes(getCategoryKey(category.id)) ? 'rgba(212, 175, 55, 0.15)' : '#f5f5f7',
                      borderColor: selectedCategoryKeys.includes(getCategoryKey(category.id)) ? '#D4AF37' : 'rgba(212, 175, 55, 0.2)',
                      color: selectedCategoryKeys.includes(getCategoryKey(category.id)) ? '#D4AF37' : '#1a1a1a',
                    }}
                  >
                    {getCategoryLabel(category)}
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
            className="w-full min-h-[40px] flex flex-col justify-start px-[10px] text-left focus:outline-none group cursor-pointer"
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
                      className="hover:opacity-70 cursor-pointer"
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
                  className="w-full px-5 py-3 text-left text-[14px] hover:bg-[#f5f5f7] transition-colors cursor-pointer"
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
            className="w-full min-h-[40px] flex flex-col justify-start px-[10px] text-left focus:outline-none group cursor-pointer"
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
            {selectedCategoryKeys.length === 0 ? (
              <span 
                className="text-[14px] font-normal leading-tight"
                style={{ color: '#737373' }}
              >
                Choose categories
              </span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {selectedCategoryKeys.map((categoryKey) => {
                  const selectedLabel = selectedCategoryLabels[categoryKey] || 'Category';
                  return (
                  <span
                    key={categoryKey}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded"
                    style={{
                      backgroundColor: 'rgba(212, 175, 55, 0.15)',
                      color: '#D4AF37',
                      border: '1px solid #D4AF37',
                    }}
                  >
                    {selectedLabel}
                    <button
                      onClick={(e) => removeCategory(categoryKey, e)}
                      className="hover:opacity-70 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                  );
                })}
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
                    type="button"
                    key={category.id}
                    onClick={() => handleCategoryToggle({ id: category.id, label: getCategoryLabel(category) })}
                    className="px-3 py-1.5 text-[13px] rounded-lg border transition-all hover:border-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] cursor-pointer"
                    style={{
                      backgroundColor: selectedCategoryKeys.includes(getCategoryKey(category.id)) ? 'rgba(212, 175, 55, 0.15)' : '#f5f5f7',
                      borderColor: selectedCategoryKeys.includes(getCategoryKey(category.id)) ? '#D4AF37' : 'rgba(212, 175, 55, 0.2)',
                      color: selectedCategoryKeys.includes(getCategoryKey(category.id)) ? '#D4AF37' : '#1a1a1a',
                    }}
                  >
                    {getCategoryLabel(category)}
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
