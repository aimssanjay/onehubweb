import { Link, useLocation } from 'react-router';
import { Search, BriefcaseBusiness, Users, LogIn } from 'lucide-react';

const items = [
  { label: 'Search', to: '/browse', icon: Search },
  { label: 'For Brands', to: '/brand/login', icon: BriefcaseBusiness },
  { label: 'For Creators', to: '/influencer-signup', icon: Users },
  { label: 'Login', to: '/login', icon: LogIn },
];

export function MobileBottomBar() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-4 h-[64px] px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.label}
              to={item.to}
              className="flex flex-col items-center justify-center gap-1"
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
              <span className={`text-[12px] leading-none ${isActive ? 'text-primary font-medium' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

