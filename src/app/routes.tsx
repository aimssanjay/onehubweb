import { Navigate, createBrowserRouter } from 'react-router';
import { InfluencerSignup } from './pages/InfluencerSignup';
import InfluencerLogin from './pages/InfluencerLogin';
import InfluencerDashboardNew from './pages/InfluencerDashboard';

export const router = createBrowserRouter([
  // Only the influencer login/signup/dashboard flow is exposed for now.
  { path: '/', element: <InfluencerLogin /> },
  { path: 'influencer/login', element: <InfluencerLogin /> },
  { path: 'influencer-signup', element: <InfluencerSignup /> },
  { path: 'influencer/dashboard', element: <InfluencerDashboardNew /> },

  // Everything else redirects back to the influencer login screen.
  { path: '*', element: <Navigate to="/" replace /> },
]);
