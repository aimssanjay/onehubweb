import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Eye, EyeOff, Lock, User, ArrowRight, Gift, BarChart3, Heart, Instagram, Sparkles, Send } from 'lucide-react';
// Unsplash photos (free licence), saved locally
import creatorWoman from '../../assets/auth/creator-woman.jpg';
import creatorMan from '../../assets/auth/creator-man.jpg';

// Simplified Dubai skyline (Burj Khalifa in the middle) drawn behind the headline
function DubaiSkyline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 420" className={className} fill="currentColor" aria-hidden="true">
      <rect x="6" y="300" width="22" height="120" rx="2" />
      <path d="M32 420V240c0-10 8-18 16-20 8 2 16 10 16 20v180z" />
      <rect x="66" y="270" width="16" height="150" rx="2" />
      {/* Burj Khalifa: stepped spire */}
      <polygon points="99,0 101,0 102,60 105,60 106,130 110,130 112,210 117,210 119,290 125,290 127,420 73,420 75,290 81,290 83,210 88,210 90,130 94,130 95,60 98,60" />
      <rect x="132" y="250" width="20" height="170" rx="2" />
      <path d="M156 420V300l14-26 14 26v120z" />
      <rect x="186" y="330" width="14" height="90" rx="2" />
    </svg>
  );
}
import { clearInfluencerClientData } from '../utils/influencerStorage';
import { API_BASE_URL, API_ENDPOINTS } from '../../services/api';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;

const isEmail = (value: string) => EMAIL_REGEX.test(value.trim());
const isPhone = (value: string) => PHONE_REGEX.test(value.trim());
const normalizePhone = (value: string) => value.replace(/\D/g, '');
const phoneToPseudoEmail = (phone: string) => `${normalizePhone(phone)}@phone.onehub.local`;

