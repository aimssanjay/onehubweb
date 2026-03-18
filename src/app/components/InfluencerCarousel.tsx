import { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { UnifiedInfluencerCard } from './UnifiedInfluencerCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Influencer } from '../../data/mockData';

interface InfluencerCarouselProps {
  influencers: Influencer[];
  onViewProfile: (id: string) => void;
}

function NextArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-2 md:-right-14 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
      style={{ backgroundColor: '#D4AF37' }}
    >
      <ChevronRight className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#ffffff' }} />
    </button>
  );
}

function PrevArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-2 md:-left-14 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
      style={{ backgroundColor: '#D4AF37' }}
    >
      <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#ffffff' }} />
    </button>
  );
}

export function InfluencerCarousel({ influencers, onViewProfile }: InfluencerCarouselProps) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <>
      {/* Desktop: Carousel with arrows */}
      <div className="hidden md:block relative px-2 sm:px-0">
        <Slider {...settings}>
          {influencers.map((influencer) => (
            <div key={influencer.id} className="px-1 sm:px-3">
              <UnifiedInfluencerCard
                influencer={influencer}
                onViewProfile={onViewProfile}
              />
            </div>
          ))}
        </Slider>
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