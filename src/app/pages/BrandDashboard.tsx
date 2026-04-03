import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import {
  TrendingUp, Users, DollarSign, MessageSquare, Calendar, Clock,
  CheckCircle, XCircle, Settings, LayoutDashboard, PlusCircle,
  LogOut, User, Link as LinkIcon, Instagram, Youtube,
  Twitter, Upload, Camera, Eye, Menu, X, Folder,
  MoreVertical, Trash2, Edit2,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../components/ui/table';
import { campaigns } from '../../data/mockData';
import { API_BASE_URL } from '../../services/api';
import { usePlatforms } from '../hooks/usePlatforms';
import { useCategories } from '../hooks/useCategories';

type TabType = 'overview' | 'profile' | 'create-campaign' | 'browse' | 'messages' | 'manage-campaign';
type ProfileTabType = 'details' | 'social-media' | 'images' | 'account';

const categoryList = [
  'Beauty', 'Fashion', 'Travel', 'Health & Fitness', 'Food & Drink',
  'Comedy & Entertainment', 'Art & Photography', 'Family & Children',
  'Music & Dance', 'Entrepreneur & Business', 'Education', 'Animals & Pets',
  'Gaming', 'Technology', 'Athletes & Sports', 'Adventure & Outdoors',
  'Healthcare', 'Automotive', 'Skilled Trades', 'Cannabis'
];

export function BrandDashboard() {
  const navigate = useNavigate();
  const { platforms: apiPlatforms } = usePlatforms();
  const { categories: apiCategories } = useCategories();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [profileTab, setProfileTab] = useState<ProfileTabType>('details');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  const [viewCampaign, setViewCampaign] = useState<any>(null);
  const [editCampaign, setEditCampaign] = useState<any>(null);

  const [brandData, setBrandData] = useState({
    name: '', email: '', phone: '', country: '', city: '',
    bio: '', company_name: '', industry: '',
  });

  const [socialMedia, setSocialMedia] = useState({
    website: '', instagram: '', tiktok: '', youtube: '', twitter: '',
  });

  const [campaignForm, setCampaignForm] = useState({
    name: '',
    description: '',
    platform: '',
    category_ids: [] as string[],
    min_budget: '',
    max_budget: '',
    num_influencers: '1',
    startDate: '',
    endDate: '',
    deliverables: '',
  });

  const [userCampaigns, setUserCampaigns] = useState(campaigns);

  // Close action menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target as Node)) {
        setOpenActionMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('brand_token');
      if (!token) { navigate('/brand/login'); return; }
      try {
        const response = await fetch(`${API_BASE_URL}/brands/get-profile`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        const result = await response.json();
        if (result.success) {
          setUserData(result.data);
          setBrandData({
            name: result.data.name || '',
            email: result.data.email || '',
            phone: result.data.phone || '',
            country: result.data.country || '',
            city: result.data.city || '',
            bio: result.data.bio || '',
            company_name: result.data.brand_profile?.company_name || '',
            industry: result.data.brand_profile?.industry || '',
          });
        } else {
          localStorage.removeItem('brand_token');
          navigate('/brand/login');
        }
      } catch (error) {
        navigate('/brand/login');
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

  const handleSaveProfile = async () => {
    const token = localStorage.getItem('brand_token');
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/brands/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(brandData),
      });
      const result = await response.json();
      if (result.success || response.ok) {
        setUserData({ ...userData, ...brandData });
        alert('Profile updated successfully!');
      } else {
        alert(result.message || 'Failed to update profile');
      }
    } catch (error) {
      alert('Server error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('brand_token');
    localStorage.removeItem('brand_user');
    navigate('/');
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    if (tab === 'browse') navigate('/browse');
  };

  const toggleCampaignCategory = (cat: string) => {
    setCampaignForm(prev => ({
      ...prev,
      category_ids: prev.category_ids.includes(cat)
        ? prev.category_ids.filter(c => c !== cat)
        : [...prev.category_ids, cat],
    }));
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const newCampaign = {
      id: Date.now().toString(),
      name: campaignForm.name,
      influencer: 'To be assigned',
      status: 'pending',
      budget: parseFloat(campaignForm.max_budget) || 0,
      min_budget: campaignForm.min_budget,
      max_budget: campaignForm.max_budget,
      startDate: campaignForm.startDate,
      endDate: campaignForm.endDate,
      description: campaignForm.description,
      platform: campaignForm.platform,
      categories: campaignForm.category_ids,
      num_influencers: campaignForm.num_influencers,
      deliverables: campaignForm.deliverables,
    };
    setUserCampaigns([newCampaign, ...userCampaigns]);
    alert('✅ Campaign created successfully!');
    setCampaignForm({
      name: '', description: '', platform: '', category_ids: [],
      min_budget: '', max_budget: '', num_influencers: '1',
      startDate: '', endDate: '', deliverables: '',
    });
    setActiveTab('manage-campaign');
  };

  const handleUpdateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    setUserCampaigns(prev =>
      prev.map(c => c.id === editCampaign.id ? { ...c, ...editCampaign } : c)
    );
    setEditCampaign(null);
    alert('✅ Campaign updated successfully!');
  };

  const handleDeleteCampaign = (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      setUserCampaigns(prev => prev.filter(c => c.id !== id));
      setOpenActionMenu(null);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return styles[status] || styles.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

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

  const stats = [
    { icon: Users, label: 'Active Campaigns', value: '8', change: '+2 this week', changeType: 'positive' as const },
    { icon: DollarSign, label: 'Total Spend', value: '$12,450', change: '+$1,200 this month', changeType: 'positive' as const },
    { icon: TrendingUp, label: 'Hired Influencers', value: '24', change: '+6 this month', changeType: 'positive' as const },
    { icon: MessageSquare, label: 'Unread Messages', value: '5', change: '2 new today', changeType: 'neutral' as const },
  ];

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Edit Profile', icon: Settings },
    { id: 'create-campaign', label: 'Create Campaign', icon: PlusCircle },
    { id: 'manage-campaign', label: 'Campaign', icon: Folder },
    { id: 'browse', label: 'Browse Creators', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">

      <Navbar />

      {/* Thin brand portal bar */}
      <div className="bg-black border-b border-gray-800 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-1 hover:bg-gray-800 rounded-lg">
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
            <span className="text-primary text-sm font-semibold">Brand Portal</span>
          </div>
          <span className="text-gray-400 text-xs">
            Welcome, {userData.brand_profile?.company_name || userData.name}
          </span>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-72 h-full bg-black border-r border-gray-800 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-800">
              <span className="text-primary font-bold text-lg">Brand Portal</span>
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
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              <Link to="/brand-public-profile" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-gray-400 hover:bg-gray-900 hover:text-white transition-colors">
                  <Eye className="w-5 h-5" />
                  <span className="font-medium">View Profile</span>
                </button>
              </Link>
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
          <aside className="w-64 min-h-[calc(100vh-120px)] bg-black border-r border-gray-800 p-6">
            <div className="mb-4 px-4">
              {/*<span className="text-xs text-gray-500 uppercase tracking-wider">Navigation</span>*/}
            </div>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} onClick={() => handleTabChange(item.id as TabType)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id ? 'bg-primary text-black' : 'text-white hover:bg-gray-900'
                    }`}>
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              <Link to="/brand-public-profile">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-gray-900 transition-colors">
                  <Eye className="w-5 h-5" />
                  <span className="font-medium">View Profile</span>
                </button>
              </Link>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-900 transition-colors mt-8">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </aside>
        )}

        <main className="flex-1 p-4 md:p-8">

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-black mb-2">Dashboard Overview</h1>
              <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8">
                Welcome back, {userData.brand_profile?.company_name || userData.name}!
              </p>
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
                    <p className={`text-xs md:text-sm ${stat.changeType === 'positive' ? 'text-green-400' : 'text-gray-400'}`}>
                      {stat.change}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-black rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-gray-800">
                <h2 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">Quick Actions</h2>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                  <button onClick={() => setActiveTab('create-campaign')} className="bg-primary hover:bg-secondary text-black font-semibold px-4 md:px-6 py-2.5 md:py-3 rounded-lg transition-colors text-sm md:text-base">
                    <PlusCircle className="w-4 h-4 mr-2 inline" /> Create New Campaign
                  </button>
                  <Link to="/browse">
                    <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg transition-colors border border-gray-700 text-sm md:text-base">
                      <Users className="w-4 h-4 mr-2 inline" /> Browse Influencers
                    </button>
                  </Link>
                  <button onClick={() => setActiveTab('messages')} className="bg-gray-900 hover:bg-gray-800 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg transition-colors border border-gray-700 text-sm md:text-base">
                    <MessageSquare className="w-4 h-4 mr-2 inline" /> View Messages
                  </button>
                </div>
              </div>

              <div className="bg-black rounded-xl p-4 md:p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h2 className="text-lg md:text-xl font-semibold text-white">Active Campaigns</h2>
                  <button onClick={() => setActiveTab('manage-campaign')} className="text-primary hover:text-secondary text-xs md:text-sm font-medium">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead className="text-gray-400 py-4">Campaign Name</TableHead>
                        <TableHead className="text-gray-400 py-4">Budget</TableHead>
                        <TableHead className="text-gray-400 py-4">Duration</TableHead>
                        <TableHead className="text-gray-400 py-4">Status</TableHead>
                        <TableHead className="text-gray-400 py-4">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userCampaigns.slice(0, 4).map((campaign) => (
                        <TableRow key={campaign.id} className="border-gray-800">
                          <TableCell className="font-semibold text-white py-5">{campaign.name}</TableCell>
                          <TableCell className="text-white py-5">${campaign.budget.toLocaleString()}</TableCell>
                          <TableCell className="text-sm text-gray-400 py-5">
                            {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="py-5">
                            <Badge variant="outline" className={getStatusBadge(campaign.status)}>
                              <span className="flex items-center gap-1.5">
                                {getStatusIcon(campaign.status)}
                                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell className="py-5">
                            <button onClick={() => setViewCampaign(campaign)} className="text-primary hover:text-secondary text-sm">View</button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          {/* ── MANAGE CAMPAIGNS TAB ── */}
          {activeTab === 'manage-campaign' && (
            <div>
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold text-black mb-2">Browse Campaigns</h1>
                  <p className="text-sm md:text-base text-gray-600">View and manage all your campaigns</p>
                </div>
                <button onClick={() => setActiveTab('create-campaign')}
                  className="flex items-center gap-2 bg-primary hover:bg-secondary text-black font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm">
                  <PlusCircle className="w-4 h-4" /> New Campaign
                </button>
              </div>

              <div className="bg-black rounded-xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead className="text-gray-400 py-4 pl-6">Campaign Name</TableHead>
                        <TableHead className="text-gray-400 py-4">Categories</TableHead>
                        <TableHead className="text-gray-400 py-4">Duration</TableHead>
                        <TableHead className="text-gray-400 py-4">Budget</TableHead>
                        <TableHead className="text-gray-400 py-4">Status</TableHead>
                        <TableHead className="text-gray-400 py-4">Influencers</TableHead>
                        <TableHead className="text-gray-400 py-4 pr-6">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userCampaigns.map((campaign) => (
                        <TableRow key={campaign.id} className="border-gray-800 hover:bg-gray-900/50 transition-colors">
                          {/* Campaign Name */}
                          <TableCell className="font-semibold text-white py-5 pl-6">{campaign.name}</TableCell>

                          {/* Categories */}
                          <TableCell className="py-5">
                            <div className="flex flex-wrap gap-1">
                              {(campaign.categories || ['Fashion', 'Lifestyle']).slice(0, 2).map((cat: string, i: number) => (
                                <span key={i} className="px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs font-medium">
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </TableCell>

                          {/* Duration */}
                          <TableCell className="text-sm text-gray-400 py-5">
                            {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                          </TableCell>

                          {/* Budget */}
                          <TableCell className="text-white font-medium py-5">
                            {campaign.min_budget && campaign.max_budget
                              ? `$${campaign.min_budget} - $${campaign.max_budget}`
                              : `$${campaign.budget?.toLocaleString()}`
                            }
                          </TableCell>

                          {/* Status */}
                          <TableCell className="py-5">
                            <Badge variant="outline" className={getStatusBadge(campaign.status)}>
                              <span className="flex items-center gap-1.5">
                                {getStatusIcon(campaign.status)}
                                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                              </span>
                            </Badge>
                          </TableCell>

                          {/* Influencers */}
                          <TableCell className="text-gray-300 text-sm py-5">
                            <div>
                              <span>{campaign.influencer}</span>
                              {campaign.num_influencers && parseInt(campaign.num_influencers) > 1 && (
                                <p className="text-xs text-primary">+{parseInt(campaign.num_influencers) - 1} more</p>
                              )}
                            </div>
                          </TableCell>

                          {/* ✅ Three dots action menu */}
                          <TableCell className="py-5 pr-6">
                            <div className="relative" ref={openActionMenu === campaign.id ? actionMenuRef : null}>
                              <button
                                onClick={() => setOpenActionMenu(openActionMenu === campaign.id ? null : campaign.id)}
                                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                              >
                                <MoreVertical className="w-5 h-5 text-gray-400" />
                              </button>

                              {/* Dropdown Menu */}
                              {openActionMenu === campaign.id && (
                                <div className="absolute right-0 top-10 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                                  {/* View Details */}
                                  <button
                                    onClick={() => { setViewCampaign(campaign); setOpenActionMenu(null); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-800 transition-colors text-sm"
                                  >
                                    <Eye className="w-4 h-4 text-gray-400" />
                                    View Details
                                  </button>

                                  {/* Edit Campaign */}
                                  <button
                                    onClick={() => { setEditCampaign({ ...campaign }); setOpenActionMenu(null); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-800 transition-colors text-sm"
                                  >
                                    <Edit2 className="w-4 h-4 text-gray-400" />
                                    Edit Campaign
                                  </button>

                                  <div className="border-t border-gray-700 my-1" />

                                  {/* Delete Campaign */}
                                  <button
                                    onClick={() => handleDeleteCampaign(campaign.id)}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 transition-colors text-sm"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Campaign
                                  </button>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          {/* ── CREATE CAMPAIGN TAB ── */}
          {activeTab === 'create-campaign' && (
            <div>
              <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-4xl font-bold text-black mb-2">Create New Campaign</h1>
                <p className="text-sm md:text-base text-gray-600">Fill out the details to launch your campaign</p>
              </div>
              <form onSubmit={handleCreateCampaign} className="w-full">
                <div className="bg-black rounded-xl p-4 md:p-8 border border-gray-800 space-y-6">

                  {/* 1. Campaign Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Name</label>
                    <Input value={campaignForm.name}
                      onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                      placeholder="Enter campaign name" className="bg-gray-900 border-gray-700 text-white" required />
                  </div>

                  {/* 2. Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <Textarea value={campaignForm.description}
                      onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                      placeholder="Describe your campaign objectives"
                      className="bg-gray-900 border-gray-700 text-white min-h-[120px]" required />
                  </div>

                  {/* 3. Platform — select ONE */}
                  <div>
  <label className="block text-sm font-medium text-gray-300 mb-2">
    Platform 
  </label>

  <select
    value={campaignForm.platform || ""}
    onChange={(e) =>
      setCampaignForm({ ...campaignForm, platform: e.target.value })
    }
    className="w-full px-4 py-2 rounded-md bg-gray-800 text-gray-300 border border-gray-700 focus:outline-none focus:border-primary"
  >
    <option value="" disabled>Select Platform</option>

    {apiPlatforms.map((platform) => (
      <option key={platform.id} value={platform.name}>
        {platform.name}
      </option>
    ))}
  </select>
</div>

                  {/* 4. Categories — select multiple */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Categories </label>
                    <div className="flex flex-wrap gap-2">
                      {apiCategories.map((category) => (
                        <button key={category.id || category.slug} type="button"
                          onClick={() => toggleCampaignCategory(category.name)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                            campaignForm.category_ids.includes(category.name)
                              ? 'bg-primary text-black border-primary'
                              : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500'
                          }`}>
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 5. Min & Max Budget */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Budget Range ($)</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Min Budget</label>
                        <Input value={campaignForm.min_budget}
                          onChange={(e) => setCampaignForm({ ...campaignForm, min_budget: e.target.value })}
                          placeholder="0" type="number" className="bg-gray-900 border-gray-700 text-white" required />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Max Budget</label>
                        <Input value={campaignForm.max_budget}
                          onChange={(e) => setCampaignForm({ ...campaignForm, max_budget: e.target.value })}
                          placeholder="0" type="number" className="bg-gray-900 border-gray-700 text-white" required />
                      </div>
                    </div>
                  </div>

                  {/* 6. Number of Influencers */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Number of Influencers</label>
                    <select value={campaignForm.num_influencers}
                      onChange={(e) => setCampaignForm({ ...campaignForm, num_influencers: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white">
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <option key={n} value={n}>{n} Influencer{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  {/* 7. Start & End Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                      <Input value={campaignForm.startDate}
                        onChange={(e) => setCampaignForm({ ...campaignForm, startDate: e.target.value })}
                        type="date" className="bg-gray-900 border-gray-700 text-white" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                      <Input value={campaignForm.endDate}
                        onChange={(e) => setCampaignForm({ ...campaignForm, endDate: e.target.value })}
                        type="date" className="bg-gray-900 border-gray-700 text-white" required />
                    </div>
                  </div>

                  {/* 8. Deliverables */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Deliverables</label>
                    <Textarea value={campaignForm.deliverables}
                      onChange={(e) => setCampaignForm({ ...campaignForm, deliverables: e.target.value })}
                      placeholder="What do you need from influencers?"
                      className="bg-gray-900 border-gray-700 text-white min-h-[100px]" />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button type="submit" className="flex-1 bg-primary hover:bg-secondary text-black font-medium">
                      Create Campaign
                    </Button>
                    <Button type="button" onClick={() => setActiveTab('overview')}
                      className="flex-1 bg-white hover:bg-gray-100 text-black font-medium">
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ── PROFILE TAB ── */}
          {activeTab === 'profile' && (
            <div>
              <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-4xl font-bold text-black mb-2">Edit Profile</h1>
                <p className="text-sm md:text-base text-gray-600">Manage your brand information</p>
              </div>
              <div className="border-b border-gray-200 mb-6 md:mb-8 overflow-x-auto">
                <div className="flex gap-4 md:gap-8 min-w-max">
                  {(['details', 'social-media', 'images', 'account'] as ProfileTabType[]).map((tab) => (
                    <button key={tab} onClick={() => setProfileTab(tab)}
                      className={`pb-3 md:pb-4 px-2 font-medium transition-all text-sm md:text-base whitespace-nowrap capitalize ${
                        profileTab === tab ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-gray-700'
                      }`}>
                      {tab.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {profileTab === 'details' && (
                <div className="max-w-2xl space-y-4 md:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <Input value={brandData.company_name} onChange={(e) => setBrandData({ ...brandData, company_name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <Input value={brandData.industry} onChange={(e) => setBrandData({ ...brandData, industry: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio / Description</label>
                    <Textarea value={brandData.bio} onChange={(e) => setBrandData({ ...brandData, bio: e.target.value })}
                      className="min-h-[120px]" placeholder="What do you sell? What is your mission?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Categories</label>
                    <div className="flex flex-wrap gap-2">
                      {categoryList.map((category) => (
                        <button key={category} onClick={() => toggleCategory(category)}
                          className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                            selectedCategories.includes(category) ? 'bg-black text-white' : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                          }`}>
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4">
                    <button onClick={handleSaveProfile} className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {profileTab === 'account' && (
                <div className="max-w-2xl space-y-4 md:space-y-6">
                  {[
                    { label: 'Full Name', key: 'name', type: 'text' },
                    { label: 'Email', key: 'email', type: 'email' },
                    { label: 'Phone', key: 'phone', type: 'tel' },
                    { label: 'Country', key: 'country', type: 'text' },
                    { label: 'City', key: 'city', type: 'text' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                      <Input
                        value={brandData[field.key as keyof typeof brandData]}
                        onChange={(e) => setBrandData({ ...brandData, [field.key]: e.target.value })}
                        type={field.type}
                      />
                    </div>
                  ))}
                  <div className="pt-4">
                    <button onClick={handleSaveProfile} className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {profileTab === 'social-media' && (
                <div className="max-w-2xl space-y-3 md:space-y-4">
                  {[
                    { key: 'website', icon: LinkIcon, placeholder: 'Add Website URL' },
                    { key: 'instagram', icon: Instagram, placeholder: 'Add Instagram URL' },
                    { key: 'youtube', icon: Youtube, placeholder: 'Add YouTube URL' },
                    { key: 'twitter', icon: Twitter, placeholder: 'Add Twitter URL' },
                  ].map((item) => (
                    <div key={item.key} className="border border-gray-200 rounded-lg p-3 md:p-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        <Input
                          value={socialMedia[item.key as keyof typeof socialMedia]}
                          onChange={(e) => setSocialMedia({ ...socialMedia, [item.key]: e.target.value })}
                          placeholder={item.placeholder}
                          className="border-0 focus-visible:ring-0"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pt-4">
                    <button onClick={handleSaveProfile} className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {profileTab === 'images' && (
                <div className="max-w-2xl space-y-6 md:space-y-8">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                      <User className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
                    </div>
                    <button className="flex items-center gap-2 text-black hover:text-gray-700 font-medium text-sm md:text-base">
                      <Camera className="w-4 h-4" /> Upload Photo
                    </button>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Cover Photo</div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 md:p-12 bg-gray-50 hover:border-gray-400 cursor-pointer">
                      <div className="flex flex-col items-center text-center">
                        <Upload className="w-10 h-10 text-gray-500 mb-4" />
                        <div className="text-gray-400 mb-2">Optional Cover Photo</div>
                        <div className="text-gray-500 text-xs">Click to upload</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── MESSAGES TAB ── */}
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
            {menuItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} onClick={() => handleTabChange(item.id as TabType)}
                  className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                    activeTab === item.id ? 'text-primary' : 'text-gray-500 hover:text-gray-300'
                  }`}>
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium truncate max-w-full">{item.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── VIEW CAMPAIGN MODAL ── */}
      {viewCampaign && (
        <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-black">{viewCampaign.name}</h2>
              <button onClick={() => setViewCampaign(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className={getStatusBadge(viewCampaign.status)}>
                  <span className="flex items-center gap-1.5">
                    {getStatusIcon(viewCampaign.status)}
                    {viewCampaign.status.charAt(0).toUpperCase() + viewCampaign.status.slice(1)}
                  </span>
                </Badge>
              </div>
              {[
                { label: 'Description', value: viewCampaign.description },
                { label: 'Platform', value: viewCampaign.platform },
                { label: 'Budget', value: viewCampaign.min_budget && viewCampaign.max_budget
                  ? `$${viewCampaign.min_budget} - $${viewCampaign.max_budget}`
                  : `$${viewCampaign.budget?.toLocaleString()}` },
                { label: 'Duration', value: `${new Date(viewCampaign.startDate).toLocaleDateString()} - ${new Date(viewCampaign.endDate).toLocaleDateString()}` },
                { label: 'No. of Influencers', value: viewCampaign.num_influencers || '1' },
                { label: 'Influencer', value: viewCampaign.influencer },
                { label: 'Deliverables', value: viewCampaign.deliverables },
              ].map((item) => item.value && (
                <div key={item.label} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className="text-gray-800 font-medium text-sm">{item.value}</p>
                </div>
              ))}
              {viewCampaign.categories?.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">Categories</p>
                  <div className="flex flex-wrap gap-1">
                    {viewCampaign.categories.map((cat: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs">{cat}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button
                onClick={() => { setEditCampaign({ ...viewCampaign }); setViewCampaign(null); }}
                className="flex-1 bg-primary hover:bg-secondary text-black font-semibold py-2.5 rounded-lg transition-colors">
                Edit Campaign
              </button>
              <button onClick={() => setViewCampaign(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT CAMPAIGN MODAL ── */}
      {editCampaign && (
        <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-black">Edit Campaign</h2>
              <button onClick={() => setEditCampaign(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateCampaign} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                <Input value={editCampaign.name} onChange={(e) => setEditCampaign({ ...editCampaign, name: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <Textarea value={editCampaign.description} onChange={(e) => setEditCampaign({ ...editCampaign, description: e.target.value })} className="min-h-[100px]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Budget ($)</label>
                  <Input value={editCampaign.min_budget || editCampaign.budget} onChange={(e) => setEditCampaign({ ...editCampaign, min_budget: e.target.value })} type="number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Budget ($)</label>
                  <Input value={editCampaign.max_budget || editCampaign.budget} onChange={(e) => setEditCampaign({ ...editCampaign, max_budget: e.target.value })} type="number" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">No. of Influencers</label>
                <select value={editCampaign.num_influencers || '1'}
                  onChange={(e) => setEditCampaign({ ...editCampaign, num_influencers: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800">
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n}>{n} Influencer{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <Input value={editCampaign.startDate} onChange={(e) => setEditCampaign({ ...editCampaign, startDate: e.target.value })} type="date" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <Input value={editCampaign.endDate} onChange={(e) => setEditCampaign({ ...editCampaign, endDate: e.target.value })} type="date" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select value={editCampaign.status}
                  onChange={(e) => setEditCampaign({ ...editCampaign, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800">
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deliverables</label>
                <Textarea value={editCampaign.deliverables} onChange={(e) => setEditCampaign({ ...editCampaign, deliverables: e.target.value })} className="min-h-[80px]" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1 bg-primary hover:bg-secondary text-black font-semibold">Save Changes</Button>
                <Button type="button" onClick={() => setEditCampaign(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}