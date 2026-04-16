import { Link, useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Logo } from './Logo';
import { useEffect, useState, useRef } from 'react';
import { clearInfluencerClientData } from '../utils/influencerStorage';

import { ChevronDown, LayoutDashboard, User, LogOut, Settings } from 'lucide-react';

export function Navbar() {
  const navigate = useNavigate();
  const [brandUser, setBrandUser] = useState<any>(null);
  const [influencerUser, setInfluencerUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const syncUsers = () => {
      const brandToken = localStorage.getItem('brand_token');
      const brandData = localStorage.getItem('brand_user');
      if (brandToken && brandData) {
        try { setBrandUser(JSON.parse(brandData)); } catch {}
      } else {
        setBrandUser(null);
      }

      const influencerToken = localStorage.getItem('influencer_token');
      const influencerData = localStorage.getItem('influencer_user');
      if (influencerToken && influencerData) {
        try { setInfluencerUser(JSON.parse(influencerData)); } catch {}
      } else {
        setInfluencerUser(null);
      }
    };

    syncUsers();
    window.addEventListener('storage', syncUsers);
    window.addEventListener('focus', syncUsers);
    window.addEventListener('auth-state-changed', syncUsers as EventListener);

    return () => {
      window.removeEventListener('storage', syncUsers);
      window.removeEventListener('focus', syncUsers);
      window.removeEventListener('auth-state-changed', syncUsers as EventListener);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const openDropdown = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setDropdownOpen(true);
  };

  const closeDropdownWithDelay = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setDropdownOpen(false);
      closeTimerRef.current = null;
    }, 180);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBrandLogout = () => {
    localStorage.removeItem('brand_token');
    localStorage.removeItem('brand_user');
    setBrandUser(null);
    setDropdownOpen(false);
    window.dispatchEvent(new Event('auth-state-changed'));
    navigate('/');
  };

  const handleInfluencerLogout = () => {
    clearInfluencerClientData();
    setInfluencerUser(null);
    setDropdownOpen(false);
    window.dispatchEvent(new Event('auth-state-changed'));
    navigate('/');
  };

  const loggedInUser = brandUser || influencerUser;
  const dashboardPath = brandUser ? '/brand-dashboard' : '/influencer/dashboard';

  return (
    <nav className="border-b border-border bg-white sticky top-0 z-50 backdrop-blur-sm shadow-sm">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo — always links to homepage */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Logo />
          </Link>

          {/* ✅ Nav Links — ALWAYS visible regardless of login state */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/browse" className="text-foreground hover:text-primary transition-colors">
              Browse Creators
            </Link>
            <Link to="/campaigns" className="text-foreground hover:text-primary transition-colors">
              Campaigns
            </Link>
            <Link to="/pricing" className="text-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link to="/how-it-works" className="text-foreground hover:text-primary transition-colors">
              How It Works
            </Link>

            {/* Show only when NOT logged in */}
            {!loggedInUser && (
              <>
                <Link to="/brand/login" className="text-foreground hover:text-primary transition-colors">
                  Join as Brand
                </Link>
                <Link to="/influencer-signup" className="text-foreground hover:text-primary transition-colors">
                  Join as Creator
                </Link>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {loggedInUser ? (
              // ✅ LOGGED IN — avatar + dropdown
              <div
                className="relative"
                ref={dropdownRef}
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdownWithDelay}
              >
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none cursor-pointer"
                >
                  {loggedInUser?.profile_pic ? (
                    <img
                      src={loggedInUser.profile_pic}
                      alt={loggedInUser?.name || 'User'}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-black font-bold text-sm">
                      {(loggedInUser?.name || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium text-gray-800 hidden sm:block">
                    {loggedInUser?.name || 'User'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 top-full w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2 overflow-hidden"
                    onMouseEnter={openDropdown}
                    onMouseLeave={closeDropdownWithDelay}
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900 text-sm">{loggedInUser?.name}</p>
                      <p className="text-gray-500 text-xs truncate">{loggedInUser?.email}</p>
                      <span className="text-xs text-primary font-medium">
                        {brandUser ? '🏢 Brand Account' : '⭐ Creator Account'}
                      </span>
                    </div>

                    {/* Dashboard */}
                    <Link to={dashboardPath} onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors text-sm">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>

                    {/* Profile */}
                    <Link
                      to={brandUser ? '/brand-public-profile' : '/influencer/dashboard?tab=profile'}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors text-sm">
                      <User className="w-4 h-4" />
                      View Profile
                    </Link>

                    {/* Settings */}
                    <Link to={brandUser ? '/brand-dashboard' : '/influencer/dashboard?tab=settings'} onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors text-sm">
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={brandUser ? handleBrandLogout : handleInfluencerLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors text-sm">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // ✅ NOT LOGGED IN — Post a Campaign button
              <Link to="/signup">
                <Button className="bg-primary hover:bg-secondary text-primary-foreground cursor-pointer">
                  Post a Campaign
                </Button>
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
