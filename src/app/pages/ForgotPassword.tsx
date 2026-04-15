import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Mail, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { API_BASE_URL } from '../../services/api';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Check if this is for brand or influencer
  const userType = searchParams.get('type') || 'brand';
  const isBrand = userType === 'brand';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          type: userType,
        }),
      });

      const result = await response.json();
      if (result.success || response.ok) {
        setIsSubmitted(true);
      } else {
        toast.error(result.message || 'Failed to send reset link');
      }
    } catch {
      toast.error('Server error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    if (isBrand) {
      navigate('/brand/login');
    } else {
      navigate('/influencer/login');
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">OneHub</span>
          </div>

          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <button
                  onClick={handleBackToLogin}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Back to login</span>
                </button>
                <h1 className="text-4xl font-bold text-black mb-3">Forgot Password?</h1>
                <p className="text-lg text-gray-600">
                  No worries! Enter your email and we'll send you reset instructions.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-12"
                      placeholder={isBrand ? 'you@company.com' : 'you@example.com'}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-primary hover:bg-secondary text-black font-semibold text-lg"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-4xl font-bold text-black mb-3">Check Your Email</h1>
                <p className="text-lg text-gray-600 mb-8">
                  We've sent password reset instructions to <strong>{email}</strong>
                </p>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Next steps:</strong>
                  </p>
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li className="flex gap-2">
                      <span className="font-semibold">1.</span>
                      <span>Check your inbox for an email from OneHub</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">2.</span>
                      <span>Click the reset password link in the email</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">3.</span>
                      <span>Create a new password for your account</span>
                    </li>
                  </ol>
                </div>

                {/* Test Button - For Development */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-xs text-yellow-800 mb-3 font-medium">
                    🧪 DEMO MODE - Click below to test the reset password flow
                  </p>
                  <Button
                    onClick={() => navigate(`/reset-password?token=demo-token-${Date.now()}&type=${userType}`)}
                    className="w-full h-10 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold"
                  >
                    Simulate Email Link (Test)
                  </Button>
                </div>

                <p className="text-sm text-gray-600 mb-6">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-primary hover:text-secondary font-semibold"
                  >
                    try again
                  </button>
                </p>

                <Button
                  onClick={handleBackToLogin}
                  variant="outline"
                  className="w-full h-12 border-2"
                >
                  Back to Login
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Side - Image/Info */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-secondary items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Reset Your Password Securely
          </h2>
          <p className="text-white/90 text-lg">
            We'll send you a secure link to reset your password. The link will expire in 15 minutes for your security.
          </p>
        </div>
      </div>
    </div>
  );
}
