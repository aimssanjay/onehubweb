import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Building2, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { API_BASE_URL } from '../../services/api';

export function BrandLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Brand Login Response:', data);

      if (response.ok && data.success) {
        const token =
          data.token ||
          data.access_token ||
          data.data?.token ||
          data.data?.access_token;

        if (!token) {
          alert('Login successful but token missing. Check console.');
          return;
        }

        // ✅ Save with brand specific keys
        localStorage.setItem('brand_token', token);
        localStorage.setItem('brand_user', JSON.stringify(data.data));

        navigate('/brand-dashboard');
      } else {
        alert(data.message || 'Invalid email or password');
      }

    } catch (error) {
      console.error('Login Error:', error);
      alert('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">OneHub</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-3">Welcome Back</h1>
            <p className="text-lg text-gray-600">Sign in to your brand account to manage campaigns</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password?type=brand" className="text-sm text-primary hover:text-secondary font-medium">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-secondary text-black font-semibold text-lg"
            >
              {isLoading ? 'Signing in...' : (<>Sign In <ArrowRight className="w-5 h-5 ml-2" /></>)}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <div className="text-center space-y-3">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:text-secondary font-semibold">Sign up as a Brand</Link>
            </p>
            <p className="text-gray-600">
              Are you a creator?{' '}
              <Link to="/influencer/login" className="text-primary hover:text-secondary font-semibold">Creator Login</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden lg:flex lg:flex-1 bg-black text-white p-12 flex-col justify-center">
        <div className="max-w-lg">
          <Building2 className="w-16 h-16 text-primary mb-8" />
          <h2 className="text-4xl font-bold mb-6">Grow Your Brand with Top Influencers</h2>
          <p className="text-xl text-gray-300 mb-12">
            Access thousands of verified creators, manage campaigns, and track performance all in one place.
          </p>
          <div className="space-y-6">
            {[
              { icon: Sparkles, title: 'Verified Creators', desc: 'Work with authenticated influencers with proven engagement rates' },
              { icon: Building2, title: 'Campaign Management', desc: 'Create, launch, and monitor campaigns with our intuitive dashboard' },
              { icon: ArrowRight, title: 'Real-Time Analytics', desc: 'Track campaign performance and ROI with detailed analytics' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}