import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

export function Footer() {
  const menuLinks = [
    { label: 'About Us', href: '/about-us' },
    { label: 'Contact', href: '#' },
    { label: 'Blog', href: 'https://blog.onehub.ae/blogs/' },
  ];

  return (
    <footer className="bg-black border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4">
          <p className="text-white/90 text-sm order-3 md:order-1 text-center md:text-left">
            © 2026 One Hub. All rights reserved.
          </p>

          <div className="flex items-center gap-5 order-1 md:order-2">
            {menuLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-white/85 hover:text-primary transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 order-2 md:order-3">
            <a href="https://www.facebook.com/profile.php?id=100064185243040" className="w-9 h-9 rounded-lg bg-white/5 border border-white/20 hover:bg-primary hover:border-primary flex items-center justify-center transition-all group">
              <Facebook className="w-4 h-4 text-white group-hover:text-black" />
            </a>
            <a href="https://x.com/Onehub_ae" className="w-9 h-9 rounded-lg bg-white/5 border border-white/20 hover:bg-primary hover:border-primary flex items-center justify-center transition-all group">
              <Twitter className="w-4 h-4 text-white group-hover:text-black" />
            </a>
            <a href="https://www.instagram.com/onehub.uae/" className="w-9 h-9 rounded-lg bg-white/5 border border-white/20 hover:bg-primary hover:border-primary flex items-center justify-center transition-all group">
              <Instagram className="w-4 h-4 text-white group-hover:text-black" />
            </a>
            <a href="https://www.linkedin.com/company/onehub-ae/" className="w-9 h-9 rounded-lg bg-white/5 border border-white/20 hover:bg-primary hover:border-primary flex items-center justify-center transition-all group">
              <Linkedin className="w-4 h-4 text-white group-hover:text-black" />
            </a>
            <a href="https://www.youtube.com/@OnehubUAE" className="w-9 h-9 rounded-lg bg-white/5 border border-white/20 hover:bg-primary hover:border-primary flex items-center justify-center transition-all group">
              <Youtube className="w-4 h-4 text-white group-hover:text-black" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
