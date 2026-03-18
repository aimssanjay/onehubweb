import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  MapPin, 
  Instagram, 
  Star, 
  ArrowLeft, 
  Share2,
  Heart,
  MessageCircle,
  Award,
  Zap,
  Camera,
  ChevronRight,
  Plus,
  ShoppingCart,
  ChevronLeft
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { influencers } from '../../data/mockData';

export function InfluencerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState('package-1');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const influencer = influencers.find((inf) => inf.id === id);

  // Scroll to top when component mounts or ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!influencer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Card className="p-8 text-center bg-white border border-gray-200">
          <p className="text-gray-600 mb-4">Influencer not found</p>
          <Button onClick={() => navigate('/browse')} className="bg-primary hover:bg-secondary text-black">
            Back to Browse
          </Button>
        </Card>
      </div>
    );
  }

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  const totalFollowers = Object.values(influencer.platforms).reduce((a, b) => a + b, 0);
  const engagementRate = 'N/A';

  // Mock portfolio images for carousel
  const portfolioImages = [
    influencer.profileImage,
    influencer.coverImage || influencer.profileImage,
    influencer.portfolio[0]?.url || influencer.profileImage,
    influencer.portfolio[1]?.url || influencer.profileImage,
  ];

  // Mock data for analytics
  const audienceLocationData = [
    { country: 'United States', code: 'US', percentage: 51 },
    { country: 'Canada', code: 'CA', percentage: 18 },
    { country: 'United Kingdom', code: 'GB', percentage: 3 },
    { country: 'Other', code: 'Other', percentage: 13 },
  ];

  const audienceAgeData = [
    { range: '13-17', percentage: 3 },
    { range: '18-24', percentage: 29 },
    { range: '25-34', percentage: 46 },
    { range: '35-44', percentage: 17 },
    { range: '45-64', percentage: 6 },
    { range: '65+', percentage: 0 },
  ];

  const reviews = [
    {
      name: 'Andrea',
      initial: 'A',
      package: '1 UGC Product Video (20 Seconds)',
      rating: 5,
      date: 'July 2025',
      text: 'Thanks for such a cute video. : )',
    },
    {
      name: 'Aliénor',
      initial: 'A',
      package: '2 Instagram Photo Feed Posts',
      rating: 5,
      date: 'September 2023',
      text: 'Aliénor left a 5.0 star review.',
    },
    {
      name: 'John-ritchy',
      initial: 'J',
      package: '3 UGC Product Videos (20 Seconds) & 3 UGC Product Photos',
      rating: 5,
      date: 'February 2023',
      text: 'High-Quality Content. Thank you so much!!!',
    },
  ];

  const similarInfluencers = influencers.filter(inf => inf.id !== id).slice(0, 3);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? portfolioImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === portfolioImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-0">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 md:relative md:border-0">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2 cursor-pointer hover:text-primary text-gray-600 p-2"
            size="sm"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden md:inline">Back</span>
          </Button>

          {/* Mobile Actions */}
          {isMobile && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <ShoppingCart className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-8">
        {/* Desktop Header Section */}
        {!isMobile && (
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 max-w-2xl">
              {influencer.category} content creator with versatile feed!
            </h1>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2 border-gray-300 text-gray-700">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-2 border-gray-300 text-gray-700">
                <Heart className="w-4 h-4" />
                Save
              </Button>
              <Button size="sm" className="gap-2 bg-pink-500 hover:bg-pink-600 text-white">
                <Plus className="w-4 h-4" />
                Invite to Campaign
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Image Carousel - Mobile */}
            {isMobile ? (
              <div className="relative -mx-4">
                <div 
                  className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                  onScroll={(e) => {
                    const scrollLeft = e.currentTarget.scrollLeft;
                    const width = e.currentTarget.offsetWidth;
                    const index = Math.round(scrollLeft / width);
                    setCurrentImageIndex(index);
                  }}
                >
                  {portfolioImages.map((image, index) => (
                    <div
                      key={index}
                      className="w-full flex-shrink-0 snap-start"
                    >
                      <img
                        src={image}
                        alt={`${influencer.name} - ${index + 1}`}
                        className="w-full h-[400px] object-cover"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                  {currentImageIndex + 1}/{portfolioImages.length}
                </div>

                {/* Carousel Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {portfolioImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const carousel = document.querySelector('.flex.overflow-x-auto');
                        if (carousel) {
                          carousel.scrollTo({
                            left: index * carousel.clientWidth,
                            behavior: 'smooth',
                          });
                        }
                      }}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentImageIndex 
                          ? 'w-6 bg-white' 
                          : 'w-1.5 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* Desktop Image Gallery */
              <div className="grid grid-cols-3 gap-4">
                {portfolioImages.slice(0, 3).map((image, index) => (
                  <div key={index} className="aspect-[3/4] rounded-lg overflow-hidden relative">
                    <img
                      src={image}
                      alt={influencer.name}
                      className="w-full h-full object-cover"
                    />
                    {index === 2 && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute bottom-4 right-4 bg-white hover:bg-gray-100 text-gray-900 shadow-lg text-xs"
                      >
                        <Camera className="w-3 h-3 mr-1" />
                        Show All
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Mobile Title */}
            {isMobile && (
              <div className="px-0">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 leading-tight">
                  {influencer.category} content creator with versatile feed!
                </h1>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 border-gray-300 text-gray-700 text-xs h-8 px-3"
                  >
                    <Share2 className="w-3 h-3" />
                    Share
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 border-gray-300 text-gray-700 text-xs h-8 px-3"
                  >
                    <Heart className="w-3 h-3" />
                    Save
                  </Button>
                  <Button 
                    size="sm" 
                    className="gap-2 bg-pink-500 hover:bg-pink-600 text-white text-xs h-8 px-3 flex-1 min-w-0"
                  >
                    <Plus className="w-3 h-3" />
                    Invite to Campaign
                  </Button>
                </div>
              </div>
            )}

            {/* Profile Info Section */}
            <div className="flex items-start gap-3 md:gap-4">
              <img
                src={influencer.profileImage}
                alt={influencer.name}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900">{influencer.name}</h2>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900 text-sm">5.0</span>
                  </div>
                  <span className="text-gray-500 text-sm">·</span>
                  <a href="#reviews" className="text-gray-700 underline hover:text-gray-900 text-sm">
                    7 Reviews
                  </a>
                </div>
                <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {influencer.location}
                </p>
                
                {influencer.platforms.instagram && (
                  <Badge className="bg-blue-50 text-blue-600 border border-blue-200 mb-4 text-xs">
                    <Instagram className="w-3 h-3 mr-1" />
                    {formatFollowers(influencer.platforms.instagram)} Followers
                  </Badge>
                )}

                {/* Badges - Hidden on mobile initially, can be shown in expandable section */}
                {!isMobile && (
                  <div className="space-y-3 mb-4">
                    {influencer.featured && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                          <Award className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{influencer.name} is a Top Creator</p>
                          <p className="text-xs text-gray-600">
                            Top creators have completed multiple orders and have a high rating from brands.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{influencer.name} Responds Fast</p>
                        <p className="text-xs text-gray-600">
                          {influencer.name} responds to requests faster than most creators.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bio */}
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  {influencer.bio || '2020 has taught me that pivoting is everything & I have been working to perfect the art of maintaining a versatile feed for times where certain content, ie. travel, may not be as possible. I\'m very happy to be able to share many aspects of my life with my followers, from fitness to food to fashion, etc.'}
                </p>
              </div>
            </div>

            <Separator className="bg-gray-200" />

            {/* Packages Section */}
            <div id="packages">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Packages</h2>
              
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4 md:mb-6 bg-transparent border-b border-gray-200 rounded-none w-full justify-start h-auto p-0">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none text-sm md:text-base pb-2"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger 
                    value="instagram"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none text-sm md:text-base pb-2"
                  >
                    Instagram
                  </TabsTrigger>
                  <TabsTrigger 
                    value="ugc"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none text-sm md:text-base pb-2"
                  >
                    UGC
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-3 md:space-y-4">
                  {influencer.packages.map((pkg) => (
                    <Card 
                      key={pkg.id}
                      className="p-4 md:p-5 border-2 border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                            <Instagram className="w-4 h-4 md:w-5 md:h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-bold text-gray-900 text-sm md:text-base">{pkg.type}</h3>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-lg md:text-xl font-bold text-gray-900">${pkg.price}</span>
                              </div>
                            </div>
                            <p className="text-xs md:text-sm text-gray-600 mb-2">{pkg.description}</p>
                            {pkg.deliverables && pkg.deliverables.length > 0 && (
                              <p className="text-xs text-gray-500">
                                {pkg.deliverables.join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {/* Negotiate Package Option */}
                  <Card className="p-4 md:p-5 border-2 border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1 text-sm md:text-base">Negotiate a Package</h3>
                          <p className="text-xs md:text-sm text-gray-600">
                            Tailor a collaboration to your needs: propose custom terms, pricing, or requirements.
                          </p>
                        </div>
                      </div>
                      <Plus className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="instagram">
                  <p className="text-gray-600 text-sm">Instagram packages only...</p>
                </TabsContent>

                <TabsContent value="ugc">
                  <p className="text-gray-600 text-sm">UGC packages only...</p>
                </TabsContent>
              </Tabs>
            </div>

            <Separator className="bg-gray-200" />

            {/* Analytics Section */}
            <div id="analytics">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Analytics</h2>
              
              <Tabs defaultValue="instagram" className="w-full">
                <TabsList className="mb-4 md:mb-6 bg-transparent border-b border-gray-200 rounded-none w-full justify-start h-auto p-0">
                  <TabsTrigger 
                    value="instagram" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none gap-2 text-sm md:text-base pb-2"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="instagram" className="space-y-6 md:space-y-8">
                  {/* Stats Overview */}
                  <div className="grid grid-cols-3 gap-4 md:gap-8">
                    <div className="text-center md:text-left">
                      <div className="text-xl md:text-3xl font-bold text-gray-900 mb-1">
                        {formatFollowers(influencer.platforms.instagram || totalFollowers)}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600">Followers</div>
                    </div>
                    <div className="text-center md:text-left">
                      <div className="text-xl md:text-3xl font-bold text-gray-900 mb-1">5.2k</div>
                      <div className="text-xs md:text-sm text-gray-600">Avg Views</div>
                    </div>
                    <div className="text-center md:text-left">
                      <div className="text-xl md:text-3xl font-bold text-gray-900 mb-1">{engagementRate}</div>
                      <div className="text-xs md:text-sm text-gray-600">Engagement</div>
                    </div>
                  </div>

                  {/* Location and Age Charts - Two Column Layout on Desktop */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Audience Location */}
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 text-base">Audience Location</h3>
                      <div className="space-y-3 md:space-y-4">
                        {audienceLocationData.map((location) => (
                          <div key={location.code}>
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-gray-700">
                                <span className="text-gray-500 uppercase text-xs mr-1">{location.code}</span>
                                {location.country}
                              </span>
                              <span className="font-semibold text-gray-900">{location.percentage}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full transition-all"
                                style={{ width: `${location.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Audience Age - Vertical Bar Chart */}
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 text-base">Audience Age</h3>
                      <div className="flex items-end justify-between h-48 gap-2">
                        {audienceAgeData.map((age) => (
                          <div key={age.range} className="flex-1 flex flex-col items-center h-full">
                            <div className="text-xs font-semibold text-gray-900 mb-2 order-1">
                              {age.percentage}%
                            </div>
                            <div className="w-full bg-gray-200 rounded-t-lg relative flex-1 order-2">
                              <div
                                className="w-full bg-blue-400 rounded-t-lg absolute bottom-0"
                                style={{ height: `${age.percentage}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-600 mt-2 order-3">{age.range}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Audience Gender - Donut Chart */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4 text-base">Audience Gender</h3>
                    <div className="flex items-center gap-8">
                      {/* Donut Chart */}
                      <div className="relative w-32 h-32 flex-shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          {/* Female (55%) - Blue */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#93C5FD"
                            strokeWidth="20"
                            strokeDasharray={`${55 * 2.51} ${(100 - 55) * 2.51}`}
                          />
                          {/* Male (45%) - Gray */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="20"
                            strokeDasharray={`${45 * 2.51} ${(100 - 45) * 2.51}`}
                            strokeDashoffset={`${-55 * 2.51}`}
                          />
                        </svg>
                      </div>
                      {/* Legend */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-blue-300 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Female</span>
                          <span className="text-sm font-semibold text-gray-900">55%</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-gray-300 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Male</span>
                          <span className="text-sm font-semibold text-gray-900">45%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <Separator className="bg-gray-200" />

            {/* Reviews Section */}
            <div id="reviews">
              <div className="flex flex-wrap items-center gap-2 mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">7 Reviews</h2>
                <span className="text-gray-500">·</span>
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg md:text-xl font-bold text-gray-900">5.0</span>
              </div>

              {/* Rating Categories - Hidden on mobile */}
              {!isMobile && (
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-8 h-8 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-600">Communication</div>
                      <div className="font-semibold text-gray-900">5.0</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-8 h-8 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-600">Timeliness</div>
                      <div className="font-semibold text-gray-900">5.0</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-8 h-8 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-600">Satisfaction</div>
                      <div className="font-semibold text-gray-900">5.0</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Individual Reviews */}
              <div className="space-y-4 md:space-y-6">
                {reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 md:pb-6 last:border-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center flex-shrink-0">
                        <span className="font-semibold text-gray-900 text-sm">{review.initial}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 mb-1 text-sm md:text-base">{review.name}</div>
                        <div className="text-xs text-gray-600 mb-2 line-clamp-1">{review.package}</div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">· {review.date}</span>
                        </div>
                        <p className="text-sm text-gray-700">{review.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Influencers - Hidden on mobile */}
            {!isMobile && (
              <>
                <Separator className="bg-gray-200" />
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Influencers similar to {influencer.name}</h2>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {similarInfluencers.map((inf) => (
                      <div 
                        key={inf.id} 
                        className="cursor-pointer group"
                        onClick={() => navigate(`/profile/${inf.id}`)}
                      >
                        <div className="aspect-[3/4] rounded-lg overflow-hidden mb-3">
                          <img
                            src={inf.profileImage}
                            alt={inf.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs bg-gray-100">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                            {inf.rating}
                          </Badge>
                          <span className="text-xs text-gray-600">{inf.category}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{inf.name}</p>
                        <p className="text-sm text-gray-600">${inf.startingPrice}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar - Only Desktop */}
          {!isMobile && (
            <div className="lg:col-span-1">
              <Card className="p-6 border-2 border-gray-200 sticky top-4">
                <h3 className="font-bold text-gray-900 mb-4">Book {influencer.name}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Select Package</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg text-sm">
                      {influencer.packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.type} - ${pkg.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button className="w-full bg-primary hover:bg-secondary text-black font-semibold">
                    Add to Cart
                  </Button>
                  <Button variant="outline" className="w-full border-gray-300">
                    Message {influencer.name}
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom CTA - Mobile Only */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="text-sm text-gray-600">Starting from</div>
              <div className="text-xl font-bold text-gray-900">${influencer.startingPrice}</div>
            </div>
            <Button 
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-8 h-12 rounded-xl"
            >
              Book Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}