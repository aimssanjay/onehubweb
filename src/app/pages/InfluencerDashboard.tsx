import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  LayoutDashboard, User, Briefcase, MessageSquare, Settings, LogOut,
  Instagram, Youtube, Video, TrendingUp, DollarSign, Eye, Heart,
  Edit, Camera, BarChart3, Menu, X, Bell, FileText,
  ChevronDown, ChevronUp, MapPin, Mail, Phone, Check,
  ExternalLink, Search, Send, Filter,
} from 'lucide-react';
import { API_BASE_URL } from '../../services/api';

type TabType = 'overview' | 'profile' | 'campaigns' | 'earnings' | 'messages' |
  'notifications' | 'analytics' | 'content' | 'settings';

// Country list
const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria',
  'Bangladesh', 'Belgium', 'Brazil', 'Canada', 'Chile', 'China', 'Colombia',
  'Czech Republic', 'Denmark', 'Egypt', 'Ethiopia', 'Finland', 'France',
  'Germany', 'Ghana', 'Greece', 'Hungary', 'India', 'Indonesia', 'Iran',
  'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan', 'Kenya',
  'Malaysia', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand', 'Nigeria',
  'Norway', 'Pakistan', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Romania', 'Russia', 'Saudi Arabia', 'Singapore', 'South Africa',
  'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Thailand',
  'Turkey', 'UAE', 'Ukraine', 'United Kingdom', 'United States', 'Vietnam',
];

// Mock data
const mockCampaigns = [
  { id: '1', brand: 'Nike', logo: 'N', budget: '₹10,000', category: 'Fitness', platform: 'Instagram', status: 'available', description: 'Post a reel showcasing Nike shoes', matchCategory: 'Fashion' },
  { id: '2', brand: 'Lakme', logo: 'L', budget: '₹15,000', category: 'Beauty', platform: 'YouTube', status: 'applied', description: 'Beauty tutorial featuring Lakme products', matchCategory: 'Beauty' },
  { id: '3', brand: 'Mamaearth', logo: 'M', budget: '₹8,000', category: 'Skincare', platform: 'Instagram', status: 'ongoing', description: 'Skincare routine challenge', matchCategory: 'Beauty' },
];

const mockMessages = [
  { id: '1', brand: 'Nike', brandInitial: 'N', brandColor: 'bg-black', lastMessage: 'Sounds great! Looking forward to it!', time: 'Now', unread: 1, online: true,
    messages: [
      { id: 1, sender: 'brand', text: 'Hi! Your recent Instagram post is fantastic! We\'ve approved it.', time: 'Thu · 2:20 PM' },
      { id: 2, sender: 'me', text: 'Thank you! I\'m glad you liked it. Let me know if there\'s anything else.', time: 'Thu · 2:34 PM' },
      { id: 3, sender: 'brand', text: 'We\'d love to collaborate again. Please post a new reel by May 30th.', time: 'Today · 10:15 AM' },
      { id: 4, sender: 'me', text: 'Absolutely! I\'ll create a new reel featuring your latest collection.', time: 'Today · 10:18 AM' },
      { id: 5, sender: 'brand', text: 'Sounds great! Looking forward to it!', time: 'Now' },
    ]
  },
  { id: '2', brand: 'TechBrand', brandInitial: 'T', brandColor: 'bg-blue-600', lastMessage: 'Got it! We\'ll review your vid...', time: '5h ago', unread: 0, online: false, messages: [] },
  { id: '3', brand: 'Lakme', brandInitial: 'L', brandColor: 'bg-pink-500', lastMessage: 'We\'re looking forward to your...', time: '1d ago', unread: 0, online: false, messages: [] },
  { id: '4', brand: 'UrbanTaste', brandInitial: 'U', brandColor: 'bg-red-500', lastMessage: 'Your content has been approved!', time: '2d ago', unread: 0, online: false, messages: [] },
];

const mockNotifications = [
  { id: '1', brand: 'TechBrand', brandInitial: 'T', brandColor: 'bg-blue-600', message: '2 new campaign invites for your YouTube channel!', time: '2h ago', isNew: true },
  { id: '2', brand: 'TechBrand', brandInitial: 'T', brandColor: 'bg-blue-700', message: '₹7,000 payment received! Check your earnings now.', time: '3h ago', isNew: true },
  { id: '3', brand: 'Nike', brandInitial: 'N', brandColor: 'bg-black', message: 'Congrats! Your latest post has been approved.', time: '5h ago', isNew: true },
  { id: '4', brand: 'Lakme', brandInitial: 'L', brandColor: 'bg-pink-500', message: 'Lakme campaign approved! Time to get started.', time: '1d ago', isNew: false },
  { id: '5', brand: 'BeautyPlus', brandInitial: 'B', brandColor: 'bg-purple-500', message: '@llabeauty mentioned you in a post.', time: '2d ago', isNew: false },
];

