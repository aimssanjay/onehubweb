import { useRef } from 'react';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useCategories } from '../hooks/useCategories';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1653640869615-e9878a2c8344?w=400';

interface CategoryCarouselProps {
  onCategorySelect?: (category: string) => void;
}

export function CategoryCarousel({ onCategorySelect }: CategoryCarouselProps) {
  const { categories } = useCategories();
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 3000,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 3000,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 3000,
        }
      }
    ]
  };

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-0">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Categories</h2>
        
        {/* Custom Navigation Arrows */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => sliderRef.current?.slickPrev()}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
            style={{
              backgroundColor: '#ffffff',
              border: '2px solid #D4AF37',
              color: '#D4AF37'
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => sliderRef.current?.slickNext()}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
            style={{
              backgroundColor: '#D4AF37',
              color: '#ffffff'
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Slider ref={sliderRef} {...settings}>
        {categories.map((category) => (
          <div key={category.id} className="px-2">
            <button
              onClick={() => onCategorySelect?.(category.name)}
              className="relative w-full h-[180px] sm:h-[200px] rounded-2xl overflow-hidden group transition-transform hover:scale-105 cursor-pointer"
            >
              {/* Category Image */}
              <img
                src={category.image ?? FALLBACK_IMAGE}
                alt={category.name}
                className="w-full h-full object-cover"
              />
              
              {/* Dark Overlay */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
              />
              
              {/* Category Name */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-base sm:text-lg">
                  {category.name}
                </h3>
              </div>

              {/* Hover Border Effect */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  border: '3px solid #D4AF37',
                }}
              />
            </button>
          </div>
        ))}
      </Slider>
    </div>
  );
}