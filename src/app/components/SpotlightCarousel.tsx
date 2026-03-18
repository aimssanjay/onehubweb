import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { ImageWithFallback } from '@/app/components/ui/ImageWithFallback';

interface Creator {
  id: string;
  name: string;
  username: string;
  category: string;
  platform: string;
  image: string;
}

interface SpotlightCarouselProps {
  creators: Creator[];
  onViewProfile: (id: string) => void;
  autoPlayInterval?: number;
}

export function SpotlightCarousel({ 
  creators, 
  onViewProfile,
  autoPlayInterval = 3000 
}: SpotlightCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || creators.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % creators.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, creators.length, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? creators.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % creators.length;
    goToSlide(newIndex);
  };

  const getVisibleCreators = () => {
    const visible = [];
    const prevIndex = currentIndex === 0 ? creators.length - 1 : currentIndex - 1;
    const nextIndex = (currentIndex + 1) % creators.length;
    
    visible.push({ ...creators[prevIndex], position: 'left' });
    visible.push({ ...creators[currentIndex], position: 'center' });
    visible.push({ ...creators[nextIndex], position: 'right' });
    
    return visible;
  };

  const visibleCreators = getVisibleCreators();

  return (
    <div className="relative py-12">
      {/* Carousel Container */}
      <div className="flex items-center justify-center gap-2 md:gap-6 px-2 md:px-4 min-h-[400px]">
        {/* Left Arrow */}
        <Button
          onClick={goToPrevious}
          variant="outline"
          size="icon"
          className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white border-2 border-gray-300 hover:border-primary hover:bg-primary/10 text-foreground shrink-0 z-10"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </Button>

        {/* Cards Container */}
        <div className="flex items-center justify-center gap-2 md:gap-6 flex-1 max-w-5xl">
          {visibleCreators.map((creator, idx) => {
            const isCenter = creator.position === 'center';
            
            return (
              <div
                key={`${creator.id}-${idx}`}
                className={`relative transition-all duration-500 ease-out ${
                  isCenter 
                    ? 'scale-100 opacity-100 z-10' 
                    : 'scale-75 opacity-40 z-0 hidden md:block'
                }`}
                style={{
                  width: isCenter ? '280px' : '240px',
                }}
              >
                <div
                  onClick={() => isCenter && onViewProfile(creator.id)}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                    isCenter 
                      ? 'border-4 border-primary shadow-2xl shadow-primary/20' 
                      : 'border-2 border-white/10'
                  }`}
                  style={{
                    height: isCenter ? '380px' : '300px',
                  }}
                >
                  {/* Creator Image */}
                  <ImageWithFallback
                    src={creator.image}
                    alt={creator.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  
                  {/* Creator Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <div className="text-white font-bold text-lg md:text-xl mb-1">
                      {creator.username}
                    </div>
                    <div className="text-primary text-xs md:text-sm">
                      {creator.category} | {creator.platform}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <Button
          onClick={goToNext}
          variant="outline"
          size="icon"
          className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white border-2 border-gray-300 hover:border-primary hover:bg-primary/10 text-foreground shrink-0 z-10"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {creators.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 bg-primary'
                : 'w-2 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}