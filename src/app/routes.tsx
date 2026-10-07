import { Navigate, createBrowserRouter } from 'react-router';
import { InfluencerSignup } from './pages/InfluencerSignup';
import InfluencerLogin from './pages/InfluencerLogin';
import InfluencerDashboardNew from './pages/InfluencerDashboard';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { InfluencerNDA } from './pages/InfluencerNDA';

export const router = createBrowserRouter([
  // Only the influencer login/signup/dashboard flow is exposed for now.
  { path: '/', element: <InfluencerLogin /> },
  { path: 'influencer/login', element: <InfluencerLogin /> },
  { path: 'influencer-signup', element: <InfluencerSignup /> },
  { path: 'influencer/dashboard', element: <InfluencerDashboardNew /> },
  // Agreement linked from the final signup step
  { path: 'influencer-nda', element: <InfluencerNDA /> },

  // Password recovery, linked from the login screen and the reset email
  { path: 'forgot-password', element: <ForgotPassword /> },
  { path: 'reset-password', element: <ResetPassword /> },
  { path: 'reset-password/:token', element: <ResetPassword /> },

  // Everything else redirects back to the influencer login screen.
  { path: '*', element: <Navigate to="/" replace /> },
]);