export default function InfluencerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [campaignsSubTab, setCampaignsSubTab] = useState<'available' | 'applied' | 'ongoing' | 'completed'>('available');
  const [campaignsExpanded, setCampaignsExpanded] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(mockMessages[0]);
  const [messageText, setMessageText] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '', phone: '', country: '', city: '', bio: '',
  });

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('influencer_token');
      if (!token) { navigate('/influencer/login'); return; }
      try {
        const response = await fetch(`${API_BASE_URL}/influencers/get-profile`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        const result = await response.json();
        if (result.success) {
          setUserData(result.data);
          setEditForm({
            name: result.data.name || '',
            phone: result.data.phone || '',
            country: result.data.country || '',
            city: result.data.city || '',
            bio: result.data.bio || '',
          });
        } else {
          localStorage.removeItem('influencer_token');
          navigate('/influencer/login');
        }
      } catch (error) {
        navigate('/influencer/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save profile to API
  const handleSaveProfile = async () => {
    const token = localStorage.getItem('influencer_token');
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/influencers/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editForm),
      });
      const result = await response.json();
      if (result.success || response.ok) {
        setUserData({ ...userData, ...editForm });
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert(result.message || 'Failed to update profile');
      }
    } catch (error) {
      alert('Server error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('influencer_token');
    localStorage.removeItem('influencer_user');
    navigate('/');
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const filteredCountries = COUNTRIES.filter(c =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'campaigns', label: 'Campaigns', icon: Briefcase, hasDropdown: true },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 3 },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 7 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-950 pb-16 md:pb-0">
      <Navbar />

      {/* Portal bar */}
      <div className="bg-black border-b border-gray-800 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-1 hover:bg-gray-800 rounded-lg">
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
            <span className="text-primary text-sm font-semibold">Influencers Portal</span>
          </div>
          <span className="text-gray-400 text-xs">Welcome, {userData?.name}</span>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-72 h-full bg-gray-950 border-r border-gray-800 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-800">
              <span className="text-primary font-bold text-lg">Influencers Portal</span>
            </div>
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} onClick={() => handleTabChange(item.id as TabType)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg transition-colors ${
                      activeTab === item.id ? 'bg-primary text-black' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                    }`}>
                    <Icon className="w-5 h-5" />
                    <span className="font-medium flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-red-400 hover:bg-gray-900 transition-colors mt-6">
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
          <aside className="w-56 min-h-[calc(100vh-88px)] bg-black border-r border-gray-800 py-6 px-3 flex-shrink-0">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} onClick={() => {
                    handleTabChange(item.id as TabType);
                    if (item.hasDropdown) setCampaignsExpanded(!campaignsExpanded);
                  }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id ? 'bg-primary text-black font-semibold' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                    }`}>
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium flex-1 text-left text-sm">{item.label}</span>
                    {item.badge && (
                      <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                        {item.badge}
                      </span>
                    )}
                    {item.hasDropdown && (
                      campaignsExpanded ? <ChevronUp className="w-4 h-4 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-900 transition-colors mt-4">
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">

          {activeTab === 'overview' && (
  <div className="text-white">

    {/* ── TOP SECTION ── */}
    <div className="flex gap-4">

      {/* Left + Middle Content */}
      <div className="flex-1 min-w-0">

        {/* Welcome Header */}
        <div className="mb-5">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Welcome back, {userData.name}! 👋
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
            <span className="text-primary font-semibold">Beauty Creator</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">Skincare & Makeup Influencer</span>
            {userData.city && (
              <>
                <span className="text-gray-500">•</span>
                <span className="flex items-center gap-1 text-gray-400">
                  <MapPin className="w-3 h-3" />
                  {userData.city}{userData.country ? `, ${userData.country}` : ''}
                </span>
              </>
            )}
          </div>
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-400 text-sm">Categories:</span>
            {(userData.categories?.length > 0 ? userData.categories : [
              { name: 'Beauty' }, { name: 'Skincare' }, { name: 'Makeup' }, { name: 'Lifestyle' }
            ]).map((cat: any, i: number) => (
              <span key={i} className="px-3 py-1 bg-gray-800 border border-gray-700 text-white rounded-full text-xs font-medium">
                {cat.name || cat}
              </span>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Total Earnings', value: '₹12,450', change: '12.5%', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10' },
            { label: 'Active Campaigns', value: '5', change: '25%', icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            { label: 'Total Reach', value: '485K', change: '18.7%', icon: Eye, color: 'text-purple-400', bg: 'bg-purple-400/10' },
            { label: 'Engagement Rate', value: '4.8%', change: '0.6%', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-400/10' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className="text-xl font-bold text-white mb-0.5">{stat.value}</p>
                <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> {stat.change} vs last month
                </p>
              </div>
            );
          })}
        </div>

        {/* Recent Campaigns + Social Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

          {/* Recent Campaigns */}
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">Recent Campaigns</h2>
              <button onClick={() => setActiveTab('campaigns')} className="text-primary text-xs hover:underline flex items-center gap-1">
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {[
                { brand: 'Lakmé', logo: '/lakme.png', logoFallback: 'L', logoColor: 'bg-red-100', budget: '₹10,000', desc: 'Beauty Glows Campaign', tags: ['Instagram', 'Reel'], status: 'In Progress', statusColor: 'bg-blue-500/20 text-blue-300' },
                { brand: 'Nykaa', logo: '', logoFallback: 'N', logoColor: 'bg-pink-500', budget: '₹15,000', desc: 'Summer Glow Edit', tags: ['Instagram', 'Post'], status: 'Approved', statusColor: 'bg-green-500/20 text-green-300' },
                { brand: 'Mamaearth', logo: '', logoFallback: 'M', logoColor: 'bg-green-600', budget: '₹8,000', desc: 'Skincare Routine Challenge', tags: ['YouTube', 'Video'], status: 'Pending', statusColor: 'bg-yellow-500/20 text-yellow-300' },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <div className={`w-12 h-12 ${c.logoColor} rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0`}>
                    {c.logoFallback}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-semibold text-white text-sm">{c.brand}</p>
                      <p className="text-primary font-bold text-sm">{c.budget}</p>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">{c.desc}</p>
                    <div className="flex items-center gap-1.5">
                      {c.tags.map((tag, j) => (
                        <span key={j} className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs">{tag}</span>
                      ))}
                      <span className={`ml-auto px-2 py-0.5 rounded text-xs font-medium ${c.statusColor}`}>{c.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Performance */}
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">Social Media Performance</h2>
              <button className="text-primary text-xs hover:underline">View All →</button>
            </div>
            {/* Platform Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { name: 'Instagram', followers: '225K', engagement: '6.2%', icon: Instagram, color: 'from-purple-500 to-pink-500', platformId: 1 },
                { name: 'YouTube', followers: '120K', engagement: '4.8%', icon: Youtube, color: 'from-red-600 to-red-500', platformId: 2 },
                { name: 'TikTok', followers: '58K', engagement: '7.5%', icon: Video, color: 'from-gray-700 to-gray-800', platformId: 3 },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.name} className="bg-gray-800 rounded-lg p-3 text-center">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-2`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xs font-medium text-white mb-1">{s.name}</p>
                    <p className="text-base font-bold text-white">{s.followers}</p>
                    <p className="text-xs text-gray-500">Followers</p>
                    <p className="text-xs text-green-400 mt-1">↑ {s.engagement}</p>
                  </div>
                );
              })}
            </div>
            {/* Mini Chart */}
            <div className="relative h-28">
              <svg viewBox="0 0 300 80" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#eab308" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,60 C30,55 60,45 90,50 C120,55 150,35 180,30 C210,25 240,20 270,15 L300,10 L300,80 L0,80 Z"
                  fill="url(#chartGrad)" />
                <path d="M0,60 C30,55 60,45 90,50 C120,55 150,35 180,30 C210,25 240,20 270,15 L300,10"
                  fill="none" stroke="#eab308" strokeWidth="2" />
                {[[0,60],[90,50],[150,35],[180,30],[240,20],[300,10]].map(([x,y], i) => (
                  <circle key={i} cx={x} cy={y} r="3" fill="#eab308" />
                ))}
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-1">
                {['Jan','Feb','Mar','Apr','May','Jun'].map(m => <span key={m}>{m}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row — Messages + Earnings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Recent Messages */}
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">Recent Messages</h2>
              <button onClick={() => setActiveTab('messages')} className="text-primary text-xs hover:underline">View All →</button>
            </div>
            <div className="space-y-2">
              {[
                { brand: 'Nike', initial: 'N', color: 'bg-black border border-gray-700', msg: "Congrats! Your story has been approved.", time: '2h ago' },
                { brand: 'TechBrand', initial: 'T', color: 'bg-blue-600', msg: "Your YouTube video is live. Great work!", time: '5h ago' },
                { brand: 'BeautyPlus', initial: 'B', color: 'bg-red-500', msg: "Please submit the final content.", time: '1d ago' },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors"
                  onClick={() => setActiveTab('messages')}>
                  <div className={`w-10 h-10 ${m.color} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {m.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-white text-sm">{m.brand}</p>
                      <p className="text-gray-500 text-xs">{m.time}</p>
                    </div>
                    <p className="text-gray-400 text-xs truncate">{m.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings Overview */}
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">Earnings Overview</h2>
              <button onClick={() => setActiveTab('earnings')} className="text-primary text-xs hover:underline">View All →</button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Total Earnings</p>
                <p className="text-xl font-bold text-white">₹12,450</p>
                <p className="text-xs text-green-400 mt-1">↑ 12.5% this month</p>
              </div>
              <div className="space-y-2">
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-yellow-400 font-medium">Pending</p>
                  <p className="text-lg font-bold text-white">₹3,200</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-blue-400 font-medium">Available</p>
                  <p className="text-lg font-bold text-white">₹9,250</p>
                </div>
              </div>
            </div>
            {/* Transactions */}
            <div className="space-y-2 mb-3">
              {[
                { brand: 'Lakmé', initial: 'L', color: 'bg-red-100', amount: '+₹10,000', date: 'May 20' },
                { brand: 'Nykaa', initial: 'N', color: 'bg-pink-500', amount: '+₹15,000', date: 'May 10' },
                { brand: 'Mamaearth', initial: 'M', color: 'bg-green-600', amount: '+₹8,000', date: 'Apr 28' },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${t.color} rounded-lg flex items-center justify-center text-gray-800 font-bold text-xs flex-shrink-0`}>
                    {t.initial}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-xs font-medium">{t.brand}</p>
                    <p className="text-gray-500 text-xs">{t.date}</p>
                  </div>
                  <p className="text-green-400 text-xs font-bold">{t.amount}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setActiveTab('earnings')}
              className="w-full bg-primary hover:bg-secondary text-black font-semibold py-2.5 rounded-lg text-sm transition-colors">
              Withdraw Earnings
            </button>
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDEBAR — Profile Card + Audience ── */}
      <div className="w-72 flex-shrink-0 space-y-4 hidden lg:block">

        {/* Profile Card */}
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 text-center">
          {/* Avatar */}
          <div className="relative w-20 h-20 mx-auto mb-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-black text-3xl font-bold">
              {userData.name?.[0]?.toUpperCase()}
            </div>
            <button onClick={() => setActiveTab('profile')}
              className="absolute bottom-0 right-0 w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center">
              <Edit className="w-3 h-3 text-white" />
            </button>
          </div>

          {/* Name + badge */}
          <div className="flex items-center justify-center gap-1 mb-1">
            <p className="font-bold text-white text-lg">{userData.name}</p>
            <span className="text-blue-400 text-sm">✓</span>
          </div>
          <p className="text-gray-400 text-xs mb-2">Beauty Creator</p>
          <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium mb-3">
            ▶ Beauty Influencer
          </span>
          <p className="text-gray-400 text-xs leading-relaxed mb-4">
            {userData.bio || 'I create content around beauty, skincare, makeup & lifestyle. Let\'s collaborate! ✨'}
          </p>

          {/* Info */}
          <div className="space-y-1.5 text-xs text-gray-400 text-left mb-4">
            {(userData.city || userData.country) && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-gray-500" />
                {userData.city}{userData.country ? `, ${userData.country}` : ''}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3 text-gray-500" />
              {userData.email}
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-3 h-3 text-gray-500" />
              Joined Jan 2024
            </div>
          </div>

          {/* Categories */}
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-400 text-left mb-2">Categories</p>
            <div className="flex flex-wrap gap-1">
              {(userData.categories?.length > 0 ? userData.categories : [
                { name: 'Beauty' }, { name: 'Skincare' }, { name: 'Makeup' }, { name: 'Lifestyle' }
              ]).map((cat: any, i: number) => (
                <span key={i} className="px-2 py-0.5 bg-gray-800 border border-gray-700 text-gray-300 rounded-full text-xs">
                  {cat.name || cat}
                </span>
              ))}
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center gap-2">
            {[
              { platformId: 1, icon: Instagram, color: 'from-purple-500 to-pink-500' },
              { platformId: 2, icon: Youtube, color: 'from-red-600 to-red-500' },
              { platformId: 3, icon: Video, color: 'from-gray-700 to-gray-800' },
            ].map((s) => {
              const Icon = s.icon;
              const connected = userData.social_accounts?.find((acc: any) => acc.platform_id === s.platformId);
              return connected ? (
                <div key={s.platformId} className={`w-9 h-9 rounded-full bg-gradient-to-br ${s.color} flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              ) : null;
            })}
            <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors">
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Audience Snapshot */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm">Audience Snapshot</h3>
            <button className="text-primary text-xs hover:underline">View All →</button>
          </div>

          {/* Gender */}
          <p className="text-xs font-medium text-gray-400 mb-3">Gender</p>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                <circle cx="18" cy="18" r="13" fill="none" stroke="#374151" strokeWidth="5" />
                <circle cx="18" cy="18" r="13" fill="none" stroke="#ec4899" strokeWidth="5"
                  strokeDasharray="78 22" strokeLinecap="round" />
                <circle cx="18" cy="18" r="13" fill="none" stroke="#3b82f6" strokeWidth="5"
                  strokeDasharray="22 78" strokeDashoffset="-78" strokeLinecap="round" />
              </svg>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-pink-500"></div>
                <span className="text-white text-xs font-medium">78% Female</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <span className="text-white text-xs font-medium">22% Male</span>
              </div>
            </div>
          </div>

          {/* Top Locations */}
          <p className="text-xs font-medium text-gray-400 mb-3">Top Locations</p>
          {[
            { country: 'India', pct: 68, color: 'bg-yellow-400' },
            { country: 'USA', pct: 12, color: 'bg-blue-400' },
            { country: 'UK', pct: 7, color: 'bg-purple-400' },
            { country: 'Other', pct: 13, color: 'bg-gray-400' },
          ].map((loc) => (
            <div key={loc.country} className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300">{loc.country}</span>
                <span className="text-white font-medium">{loc.pct}%</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full">
                <div className={`h-1.5 ${loc.color} rounded-full`} style={{ width: `${loc.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
)}

          {/* ── PROFILE TAB ── */}
          {activeTab === 'profile' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">My Profile</h1>
                <button
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    isEditing ? 'bg-primary hover:bg-secondary text-black' : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                  }`}>
                  <Edit className="w-4 h-4" />
                  {isEditing ? 'Save Profile' : 'Edit Profile'}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left — Profile Info */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    {/* Avatar + Name */}
                    <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-800">
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-black text-3xl font-bold">
                          {userData.name?.[0]?.toUpperCase()}
                        </div>
                        {isEditing && (
                          <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-black">
                            <Camera className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div className="flex-1">
                        {isEditing ? (
                          <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white text-lg font-bold mb-2" placeholder="Full Name" />
                        ) : (
                          <h2 className="text-xl font-bold text-white mb-1">{userData.name}</h2>
                        )}
                        <p className="text-sm text-gray-400">Content Creator & Influencer</p>
                        {/* Social icons */}
                        <div className="flex gap-2 mt-2">
                          {userData.social_accounts?.find((s: any) => s.platform_id === 1) && (
                            <div className="w-7 h-7 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                              <Instagram className="w-3 h-3 text-white" />
                            </div>
                          )}
                          {userData.social_accounts?.find((s: any) => s.platform_id === 2) && (
                            <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center">
                              <Youtube className="w-3 h-3 text-white" />
                            </div>
                          )}
                          {userData.social_accounts?.find((s: any) => s.platform_id === 3) && (
                            <div className="w-7 h-7 bg-gray-700 rounded-full flex items-center justify-center">
                              <Video className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Profile Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
                        <p className="text-white text-sm bg-gray-800 rounded-lg px-3 py-2.5">{userData.email}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone</label>
                        {isEditing ? (
                          <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white" placeholder="+1 (555) 000-0000" type="tel" />
                        ) : (
                          <p className="text-white text-sm bg-gray-800 rounded-lg px-3 py-2.5">{userData.phone || 'Not provided'}</p>
                        )}
                      </div>

                      {/* ✅ Country with dropdown + search */}
                      <div className="relative">
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Country</label>
                        {isEditing ? (
                          <div className="relative">
                            <Input
                              value={editForm.country}
                              onChange={(e) => {
                                setEditForm({ ...editForm, country: e.target.value });
                                setCountrySearch(e.target.value);
                                setShowCountryDropdown(true);
                              }}
                              onFocus={() => setShowCountryDropdown(true)}
                              className="bg-gray-800 border-gray-700 text-white"
                              placeholder="Type or select country"
                            />
                            {showCountryDropdown && filteredCountries.length > 0 && (
                              <div className="absolute top-full left-0 right-0 z-50 bg-gray-800 border border-gray-700 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-xl">
                                {filteredCountries.map((country) => (
                                  <button key={country} type="button"
                                    onClick={() => {
                                      setEditForm({ ...editForm, country });
                                      setCountrySearch(country);
                                      setShowCountryDropdown(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-white text-sm hover:bg-gray-700 transition-colors">
                                    {country}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-white text-sm bg-gray-800 rounded-lg px-3 py-2.5">{userData.country || 'Not provided'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">City</label>
                        {isEditing ? (
                          <Input value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white" placeholder="City" />
                        ) : (
                          <p className="text-white text-sm bg-gray-800 rounded-lg px-3 py-2.5">{userData.city || 'Not provided'}</p>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Bio</label>
                      {isEditing ? (
                        <textarea rows={4} value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          placeholder="Tell brands about yourself..." />
                      ) : (
                        <p className="text-white text-sm bg-gray-800 rounded-lg px-3 py-2.5 leading-relaxed">
                          {userData.bio || 'No bio added yet.'}
                        </p>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex gap-3 pt-4 border-t border-gray-800">
                        <button onClick={handleSaveProfile} className="flex-1 bg-primary hover:bg-secondary text-black font-semibold py-2.5 rounded-lg transition-colors text-sm">
                          Save Changes
                        </button>
                        <button onClick={() => { setIsEditing(false); setEditForm({ name: userData.name || '', phone: userData.phone || '', country: userData.country || '', city: userData.city || '', bio: userData.bio || '' }); }}
                          className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Connected Social Accounts */}
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <h3 className="font-bold text-white mb-4">Social Media Accounts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { platformId: 1, name: 'Instagram', icon: Instagram, color: 'from-purple-600 to-pink-600' },
                        { platformId: 3, name: 'TikTok', icon: Video, color: 'from-gray-800 to-gray-700' },
                        { platformId: 2, name: 'YouTube', icon: Youtube, color: 'from-red-600 to-red-500' },
                        { platformId: 4, name: 'UGC / Other', icon: Video, color: 'from-primary to-secondary' },
                      ].map((social) => {
                        const Icon = social.icon;
                        const account = userData.social_accounts?.find((s: any) => s.platform_id === social.platformId);
                        return (
                          <div key={social.platformId} className="flex items-center gap-3 bg-gray-800 rounded-lg p-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${social.color} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-white text-sm">{social.name}</p>
                              <p className="text-xs text-gray-400 truncate">{account?.profile_url || 'Not connected'}</p>
                            </div>
                            {account && (
                              <a href={account.profile_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 text-gray-400 hover:text-primary" />
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-4">
                  {/* Audience Insights */}
                  <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                    <h3 className="font-bold text-white mb-4">Audience Insights</h3>
                    <div className="flex items-center justify-center mb-4">
                      <div className="relative w-24 h-24">
                        <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#374151" strokeWidth="3" />
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#a855f7" strokeWidth="3"
                            strokeDasharray="72 28" strokeLinecap="round" />
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3b82f6" strokeWidth="3"
                            strokeDasharray="28 72" strokeDashoffset="-72" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs text-gray-400 text-center">Gender</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center gap-4 text-sm mb-4">
                      <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-purple-500"></div><span className="text-white">72% Female</span></div>
                      <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-white">28% Male</span></div>
                    </div>
                    <h4 className="font-medium text-white text-sm mb-3">Top Locations</h4>
                    {[{ country: 'India', pct: 65 }, { country: 'United States', pct: 15 }, { country: 'United Kingdom', pct: 10 }, { country: 'Other', pct: 10 }].map((loc) => (
                      <div key={loc.country} className="mb-2">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>{loc.country}</span><span>{loc.pct}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full">
                          <div className="h-1.5 bg-primary rounded-full" style={{ width: `${loc.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Categories */}
                  {userData.categories?.length > 0 && (
                    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                      <h3 className="font-bold text-white mb-3">Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        {userData.categories.map((cat: any, i: number) => (
                          <span key={i} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                            {cat.name || cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── CAMPAIGNS TAB ── */}
          {activeTab === 'campaigns' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Campaigns</h1>
                <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm border border-gray-700">
                  <Filter className="w-4 h-4" /> Filters
                </button>
              </div>

              {/* Sub tabs */}
              <div className="flex gap-2 mb-6 bg-gray-900 rounded-lg p-1 w-fit">
                {(['available', 'applied', 'ongoing', 'completed'] as const).map((tab) => (
                  <button key={tab} onClick={() => setCampaignsSubTab(tab)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                      campaignsSubTab === tab ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
                    }`}>
                    {tab}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-3">
                  {mockCampaigns.filter(c =>
                    campaignsSubTab === 'available' ? c.status === 'available' :
                    campaignsSubTab === 'applied' ? c.status === 'applied' :
                    campaignsSubTab === 'ongoing' ? c.status === 'ongoing' : c.status === 'completed'
                  ).length === 0 ? (
                    <div className="bg-gray-900 rounded-xl p-12 border border-gray-800 text-center">
                      <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-white font-medium mb-2">No {campaignsSubTab} campaigns</p>
                      <p className="text-gray-400 text-sm">
                        {campaignsSubTab === 'available' ? 'Check back later for new campaigns' : 'No campaigns in this category yet'}
                      </p>
                    </div>
                  ) : (
                    mockCampaigns.filter(c => c.status === campaignsSubTab || (campaignsSubTab === 'available' && c.status === 'available')).map((campaign) => (
                      <div key={campaign.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {campaign.logo}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-bold text-white">{campaign.brand}</h3>
                                <p className="text-sm text-gray-400">{campaign.description}</p>
                              </div>
                              <p className="text-primary font-bold text-sm flex-shrink-0">{campaign.budget}</p>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              <span className="px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-xs">{campaign.category}</span>
                              <span className="px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-xs flex items-center gap-1">
                                <Instagram className="w-3 h-3" />{campaign.platform}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                          <div className="flex items-center gap-1 text-green-400 text-xs">
                            <Check className="w-3 h-3" />
                            Matches your category ({campaign.matchCategory})
                          </div>
                          {campaignsSubTab === 'available' && (
                            <button className="bg-primary hover:bg-secondary text-black text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors">
                              Apply
                            </button>
                          )}
                          {campaignsSubTab === 'ongoing' && (
                            <span className="bg-blue-900 text-blue-300 text-xs px-3 py-1 rounded-full">In Progress</span>
                          )}
                          {campaignsSubTab === 'applied' && (
                            <span className="bg-yellow-900 text-yellow-300 text-xs px-3 py-1 rounded-full">Pending Review</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Rate Card + Audience sidebar */}
                <div className="space-y-4">
                  <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                    <h3 className="font-bold text-white mb-3">Rate Card</h3>
                    {[{ type: 'Reel', price: '₹5,000', icon: '▶' }, { type: 'Post', price: '₹8,000', icon: '📷' }].map((r) => (
                      <div key={r.type} className="flex items-center justify-between bg-gray-800 rounded-lg p-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{r.icon}</span>
                          <span className="text-white text-sm font-medium">{r.type}</span>
                        </div>
                        <span className="text-primary font-bold text-sm">{r.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                    <h3 className="font-bold text-white mb-3">Audience Insights</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-16 h-16 relative flex-shrink-0">
                        <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#374151" strokeWidth="4" />
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#a855f7" strokeWidth="4" strokeDasharray="72 28" />
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="28 72" strokeDashoffset="-72" />
                        </svg>
                      </div>
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-white mb-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div>72% Female</div>
                        <div className="flex items-center gap-1 text-white"><div className="w-2 h-2 rounded-full bg-blue-500"></div>28% Male</div>
                      </div>
                    </div>
                    <h4 className="text-xs font-medium text-gray-400 mb-2">Top Locations</h4>
                    {[{ country: 'India', pct: 65 }, { country: 'United States', pct: 15 }, { country: 'UK', pct: 10 }].map((loc) => (
                      <div key={loc.country} className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs text-gray-400 w-24">{loc.country}</span>
                        <div className="flex-1 h-1.5 bg-gray-700 rounded-full">
                          <div className="h-1.5 bg-primary rounded-full" style={{ width: `${loc.pct}%` }} />
                        </div>
                        <span className="text-xs text-white w-8 text-right">{loc.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── EARNINGS TAB ── */}
          {activeTab === 'earnings' && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-6">Earnings</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Total Earnings', value: '$12,450', sub: '+12.5% this month', color: 'text-green-400' },
                  { label: 'Pending', value: '$3,200', sub: 'Awaiting payment', color: 'text-yellow-400' },
                  { label: 'Available', value: '$9,250', sub: 'Ready to withdraw', color: 'text-blue-400' },
                ].map((e) => (
                  <div key={e.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                    <p className="text-gray-400 text-sm mb-1">{e.label}</p>
                    <p className={`text-2xl font-bold ${e.color} mb-1`}>{e.value}</p>
                    <p className="text-xs text-gray-500">{e.sub}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-4">
                <h2 className="font-bold text-white mb-4">Recent Transactions</h2>
                {[
                  { brand: 'Lakme', amount: '+$10,000', date: 'May 20', color: 'bg-pink-500' },
                  { brand: 'Nike', amount: '+$7,000', date: 'May 10', color: 'bg-black border border-gray-700' },
                  { brand: 'Mamaearth', amount: '+$8,000', date: 'Apr 28', color: 'bg-green-600' },
                ].map((t) => (
                  <div key={t.brand} className="flex items-center gap-3 py-3 border-b border-gray-800 last:border-0">
                    <div className={`w-10 h-10 ${t.color} rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {t.brand[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{t.brand}</p>
                      <p className="text-gray-400 text-xs">{t.date}</p>
                    </div>
                    <p className="text-green-400 font-bold text-sm">{t.amount}</p>
                  </div>
                ))}
              </div>
              <button className="w-full bg-primary hover:bg-secondary text-black font-semibold py-3 rounded-lg transition-colors">
                Withdraw Earnings
              </button>
            </div>
          )}

          {/* ── MESSAGES TAB ── */}
          {activeTab === 'messages' && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-4">Messages</h1>
              <div className="flex gap-4 h-[600px]">
                {/* Conversation list */}
                <div className="w-72 bg-gray-900 rounded-xl border border-gray-800 flex flex-col flex-shrink-0">
                  <div className="p-3 border-b border-gray-800">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input className="w-full bg-gray-800 text-white text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-gray-500"
                        placeholder="Search..." />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {mockMessages.map((conv) => (
                      <button key={conv.id} onClick={() => setSelectedConversation(conv)}
                        className={`w-full flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors ${selectedConversation.id === conv.id ? 'bg-gray-800' : ''}`}>
                        <div className="relative flex-shrink-0">
                          <div className={`w-10 h-10 ${conv.brandColor} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                            {conv.brandInitial}
                          </div>
                          {conv.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900" />}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-white text-sm font-medium">{conv.brand}</p>
                            <p className="text-gray-500 text-xs">{conv.time}</p>
                          </div>
                          <p className="text-gray-400 text-xs truncate">{conv.lastMessage}</p>
                        </div>
                        {conv.unread > 0 && (
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                            {conv.unread}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat window */}
                <div className="flex-1 bg-gray-900 rounded-xl border border-gray-800 flex flex-col">
                  {/* Header */}
                  <div className="flex items-center gap-3 p-4 border-b border-gray-800">
                    <div className={`w-10 h-10 ${selectedConversation.brandColor} rounded-full flex items-center justify-center text-white font-bold`}>
                      {selectedConversation.brandInitial}
                    </div>
                    <div>
                      <p className="font-bold text-white">{selectedConversation.brand}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        Brand Team
                        {selectedConversation.online && <><span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block ml-1" />Online now</>}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedConversation.messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'brand' && (
                          <div className={`w-8 h-8 ${selectedConversation.brandColor} rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-1`}>
                            {selectedConversation.brandInitial}
                          </div>
                        )}
                        <div className="max-w-xs">
                          <div className={`rounded-2xl px-4 py-3 text-sm ${
                            msg.sender === 'me' ? 'bg-purple-700 text-white rounded-tr-sm' : 'bg-gray-800 text-white rounded-tl-sm'
                          }`}>
                            {msg.text}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 px-1">{msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-gray-800 flex items-center gap-3">
                    <input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-1 bg-gray-800 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-gray-500"
                      placeholder="Type a message..."
                    />
                    <button className="w-11 h-11 bg-primary hover:bg-secondary rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                      <Send className="w-5 h-5 text-black" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS TAB ── */}
          {activeTab === 'notifications' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Notifications</h1>
                <button className="text-primary text-sm hover:underline">Mark all as read</button>
              </div>
              <div className="space-y-2">
                {mockNotifications.map((notif) => (
                  <div key={notif.id} className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
                    notif.isNew ? 'bg-gray-900 border-gray-700' : 'bg-gray-950 border-gray-800'
                  }`}>
                    <div className={`w-10 h-10 ${notif.brandColor} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {notif.brandInitial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm">{notif.brand}</p>
                      <p className="text-gray-400 text-sm">{notif.message}</p>
                      <p className="text-gray-500 text-xs mt-1">{notif.time}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                      notif.isNew ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400'
                    }`}>
                      {notif.isNew ? 'New' : 'Read'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ANALYTICS TAB ── */}
          {activeTab === 'analytics' && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-6">Analytics</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Followers', value: '403K', change: '+8.2%' },
                  { label: 'Avg Engagement', value: '5.8%', change: '+1.2%' },
                  { label: 'Total Reach', value: '485K', change: '+18.7%' },
                  { label: 'Profile Views', value: '12.3K', change: '+5.4%' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                    <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-green-400 text-xs">{stat.change}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
                <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-white font-medium mb-2">Detailed Analytics Coming Soon</p>
                <p className="text-gray-400 text-sm">Connect your social accounts to see detailed analytics</p>
              </div>
            </div>
          )}

          {/* ── CONTENT TAB ── */}
          {activeTab === 'content' && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-6">Content Submissions</h1>
              <div className="bg-gray-900 rounded-xl p-12 border border-gray-800 text-center">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-white font-medium mb-2">No content submissions yet</p>
                <p className="text-gray-400 text-sm">Your content submissions for campaigns will appear here</p>
              </div>
            </div>
          )}

          {/* ── SETTINGS TAB ── */}
          {activeTab === 'settings' && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Profile Info */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="font-bold text-white mb-4">Profile Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Full Name</label>
                      <Input defaultValue={userData.name} className="bg-gray-800 border-gray-700 text-white text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Email Address</label>
                      <Input defaultValue={userData.email} className="bg-gray-800 border-gray-700 text-white text-sm" type="email" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Bio</label>
                      <textarea rows={3} defaultValue={userData.bio || ''}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
                    </div>
                    <button onClick={handleSaveProfile} className="bg-primary hover:bg-secondary text-black font-semibold px-6 py-2 rounded-lg text-sm transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>

                {/* Account Settings */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="font-bold text-white mb-4">Account Settings</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div><p className="text-white text-sm font-medium">Account Type</p></div>
                      <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs">Creator</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div><p className="text-white text-sm">Email Notifications</p></div>
                      <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div><p className="text-white text-sm">Campaign Updates</p></div>
                      <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Security */}
                  <h3 className="font-bold text-white mb-3">Security</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                      <span className="text-white text-sm">Change Password</span>
                      <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                      <span className="text-white text-sm">Two-Factor Authentication</span>
                      <span className="text-green-400 text-xs">Enabled</span>
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="lg:col-span-2 bg-gray-900 rounded-xl p-6 border border-red-900">
                  <h3 className="font-bold text-red-400 mb-2 flex items-center gap-2">⚠️ Danger Zone</h3>
                  <p className="text-gray-400 text-sm mb-4">Permanent actions cannot be undone.</p>
                  <button className="bg-red-950 border border-red-700 text-red-400 hover:bg-red-900 font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors w-full">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
          <div className="grid grid-cols-5 gap-1">
            {[
              { id: 'overview', label: 'Home', icon: LayoutDashboard },
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'campaigns', label: 'Campaigns', icon: Briefcase },
              { id: 'messages', label: 'Messages', icon: MessageSquare },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} onClick={() => handleTabChange(item.id as TabType)}
                  className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                    activeTab === item.id ? 'text-primary' : 'text-gray-500'
                  }`}>
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}