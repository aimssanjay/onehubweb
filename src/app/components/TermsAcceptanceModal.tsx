import { useEffect, useRef, useState } from 'react';
import { Check, ExternalLink, FileText, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE_URL } from '../../services/api';

interface TermsAcceptanceModalProps {
  onAccepted: () => void;
  onLogout: () => void;
}

// Blocking popup over the dashboard until the influencer accepts the Terms & Conditions.
// Acceptance is saved through POST /influencers/accept-terms.
export function TermsAcceptanceModal({ onAccepted, onLogout }: TermsAcceptanceModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const checkboxRef = useRef<HTMLInputElement>(null);

  // Keep the dashboard from scrolling behind the popup
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    checkboxRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const handleAccept = async () => {
    if (!agreed || saving) return;
    const token = localStorage.getItem('influencer_token');
    if (!token) {
      onLogout();
      return;
    }
    try {
      setSaving(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/influencers/accept-terms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const result = await response.json().catch(() => ({}));
      if (!(result.success || response.ok)) {
        setError(result.message || 'Could not save your acceptance. Please try again.');
        return;
      }
      toast.success('Thanks! Terms & Conditions accepted.');
      onAccepted();
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-modal-title"
      aria-describedby="terms-modal-description"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl shadow-black/50">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />

        <div className="relative p-6 sm:p-7">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h2 id="terms-modal-title" className="text-xl font-bold text-white">Terms &amp; Conditions</h2>
          <p id="terms-modal-description" className="mt-1.5 text-sm leading-relaxed text-gray-400">
            Before you start using your OneHub dashboard, please review and accept our Terms &amp; Conditions.
          </p>

          <a
            href="/influencer-nda"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-800/60 p-3.5 transition-colors hover:border-primary/50"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-900">
              <FileText className="h-4 w-4 text-primary" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-white">Influencer Terms &amp; Conditions</span>
              <span className="block text-xs text-gray-400">Opens in a new tab</span>
            </span>
            <ExternalLink className="h-4 w-4 shrink-0 text-gray-500" />
          </a>

          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl p-1">
            <input
              ref={checkboxRef}
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                setError('');
              }}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary/60 ${
                agreed ? 'border-primary bg-primary' : 'border-gray-600 bg-gray-800'
              }`}
            >
              {agreed && <Check className="h-3.5 w-3.5 text-black" strokeWidth={3} />}
            </span>
            <span className="text-sm leading-relaxed text-gray-300">
              I have read and accept the <span className="font-medium text-white">Terms &amp; Conditions</span>
            </span>
          </label>

          {error && (
            <p role="alert" className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleAccept}
            disabled={!agreed || saving}
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? 'Saving...' : 'Accept & Continue'}
          </button>

          <p className="mt-4 text-center text-xs text-gray-500">
            Not ready?{' '}
            <button type="button" onClick={onLogout} className="font-medium text-gray-300 hover:text-white hover:underline">
              Log out
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
