import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import {
  TrendingUp, Users, DollarSign, MessageSquare, Calendar, Clock,
  CheckCircle, XCircle, Settings, LayoutDashboard, PlusCircle,
  LogOut, User, Link as LinkIcon, Instagram, Youtube,
  Twitter, Upload, Camera, Eye, Menu, X, Folder,
  MoreVertical, Trash2, Edit2, ChevronDown,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../components/ui/table';
import { API_BASE_URL } from '../../services/api';
import { usePlatforms } from '../hooks/usePlatforms';
import { useCategories } from '../hooks/useCategories';
import { Music2 } from "lucide-react";
type TabType = 'overview' | 'profile' | 'create-campaign' | 'browse' | 'messages' | 'manage-campaign';
type ProfileTabType = 'details' | 'social-media' | 'images' | 'account';

// ── Status mapping ──
const STATUS_MAP: Record<number, string> = {
  1: 'pending', 2: 'active', 3: 'completed', 4: 'cancelled',
};
const STATUS_ID_MAP: Record<string, number> = {
  pending: 1, active: 2, completed: 3, cancelled: 4,
};

// ── Industries ──
const INDUSTRIES = [
  'Fashion & Apparel', 'Beauty & Cosmetics', 'Technology', 'Food & Beverage',
  'Fitness & Wellness', 'Travel & Hospitality', 'Gaming & Entertainment',
  'Healthcare', 'Education', 'Finance', 'Automotive', 'Real Estate',
  'E-Commerce', 'Media & Publishing', 'Sports', 'Retail', 'Other',
];

const COMPANY_SIZES = [
  '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+',
];

// ── Countries with cities ──
const COUNTRIES_CITIES: Record<string, string[]> = {
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'San Francisco', 'Seattle', 'Miami', 'Boston', 'Dallas'],
  'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Edinburgh', 'Bristol', 'Liverpool'],
  'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'],
  'UAE': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'],
  'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Edmonton', 'Ottawa'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast'],
  'Germany': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart'],
  'France': ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Bordeaux'],
  'Singapore': ['Singapore'],
  'Saudi Arabia': ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam'],
  'Pakistan': ['Karachi', 'Lahore', 'Islamabad', 'Faisalabad', 'Rawalpindi'],
  'Bangladesh': ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi'],
  'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza'],
  'Japan': ['Tokyo', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo'],
  'China': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu'],
  'South Korea': ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon'],
  'Netherlands': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht'],
  'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao'],
  'Italy': ['Rome', 'Milan', 'Naples', 'Turin', 'Florence'],
  'Turkey': ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya'],
  'Nigeria': ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt'],
  'South Africa': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria'],
  'Egypt': ['Cairo', 'Alexandria', 'Giza', 'Luxor'],
  'Mexico': ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla'],
  'Argentina': ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza'],
  'Indonesia': ['Jakarta', 'Surabaya', 'Bandung', 'Medan'],
  'Malaysia': ['Kuala Lumpur', 'Penang', 'Johor Bahru', 'Ipoh'],
  'Thailand': ['Bangkok', 'Chiang Mai', 'Pattaya', 'Phuket'],
  'Philippines': ['Manila', 'Cebu', 'Davao', 'Quezon City'],
  'Vietnam': ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hue'],
  'United Arab Emirates': [
  'Abu Dhabi','Dubai','Sharjah','Ajman','Umm Al Quwain','Ras Al Khaimah','Fujairah'],
  'Other': ['Other'],
};

const ALL_COUNTRIES = Object.keys(COUNTRIES_CITIES).sort();

