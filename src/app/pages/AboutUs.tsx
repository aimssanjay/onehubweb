import { Card } from '@/app/components/ui/card';
import { Check, Users, TrendingUp, BarChart3, Globe } from 'lucide-react';

export function AboutUs() {
  const features = [
    {
      icon: Users,
      title: 'Local followers',
      description: 'Connect with influencers who have authentic local followers in your target market.'
    },
    {
      icon: TrendingUp,
      title: 'High engagement rates',
      description: 'Work with creators who drive real engagement and meaningful interactions with their audience.'
    },
    {
      icon: BarChart3,
      title: 'Past-performance results',
      description: 'Access detailed analytics and proven track records of influencer campaigns.'
    },
    {
      icon: Globe,
      title: 'Nationality-based targeting',
      description: 'Reach specific demographics with influencers who resonate with your target nationality.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a1a2e] via-[#2d1b4e] to-[#1a1a2e] py-20 px-4">
        <div className="max-w-[1200px] mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            About Us
          </h1>
          <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto">
            Relevant influencers with local followers
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Text Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Leading Influencer Marketing Agency in Dubai
              </h2>
              <div className="space-y-4 text-muted-foreground text-lg">
                <p>
                  One Hub is a leading influencer marketing agency in Dubai. With a growing network of micro, macro, and mega influencers, we create engaging content from all niches.
                </p>
                <p>
                  Here, we strive to bring together the talent of social media and the company to collaborate and create something extraordinary. So, no matter which industry you are in - we have just the right influencer for you!
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=800&fit=crop"
                  alt="Team collaboration"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-white p-6 rounded-xl shadow-lg">
                <p className="text-4xl font-bold">330K+</p>
                <p className="text-sm">Influencers</p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              Why Choose One Hub?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-[#1a1a2e] via-[#2d1b4e] to-[#1a1a2e]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">330K+</p>
              <p className="text-white/80">Influencers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">10K+</p>
              <p className="text-white/80">Brands</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">$5M+</p>
              <p className="text-white/80">Paid to Creators</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">100K+</p>
              <p className="text-white/80">Collaborations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop"
                  alt="Our mission"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <div className="space-y-4 text-muted-foreground text-lg">
                <p>
                  At One Hub, our mission is to revolutionize influencer marketing by creating authentic connections between brands and content creators.
                </p>
                <p>
                  We believe in the power of genuine storytelling and local engagement. Our platform is designed to help brands find the perfect influencer match, ensuring campaigns that resonate with target audiences and drive real results.
                </p>
              </div>
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-foreground font-semibold">Authentic partnerships</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-foreground font-semibold">Data-driven results</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-foreground font-semibold">Local market expertise</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
