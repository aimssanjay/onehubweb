import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Mail, ArrowLeft, CheckCircle, Sparkles, RotateCw } from 'lucide-react';
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
  const userType = searchParams.get('type') || 'influencer';
  const isBrand = userType === 'brand';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendResetLink();
  };

  // Used by the form and by "Send It Again" on the confirmation screen
  const sendResetLink = async () => {
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
        if (isSubmitted) toast.success('A new reset link has been sent');
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
                  <span className="text-sm font-medium">Back to sign in</span>
                </button>
                <h1 className="text-4xl font-bold text-black mb-3">Forgot Password?</h1>
                <p className="text-lg text-gray-600">
                  Enter the email address linked to your account and we'll send you a link to reset your password.
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
                  We've sent a password reset link to <strong>{email}</strong>
                </p>

                <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>What to do next:</strong>
                  </p>
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li className="flex gap-2">
                      <span className="font-semibold">1.</span>
                      <span>Open the email from OneHub in your inbox</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">2.</span>
                      <span>Click the reset link within 15 minutes, before it expires</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">3.</span>
                      <span>Set a new password and sign in</span>
                    </li>
                  </ol>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Didn't get the email? Check your spam or junk folder, or send it again.
                </p>

                <Button
                  onClick={sendResetLink}
                  disabled={isLoading}
                  className="w-full h-12 mb-3 gap-2 bg-primary hover:bg-secondary text-white font-semibold"
                >
                  <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Sending...' : 'Send It Again'}
                </Button>

                <Button
                  onClick={handleBackToLogin}
                  variant="outline"
                  className="w-full h-12 border-2"
                >
                  Back to Sign In
                </Button>

                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 text-sm text-gray-500 hover:text-gray-800 underline-offset-2 hover:underline"
                >
                  Use a different email
                </button>
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
            {isSubmitted ? 'Check Your Inbox' : 'Reset Your Password Securely'}
          </h2>
          <p className="text-white/90 text-lg">
            {isSubmitted
              ? 'Your reset link is on its way. For your security, it expires 15 minutes after it was sent.'
              : "We'll email you a secure link to reset your password. For your security, the link expires after 15 minutes."}
          </p>
        </div>
      </div>
    </div>
  );
}
