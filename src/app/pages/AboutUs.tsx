import { CheckCircle2 } from 'lucide-react';

export function AboutUs() {
  const points = [
    'Local followers',
    'High engagement rates',
    'Past-performance results',
    'Nationality-based targetting',
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left Content */}
          <div>
            <p className="text-[#D4AF37] text-3xl md:text-4xl font-medium mb-4">About Us</p>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
              Relevant influencers with local followers
            </h1>

            <p className="text-2xl md:text-[40px] text-white/95 leading-relaxed mb-8">
              One Hub is a leading influencer marketing agency in Dubai. With a growing network of
              micro, macro, and mega influencers, we create engaging content from all niches.
            </p>

            <p className="text-2xl md:text-[40px] text-white/95 leading-relaxed mb-8">
              Here, we strive to bring together the talent of social media and the company to
              collaborate and create something extraordinary. So, no matter which industry you are in
              - we have just the right influencer for you!
            </p>

            <ul className="space-y-3">
              {points.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-7 h-7 text-[#D4AF37] fill-[#D4AF37]" />
                  <span className="text-[28px] md:text-[44px] leading-tight">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Image */}
          <div className="w-full">
            <img
              src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200"
              alt="About One Hub"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

