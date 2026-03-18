import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  MessageSquare, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle,
  Settings,
  LayoutDashboard,
  PlusCircle,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Edit,
  Save,
  LogOut,
  Bell,
  User,
  ArrowLeft,
  Link as LinkIcon,
  Instagram,
  Youtube,
  Twitter,
  Upload,
  Camera,
  CreditCard,
  Lock,
  ChevronDown,
  Eye,
  Menu,
  X,
  Briefcase
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { campaigns } from '../../data/mockData';
import { Logo } from '../components/Logo';

type TabType = 'overview' | 'profile' | 'create-campaign' | 'browse' | 'messages';
type ProfileTabType = 'details' | 'social-media' | 'images' | 'account';
type AccountTabType = 'details' | 'payment' | 'settings';

const categories = [
  'Beauty', 'Fashion', 'Travel', 'Health & Fitness', 'Food & Drink',
  'Comedy & Entertainment', 'Art & Photography', 'Family & Children',
  'Music & Dance', 'Entrepreneur & Business', 'Education', 'Animals & Pets',
  'Gaming', 'Technology', 'Athletes & Sports', 'Adventure & Outdoors',
  'Healthcare', 'Automotive', 'Skilled Trades', 'Cannabis'
];

export function BrandDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [profileTab, setProfileTab] = useState<ProfileTabType>('details');
  const [accountTab, setAccountTab] = useState<AccountTabType>('details');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Travel']);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const [brandData, setBrandData] = useState({
    companyName: 'Acme Corporation',
    email: 'contact@acmecorp.com',
    password: '••••••••',
    phone: '+1 (555) 123-4567',
    website: 'www.acmecorp.com',
    industry: 'Technology',
    location: 'San Francisco, CA',
    description: 'Leading technology company specializing in innovative solutions for modern businesses.',
    legalCompanyName: 'Acme Corporation Inc.',
    vatId: '',
    billingAddress: '',
    billingCity: '',
    profilePhoto: '',
    coverPhoto: '',
  });

  const [socialMedia, setSocialMedia] = useState({
    website: '',
    instagram: '',
    tiktok: '',
    youtube: '',
    twitter: '',
  });

  const [campaignForm, setCampaignForm] = useState({
    name: '',
    description: '',
    budget: '',
    startDate: '',
    endDate: '',
    platform: 'instagram',
    category: 'lifestyle',
    deliverables: '',
    requirements: '',
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stats = [
    {
      icon: Users,
      label: 'Active Campaigns',
      value: '8',
      change: '+2 this week',
      changeType: 'positive' as const,
    },
    {
      icon: DollarSign,
      label: 'Total Spend',
      value: '$12,450',
      change: '+$1,200 this month',
      changeType: 'positive' as const,
    },
    {
      icon: TrendingUp,
      label: 'Hired Influencers',
      value: '24',
      change: '+6 this month',
      changeType: 'positive' as const,
    },
    {
      icon: MessageSquare,
      label: 'Unread Messages',
      value: '5',
      change: '2 new today',
      changeType: 'neutral' as const,
    },
  ];

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Edit Profile', icon: Settings },
    { id: 'create-campaign', label: 'Create Campaign', icon: PlusCircle },
    { id: 'browse', label: 'Browse Creators', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    if (tab === 'browse') {
      navigate('/browse');
    }
  };

  const handleLogout = () => {
    navigate('/brand/login');
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const handleSaveProfile = () => {
    localStorage.setItem('brandProfile', JSON.stringify(brandData));
    alert('Profile updated successfully!');
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Campaign created:', campaignForm);
    alert('Campaign created successfully!');
    setCampaignForm({
      name: '',
      description: '',
      budget: '',
      startDate: '',
      endDate: '',
      platform: 'instagram',
      category: 'lifestyle',
      deliverables: '',
      requirements: '',
    });
    setActiveTab('overview');
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      {/* Top Navigation */}
      <div className="border-b border-gray-800 bg-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            <div className="flex items-center gap-3">
              {isMobile && (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-white p-2 hover:bg-gray-800 rounded-lg"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              )}
              <Logo />
              {!isMobile && (
                <span className="text-primary text-sm font-medium ml-2">Brand Portal</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-900 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              </button>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-black font-bold text-sm md:text-base">
                {brandData.companyName.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="w-72 h-full bg-black border-r border-gray-800 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu Header */}
            <div className="p-6 border-b border-gray-800">
              <Logo />
            </div>
            
            {/* Menu Items */}
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id as TabType)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary text-black'
                        : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              
              {/* View Profile */}
              <Link to="/brand-public-profile">
                <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-gray-400 hover:bg-gray-900 hover:text-white transition-colors">
                  <Eye className="w-5 h-5" />
                  <span className="font-medium">View Profile</span>
                </button>
              </Link>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-red-400 hover:bg-gray-900 transition-colors mt-6"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className="w-64 min-h-[calc(100vh-64px)] bg-black border-r border-gray-800 p-6">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id as TabType)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary text-black'
                        : 'text-white hover:bg-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              <Link to="/brand-public-profile">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-white hover:bg-gray-900">
                  <Eye className="w-5 h-5" />
                  <span className="font-medium">View Profile</span>
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-900 transition-colors mt-8"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-black mb-2">Dashboard Overview</h1>
              <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8">
                Welcome back, {brandData.companyName}! Here's your campaign performance.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-black rounded-xl p-4 md:p-6 border border-gray-800">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                        <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2">{stat.value}</p>
                    <p className={`text-xs md:text-sm ${
                      stat.changeType === 'positive' ? 'text-green-400' : 'text-gray-400'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-black rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-gray-800">
                <h2 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">Quick Actions</h2>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('create-campaign')}
                    className="bg-primary hover:bg-secondary text-black font-semibold px-4 md:px-6 py-2.5 md:py-3 rounded-lg transition-colors text-sm md:text-base"
                  >
                    <PlusCircle className="w-4 h-4 mr-2 inline" />
                    Create New Campaign
                  </button>
                  <Link to="/browse" className="flex-1 sm:flex-initial">
                    <button className="w-full bg-gray-900 hover:bg-gray-800 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg transition-colors border border-gray-700 text-sm md:text-base">
                      <Users className="w-4 h-4 mr-2 inline" />
                      Browse Influencers
                    </button>
                  </Link>
                  <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg transition-colors border border-gray-700 text-sm md:text-base">
                    <MessageSquare className="w-4 h-4 mr-2 inline" />
                    View Messages
                  </button>
                </div>
              </div>

              {/* Active Campaigns - Mobile Cards / Desktop Table */}
              <div className="bg-black rounded-xl p-4 md:p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h2 className="text-lg md:text-xl font-semibold text-white">Active Campaigns</h2>
                  <button className="text-primary hover:text-secondary transition-colors text-xs md:text-sm font-medium">
                    View All
                  </button>
                </div>
                
                {/* Desktop Table View */}
                {!isMobile && (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-800">
                          <TableHead className="text-gray-400">Campaign Name</TableHead>
                          <TableHead className="text-gray-400">Influencer</TableHead>
                          <TableHead className="text-gray-400">Status</TableHead>
                          <TableHead className="text-gray-400">Budget</TableHead>
                          <TableHead className="text-gray-400">Duration</TableHead>
                          <TableHead className="text-gray-400">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {campaigns.slice(0, 5).map((campaign) => (
                          <TableRow key={campaign.id} className="border-gray-800">
                            <TableCell className="font-semibold text-white">{campaign.name}</TableCell>
                            <TableCell className="text-gray-300">{campaign.influencer}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusBadge(campaign.status)}>
                                <span className="flex items-center gap-1.5">
                                  {getStatusIcon(campaign.status)}
                                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                </span>
                              </Badge>
                            </TableCell>
                            <TableCell className="text-white">${campaign.budget.toLocaleString()}</TableCell>
                            <TableCell className="text-sm text-gray-400">
                              {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <button className="text-primary hover:text-secondary transition-colors text-sm">
                                View
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Mobile Card View */}
                {isMobile && (
                  <div className="space-y-3">
                    {campaigns.slice(0, 5).map((campaign) => (
                      <div key={campaign.id} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-1">{campaign.name}</h3>
                            <p className="text-sm text-gray-400">{campaign.influencer}</p>
                          </div>
                          <Badge variant="outline" className={`${getStatusBadge(campaign.status)} text-xs`}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(campaign.status)}
                              {campaign.status}
                            </span>
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                          <div>
                            <p className="text-gray-500">Budget</p>
                            <p className="text-white font-medium">${campaign.budget.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Duration</p>
                            <p className="text-white font-medium text-xs">
                              {new Date(campaign.startDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button className="w-full bg-primary text-black py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-4xl font-bold text-black mb-2">Edit Profile</h1>
                <p className="text-sm md:text-base text-gray-600">Manage your brand information and settings</p>
              </div>

              {/* Profile Sub-Tabs */}
              <div className="border-b border-gray-200 mb-6 md:mb-8 overflow-x-auto">
                <div className="flex gap-4 md:gap-8 min-w-max">
                  <button
                    onClick={() => setProfileTab('details')}
                    className={`pb-3 md:pb-4 px-2 font-medium transition-all text-sm md:text-base whitespace-nowrap ${
                      profileTab === 'details'
                        ? 'text-black border-b-2 border-black'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setProfileTab('social-media')}
                    className={`pb-3 md:pb-4 px-2 font-medium transition-all text-sm md:text-base whitespace-nowrap ${
                      profileTab === 'social-media'
                        ? 'text-black border-b-2 border-black'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Social Media
                  </button>
                  <button
                    onClick={() => setProfileTab('images')}
                    className={`pb-3 md:pb-4 px-2 font-medium transition-all text-sm md:text-base whitespace-nowrap ${
                      profileTab === 'images'
                        ? 'text-black border-b-2 border-black'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Images
                  </button>
                  <button
                    onClick={() => setProfileTab('account')}
                    className={`pb-3 md:pb-4 px-2 font-medium transition-all text-sm md:text-base whitespace-nowrap ${
                      profileTab === 'account'
                        ? 'text-black border-b-2 border-black'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Account
                  </button>
                </div>
              </div>

              {/* Details Tab */}
              {profileTab === 'details' && (
                <div className="max-w-2xl">
                  <div className="space-y-4 md:space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <Input
                        value={brandData.location}
                        onChange={(e) => setBrandData({ ...brandData, location: e.target.value })}
                        placeholder="City, State"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <Textarea
                        value={brandData.description}
                        onChange={(e) => setBrandData({ ...brandData, description: e.target.value })}
                        placeholder="What do you sell? What is your mission?"
                        className="w-full min-h-[120px]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Categories
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <button
                            key={category}
                            onClick={() => toggleCategory(category)}
                            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                              selectedCategories.includes(category)
                                ? 'bg-black text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={handleSaveProfile}
                        className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Media Tab */}
              {profileTab === 'social-media' && (
                <div className="max-w-2xl">
                  <div className="space-y-3 md:space-y-4">
                    <div className="border border-gray-200 rounded-lg p-3 md:p-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <LinkIcon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        <Input
                          value={socialMedia.website}
                          onChange={(e) => setSocialMedia({ ...socialMedia, website: e.target.value })}
                          placeholder="Add Website"
                          className="border-0 focus-visible:ring-0"
                        />
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-3 md:p-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <Instagram className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        <Input
                          value={socialMedia.instagram}
                          onChange={(e) => setSocialMedia({ ...socialMedia, instagram: e.target.value })}
                          placeholder="Add Instagram"
                          className="border-0 focus-visible:ring-0"
                        />
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-3 md:p-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-600 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                        <Input
                          value={socialMedia.tiktok}
                          onChange={(e) => setSocialMedia({ ...socialMedia, tiktok: e.target.value })}
                          placeholder="Add TikTok"
                          className="border-0 focus-visible:ring-0"
                        />
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-3 md:p-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <Youtube className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        <Input
                          value={socialMedia.youtube}
                          onChange={(e) => setSocialMedia({ ...socialMedia, youtube: e.target.value })}
                          placeholder="Add YouTube"
                          className="border-0 focus-visible:ring-0"
                        />
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-3 md:p-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <Twitter className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        <Input
                          value={socialMedia.twitter}
                          onChange={(e) => setSocialMedia({ ...socialMedia, twitter: e.target.value })}
                          placeholder="Add Twitter"
                          className="border-0 focus-visible:ring-0"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={handleSaveProfile}
                        className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Images Tab */}
              {profileTab === 'images' && (
                <div className="max-w-2xl">
                  <div className="space-y-6 md:space-y-8">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                        <User className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
                      </div>
                      <button className="flex items-center gap-2 text-black hover:text-gray-700 font-medium text-sm md:text-base">
                        <Camera className="w-4 h-4" />
                        Upload Photo
                      </button>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Cover Photo</div>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 md:p-12 bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-gray-300 flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 md:w-10 md:h-10 text-gray-500" />
                          </div>
                          <div className="text-gray-400 text-base md:text-lg mb-2">Optional Cover Photo</div>
                          <div className="text-gray-500 text-xs md:text-sm">Click to upload</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={handleSaveProfile}
                        className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {profileTab === 'account' && (
                <div className="max-w-2xl">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                      <Input
                        value={brandData.companyName}
                        onChange={(e) => setBrandData({ ...brandData, companyName: e.target.value })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <Input
                        value={brandData.email}
                        onChange={(e) => setBrandData({ ...brandData, email: e.target.value })}
                        type="email"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <Input
                        value={brandData.phone}
                        onChange={(e) => setBrandData({ ...brandData, phone: e.target.value })}
                        type="tel"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                      <Input
                        value={brandData.industry}
                        onChange={(e) => setBrandData({ ...brandData, industry: e.target.value })}
                        className="w-full"
                      />
                    </div>
                    <div className="pt-4">
                      <button
                        onClick={handleSaveProfile}
                        className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Create Campaign Tab */}
          {activeTab === 'create-campaign' && (
            <div>
              <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-4xl font-bold text-black mb-2">Create New Campaign</h1>
                <p className="text-sm md:text-base text-gray-600">Fill out the details to launch your campaign</p>
              </div>

              <form onSubmit={handleCreateCampaign} className="max-w-2xl">
                <div className="bg-black rounded-xl p-4 md:p-8 border border-gray-800 space-y-4 md:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Name</label>
                    <Input
                      value={campaignForm.name}
                      onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                      placeholder="Enter campaign name"
                      className="bg-gray-900 border-gray-700 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <Textarea
                      value={campaignForm.description}
                      onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                      placeholder="Describe your campaign objectives"
                      className="bg-gray-900 border-gray-700 text-white min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Budget</label>
                      <Input
                        value={campaignForm.budget}
                        onChange={(e) => setCampaignForm({ ...campaignForm, budget: e.target.value })}
                        placeholder="$0"
                        type="number"
                        className="bg-gray-900 border-gray-700 text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
                      <select
                        value={campaignForm.platform}
                        onChange={(e) => setCampaignForm({ ...campaignForm, platform: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                      >
                        <option value="instagram">Instagram</option>
                        <option value="tiktok">TikTok</option>
                        <option value="youtube">YouTube</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                      <Input
                        value={campaignForm.startDate}
                        onChange={(e) => setCampaignForm({ ...campaignForm, startDate: e.target.value })}
                        type="date"
                        className="bg-gray-900 border-gray-700 text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                      <Input
                        value={campaignForm.endDate}
                        onChange={(e) => setCampaignForm({ ...campaignForm, endDate: e.target.value })}
                        type="date"
                        className="bg-gray-900 border-gray-700 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Deliverables</label>
                    <Textarea
                      value={campaignForm.deliverables}
                      onChange={(e) => setCampaignForm({ ...campaignForm, deliverables: e.target.value })}
                      placeholder="What do you need from influencers?"
                      className="bg-gray-900 border-gray-700 text-white min-h-[100px]"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-secondary text-black font-medium"
                    >
                      Create Campaign
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setActiveTab('overview')}
                      className="flex-1 bg-white hover:bg-gray-100 text-black font-medium"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-black mb-6 md:mb-8">Messages</h1>
              <div className="bg-black rounded-xl p-8 md:p-12 border border-gray-800 text-center">
                <MessageSquare className="w-12 h-12 md:w-16 md:h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-lg md:text-xl text-white mb-2">No messages yet</p>
                <p className="text-sm md:text-base text-gray-400">Your conversations with influencers will appear here</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
          <div className="grid grid-cols-5 gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id as TabType)}
                  className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                    activeTab === item.id
                      ? 'text-primary'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium truncate max-w-full">{item.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
