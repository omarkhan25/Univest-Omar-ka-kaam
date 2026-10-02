import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X, Sparkles, Compass, BarChart3, Newspaper, FlaskConical, Crown, Bot } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const BrandLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 256 256"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M 128.005 191.173 C 128.448 156.208 156.93 128 192 128 L 192 64 L 128 64 C 128 99.346 99.346 128 64 128 L 64 192 L 128 192 Z M 192 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 64 L 64 64 L 64 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 192 L 192 192 Z" />
  </svg>
);

export const ArthSetuNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Markets', href: '/#markets', icon: BarChart3 },
    { name: 'Research', href: '/#research', icon: Compass },
    { name: 'News', href: '/#news', icon: Newspaper },
    { name: 'Investment Lab', href: '/#investment-lab', icon: FlaskConical },
    { name: 'Pro', href: '/#pro', icon: Crown },
    { name: 'AI Copilot', href: '/#ai-copilot', icon: Bot, isHighlight: true },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      if (location.pathname === '/') {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      } else {
        navigate(`/${href.substring(1)}`);
        return;
      }
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/85 backdrop-blur-md shadow-sm border-b border-black/5 py-3.5' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-[88rem] mx-auto px-6 sm:px-10 md:px-[50px] flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group cursor-pointer shrink-0">
          <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-sm">
            <BrandLogo className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-gray-950 font-sans">ArthSetu</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-purple-700 -mt-1 hidden sm:block">
              Research & Advisory
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-black/5 shadow-xs">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                if (link.href.startsWith('/#')) {
                  e.preventDefault();
                  handleNavClick(link.href);
                }
              }}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                link.isHighlight
                  ? 'text-purple-900 bg-purple-50/80 hover:bg-purple-100 font-semibold'
                  : 'text-gray-600 hover:text-gray-950 hover:bg-black/5'
              }`}
            >
              {link.isHighlight && <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />}
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="hidden sm:inline-flex text-sm font-semibold text-gray-700 hover:text-black transition-colors px-3 py-2"
          >
            Sign In
          </Link>

          <button
            onClick={() => navigate('/signup')}
            className="group inline-flex items-center gap-2 bg-black text-white text-sm font-medium pl-5 pr-4 py-2.5 rounded-full hover:bg-gray-900 transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer"
          >
            <span>Start Researching</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-black/5 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-black/10 px-6 py-6 animate-in slide-in-from-top-2 duration-200 shadow-xl">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href.startsWith('/#')) {
                      e.preventDefault();
                      handleNavClick(link.href);
                    } else {
                      setMobileMenuOpen(false);
                    }
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  <Icon className="w-5 h-5 text-gray-500" />
                  <span>{link.name}</span>
                </a>
              );
            })}
            <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-800"
              >
                Sign In
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/signup');
                }}
                className="w-full text-center py-3 rounded-xl bg-black text-white text-sm font-semibold"
              >
                Start Researching
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default ArthSetuNavbar;
