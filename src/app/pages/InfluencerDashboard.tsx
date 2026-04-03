import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Logo } from '../components/Logo';
import {
  LayoutDashboard, User, Briefcase, MessageSquare, Settings, LogOut,
  Instagram, Youtube, Video, TrendingUp, DollarSign, Eye, Heart,
  Edit, Camera, BarChart3, Menu, X,
} from 'lucide-react';
import { InfluencerAnalytics } from '../components/InfluencerAnalytics';
import { API_BASE_URL } from '../../services/api';

type TabType = 'overview' | 'profile' | 'campaigns' | 'messages' | 'settings' | 'analytics';

export default function InfluencerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('influencer_token');
      if (!token) {
        navigate('/influencer/login');
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/influencers/get-profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const result = await response.json();
        console.log('Profile Response:', result);
        if (result.success) {
          setUserData(result.data);
        } else {
          localStorage.removeItem('influencer_token');
          navigate('/influencer/login');
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
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

  const handleLogout = () => {
    localStorage.removeItem('influencer_token');
    navigate('/influencer/login');
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
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
    { label: 'Total Earnings', value: '$12,450', icon: DollarSign, color: 'text-green-500' },
    { label: 'Active Campaigns', value: '3', icon: Briefcase, color: 'text-blue-500' },
    { label: 'Total Reach', value: '245K', icon: Eye, color: 'text-purple-500' },
    { label: 'Engagement Rate', value: '4.8%', icon: Heart, color: 'text-pink-500' },
  ];

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'campaigns', label: 'Campaigns', icon: Briefcase },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const socialStats = [
    { platform: 'Instagram', followers: '125K', engagement: '5.2%', icon: Instagram, color: 'from-purple-600 to-pink-600' },
    { platform: 'YouTube', followers: '85K', engagement: '3.8%', icon: Youtube, color: 'from-red-600 to-red-500' },
    { platform: 'TikTok', followers: '35K', engagement: '7.1%', icon: Video, color: 'from-black to-gray-800' },
  ];

  return (
    
    <div className="min-h-screen bg-white pb-16 md:pb-0">
 <Navbar />
      {/* Top Navigation */}
      <div className="bg-black border-b border-gray-800 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-1 hover:bg-gray-800 rounded-lg">
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
            <span className="text-primary text-sm font-semibold">Influncers Portal</span>
          </div>
          <span className="text-gray-400 text-xs">
           Welcome, {userData?.name}
          </span>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-72 h-full bg-black border-r border-gray-800 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-800"><Logo /></div>
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
          <aside className="w-64 min-h-[calc(100vh-64px)] bg-black border-r border-gray-800 p-6">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} onClick={() => setActiveTab(item.id as TabType)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id ? 'bg-primary text-black' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                    }`}>
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-900 transition-colors mt-8">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Dashboard Overview</h1>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="bg-black rounded-xl p-4 md:p-6 border border-gray-800">
                      <div className="flex items-center justify-between mb-3 md:mb-4">
                        <Icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.color}`} />
                        <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                      </div>
                      <p className="text-xl md:text-2xl font-bold text-white mb-1">{stat.value}</p>
                      <p className="text-xs md:text-sm text-gray-400">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
              <div className="bg-black rounded-xl p-4 md:p-6 border border-gray-800">
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">Social Media Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {socialStats.map((social) => {
                    const Icon = social.icon;
                    return (
                      <div key={social.platform} className="bg-gray-900 rounded-lg p-4 md:p-6">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br ${social.color} flex items-center justify-center mb-3 md:mb-4`}>
                          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-white mb-2">{social.platform}</h3>
                        <p className="text-sm text-gray-400">Followers: <span className="text-white font-medium">{social.followers}</span></p>
                        <p className="text-sm text-gray-400">Engagement: <span className="text-white font-medium">{social.engagement}</span></p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── PROFILE TAB ── */}
          {activeTab === 'profile' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Profile</h1>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? 'outline' : 'default'}
                  className={`${isEditing ? 'border-gray-700 text-gray-900' : 'bg-primary text-black'} w-full sm:w-auto`}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>

              <div className="bg-black rounded-xl p-4 md:p-8 border border-gray-800 mb-6">

                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-gray-800">
                  <div className="relative mx-auto sm:mx-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl md:text-4xl font-bold">
                      {userData.name?.[0]?.toUpperCase() || 'I'}
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center text-black">
                        <Camera className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    )}
                  </div>
                  <div className="flex-1 w-full">
                    {isEditing ? (
                      <div className="space-y-3 md:space-y-4">
                        <Input defaultValue={userData.name} className="bg-gray-900 border-gray-700 text-white text-lg font-bold" placeholder="Full Name" />
                        <Input defaultValue={userData.bio || ''} className="bg-gray-900 border-gray-700 text-white" placeholder="Bio" />
                      </div>
                    ) : (
                      <div className="text-center sm:text-left">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{userData.name}</h2>
                        <p className="text-gray-400 mb-3 text-sm md:text-base">{userData.bio || 'Content Creator & Influencer'}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    {isEditing ? (
                      <Input defaultValue={userData.email} className="bg-gray-900 border-gray-700 text-white" type="email" />
                    ) : (
                      <p className="text-white text-sm md:text-base break-all">{userData.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                    {isEditing ? (
                      <Input defaultValue={userData.phone || ''} className="bg-gray-900 border-gray-700 text-white" type="tel" placeholder="+1 (555) 000-0000" />
                    ) : (
                      <p className="text-white text-sm md:text-base">{userData.phone || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Country</label>
                    {isEditing ? (
                      <Input defaultValue={userData.country || ''} className="bg-gray-900 border-gray-700 text-white" placeholder="Country" />
                    ) : (
                      <p className="text-white text-sm md:text-base">{userData.country || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
                    {isEditing ? (
                      <Input defaultValue={userData.city || ''} className="bg-gray-900 border-gray-700 text-white" placeholder="City" />
                    ) : (
                      <p className="text-white text-sm md:text-base">{userData.city || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-6 md:mb-8">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                  {isEditing ? (
                    <textarea rows={4}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="Tell brands about yourself..."
                      defaultValue={userData.bio || ''}
                    />
                  ) : (
                    <p className="text-white text-sm md:text-base leading-relaxed">{userData.bio || 'No bio added yet.'}</p>
                  )}
                </div>

{/* Connected Social Accounts */}
<div>
  <h3 className="text-base md:text-lg font-bold text-white mb-3 md:mb-4">Connected Social Accounts</h3>
  <div className="space-y-3">

    {/* Instagram - platform_id: 1 */}
    <div className="flex items-center bg-gray-900 rounded-lg p-3 md:p-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
          <Instagram className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white text-sm md:text-base">Instagram</p>
          <p className="text-xs md:text-sm text-gray-400 truncate">
            {userData.social_accounts?.find((s: any) => s.platform_id === 1)?.profile_url || 'Not connected'}
          </p>
        </div>
      </div>
    </div>

    {/* YouTube - platform_id: 2 */}
    <div className="flex items-center bg-gray-900 rounded-lg p-3 md:p-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center flex-shrink-0">
          <Youtube className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white text-sm md:text-base">YouTube</p>
          <p className="text-xs md:text-sm text-gray-400 truncate">
            {userData.social_accounts?.find((s: any) => s.platform_id === 2)?.profile_url || 'Not connected'}
          </p>
        </div>
      </div>
    </div>

    {/* TikTok - platform_id: 3 */}
    <div className="flex items-center bg-gray-900 rounded-lg p-3 md:p-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-black to-gray-700 flex items-center justify-center flex-shrink-0">
          <Video className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white text-sm md:text-base">TikTok</p>
          <p className="text-xs md:text-sm text-gray-400 truncate">
            {userData.social_accounts?.find((s: any) => s.platform_id === 3)?.profile_url || 'Not connected'}
          </p>
        </div>
      </div>
    </div>

    {/* UGC / Other - platform_id: 4 */}
    <div className="flex items-center bg-gray-900 rounded-lg p-3 md:p-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
          <Video className="w-5 h-5 text-black" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white text-sm md:text-base">UGC / Other</p>
          <p className="text-xs md:text-sm text-gray-400 truncate">
            {userData.social_accounts?.find((s: any) => s.platform_id === 4)?.profile_url || 'Not connected'}
          </p>
        </div>
      </div>
    </div>

  </div>
</div>

                {/* Save / Cancel buttons */}
                {isEditing && (
                  <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-800">
                    <Button onClick={() => setIsEditing(false)} className="flex-1 bg-primary hover:bg-secondary text-black font-medium">
                      Save Changes
                    </Button>
                    <Button onClick={() => setIsEditing(false)} className="flex-1 bg-white hover:bg-gray-100 text-black font-medium">
                      Cancel
                    </Button>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* ── CAMPAIGNS TAB ── */}
          {activeTab === 'campaigns' && (
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">My Campaigns</h1>
              <div className="bg-black rounded-xl p-8 md:p-12 border border-gray-800 text-center">
                <Briefcase className="w-12 h-12 md:w-16 md:h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-lg md:text-xl text-white mb-2">No active campaigns yet</p>
                <p className="text-sm md:text-base text-gray-400 mb-6">Start browsing available campaigns to get started</p>
                <Button className="bg-primary hover:bg-secondary text-black w-full sm:w-auto">Browse Campaigns</Button>
              </div>
            </div>
          )}

          {/* ── MESSAGES TAB ── */}
          {activeTab === 'messages' && (
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Messages</h1>
              <div className="bg-black rounded-xl p-8 md:p-12 border border-gray-800 text-center">
                <MessageSquare className="w-12 h-12 md:w-16 md:h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-lg md:text-xl text-white mb-2">No messages yet</p>
                <p className="text-sm md:text-base text-gray-400">Your conversations with brands will appear here</p>
              </div>
            </div>
          )}

          {/* ── SETTINGS TAB ── */}
          {activeTab === 'settings' && (
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Settings</h1>
              <div className="bg-black rounded-xl p-4 md:p-8 border border-gray-800">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-white mb-3 md:mb-4">Notification Preferences</h3>
                    <div className="space-y-3">
                      {['Email notifications', 'Campaign updates', 'New message alerts'].map((label) => (
                        <label key={label} className="flex items-center justify-between cursor-pointer p-3 bg-gray-900 rounded-lg">
                          <span className="text-white text-sm md:text-base">{label}</span>
                          <input type="checkbox" defaultChecked className="rounded border-gray-700 bg-gray-800" />
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-800">
                    <h3 className="text-base md:text-lg font-bold text-white mb-3 md:mb-4">Account Settings</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start bg-gray-800 border-2 border-gray-700 text-white hover:bg-gray-700 font-semibold">Change Password</Button>
                      <Button variant="outline" className="w-full justify-start bg-gray-800 border-2 border-gray-700 text-white hover:bg-gray-700 font-semibold">Privacy Settings</Button>
                      <Button variant="outline" className="w-full justify-start bg-red-950 border-2 border-red-700 text-red-500 hover:bg-red-900 font-semibold">Delete Account</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── ANALYTICS TAB ── */}
          {activeTab === 'analytics' && <InfluencerAnalytics />}

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
                  <span className="text-xs font-medium truncate max-w-full">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}