export default function InfluencerLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
  });

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  const loginId = formData.loginId.trim();
  const password = formData.password.trim();
  const loginIsEmail = isEmail(loginId);
  const loginIsPhone = isPhone(loginId);

  if (!loginIsEmail && !loginIsPhone) {
    alert("Please enter a valid email or phone number");
    return;
  }

  try {
    const payload: Record<string, string> = { password };
    if (loginIsEmail) {
      payload.email = loginId;
    } else {
      // Backend login currently expects email/password.
      payload.email = phoneToPseudoEmail(loginId);
      payload.phone = loginId;
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Login Response:", data);

    if (response.ok && data.success) {
      const token =
        data.token ||
        data.access_token ||
        data.data?.token ||
        data.data?.access_token;

      if (!token) {
        alert("Login successful but token missing. Check console.");
        return;
      }

      // Always reset previous influencer-scoped client cache before setting the new session.
      clearInfluencerClientData();

      // ✅ Save with correct key names
      localStorage.setItem("influencer_token", token);
      localStorage.setItem("influencer_user", JSON.stringify(data.data));

      navigate("/influencer/dashboard");
      return;
    }

    alert(data?.message || "Invalid email/phone or password");

  } catch (error) {
    console.error("Login Error:", error);
    alert("Network issue or server error");
  }
};

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      {/* Background: soft colour glows, white clouds along the bottom, gold sparkle under the card */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 top-1/3 h-80 w-[30rem] rounded-full bg-violet-100/70 blur-3xl" />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-sky-100/80 blur-3xl" />
        <div className="absolute left-1/3 top-1/4 h-72 w-72 rounded-full bg-amber-50/80 blur-3xl" />

        {/* Puffy clouds: white tops shading into lavender so they read against the light background */}
        {[
          'bottom-[-7rem] -left-20 h-64 w-96',
          'bottom-[-8rem] left-[14%] h-56 w-80',
          'bottom-[-9rem] left-[38%] h-52 w-96',
          'bottom-[-8rem] right-[18%] h-60 w-80',
          'bottom-[-7rem] -right-20 h-72 w-[26rem]',
        ].map((position) => (
          <div
            key={position}
            className={`absolute ${position} rounded-full bg-gradient-to-b from-white to-violet-200/70 shadow-[0_-12px_40px_rgba(167,139,250,0.25)] blur-[2px]`}
          />
        ))}

        <Sparkles className="absolute bottom-14 left-1/2 hidden h-9 w-9 -translate-x-1/2 fill-amber-300 text-amber-300 lg:block" />
      </div>

      <div className="relative mx-auto grid grid-cols-1 min-h-screen max-w-[1400px] items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_minmax(0,520px)] lg:px-8 xl:grid-cols-[1fr_minmax(0,540px)_0.8fr] xl:gap-10">

        {/* Left: brand + message */}
        <aside className="relative hidden lg:block">
          <DubaiSkyline className="pointer-events-none absolute -right-20 top-4 h-[520px] w-auto text-violet-300/30 [mask-image:linear-gradient(to_bottom,black_45%,transparent_100%)]" />

          <div className="relative">
            <p className="text-4xl font-extrabold leading-none tracking-tight text-gray-900">OneHub</p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.3em] text-gray-500">Influencer Marketing</p>
          </div>

          <p className="relative mt-10 text-xs font-medium uppercase tracking-[0.3em] text-gray-500">
            Connect · Collaborate · Grow
          </p>
          <h2 className="relative mt-3 text-5xl font-extrabold leading-[1.05] tracking-tight text-gray-900 xl:text-6xl">
            Your Creator
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">Journey</span>
            <br />
            Starts Here
          </h2>
          {/* Hand-drawn style underline */}
          <svg viewBox="0 0 160 14" className="relative mt-2 ml-14 h-3.5 w-40 text-violet-400" aria-hidden="true">
            <path d="M2 10 Q80 0 158 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <p className="relative mt-6 max-w-md text-base leading-relaxed text-gray-600">
            Join OneHub and collaborate with top brands, get exciting opportunities and grow your creativity into real impact.
          </p>

          <ul className="relative mt-8 space-y-5">
            {[
              { icon: Gift, title: 'Brand Collaborations', text: 'Work with leading brands across industries.', color: 'bg-violet-100 text-violet-600' },
              { icon: BarChart3, title: 'Grow Your Influence', text: 'Reach new audiences and unlock opportunities.', color: 'bg-amber-100 text-amber-500' },
              { icon: Heart, title: 'Earn & Get Rewarded', text: 'Monetize your content and turn passion into success.', color: 'bg-pink-100 text-pink-500' },
            ].map(({ icon: BenefitIcon, title, text, color }) => (
              <li key={title} className="flex items-center gap-4">
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${color}`}>
                  <BenefitIcon className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-bold text-gray-900">{title}</p>
                  <p className="text-sm text-gray-500">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Centre: sign-in card */}
        <div className="mx-auto w-full max-w-[540px]">
          {/* Brand name on small screens, where the left panel is hidden */}
          <p className="mb-5 text-center text-2xl font-extrabold tracking-tight text-gray-900 lg:hidden">OneHub</p>

          <div className="rounded-3xl border border-violet-100 bg-white/95 p-6 shadow-xl shadow-violet-200/40 backdrop-blur sm:p-10">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Welcome Back</h1>
              <p className="mt-2 text-gray-500">Sign in to your influencer account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="login-id" className="mb-1.5 block text-sm font-medium text-gray-800">
                  Email Address or Phone Number
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="login-id"
                    type="text"
                    autoComplete="username"
                    placeholder="you@example.com or +971 50 123 4567"
                    value={formData.loginId}
                    onChange={(e) => setFormData({ ...formData, loginId: e.target.value })}
                    className="h-12 rounded-xl border-gray-200 bg-white pl-12 text-gray-900 placeholder:text-gray-400 focus-visible:border-violet-400 focus-visible:ring-violet-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-gray-800">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-12 rounded-xl border-gray-200 bg-white pl-12 pr-12 text-gray-900 placeholder:text-gray-400 focus-visible:border-violet-400 focus-visible:ring-violet-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <a href="/forgot-password?type=influencer" className="text-sm font-medium text-amber-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="h-12 w-full gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-base font-semibold text-white shadow-lg shadow-violet-300/50 hover:from-violet-700 hover:to-purple-600"
              >
                Sign In
                <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-3 pt-2">
                <span className="h-px flex-1 bg-gray-200" />
                <p className="text-center text-sm text-gray-500 sm:whitespace-nowrap">
                  Don't have an account?{' '}
                  <a href="/influencer-signup" className="font-semibold text-amber-600 hover:underline">
                    Sign up as influencer
                  </a>
                </p>
                <span className="h-px flex-1 bg-gray-200" />
              </div>
            </form>
          </div>
        </div>

        {/* Right: creator photo with floating highlights */}
        <aside className="relative hidden h-[680px] xl:block" aria-hidden="true">
          {/* Main photo */}
          <div className="absolute right-0 top-16 h-[360px] w-[250px] rotate-[8deg] overflow-hidden rounded-[2rem] border-[6px] border-white bg-violet-100 shadow-2xl shadow-violet-300/40">
            <img src={creatorWoman} alt="" className="h-full w-full object-cover object-top" />
          </div>

          {/* Second photo, overlapping below */}
          <div className="absolute bottom-6 left-6 h-[230px] w-[180px] rotate-[-8deg] overflow-hidden rounded-[1.75rem] border-[6px] border-white bg-violet-100 shadow-2xl shadow-violet-300/40">
            <img src={creatorMan} alt="" className="h-full w-full object-cover object-top" />
          </div>

          <span className="absolute left-8 top-14 flex h-14 w-14 -rotate-6 items-center justify-center rounded-2xl bg-white shadow-lg shadow-violet-200/60">
            <Instagram className="h-7 w-7 text-pink-500" />
          </span>

          <div className="absolute -right-4 top-[330px] flex -rotate-12 items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-lg shadow-violet-200/60">
            <Heart className="h-6 w-6 fill-pink-500 text-pink-500" />
            <p className="text-lg font-extrabold text-gray-900">12.8K</p>
          </div>

          <div className="absolute bottom-10 right-0 flex -rotate-6 items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg shadow-violet-200/60">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-500">
              <BarChart3 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-lg font-extrabold leading-none text-gray-900">10K+</p>
              <p className="text-xs text-gray-500">Creators</p>
            </div>
          </div>

          {/* Paper plane with dashed gold trail */}
          <svg viewBox="0 0 120 60" className="absolute right-6 top-2 h-12 w-24 text-amber-400" aria-hidden="true">
            <path d="M4 56 Q50 54 96 16" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" />
          </svg>
          <Send className="absolute -right-2 -top-2 h-10 w-10 -rotate-12 fill-violet-300 text-violet-500" />
          <Sparkles className="absolute left-1/2 top-8 h-8 w-8 fill-amber-300 text-amber-300" />
          <Sparkles className="absolute left-0 top-[330px] h-6 w-6 fill-amber-300 text-amber-300" />
        </aside>
      </div>
    </div>
  );
}
