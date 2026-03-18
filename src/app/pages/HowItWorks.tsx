import { useNavigate } from 'react-router';
import { 
  Search,
  Shield,
  Star,
  DollarSign,
  CheckCircle,
  MessageCircle,
  Lock,
  Target,
  Send,
  Users,
  BarChart3,
  TrendingUp,
  Clock,
  Instagram,
  Heart,
  Eye,
  MessageSquare
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export function HowItWorks() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Section 1: Search & Hire */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <Badge className="bg-pink-500 text-white hover:bg-pink-600 mb-6">
                Search
              </Badge>
              <h1 className="text-4xl font-bold text-gray-900 mb-12">
                Find and Hire Influencers in Seconds<br />on the Marketplace
              </h1>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Search Influencers
                  </h3>
                  <p className="text-gray-600">
                    Search thousands of vetted Instagram, TikTok, and YouTube influencers.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Purchase & Chat Securely
                  </h3>
                  <p className="text-gray-600">
                    Safely purchase and communicate through Collabstr. We hold your payment until the work is completed.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Receive Quality Content
                  </h3>
                  <p className="text-gray-600">
                    Receive your high-quality content from influencers directly through the platform.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Visual Mockup */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                {/* Search Bar Mockup */}
                <div className="flex items-center gap-3 mb-6">
                  <Button variant="ghost" size="sm" className="text-gray-600">
                    Niche
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600">
                    Location
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600">
                    Followers
                  </Button>
                  <div className="ml-auto w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Influencer Grid Mockup */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="aspect-[3/4] rounded-lg bg-gray-200 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1759350075177-eeb89d507990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmZsdWVuY2VyJTIwd29tYW4lMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzAyMDk3NTh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Influencer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-[3/4] rounded-lg bg-gray-200 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1582384910893-0fcfbd14144f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW50JTIwY3JlYXRvciUyMGxhcHRvcCUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzAyMDk3NTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Influencer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-[3/4] rounded-lg bg-gray-200 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1632613714614-e817d3814a8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbGlmZXN0eWxlJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzcwMTEzMDY3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Influencer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="aspect-[3/4] rounded-lg bg-gray-200 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1759350075177-eeb89d507990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmZsdWVuY2VyJTIwd29tYW4lMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzAyMDk3NTh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Influencer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-[3/4] rounded-lg bg-gray-200 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1632613714614-e817d3814a8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbGlmZXN0eWxlJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzcwMTEzMDY3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Influencer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Package Detail Mockup */}
                <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-900">Instagram Stories</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">$250</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Lifestyle, Fashion, Content creator, artist, photography, Travel
                  </p>
                  <div className="text-xs text-pink-500 font-semibold">
                    Starting at $250
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Feature Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* No Upfront Cost */}
            <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                No Upfront Cost
              </h3>
              <p className="text-sm text-gray-600">
                Search influencers for free. No subscriptions, contracts, or hidden fees.
              </p>
            </Card>

            {/* Vetted Influencers */}
            <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Vetted Influencers
              </h3>
              <p className="text-sm text-gray-600">
                Every influencer is vetted by us. Always receive high-quality, professional content.
              </p>
            </Card>

            {/* Instant Chat */}
            <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Instant Chat
              </h3>
              <p className="text-sm text-gray-600">
                Instantly chat with influencers and stay in touch throughout the whole transaction.
              </p>
            </Card>

            {/* Secure Purchases */}
            <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Secure Purchases
              </h3>
              <p className="text-sm text-gray-600">
                Your money is held safely until you approve the influencer's work.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 3: Campaigns */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Visual Mockup */}
            <div className="relative order-2 lg:order-1">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                {/* Campaign Cards Mockup */}
                <div className="space-y-4">
                  {/* Card 1 */}
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-20 h-20 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1759350075177-eeb89d507990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmZsdWVuY2VyJTIwd29tYW4lMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzAyMDk3NTh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Influencer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 mb-1">$55</div>
                      <div className="text-xs text-gray-600 mb-3">Fashion & Beauty Content</div>
                      <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white text-xs">
                        View Profile
                      </Button>
                      <Button size="sm" variant="outline" className="ml-2 text-xs border-pink-300 text-pink-500">
                        Accept
                      </Button>
                      <Button size="sm" variant="ghost" className="ml-2 text-xs text-gray-600">
                        Decline
                      </Button>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-20 h-20 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1632613714614-e817d3814a8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbGlmZXN0eWxlJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzcwMTEzMDY3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Influencer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 mb-1">$150</div>
                      <div className="text-xs text-gray-600 mb-3">Lifestyle Content Creator</div>
                      <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white text-xs">
                        View Profile
                      </Button>
                      <Button size="sm" variant="outline" className="ml-2 text-xs border-pink-300 text-pink-500">
                        Accept
                      </Button>
                      <Button size="sm" variant="ghost" className="ml-2 text-xs text-gray-600">
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Fashion Category Mockup */}
                <div className="mt-6 flex items-center justify-center gap-2">
                  <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">👗</span>
                  </div>
                  <span className="text-xs text-gray-600">Cat: Fashion</span>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="order-1 lg:order-2">
              <Badge className="bg-pink-500 text-white hover:bg-pink-600 mb-6">
                Campaigns
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-12">
                Post Campaigns and Have 550,000+<br />Influencers Come to You
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Set Targeting
                  </h3>
                  <p className="text-gray-600">
                    Specify demographics including niche, location and following size of the influencers you want to target.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Post Campaign
                  </h3>
                  <p className="text-gray-600">
                    Centralize your images, requirements, and more in a campaign brief sent to 550,000 influencers.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Influencers Apply
                  </h3>
                  <p className="text-gray-600">
                    Targeted influencers submit their pricing, and you choose who to collaborate with.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Analytics & Tracking */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <Badge className="bg-pink-500 text-white hover:bg-pink-600 mb-6">
                Track
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-12">
                Track Post Analytics and Performance<br />in Real Time
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    One-Click Tracking
                  </h3>
                  <p className="text-gray-600">
                    Track Instagram, TikTok, and YouTube content in real time from a single dashboard. Say goodbye to manual tracking and messy spreadsheets.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Advanced Analytics & Reporting
                  </h3>
                  <p className="text-gray-600">
                    Analyze content performance over time, including impressions, engagement and more. Organize performance by campaign and effortlessly build reports.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Fully Automated
                  </h3>
                  <p className="text-gray-600">
                    Metrics are updated every 24 hours, ensuring performance data is always up-to-date.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Visual Mockup */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                {/* Campaign Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                  <div className="w-12 h-12 rounded-lg bg-pink-500 flex items-center justify-center">
                    <span className="text-white text-xs">🎯</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">Golf Activewear Line Launch</h3>
                  </div>
                  <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white text-xs">
                    Track New Post
                  </Button>
                </div>

                {/* Summary Stats */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Summary</h4>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">3.9M</div>
                      <div className="text-xs text-gray-600">Total Views</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">4.6M</div>
                      <div className="text-xs text-gray-600">Total Likes</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">11.4K</div>
                      <div className="text-xs text-gray-600">Total Comments</div>
                    </div>
                  </div>
                </div>

                {/* Performance Chart Mockup */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Performance over Time</h4>
                  <div className="h-32 bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 rounded-lg flex items-end justify-between px-2 pb-2">
                    <div className="w-1 h-12 bg-purple-400 rounded-t"></div>
                    <div className="w-1 h-16 bg-pink-400 rounded-t"></div>
                    <div className="w-1 h-20 bg-blue-400 rounded-t"></div>
                    <div className="w-1 h-24 bg-purple-400 rounded-t"></div>
                    <div className="w-1 h-32 bg-pink-500 rounded-t"></div>
                    <div className="w-1 h-28 bg-blue-400 rounded-t"></div>
                    <div className="w-1 h-20 bg-purple-400 rounded-t"></div>
                    <div className="w-1 h-16 bg-pink-400 rounded-t"></div>
                    <div className="w-1 h-24 bg-blue-400 rounded-t"></div>
                    <div className="w-1 h-20 bg-purple-400 rounded-t"></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                  </div>
                </div>

                {/* Post Performance */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1759350075177-eeb89d507990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmZsdWVuY2VyJTIwd29tYW4lMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzAyMDk3NTh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Post"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">@sarah</div>
                      <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white text-xs mt-1">
                        View Post
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-3 text-center">
                    <div>
                      <div className="text-sm font-bold text-gray-900">0</div>
                      <div className="text-xs text-gray-600">Reach</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">317k</div>
                      <div className="text-xs text-gray-600">Likes</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">11k</div>
                      <div className="text-xs text-gray-600">Comments</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">318k</div>
                      <div className="text-xs text-gray-600">Engagements</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">11.0%</div>
                      <div className="text-xs text-gray-600">Eng. Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of brands and influencers already using OneHub to create amazing campaigns.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-pink-500 hover:bg-pink-600 text-white cursor-pointer"
              onClick={() => navigate('/browse')}
            >
              Browse Influencers
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate('/registration')}
            >
              Sign Up Free
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
