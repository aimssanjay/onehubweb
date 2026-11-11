import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export type TopNoticeData = { id: number; message: string; title?: string; variant?: 'error' | 'success' };

interface TopNoticeProps {
  notice: TopNoticeData | null;
  onClose: () => void;
  duration?: number;
}

// Notification that slides down from the top centre, closes itself after `duration` ms
// (paused while hovered) and slides back up when dismissed.
export function TopNotice({ notice, onClose, duration = 5000 }: TopNoticeProps) {
  const [shown, setShown] = useState<TopNoticeData | null>(notice);
  const [leaving, setLeaving] = useState(false);
  const closeTimer = useRef<number>();

  useEffect(() => {
    window.clearTimeout(closeTimer.current);
    if (notice) {
      setShown(notice);
      setLeaving(false);
    } else if (shown) {
      setLeaving(true);
      closeTimer.current = window.setTimeout(() => setShown(null), 260);
    }
    return () => window.clearTimeout(closeTimer.current);
  }, [notice]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!shown) return null;
  const success = shown.variant === 'success';
  const Icon = success ? CheckCircle2 : AlertCircle;

  return createPortal(
    <>
      <style>{`
        @keyframes top-notice-in { 0% { transform: translate(-50%, -140%); opacity: 0; } 60% { transform: translate(-50%, 6px); opacity: 1; } 100% { transform: translate(-50%, 0); opacity: 1; } }
        @keyframes top-notice-out { from { transform: translate(-50%, 0); opacity: 1; } to { transform: translate(-50%, -140%); opacity: 0; } }
        @keyframes top-notice-progress { from { transform: scaleX(1); } to { transform: scaleX(0); } }
        @keyframes top-notice-icon { 0%, 100% { transform: rotate(0); } 20% { transform: rotate(-14deg); } 40% { transform: rotate(12deg); } 60% { transform: rotate(-8deg); } 80% { transform: rotate(4deg); } }
        .top-notice { animation: top-notice-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        .top-notice.is-leaving { animation: top-notice-out 260ms ease-in both; }
        .top-notice-icon { animation: top-notice-icon 600ms ease-in-out 280ms both; }
        .top-notice-bar { animation: top-notice-progress linear forwards; transform-origin: left; }
        .top-notice:hover .top-notice-bar { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .top-notice, .top-notice.is-leaving, .top-notice-icon { animation-duration: 1ms; }
        }
      `}</style>
      <div
        key={shown.id}
        role={success ? 'status' : 'alert'}
        aria-live={success ? 'polite' : 'assertive'}
        className={`top-notice fixed left-1/2 top-4 z-[120] w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-2xl border bg-white shadow-2xl ${
          success ? 'border-emerald-100 shadow-emerald-200/40' : 'border-red-100 shadow-red-200/50'
        } ${leaving ? 'is-leaving' : ''}`}
      >
        <div className="flex items-start gap-3 px-4 py-3.5">
          <span
            className={`top-notice-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
              success ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'
            }`}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-sm font-semibold text-gray-900">{shown.title || (success ? 'Success' : 'Sign in failed')}</p>
            <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{shown.message}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss"
            className="shrink-0 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="h-1 w-full bg-gray-100">
          <div
            key={`bar-${shown.id}`}
            className={`top-notice-bar h-full ${success ? 'bg-emerald-400' : 'bg-gradient-to-r from-red-500 to-rose-400'}`}
            style={{ animationDuration: `${duration}ms` }}
            onAnimationEnd={onClose}
          />
        </div>
      </div>
    </>,
    document.body
  );
}
