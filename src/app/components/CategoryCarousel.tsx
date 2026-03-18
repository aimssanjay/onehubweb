import { useRef } from 'react';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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

interface CategoryCarouselProps {
  onCategorySelect?: (category: string) => void;
}

export function CategoryCarousel({ onCategorySelect }: CategoryCarouselProps) {
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
        {categoryData.map((category) => (
          <div key={category.name} className="px-2">
            <button
              onClick={() => onCategorySelect?.(category.name)}
              className="relative w-full h-[180px] sm:h-[200px] rounded-2xl overflow-hidden group transition-transform hover:scale-105 cursor-pointer"
            >
              {/* Category Image */}
              <img 
                src={category.image} 
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