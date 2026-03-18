import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { UnifiedInfluencerCard } from './UnifiedInfluencerCard';
import type { Influencer } from '../../data/mockData';

interface UGCCreatorCarouselProps {
  influencers: Influencer[];
  onViewProfile: (id: string) => void;
}

export function UGCCreatorCarousel({ influencers, onViewProfile }: UGCCreatorCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const carouselRef = useRef<HTMLDivElement>(null);
  const maxIndex = Math.max(0, influencers.length - itemsPerPage);

  // Responsive items per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(2); // Mobile: 2 columns
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(3); // Tablet: 3 columns
      } else {
        setItemsPerPage(4); // Desktop: 4 columns
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [maxIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <>
      {/* Desktop: Carousel with arrows */}
      <div className="relative hidden md:block">
        {/* Navigation Arrows */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-5 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg"
            style={{ backgroundColor: '#D4AF37' }}
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-black" />
          </button>
        )}

        {currentIndex < maxIndex && (
          <button
            onClick={handleNext}
            className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-5 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg"
            style={{ backgroundColor: '#D4AF37' }}
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-black" />
          </button>
        )}

        {/* Carousel Container */}
        <div className="overflow-hidden px-2 sm:px-0" ref={carouselRef}>
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
            }}
          >
            {influencers.map((influencer) => (
              <div
                key={influencer.id}
                className="flex-shrink-0 px-1 sm:px-2"
                style={{ width: `${100 / itemsPerPage}%` }}
              >
                <UnifiedInfluencerCard
                  influencer={influencer}
                  onViewProfile={onViewProfile}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                backgroundColor: index === currentIndex ? '#D4AF37' : '#404040',
              }}
            />
          ))}
        </div>
      </div>

      {/* Mobile: Horizontal Scroll */}
      <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 snap-x snap-mandatory">
        <div className="flex gap-4 px-4 pb-2">
          {influencers.map((influencer) => (
            <div 
              key={influencer.id} 
              className="flex-shrink-0 snap-start"
              style={{ width: 'calc(100vw - 120px)' }}
            >
              <UnifiedInfluencerCard
                influencer={influencer}
                onViewProfile={onViewProfile}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}