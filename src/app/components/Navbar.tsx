import { Link } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Logo } from './Logo';

export function Navbar() {
  return (
    <nav className="border-b border-border bg-white sticky top-0 z-50 backdrop-blur-sm shadow-sm">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center hover:opacity-80 transition-opacity cursor-pointer"
          >
            <Logo />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/browse"
              className="text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              Browse Creators
            </Link>
            <Link
              to="/campaigns"
              className="text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              Campaigns
            </Link>
            <Link
              to="/pricing"
              className="text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              Pricing
            </Link>
            <Link
              to="/how-it-works"
              className="text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              How It Works
            </Link>
            <Link
              to="/brand/login"
              className="text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              Join as Brand
            </Link>
            <Link
              to="/influencer-signup"
              className="text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              Join as Creator
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link to="/brand/login">
              <Button
                variant="ghost"
                className="text-foreground hover:text-primary cursor-pointer"
              >
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-primary hover:bg-secondary text-primary-foreground cursor-pointer">
                Post a Campaign
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}