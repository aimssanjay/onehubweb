import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Search, SlidersHorizontal, X, Grid3x3, LayoutList, ChevronDown, ChevronUp, Shield, Zap, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { UnifiedInfluencerCard } from '../components/UnifiedInfluencerCard';
import { influencers, categories } from '../../data/mockData';

export function InfluencerListing() {
  const navigate = useNavigate();
  
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recommended');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [followerRange, setFollowerRange] = useState([0, 1000000]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [engagementRange, setEngagementRange] = useState([0, 100]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  
  // Collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    platform: true,
    category: true,
    location: false,
    price: true,
    followers: true,
    engagement: false,
    badges: false,
    rating: false,
    deliverables: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setShowFilters(true);
      } else {
        setShowFilters(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const platforms = [
    { id: 'instagram', label: 'Instagram' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'twitter', label: 'Twitter' },
  ];

  const badges = [
    { id: 'top', label: 'Top Creator' },
    { id: 'fast', label: 'Responds Fast' },
    { id: 'verified', label: 'Verified' },
    { id: 'ugc', label: 'UGC Specialist' },
  ];

  const filteredInfluencers = useMemo(() => {
    return influencers.filter((influencer) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !influencer.name.toLowerCase().includes(query) &&
          !influencer.username.toLowerCase().includes(query) &&
          !influencer.category.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(influencer.category)) {
          return false;
        }
      }

      if (selectedPlatforms.length > 0) {
        const hasPlatform = selectedPlatforms.some(
          (platform) => influencer.platforms[platform as keyof typeof influencer.platforms]
        );
        if (!hasPlatform) {
          return false;
        }
      }

      const totalFollowers = Object.values(influencer.platforms).reduce((a, b) => a + b, 0);
      if (totalFollowers < followerRange[0] || totalFollowers > followerRange[1]) {
        return false;
      }

      if (influencer.startingPrice < priceRange[0] || influencer.startingPrice > priceRange[1]) {
        return false;
      }

      if (minRating > 0 && influencer.rating < minRating) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategories, selectedPlatforms, followerRange, priceRange, minRating]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const toggleBadge = (badge: string) => {
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedPlatforms([]);
    setFollowerRange([0, 1000000]);
    setPriceRange([0, 5000]);
    setEngagementRange([0, 100]);
    setSelectedBadges([]);
    setMinRating(0);
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  const FilterSection = ({ 
    title, 
    section, 
    children 
  }: { 
    title: string; 
    section: keyof typeof expandedSections; 
    children: React.ReactNode 
  }) => (
    <div className="border-b border-border pb-4 mb-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full mb-3 hover:text-primary transition-colors"
      >
        <Label className="cursor-pointer">{title}</Label>
        {expandedSections[section] ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {expandedSections[section] && <div>{children}</div>}
    </div>
  );

  const FiltersContent = () => (
    <div className="h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-card z-10 pb-4">
        <h3 className="font-semibold text-foreground">Filters</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-primary hover:text-secondary"
          >
            Clear all
          </Button>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFilters(false)}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Keyword Search */}
      <div className="mb-6">
        <Label className="mb-2 text-foreground">Keyword Search</Label>
        <Input
          placeholder="Name, niche, keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-input-background border-border text-foreground"
        />
      </div>

      {/* Platform Filter */}
      <FilterSection title="Platform" section="platform">
        <div className="flex flex-wrap gap-2">
          {platforms.map((platform) => (
            <Badge
              key={platform.id}
              variant={selectedPlatforms.includes(platform.id) ? "default" : "outline"}
              className={`cursor-pointer transition-all ${
                selectedPlatforms.includes(platform.id)
                  ? 'bg-primary text-primary-foreground hover:bg-secondary'
                  : 'bg-muted text-foreground hover:bg-accent'
              }`}
              onClick={() => togglePlatform(platform.id)}
            >
              {platform.label}
            </Badge>
          ))}
        </div>
      </FilterSection>

      {/* Category Filter */}
      <FilterSection title="Category / Niche" section="category">
        <div className="space-y-2">
          {categories.slice(0, 8).map((category) => (
            <div key={category.id} className="flex items-center">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.name)}
                onCheckedChange={() => toggleCategory(category.name)}
              />
              <label
                htmlFor={`category-${category.id}`}
                className="ml-3 text-sm cursor-pointer flex-1 text-foreground"
              >
                {category.name}
                <span className="text-muted-foreground ml-1">({category.count})</span>
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range" section="price">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">${priceRange[0]}</span>
            <span className="text-primary font-semibold">${priceRange[1]}</span>
          </div>
          <Slider
            min={0}
            max={5000}
            step={50}
            value={priceRange}
            onValueChange={setPriceRange}
          />
        </div>
      </FilterSection>

      {/* Follower Count */}
      <FilterSection title="Follower Count" section="followers">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 mb-3">
            {[
              { label: '1-10K', range: [1000, 10000] },
              { label: '10-50K', range: [10000, 50000] },
              { label: '50-250K', range: [50000, 250000] },
              { label: '250K+', range: [250000, 1000000] },
            ].map((preset) => (
              <Badge
                key={preset.label}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all bg-muted text-foreground"
                onClick={() => setFollowerRange(preset.range)}
              >
                {preset.label}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{formatFollowers(followerRange[0])}</span>
            <span className="text-primary font-semibold">{formatFollowers(followerRange[1])}</span>
          </div>
          <Slider
            min={0}
            max={1000000}
            step={10000}
            value={followerRange}
            onValueChange={setFollowerRange}
          />
        </div>
      </FilterSection>

      {/* Engagement Rate */}
      <FilterSection title="Engagement Rate" section="engagement">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{engagementRange[0]}%</span>
            <span className="text-primary font-semibold">{engagementRange[1]}%</span>
          </div>
          <Slider
            min={0}
            max={100}
            step={1}
            value={engagementRange}
            onValueChange={setEngagementRange}
          />
        </div>
      </FilterSection>

      {/* Creator Badges */}
      <FilterSection title="Creator Badges" section="badges">
        <div className="space-y-2">
          {badges.map((badge) => (
            <div key={badge.id} className="flex items-center">
              <Checkbox
                id={`badge-${badge.id}`}
                checked={selectedBadges.includes(badge.id)}
                onCheckedChange={() => toggleBadge(badge.id)}
              />
              <label
                htmlFor={`badge-${badge.id}`}
                className="ml-3 text-sm cursor-pointer text-foreground"
              >
                {badge.label}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Rating" section="rating">
        <div className="space-y-2">
          {[4.5, 4.0].map((rating) => (
            <div key={rating} className="flex items-center">
              <Checkbox
                id={`rating-${rating}`}
                checked={minRating === rating}
                onCheckedChange={(checked) => setMinRating(checked ? rating : 0)}
              />
              <label
                htmlFor={`rating-${rating}`}
                className="ml-3 text-sm cursor-pointer text-foreground"
              >
                {rating}★ & up
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Apply Filters Button for Mobile */}
      {isMobile && (
        <div className="sticky bottom-0 bg-card pt-4 pb-2 mt-6 border-t border-border">
          <Button
            onClick={() => setShowFilters(false)}
            className="w-full bg-primary text-primary-foreground hover:bg-secondary"
          >
            Apply Filters ({filteredInfluencers.length} results)
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col gap-4 lg:gap-0 lg:flex-row lg:items-start lg:justify-between mb-4 lg:mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-foreground">Find Creators That Fit Your Brand</h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Discover verified creators ready to collaborate with your brand
              </p>
            </div>
            
            {/* Trust Badges - Hide on mobile, show on tablet+ */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              <div className="flex items-center gap-2 bg-card px-3 lg:px-4 py-2 rounded-lg border border-border">
                <Shield className="w-3 h-3 lg:w-4 lg:h-4 text-primary" />
                <span className="text-xs lg:text-sm text-foreground whitespace-nowrap">450K+ creators</span>
              </div>
              <div className="flex items-center gap-2 bg-card px-3 lg:px-4 py-2 rounded-lg border border-border">
                <Zap className="w-3 h-3 lg:w-4 lg:h-4 text-primary" />
                <span className="text-xs lg:text-sm text-foreground whitespace-nowrap">Secure Payments</span>
              </div>
              <div className="hidden lg:flex items-center gap-2 bg-card px-4 py-2 rounded-lg border border-border">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">Vetted Profiles</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6 relative">
          {/* Desktop Filters Sidebar */}
          {!isMobile && showFilters && (
            <aside className="w-80 flex-shrink-0">
              <Card className="p-6 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto bg-card border-border">
                <FiltersContent />
              </Card>
            </aside>
          )}

          {/* Mobile Filter Drawer */}
          {isMobile && showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div 
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowFilters(false)}
              />
              <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-card shadow-xl">
                <div className="h-full p-6">
                  <FiltersContent />
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4 lg:mb-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2 border-border text-foreground hover:text-primary"
                  size={isMobile ? 'sm' : 'default'}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {(selectedCategories.length > 0 || selectedPlatforms.length > 0) && (
                    <Badge className="ml-1 bg-primary text-primary-foreground">
                      {selectedCategories.length + selectedPlatforms.length}
                    </Badge>
                  )}
                </Button>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  <span className="text-foreground font-semibold">{filteredInfluencers.length}</span> creators
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px] lg:w-[200px] border-border bg-card text-foreground text-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="followers">Followers</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>

                <div className="hidden sm:flex items-center gap-1 border border-border rounded-lg p-1 bg-card">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}
                  >
                    <LayoutList className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategories.length > 0 || selectedPlatforms.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-4 lg:mb-6">
                {selectedCategories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="gap-2 cursor-pointer bg-primary/10 text-primary hover:bg-primary/20 text-xs sm:text-sm"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
                {selectedPlatforms.map((platform) => (
                  <Badge
                    key={platform}
                    variant="secondary"
                    className="gap-2 cursor-pointer bg-primary/10 text-primary hover:bg-primary/20 text-xs sm:text-sm"
                    onClick={() => togglePlatform(platform)}
                  >
                    {platform}
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
              </div>
            )}

            {/* Influencer Grid */}
            <div className={`grid ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            } gap-4 sm:gap-5 lg:gap-6`}>
              {filteredInfluencers.map((influencer) => (
                <UnifiedInfluencerCard
                  key={influencer.id}
                  influencer={influencer}
                  onViewProfile={(id) => navigate(`/profile/${id}`)}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredInfluencers.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <p className="text-base sm:text-lg text-muted-foreground mb-4">No creators found matching your filters</p>
                <Button onClick={clearFilters} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Clear all filters
                </Button>
              </div>
            )}

            {/* Pagination Placeholder */}
            {filteredInfluencers.length > 0 && (
              <div className="flex justify-center mt-8 sm:mt-10 lg:mt-12 gap-2">
                {[1, 2, 3, 4, 5].map((page) => (
                  <Button
                    key={page}
                    variant={page === 1 ? 'default' : 'outline'}
                    size="sm"
                    className={`${
                      page === 1 
                        ? 'bg-primary text-primary-foreground' 
                        : 'border-border text-foreground hover:bg-accent'
                    } w-8 h-8 sm:w-10 sm:h-10 p-0 text-xs sm:text-sm`}
                  >
                    {page}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
