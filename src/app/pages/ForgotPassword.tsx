import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Mail, ArrowLeft, CheckCircle, RotateCw, Send, ShieldCheck, LockKeyhole, Users, Zap } from 'lucide-react';
import creatorWoman from '../../assets/auth/creator-woman.jpg';
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
    <div className="relative min-h-screen overflow-hidden bg-white lg:grid lg:grid-cols-[minmax(0,44%)_1fr]">

      {/* Left: form */}
      <div className="relative flex min-h-screen items-center bg-gradient-to-br from-white via-white to-violet-50 px-6 py-10 sm:px-10 lg:px-16">
        <div className="pointer-events-none absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-violet-100/60 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto w-full max-w-md lg:mx-0">
          {/* Logo */}
          <div className="mb-10">
            <p className="text-4xl font-extrabold leading-none tracking-tight text-gray-900">OneHub</p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.3em] text-gray-500">Influencer Marketing</p>
          </div>

          <button
            type="button"
            onClick={handleBackToLogin}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </button>

          {!isSubmitted ? (
            <>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
                Forgot Your
                <br />
                <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">Password?</span>
              </h1>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Enter the email address linked to your account and we'll send you a secure link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="reset-email" className="mb-1.5 block text-sm font-semibold text-gray-800">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="reset-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-xl border-gray-200 bg-white pl-12 text-gray-900 placeholder:text-gray-400 focus-visible:border-amber-400 focus-visible:ring-amber-200"
                      placeholder={isBrand ? 'you@company.com' : 'you@example.com'}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 w-full gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-amber-400 text-base font-semibold text-gray-900 shadow-lg shadow-amber-200/60 hover:from-amber-400 hover:to-amber-500"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                  <Send className="h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6 flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                  <ShieldCheck className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Your security matters</p>
                  <p className="text-sm text-gray-500">The reset link will expire after 15 minutes.</p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Success state */}
              <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
                <CheckCircle className="h-7 w-7 text-green-600" />
              </span>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900">
                Check Your{' '}
                <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">Email</span>
              </h1>
              <p className="mt-3 text-base text-gray-500">
                We've sent a password reset link to <strong className="text-gray-900">{email}</strong>
              </p>

              <div className="mt-6 rounded-xl border border-violet-100 bg-violet-50/50 p-5">
                <p className="mb-3 text-sm font-semibold text-gray-900">What to do next:</p>
                <ol className="space-y-2 text-sm text-gray-600">
                  {[
                    'Open the email from OneHub in your inbox',
                    'Click the reset link within 15 minutes, before it expires',
                    'Set a new password and sign in',
                  ].map((stepText, index) => (
                    <li key={stepText} className="flex gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[11px] font-bold text-white">
                        {index + 1}
                      </span>
                      <span>{stepText}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <p className="mt-6 mb-3 text-sm text-gray-500">
                Didn't get the email? Check your spam or junk folder, or send it again.
              </p>

              <Button
                onClick={sendResetLink}
                disabled={isLoading}
                className="mb-3 h-12 w-full gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-amber-400 font-semibold text-gray-900 shadow-lg shadow-amber-200/60 hover:from-amber-400 hover:to-amber-500"
              >
                <RotateCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Sending...' : 'Send It Again'}
              </Button>

              <Button
                onClick={handleBackToLogin}
                variant="outline"
                className="h-12 w-full rounded-xl border border-gray-300 bg-white font-semibold text-gray-800 hover:bg-gray-50"
              >
                Back to Sign In
              </Button>

              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-4 block w-full text-center text-sm text-gray-500 underline-offset-2 hover:text-gray-800 hover:underline"
              >
                Use a different email
              </button>
            </>
          )}
        </div>
      </div>

      {/* Right: illustration panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 lg:block" aria-hidden="true">
        {/* Soft lavender shapes and white cloud along the bottom */}
        <div className="absolute -left-32 top-1/4 h-[28rem] w-[28rem] rounded-full bg-white/50 blur-2xl" />
        <div className="absolute -right-24 bottom-24 h-80 w-80 rounded-full bg-violet-300/50 blur-3xl" />
        {/* Curved edge where the white side meets the gold panel */}
        <div className="absolute -left-44 -top-[10%] h-[120%] w-64 rounded-[50%] bg-white" />
        {/* Row of clouds along the bottom */}
        {[
          'bottom-[-6rem] left-[-4rem] h-56 w-80',
          'bottom-[-7rem] left-[22%] h-60 w-96',
          'bottom-[-6rem] left-[52%] h-52 w-80',
          'bottom-[-7rem] right-[-5rem] h-64 w-96',
        ].map((position) => (
          <div key={position} className={`absolute ${position} rounded-full bg-gradient-to-b from-white to-violet-50 shadow-[0_-10px_30px_rgba(167,139,250,0.18)]`} />
        ))}

        {/* Photo */}
        <div className="absolute right-[12%] top-[14%] h-[58%] w-[34%] overflow-hidden rounded-[2.5rem] border-[6px] border-white/80 shadow-2xl shadow-amber-500/30">
          <img src={creatorWoman} alt="" className="h-full w-full object-cover object-top" />
        </div>

        {/* "Reset securely" card */}
        <div className="absolute left-[8%] top-[22%] w-[38%] max-w-xs -rotate-6 rounded-3xl bg-white p-6 text-center shadow-2xl shadow-amber-600/20">
          <div className="relative mx-auto mb-5 flex h-28 w-36 items-end justify-center">
            <span className="absolute bottom-0 h-20 w-36 rounded-xl bg-gradient-to-b from-amber-300 to-amber-400" />
            <span className="absolute bottom-6 h-20 w-28 rounded-lg bg-gray-50 shadow" />
            <span className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 shadow-lg">
              <LockKeyhole className="h-7 w-7 text-amber-300" />
            </span>
          </div>
          <p className="text-lg font-extrabold leading-tight text-gray-900">Reset Your Password Securely</p>
          <p className="mt-2 text-xs leading-relaxed text-gray-500">
            {isSubmitted
              ? 'Your reset link is on its way. For your security, it expires 15 minutes after it was sent.'
              : "We'll email you a secure link to reset your password. For your security, the link expires after 15 minutes."}
          </p>
        </div>

        {/* Badges */}
        <div className="absolute right-[4%] top-[6%] flex rotate-6 items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-extrabold text-gray-900">100% Secure</p>
            <p className="text-xs text-gray-500">Your data is safe</p>
          </div>
        </div>

        <div className="absolute right-[3%] top-[44%] flex -rotate-6 items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
            <Users className="h-5 w-5" />
          </span>
          <p className="text-sm font-extrabold leading-tight text-gray-900">
            Trusted by
            <br />
            10K+ Creators
          </p>
        </div>

        {/* Paper plane with dashed trail, and padlock */}
        <svg viewBox="0 0 200 70" className="absolute left-[24%] top-[8%] h-14 w-48 text-violet-500" aria-hidden="true">
          <path d="M4 64 Q50 4 100 30 T196 8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="7 7" strokeLinecap="round" />
        </svg>
        <Send className="absolute left-[38%] top-[4%] h-12 w-12 -rotate-12 fill-violet-400 text-violet-600" />
        <span className="absolute bottom-[22%] right-[6%] flex h-24 w-20 rotate-12 items-end justify-center">
          <span className="absolute top-0 h-12 w-12 rounded-t-full border-[7px] border-b-0 border-gray-400" />
          <span className="relative flex h-16 w-20 items-center justify-center rounded-xl bg-gradient-to-b from-amber-300 to-amber-500 shadow-xl">
            <span className="h-5 w-3 rounded-full bg-amber-800/70" />
          </span>
        </span>

        {/* Benefits row */}
        <div className="absolute bottom-8 left-0 right-0 grid grid-cols-3 gap-4 px-10 text-center">
          {[
            { icon: Zap, title: 'Quick & Easy', text: 'Reset in seconds', color: 'bg-violet-100 text-violet-600' },
            { icon: ShieldCheck, title: 'Secure Process', text: 'Your data is protected', color: 'bg-amber-100 text-amber-500' },
            { icon: Mail, title: 'Get Back Faster', text: 'Access your account quickly', color: 'bg-pink-100 text-pink-500' },
          ].map(({ icon: BenefitIcon, title, text, color }) => (
            <div key={title}>
              <span className={`mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
                <BenefitIcon className="h-5 w-5" />
              </span>
              <p className="text-sm font-bold text-gray-900">{title}</p>
              <p className="text-xs text-gray-500">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
