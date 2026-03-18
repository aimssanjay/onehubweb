import { createBrowserRouter } from 'react-router';
import { Homepage } from './pages/Homepage';
import { InfluencerListing } from './pages/InfluencerListing';
import { InfluencerProfile } from './pages/InfluencerProfile';
import { Login } from './pages/Login';
import { BrandSignup } from './pages/BrandSignup';
import { InfluencerSignup } from './pages/InfluencerSignup';
import { BrandDashboard } from './pages/BrandDashboard';
import { InfluencerDashboard } from './pages/InfluencerDashboard';
import { Checkout } from './pages/Checkout';
import { Pricing } from './pages/Pricing';
import { AdminPanel } from './pages/AdminPanel';
import Registration from './pages/Registration';
import { HowItWorks } from './pages/HowItWorks';
import SignupInfluencer from './pages/SignupInfluencer';
import InfluencerLogin from './pages/InfluencerLogin';
import InfluencerDashboardNew from './pages/InfluencerDashboard';
import { BrandLogin } from './pages/BrandLogin';
import { BrandPublicProfile } from './pages/BrandPublicProfile';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import RootLayout from './RootLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: 'browse',
        element: <InfluencerListing />,
      },
      {
        path: 'profile/:id',
        element: <InfluencerProfile />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <BrandSignup />,
      },
      {
        path: 'signup-brand',
        element: <BrandSignup />,
      },
      {
        path: 'signup-influencer',
        element: <SignupInfluencer />,
      },
      {
        path: 'influencer/login',
        element: <InfluencerLogin />,
      },
      {
        path: 'influencer/dashboard',
        element: <InfluencerDashboardNew />,
      },
      {
        path: 'dashboard-influencer',
        element: <InfluencerDashboardNew />,
      },
      {
        path: 'dashboard-brand',
        element: <BrandDashboard />,
      },
      {
        path: 'checkout',
        element: <Checkout />,
      },
      {
        path: 'pricing',
        element: <Pricing />,
      },
      {
        path: 'admin',
        element: <AdminPanel />,
      },
      {
        path: 'registration',
        element: <Registration />,
      },
      {
        path: 'how-it-works',
        element: <HowItWorks />,
      },
      {
        path: 'campaigns',
        element: <Homepage />,
      },
      {
        path: 'brand/login',
        element: <BrandLogin />,
      },
      {
        path: 'brand-public-profile',
        element: <BrandPublicProfile />,
      },
      {
        path: 'influencer-signup',
        element: <SignupInfluencer />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
    ],
  },
]);