export function BrandDashboard() {
  const navigate = useNavigate();
  const { platforms: apiPlatforms } = usePlatforms();
  const { categories: apiCategories } = useCategories();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [profileTab, setProfileTab] = useState<ProfileTabType>('details');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  const [viewCampaign, setViewCampaign] = useState<any>(null);
  const [editCampaign, setEditCampaign] = useState<any>(null);
  const [campaignLoading, setCampaignLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  const [brandData, setBrandData] = useState({
    name: '', phone: '', country: '', city: '',
    bio: '', company_name: '', industry: '', company_size: '',
  });

  const [socialMedia, setSocialMedia] = useState({
    website: '', instagram: '', tiktok: '', youtube: '', twitter: '',
  });

  const [campaignForm, setCampaignForm] = useState({
    title: '', description: '', platform: '',
    category_ids: [] as number[],
    budget_min: '', budget_max: '',
    number_of_influencers: '1',
    start_date: '', end_date: '',
  });

  const [userCampaigns, setUserCampaigns] = useState<any[]>([]);

  // ── Available cities based on selected country ──
  const availableCities = brandData.country
    ? (COUNTRIES_CITIES[brandData.country] || ['Other'])
    : [];

  // ── Close action menu on outside click ──
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target as Node)) {
        setOpenActionMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Fetch brand profile ──
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
          prefillBrandData(result.data);
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

  const prefillBrandData = (data: any) => {
    const brandProfile = data.brand_profile || {};
    const socialProfile = data.social_profile || data.brand_social_profile || {};

    setBrandData({
      name: data.name || '',
      phone: data.phone || '',
      country: data.country || '',
      city: data.city || '',
      bio: brandProfile.bio || data.bio || '',
      company_name: brandProfile.company_name || '',
      industry: brandProfile.industry || '',
      company_size: brandProfile.company_size || '',
    });

    setSocialMedia({
      website: socialProfile.website || brandProfile.website || data.website || '',
      instagram: socialProfile.instagram || '',
      tiktok: socialProfile.tiktok || '',
      youtube: socialProfile.youtube || '',
      twitter: socialProfile.twitter || '',
    });

    setProfileImagePreview(data.profile_pic || null);
    setCoverImagePreview(data.cover_image || brandProfile.cover_image || null);
  };

  // ── Fetch campaigns ──
  useEffect(() => {
    const fetchCampaigns = async () => {
      const token = localStorage.getItem('brand_token');
      if (!token) return;
      try {
        const response = await fetch(`${API_BASE_URL}/campaigns/get-campaigns`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        const result = await response.json();
        if (result.success) setUserCampaigns(result.data || []);
      } catch (error) {
        console.error('Fetch campaigns error:', error);
      }
    };
    fetchCampaigns();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const refreshProfile = async (token: string) => {
    const refetch = await fetch(`${API_BASE_URL}/brands/get-profile`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    });
    const refetchResult = await refetch.json();
    if (refetchResult.success) {
      setUserData(refetchResult.data);
      prefillBrandData(refetchResult.data);
      localStorage.setItem('brand_user', JSON.stringify(refetchResult.data));
    }
  };

  const handleSaveProfileDetails = async () => {
    const token = localStorage.getItem('brand_token');
    if (!token) return;
    setProfileSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/brands/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          company_name: brandData.company_name,
          industry: brandData.industry,
          website: socialMedia.website,
          company_size: brandData.company_size,
          bio: brandData.bio,
        }),
      });
      const result = await response.json();
      if (result.success || response.ok) {
        await refreshProfile(token);
        alert('Profile details updated successfully!');
      } else {
        alert(result.message || 'Failed to update profile details');
      }
    } catch (error) {
      alert('Server error');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSaveSocialProfile = async () => {
    const token = localStorage.getItem('brand_token');
    if (!token) return;
    setProfileSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/brands/update-social-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          website: socialMedia.website,
          instagram: socialMedia.instagram,
          youtube: socialMedia.youtube,
          tiktok: socialMedia.tiktok,
          twitter: socialMedia.twitter,
        }),
      });
      const result = await response.json();
      if (result.success || response.ok) {
        await refreshProfile(token);
        alert('Social profile updated successfully!');
      } else {
        alert(result.message || 'Failed to update social profile');
      }
    } catch (error) {
      alert('Server error');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSaveProfileImages = async () => {
    const token = localStorage.getItem('brand_token');
    if (!token) return;
    if (!profileImageFile && !coverImageFile) {
      alert('Please select at least one image to upload');
      return;
    }

    setProfileSaving(true);
    try {
      const formData = new FormData();
      if (profileImageFile) formData.append('profile_pic', profileImageFile);
      if (coverImageFile) formData.append('cover_image', coverImageFile);

      const response = await fetch(`${API_BASE_URL}/brands/update-profile-images`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      const result = await response.json();
      if (result.success || response.ok) {
        await refreshProfile(token);
        setProfileImageFile(null);
        setCoverImageFile(null);
        alert('Profile images updated successfully!');
      } else {
        alert(result.message || 'Failed to update profile images');
      }
    } catch (error) {
      alert('Server error');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSaveAccountDetails = async () => {
    const token = localStorage.getItem('brand_token');
    if (!token) return;
    setProfileSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/brands/update-account-details`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          country: brandData.country,
          city: brandData.city,
          phone: brandData.phone,
        }),
      });
      const result = await response.json();
      if (result.success || response.ok) {
        await refreshProfile(token);
        alert('Account details updated successfully!');
      } else {
        alert(result.message || 'Failed to update account details');
      }
    } catch (error) {
      alert('Server error');
    } finally {
      setProfileSaving(false);
    }
  };

  // ── Handle profile image selection ──
  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'profile' | 'cover',
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      if (type === 'profile') {
        setProfileImageFile(file);
        setProfileImagePreview(imageUrl);
      } else {
        setCoverImageFile(file);
        setCoverImagePreview(imageUrl);
      }
    };
    reader.readAsDataURL(file);
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

  const toggleCampaignCategory = (id: number) => {
    setCampaignForm(prev => ({
      ...prev,
      category_ids: prev.category_ids.includes(id)
        ? prev.category_ids.filter(c => c !== id)
        : [...prev.category_ids, id],
    }));
  };

  // ── ✅ Create Campaign ──
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('brand_token');
    if (!token) return;
    setCampaignLoading(true);
    try {
      const payload = {
        title: campaignForm.title,
        description: campaignForm.description,
        budget_min: campaignForm.budget_min,
        budget_max: campaignForm.budget_max,
        start_date: campaignForm.start_date,
        end_date: campaignForm.end_date,
        status_id: 1, // always pending on create
        number_of_influencers: parseInt(campaignForm.number_of_influencers),
        category_ids: campaignForm.category_ids,
      };
      const response = await fetch(`${API_BASE_URL}/campaigns/add-campaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success || response.ok) {
        alert('✅ Campaign created successfully!');
        // Refresh list
        const res = await fetch(`${API_BASE_URL}/campaigns/get-campaigns`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setUserCampaigns(data.data || []);
        setCampaignForm({ title: '', description: '', platform: '', category_ids: [], budget_min: '', budget_max: '', number_of_influencers: '1', start_date: '', end_date: '' });
        setActiveTab('manage-campaign');
      } else {
        alert(result.message || 'Failed to create campaign');
      }
    } catch (error) {
      alert('Server error');
    } finally {
      setCampaignLoading(false);
    }
  };

  // ── ✅ Update Campaign ──
  const handleUpdateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('brand_token');
    if (!token) return;
    setCampaignLoading(true);
    try {
      const payload = {
        id: editCampaign.id,
        title: editCampaign.title || editCampaign.name,
        description: editCampaign.description,
        budget_min: editCampaign.budget_min,
        budget_max: editCampaign.budget_max,
        start_date: editCampaign.start_date,
        end_date: editCampaign.end_date,
        status_id: editCampaign.status_id || STATUS_ID_MAP[editCampaign.status] || 1,
        number_of_influencers: parseInt(editCampaign.number_of_influencers || '1'),
        // ✅ Preserve existing category_ids
        category_ids: editCampaign.category_ids ||
          (editCampaign.campaign_categories || editCampaign.categories || [])
            .map((c: any) => c.id || c.category_id || c.category?.id)
            .filter(Boolean),
      };
      const response = await fetch(`${API_BASE_URL}/campaigns/edit-campaign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success || response.ok) {
        alert('✅ Campaign updated successfully!');
        // ✅ Refresh to get updated categories
        const res = await fetch(`${API_BASE_URL}/campaigns/get-campaigns`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setUserCampaigns(data.data || []);
        setEditCampaign(null);
      } else {
        alert(result.message || 'Failed to update campaign');
      }
    } catch (error) {
      alert('Server error');
    } finally {
      setCampaignLoading(false);
    }
  };

  // ── ✅ Delete Campaign ──
  const handleDeleteCampaign = async (id: any) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    const token = localStorage.getItem('brand_token');
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns/delete-campaign`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();
      if (result.success || response.ok) {
        setUserCampaigns(prev => prev.filter(c => c.id !== id));
        setOpenActionMenu(null);
      } else {
        alert(result.message || 'Failed to delete');
      }
    } catch (error) {
      alert('Server error');
    }
  };

  // ── ✅ View Campaign Details ──
  const handleViewCampaign = async (campaign: any) => {
    const token = localStorage.getItem('brand_token');
    if (!token) return;
    setOpenActionMenu(null);
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns/get-campaign-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id: campaign.id }),
      });
      const result = await response.json();
      setViewCampaign(result.success ? result.data : campaign);
    } catch {
      setViewCampaign(campaign);
    }
  };

  // ── ✅ Open Edit with categories pre-loaded ──
  const handleOpenEdit = async (campaign: any) => {
    setOpenActionMenu(null);
    const token = localStorage.getItem('brand_token');
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns/get-campaign-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id: campaign.id }),
      });
      const result = await response.json();
      const detail = result.success ? result.data : campaign;
      // Extract category IDs
      const catIds = (detail.campaign_categories || detail.categories || [])
        .map((c: any) => c.id || c.category_id || c.category?.id)
        .filter(Boolean);
      setEditCampaign({
        ...detail,
        category_ids: catIds,
        status_id: detail.status_id || STATUS_ID_MAP[detail.status] || 1,
      });
    } catch {
      setEditCampaign({ ...campaign, category_ids: [] });
    }
  };

  const getCampaignStatus = (campaign: any): string => {
    if (campaign.status && typeof campaign.status === 'string') return campaign.status;
    if (campaign.status_id) return STATUS_MAP[campaign.status_id] || 'pending';
    return 'pending';
  };

  const getCampaignName = (campaign: any): string =>
    campaign.title || campaign.name || 'Untitled';

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
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  const stats = [
    { icon: Users, label: 'Active Campaigns', value: userCampaigns.filter(c => getCampaignStatus(c) === 'active').length.toString(), change: 'Total active', changeType: 'positive' as const },
    { icon: DollarSign, label: 'Total Budget', value: '$' + userCampaigns.reduce((sum, c) => sum + (parseFloat(c.budget_max || c.budget || 0)), 0).toLocaleString(), change: 'All campaigns', changeType: 'positive' as const },
    { icon: TrendingUp, label: 'Total Campaigns', value: userCampaigns.length.toString(), change: 'All time', changeType: 'positive' as const },
    { icon: MessageSquare, label: 'Unread Messages', value: '0', change: '0 new today', changeType: 'neutral' as const },
  ];

  // ✅ Removed 'create-campaign' from sidebar
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Edit Profile', icon: Settings },
    { id: 'manage-campaign', label: 'Campaigns', icon: Folder },
    { id: 'browse', label: 'Browse Creators', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
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
                  <button onClick={() => setActiveTab('manage-campaign')}
                    className="bg-primary hover:bg-secondary text-black font-semibold px-4 md:px-6 py-2.5 md:py-3 rounded-lg transition-colors text-sm md:text-base">
                    <Folder className="w-4 h-4 mr-2 inline" /> Manage Campaigns
                  </button>
                  <Link to="/browse">
                    <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg transition-colors border border-gray-700 text-sm md:text-base">
                      <Users className="w-4 h-4 mr-2 inline" /> Browse Influencers
                    </button>
                  </Link>
                  <button onClick={() => setActiveTab('messages')}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg transition-colors border border-gray-700 text-sm md:text-base">
                    <MessageSquare className="w-4 h-4 mr-2 inline" /> View Messages
                  </button>
                </div>
              </div>

              <div className="bg-black rounded-xl p-4 md:p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h2 className="text-lg md:text-xl font-semibold text-white">Recent Campaigns</h2>
                  <button onClick={() => setActiveTab('manage-campaign')} className="text-primary text-xs md:text-sm font-medium">View All</button>
                </div>
                {userCampaigns.length === 0 ? (
                  <div className="text-center py-8">
                    <Folder className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm mb-3">No campaigns yet</p>
                    <button onClick={() => setActiveTab('manage-campaign')} className="text-primary text-sm hover:underline">
                      Create your first campaign →
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-800">
                          <TableHead className="text-gray-400 py-4">Campaign Name</TableHead>
                          <TableHead className="text-gray-400 py-4">Budget</TableHead>
                          <TableHead className="text-gray-400 py-4">Duration</TableHead>
                          {/*<TableHead className="text-gray-400 py-4">Status</TableHead>*/}
                          <TableHead className="text-gray-400 py-4">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userCampaigns.slice(0, 4).map((campaign) => {
                          const status = getCampaignStatus(campaign);
                          return (
                            <TableRow key={campaign.id} className="border-gray-800">
                              <TableCell className="font-semibold text-white py-5">{getCampaignName(campaign)}</TableCell>
                              <TableCell className="text-white py-5">
                                {campaign.budget_min && campaign.budget_max
                                  ? `$${campaign.budget_min} - $${campaign.budget_max}`
                                  : `$${(campaign.budget || 0).toLocaleString()}`}
                              </TableCell>
                              <TableCell className="text-sm text-gray-400 py-5">
                                {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : '-'} - {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : '-'}
                              </TableCell>
                              <TableCell className="py-5">
                                <Badge variant="outline" className={getStatusBadge(status)}>
                                  <span className="flex items-center gap-1.5">{getStatusIcon(status)}{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                                </Badge>
                              </TableCell>
                              <TableCell className="py-5">
                                <button onClick={() => handleViewCampaign(campaign)} className="text-primary hover:text-secondary text-sm">View</button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── MANAGE CAMPAIGNS TAB ── */}
          {activeTab === 'manage-campaign' && (
            <div>
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold text-black mb-2">Campaigns</h1>
                  <p className="text-sm md:text-base text-gray-600">View and manage all your campaigns</p>
                </div>
                {/* ✅ Create Campaign button INSIDE campaigns section */}
                <button onClick={() => setActiveTab('create-campaign')}
                  className="flex items-center gap-2 bg-primary hover:bg-secondary text-black font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm">
                  <PlusCircle className="w-4 h-4" /> New Campaign
                </button>
              </div>

              {userCampaigns.length === 0 ? (
                <div className="bg-black rounded-xl p-12 border border-gray-800 text-center">
                  <Folder className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-white text-xl mb-2">No campaigns yet</p>
                  <p className="text-gray-400 text-sm mb-6">Create your first campaign to get started</p>
                  <button onClick={() => setActiveTab('create-campaign')} className="bg-primary hover:bg-secondary text-black font-semibold px-6 py-2.5 rounded-lg">
                    Create Campaign
                  </button>
                </div>
              ) : (
                <div className="bg-black rounded-xl border border-gray-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-800">
                          <TableHead className="text-gray-400 py-4 pl-6">Campaign Name</TableHead>
                          <TableHead className="text-gray-400 py-4">Categories</TableHead>
                          <TableHead className="text-gray-400 py-4">Duration</TableHead>
                          <TableHead className="text-gray-400 py-4">Budget</TableHead>
                          {/*<TableHead className="text-gray-400 py-4">Status</TableHead>*/}
                          <TableHead className="text-gray-400 py-4">Influencers</TableHead>
                          <TableHead className="text-gray-400 py-4 pr-6">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userCampaigns.map((campaign) => {
                          const status = getCampaignStatus(campaign);
                          // ✅ Get categories from API response
                          const cats = campaign.campaign_categories || campaign.categories || [];
                          return (
                            <TableRow key={campaign.id} className="border-gray-800 hover:bg-gray-900/50 transition-colors">
                              <TableCell className="font-semibold text-white py-5 pl-6">{getCampaignName(campaign)}</TableCell>
                              <TableCell className="py-5">
                                <div className="flex flex-wrap gap-1">
                                  {cats.length > 0 ? cats.map((cat: any, i: number) => (
                                    <span key={i} className="px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs font-medium">
                                      {cat.name || cat.category?.name || cat}
                                    </span>
                                  )) : <span className="text-gray-500 text-xs">—</span>}
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-gray-400 py-5">
                                {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : '-'} - {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : '-'}
                              </TableCell>
                              <TableCell className="text-white font-medium py-5">
                                {campaign.budget_min && campaign.budget_max
                                  ? `$${campaign.budget_min} - $${campaign.budget_max}`
                                  : `$${(campaign.budget || 0).toLocaleString()}`}
                              </TableCell>
                              {/*<TableCell className="py-5">
                                <Badge variant="outline" className={getStatusBadge(status)}>
                                  <span className="flex items-center gap-1.5">{getStatusIcon(status)}{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                                </Badge> 
                              </TableCell>*/}
                              <TableCell className="text-gray-300 text-sm py-5">
                                {campaign.number_of_influencers || 1} Influencer(s)
                              </TableCell>
                              <TableCell className="py-5 pr-6">
                                <div className="relative" ref={openActionMenu === campaign.id ? actionMenuRef : null}>
                                  <button onClick={() => setOpenActionMenu(openActionMenu === campaign.id ? null : campaign.id)}
                                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                                    <MoreVertical className="w-5 h-5 text-gray-400" />
                                  </button>
                                  {openActionMenu === campaign.id && (
                                    <div className="absolute right-0 top-10 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50 py-1">
                                      <button onClick={() => handleViewCampaign(campaign)}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-800 text-sm">
                                        <Eye className="w-4 h-4 text-gray-400" /> View Details
                                      </button>
                                      <button onClick={() => handleOpenEdit(campaign)}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-800 text-sm">
                                        <Edit2 className="w-4 h-4 text-gray-400" /> Edit Campaign
                                      </button>
                                      <div className="border-t border-gray-700 my-1" />
                                      <button onClick={() => handleDeleteCampaign(campaign.id)}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 text-sm">
                                        <Trash2 className="w-4 h-4" /> Delete Campaign
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── CREATE CAMPAIGN TAB ── */}
          {activeTab === 'create-campaign' && (
            <div>
              <div className="mb-6 md:mb-8">
                <button onClick={() => setActiveTab('manage-campaign')} className="flex items-center gap-2 text-gray-500 hover:text-black mb-4 text-sm">
                  ← Back to Campaigns
                </button>
                <h1 className="text-2xl md:text-4xl font-bold text-black mb-2">Create New Campaign</h1>
                <p className="text-sm md:text-base text-gray-600">Fill out the details to launch your campaign</p>
              </div>
              <form onSubmit={handleCreateCampaign} className="w-full">
                <div className="bg-black rounded-xl p-4 md:p-8 border border-gray-800 space-y-6">

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Name</label>
                    <Input value={campaignForm.title} onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                      placeholder="Enter campaign name" className="bg-gray-900 border-gray-700 text-white" required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <Textarea value={campaignForm.description} onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                      placeholder="Describe your campaign objectives" className="bg-gray-900 border-gray-700 text-white min-h-[120px]" required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
                    <select value={campaignForm.platform}
                      onChange={(e) => setCampaignForm({ ...campaignForm, platform: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-primary">
                      <option value="">Select Platform</option>
                      {apiPlatforms.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Categories</label>
                    <div className="flex flex-wrap gap-2">
                      {apiCategories.map((cat) => (
                        <button key={cat.id} type="button" onClick={() => toggleCampaignCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                            campaignForm.category_ids.includes(cat.id)
                              ? 'bg-primary text-black border-primary'
                              : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500'
                          }`}>
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Budget Range ($)</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Min Budget</label>
                        <Input value={campaignForm.budget_min} onChange={(e) => setCampaignForm({ ...campaignForm, budget_min: e.target.value })}
                          placeholder="0" type="number" className="bg-gray-900 border-gray-700 text-white" required />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Max Budget</label>
                        <Input value={campaignForm.budget_max} onChange={(e) => setCampaignForm({ ...campaignForm, budget_max: e.target.value })}
                          placeholder="0" type="number" className="bg-gray-900 border-gray-700 text-white" required />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Number of Influencers</label>
                    <select value={campaignForm.number_of_influencers}
                      onChange={(e) => setCampaignForm({ ...campaignForm, number_of_influencers: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white">
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <option key={n} value={n}>{n} Influencer{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                      <Input value={campaignForm.start_date} onChange={(e) => setCampaignForm({ ...campaignForm, start_date: e.target.value })}
                        type="date" className="bg-gray-900 border-gray-700 text-white" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                      <Input value={campaignForm.end_date} onChange={(e) => setCampaignForm({ ...campaignForm, end_date: e.target.value })}
                        type="date" className="bg-gray-900 border-gray-700 text-white" required />
                    </div>
                  </div>

                  {/* No status field - always pending on create */}

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button type="submit" disabled={campaignLoading} className="flex-1 bg-primary hover:bg-secondary text-black font-medium">
                      {campaignLoading ? 'Creating...' : 'Create Campaign'}
                    </Button>
                    <Button type="button" onClick={() => setActiveTab('manage-campaign')} className="flex-1 bg-white hover:bg-gray-100 text-black font-medium">
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

              {/* Details Tab */}
              {profileTab === 'details' && (
                <div className="max-w-2xl space-y-4 md:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <Input value={brandData.company_name} onChange={(e) => setBrandData({ ...brandData, company_name: e.target.value })} />
                  </div>

                  {/* ✅ Industry dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <div className="relative">
                      <select
                        value={brandData.industry}
                        onChange={(e) => setBrandData({ ...brandData, industry: e.target.value })}
                        className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary pr-10">
                        <option value="">Select Industry</option>
                        {INDUSTRIES.map((ind) => (
                          <option key={ind} value={ind}>{ind}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                    <div className="relative">
                      <select
                        value={brandData.company_size}
                        onChange={(e) => setBrandData({ ...brandData, company_size: e.target.value })}
                        className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary pr-10">
                        <option value="">Select Company Size</option>
                        {COMPANY_SIZES.map((size) => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio / Description</label>
                    <Textarea value={brandData.bio} onChange={(e) => setBrandData({ ...brandData, bio: e.target.value })}
                      className="min-h-[120px]" placeholder="What do you sell? What is your mission?" />
                  </div>
                  <div className="pt-4">
                    <button onClick={handleSaveProfileDetails} disabled={profileSaving}
                      className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50">
                      {profileSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {profileTab === 'account' && (
                <div className="max-w-2xl space-y-4 md:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-500 text-sm select-none">
                      {userData.name}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Name editing is not included in the current account details API.</p>
                  </div>

                  {/* ✅ Email non-editable */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-gray-400 text-xs font-normal">(cannot be changed)</span>
                    </label>
                    <div className="border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-500 text-sm select-none">
                      {userData.email}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <Input value={brandData.phone} onChange={(e) => setBrandData({ ...brandData, phone: e.target.value })} type="tel" />
                  </div>

                  {/* ✅ Country dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <div className="relative">
                      <select
                        value={brandData.country}
                        onChange={(e) => setBrandData({ ...brandData, country: e.target.value, city: '' })}
                        className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary pr-10">
                        <option value="">Select Country</option>
                        {ALL_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* ✅ City dropdown dependent on country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <div className="relative">
                      <select
                        value={brandData.city}
                        onChange={(e) => setBrandData({ ...brandData, city: e.target.value })}
                        disabled={!brandData.country}
                        className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary pr-10 disabled:bg-gray-100 disabled:text-gray-400">
                        <option value="">{brandData.country ? 'Select City' : 'Select country first'}</option>
                        {availableCities.map((city) => <option key={city} value={city}>{city}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button onClick={handleSaveAccountDetails} disabled={profileSaving}
                      className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50">
                      {profileSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}

              {/* Social Media Tab */}
              {profileTab === 'social-media' && (
                <div className="max-w-2xl space-y-3 md:space-y-4">
                  {[
                    { key: 'website', icon: LinkIcon, placeholder: 'Add Website URL' },
                    { key: 'instagram', icon: Instagram, placeholder: 'Add Instagram URL' },
                    { key: 'youtube', icon: Youtube, placeholder: 'Add YouTube URL' },
                    
                    { key: 'tiktok', icon: Music2, placeholder: 'Add TikTok URL' },
                  ].map((item) => (
                    <div key={item.key} className="border border-gray-200 rounded-lg p-3 md:p-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        <Input value={socialMedia[item.key as keyof typeof socialMedia]}
                          onChange={(e) => setSocialMedia({ ...socialMedia, [item.key]: e.target.value })}
                          placeholder={item.placeholder} className="border-0 focus-visible:ring-0" />
                      </div>
                    </div>
                  ))}
                  <div className="pt-4">
                    <button onClick={handleSaveSocialProfile} disabled={profileSaving}
                      className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50">
                      {profileSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}

              {/* ✅ Images Tab with working upload */}
              {profileTab === 'images' && (
                <div className="max-w-2xl space-y-6 md:space-y-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Profile Photo</h3>
                    <div className="flex items-center gap-6">
                      {/* Preview */}
                      <div className="relative">
                        {profileImagePreview || userData.profile_pic ? (
                          <img
                            src={profileImagePreview || userData.profile_pic}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-black text-3xl font-bold border-4 border-gray-200">
                            {userData.name?.[0]?.toUpperCase() || 'B'}
                          </div>
                        )}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-0 right-0 w-8 h-8 bg-black rounded-full flex items-center justify-center border-2 border-white hover:bg-gray-800 transition-colors">
                          <Camera className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      <div>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 bg-white border-2 border-gray-300 hover:border-primary text-gray-700 hover:text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          <Upload className="w-4 h-4" />
                          {profileImageFile ? 'Change Photo' : 'Upload Photo'}
                        </button>
                        <p className="text-xs text-gray-400 mt-2">JPG, PNG. Max 5MB.</p>
                        {profileImageFile && (
                          <p className="text-xs text-green-600 mt-1">✓ {profileImageFile.name} selected</p>
                        )}
                      </div>
                    </div>
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => handleImageSelect(e, 'profile')}
                      className="hidden"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Cover Photo</h3>
                    <div
                      onClick={() => coverImageInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 md:p-12 bg-gray-50 hover:border-gray-400 cursor-pointer transition-colors"
                    >
                      <div className="flex flex-col items-center text-center">
                        {coverImagePreview ? (
                          <img
                            src={coverImagePreview}
                            alt="Cover preview"
                            className="w-full max-w-md h-36 object-cover rounded-lg mb-4"
                          />
                        ) : (
                          <Upload className="w-10 h-10 text-gray-500 mb-4" />
                        )}
                        <div className="text-gray-400 mb-2">
                          {coverImageFile ? coverImageFile.name : 'Optional Cover Photo'}
                        </div>
                        <div className="text-gray-500 text-xs">Click to upload</div>
                      </div>
                    </div>
                    <input
                      ref={coverImageInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => handleImageSelect(e, 'cover')}
                      className="hidden"
                    />
                  </div>

                  <div className="pt-2">
                    <button onClick={handleSaveProfileImages} disabled={profileSaving}
                      className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50">
                      {profileSaving ? 'Saving...' : 'Save Changes'}
                    </button>
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
            {menuItems.map((item) => {
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
              <h2 className="text-xl font-bold text-black">{getCampaignName(viewCampaign)}</h2>
              <button onClick={() => setViewCampaign(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <Badge variant="outline" className={getStatusBadge(getCampaignStatus(viewCampaign))}>
                <span className="flex items-center gap-1.5">
                  {getStatusIcon(getCampaignStatus(viewCampaign))}
                  {getCampaignStatus(viewCampaign).charAt(0).toUpperCase() + getCampaignStatus(viewCampaign).slice(1)}
                </span>
              </Badge>
              {[
                { label: 'Description', value: viewCampaign.description },
                { label: 'Platform', value: viewCampaign.platform },
                { label: 'Budget', value: viewCampaign.budget_min && viewCampaign.budget_max ? `$${viewCampaign.budget_min} - $${viewCampaign.budget_max}` : `$${viewCampaign.budget || 0}` },
                { label: 'Duration', value: `${viewCampaign.start_date ? new Date(viewCampaign.start_date).toLocaleDateString() : '-'} - ${viewCampaign.end_date ? new Date(viewCampaign.end_date).toLocaleDateString() : '-'}` },
                { label: 'No. of Influencers', value: String(viewCampaign.number_of_influencers || 1) },
              ].map((item) => item.value && (
                <div key={item.label} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className="text-gray-800 font-medium text-sm">{item.value}</p>
                </div>
              ))}
              {/* ✅ Categories display */}
              {(viewCampaign.campaign_categories || viewCampaign.categories || []).length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">Categories</p>
                  <div className="flex flex-wrap gap-1">
                    {(viewCampaign.campaign_categories || viewCampaign.categories || []).map((cat: any, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs">
                        {cat.name || cat.category?.name || cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button onClick={() => { handleOpenEdit(viewCampaign); setViewCampaign(null); }}
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
                <Input value={editCampaign.title || ''} onChange={(e) => setEditCampaign({ ...editCampaign, title: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <Textarea value={editCampaign.description || ''} onChange={(e) => setEditCampaign({ ...editCampaign, description: e.target.value })} className="min-h-[100px]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Budget ($)</label>
                  <Input value={editCampaign.budget_min || ''} onChange={(e) => setEditCampaign({ ...editCampaign, budget_min: e.target.value })} type="number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Budget ($)</label>
                  <Input value={editCampaign.budget_max || ''} onChange={(e) => setEditCampaign({ ...editCampaign, budget_max: e.target.value })} type="number" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">No. of Influencers</label>
                <select value={editCampaign.number_of_influencers || '1'}
                  onChange={(e) => setEditCampaign({ ...editCampaign, number_of_influencers: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800">
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n}>{n} Influencer{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <Input value={editCampaign.start_date || ''} onChange={(e) => setEditCampaign({ ...editCampaign, start_date: e.target.value })} type="date" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <Input value={editCampaign.end_date || ''} onChange={(e) => setEditCampaign({ ...editCampaign, end_date: e.target.value })} type="date" />
                </div>
              </div>

              {/* ✅ Categories in edit modal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {apiCategories.map((cat) => (
                    <button key={cat.id} type="button"
                      onClick={() => {
                        const ids = editCampaign.category_ids || [];
                        setEditCampaign({
                          ...editCampaign,
                          category_ids: ids.includes(cat.id)
                            ? ids.filter((id: number) => id !== cat.id)
                            : [...ids, cat.id],
                        });
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                        (editCampaign.category_ids || []).includes(cat.id)
                          ? 'bg-primary text-black border-primary'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-500'
                      }`}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* ✅ No status field in edit modal */}

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={campaignLoading} className="flex-1 bg-primary hover:bg-secondary text-black font-semibold">
                  {campaignLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button type="button" onClick={() => setEditCampaign(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
