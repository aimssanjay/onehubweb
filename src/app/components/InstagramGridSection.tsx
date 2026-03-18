import { ChevronLeft, ChevronRight } from 'lucide-react';
import { UnifiedInfluencerCard } from './UnifiedInfluencerCard';
import type { Influencer } from '../../data/mockData';
import { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

interface InstagramGridSectionProps {
  instagramInfluencers: Influencer[];
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

export function InstagramGridSection({ instagramInfluencers, onViewProfile }: InstagramGridSectionProps) {
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
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <section className="py-12 px-4 bg-background">
      <div className="max-w-[1350px] mx-auto">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">Instagram Creators</h2>
            <p className="text-muted-foreground text-sm md:text-base lg:text-lg">Discover top-rated Instagram influencers</p>
          </div>
          <Button
            variant="ghost"
            className="text-foreground hover:text-primary flex items-center gap-2 hidden sm:flex"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            className="text-foreground hover:text-primary sm:hidden"
            size="sm"
          >
            See All
          </Button>
        </div>

        {/* Desktop: Carousel */}
        <div className="relative px-2 sm:px-0 hidden md:block">
          <Slider {...settings}>
            {instagramInfluencers.map((influencer) => (
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
            {instagramInfluencers.map((influencer) => (
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
      </div>
    </section>
  );
}