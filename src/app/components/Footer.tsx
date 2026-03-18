import { Sparkles, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  const productLinks = [
    { label: 'Browse Influencers', href: '#' },
    { label: 'How It Works', href: '#' },
    { label: 'Pricing', href: '#' },
    { label: 'Success Stories', href: '#' },
  ];

  const companyLinks = [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Blog', href: '#' },
  ];

  const legalLinks = [
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ];

  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-muted-foreground mb-4 max-w-xs">
              The leading marketplace connecting brands with authentic influencers for impactful collaborations.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-card border border-border hover:bg-primary hover:border-primary flex items-center justify-center transition-all group">
                <Facebook className="w-4 h-4 text-foreground group-hover:text-primary-foreground" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-card border border-border hover:bg-primary hover:border-primary flex items-center justify-center transition-all group">
                <Twitter className="w-4 h-4 text-foreground group-hover:text-primary-foreground" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-card border border-border hover:bg-primary hover:border-primary flex items-center justify-center transition-all group">
                <Instagram className="w-4 h-4 text-foreground group-hover:text-primary-foreground" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-card border border-border hover:bg-primary hover:border-primary flex items-center justify-center transition-all group">
                <Linkedin className="w-4 h-4 text-foreground group-hover:text-primary-foreground" />
              </a>
            </div>
          </div>

          {/* Product and Company in Same Row on Mobile */}
          <div className="grid grid-cols-2 gap-8 lg:contents">
            {/* Product Links */}
            <div>
              <h4 className="mb-4 text-foreground font-semibold">Product</h4>
              <ul className="space-y-3">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="mb-4 text-foreground font-semibold">Company</h4>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="mb-4 text-foreground font-semibold">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
          <p>&copy; 2026 One Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}