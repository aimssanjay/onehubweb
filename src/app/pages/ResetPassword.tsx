import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Lock, Eye, EyeOff, CheckCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get token and user type from URL
  const token = searchParams.get('token');
  const userType = searchParams.get('type') || 'brand';
  const isBrand = userType === 'brand';

  // Password validation
  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumber = /\d/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
    };
  };

  const passwordStrength = validatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!passwordStrength.isValid) {
      newErrors.password = 'Password does not meet all requirements';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    // Simulate API call to reset password
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        if (isBrand) {
          navigate('/brand/login');
        } else {
          navigate('/influencer/login');
        }
      }, 2000);
    }, 1500);
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

          {!isSuccess ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-black mb-3">Set New Password</h1>
                <p className="text-lg text-gray-600">
                  Create a strong password for your {isBrand ? 'brand' : 'influencer'} account.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-12 pr-12 h-12 ${errors.password ? 'border-red-500' : ''}`}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Password Requirements */}
                {password && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">Password must contain:</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 ${passwordStrength.minLength ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className={`text-sm ${passwordStrength.minLength ? 'text-green-600' : 'text-gray-600'}`}>
                          At least 8 characters
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 ${passwordStrength.hasUpperCase ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className={`text-sm ${passwordStrength.hasUpperCase ? 'text-green-600' : 'text-gray-600'}`}>
                          One uppercase letter (A-Z)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 ${passwordStrength.hasLowerCase ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className={`text-sm ${passwordStrength.hasLowerCase ? 'text-green-600' : 'text-gray-600'}`}>
                          One lowercase letter (a-z)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className={`text-sm ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-600'}`}>
                          One number (0-9)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 ${passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className={`text-sm ${passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-gray-600'}`}>
                          One special character (!@#$%^&*)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`pl-12 pr-12 h-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !password || !confirmPassword}
                  className="w-full h-12 bg-primary hover:bg-secondary text-black font-semibold text-lg"
                >
                  {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </Button>

                {/* Back to Login */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Back to login
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-4xl font-bold text-black mb-3">Password Reset Successful!</h1>
                <p className="text-lg text-gray-600 mb-8">
                  Your password has been successfully reset. You can now log in with your new password.
                </p>
                
                <div className="bg-green-50 rounded-lg p-4 mb-8">
                  <p className="text-sm text-green-800">
                    Redirecting you to login page...
                  </p>
                </div>

                <Button
                  onClick={handleBackToLogin}
                  className="w-full h-12 bg-primary hover:bg-secondary text-black font-semibold"
                >
                  Go to Login
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
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Secure Password Reset
          </h2>
          <p className="text-white/90 text-lg mb-6">
            We use industry-standard encryption to keep your account secure. Your new password will be encrypted and safely stored.
          </p>
          <div className="space-y-3 text-left bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold">Strong Encryption</p>
                <p className="text-white/80 text-sm">Military-grade security</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold">Secure Token</p>
                <p className="text-white/80 text-sm">One-time use reset link</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold">Time Limited</p>
                <p className="text-white/80 text-sm">Expires after 15 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}