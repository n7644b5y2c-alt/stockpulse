import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X, Sparkles, SlidersHorizontal } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'All Stocks', path: '/stocks' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Expert Picks', path: '/expert-picks', badge: true },
  { name: 'Expected Profits', path: '/expected-profits' },
  { name: 'Future', path: '/future' },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-token bg-bg-primary transition-colors duration-fast">
      <div className="w-full max-w-page mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-accent-gold rounded-btn p-1 -ml-1"
            aria-label="StockPulse home"
          >
            <div className="w-8 h-8 rounded-btn bg-bg-surface border border-border-token flex items-center justify-center text-profit group-hover:border-profit transition-colors duration-fast shadow-subtle">
              <Activity className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-semibold text-lg tracking-tight text-text-primary">
                Stock<span className="text-profit">Pulse</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm rounded-btn transition-colors duration-fast relative flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-accent-gold ${
                    isActive
                      ? 'text-text-primary font-medium bg-bg-surface border border-border-token shadow-subtle'
                      : 'text-text-muted hover:text-text-primary hover:bg-bg-surface-hover border border-transparent'
                  }`
                }
              >
                <span>{link.name}</span>
                {link.badge && (
                  <Sparkles className="w-3 h-3 text-accent-gold" aria-hidden="true" />
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link
              to="/appearance"
              aria-label="Appearance settings"
              title="Appearance settings"
              className="p-2 rounded-btn border border-border-token bg-bg-surface text-text-muted hover:text-text-primary hover:bg-bg-surface-hover transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-accent-gold"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Link>
            <ThemeToggle />
            <div className="h-4 w-px bg-border-token mx-1" aria-hidden="true" />
            <Link
              to="/login"
              className="px-3.5 py-1.5 text-sm font-medium rounded-btn text-text-primary hover:bg-bg-surface-hover transition-colors duration-fast border border-transparent focus:outline-none focus:ring-2 focus:ring-accent-gold"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-3.5 py-1.5 text-sm font-medium rounded-btn bg-text-primary text-bg-primary hover:opacity-90 transition-opacity duration-fast shadow-subtle focus:outline-none focus:ring-2 focus:ring-accent-gold"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile Right Controls: ThemeToggle + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="p-2 rounded-btn border border-border-token bg-bg-surface text-text-primary hover:bg-bg-surface-hover focus:outline-none focus:ring-2 focus:ring-accent-gold cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Backdrop & Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="md:hidden fixed inset-x-0 top-16 bottom-0 z-50 bg-bg-primary border-b border-border-token overflow-y-auto px-4 py-6 flex flex-col justify-between"
        >
          <div className="space-y-2">
            <p className="px-3 text-xs uppercase tracking-wider text-text-muted font-medium mb-3">
              Navigation
            </p>
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `w-full px-3.5 py-2.5 text-base rounded-btn transition-colors duration-fast flex items-center justify-between border ${
                    isActive
                      ? 'text-text-primary font-medium bg-bg-surface border-border-token shadow-subtle'
                      : 'text-text-muted hover:text-text-primary hover:bg-bg-surface border-transparent'
                  }`
                }
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="flex items-center gap-1 text-xs text-accent-gold font-medium bg-accent-gold-bg px-2 py-0.5 rounded-full border border-accent-gold">
                    <Sparkles className="w-3 h-3" />
                    Hot
                  </span>
                )}
              </NavLink>
            ))}

            <div className="pt-2">
              <NavLink
                to="/appearance"
                className={({ isActive }) =>
                  `w-full px-3.5 py-2.5 text-base rounded-btn transition-colors duration-fast flex items-center gap-2 border ${
                    isActive
                      ? 'text-text-primary font-medium bg-bg-surface border-border-token shadow-subtle'
                      : 'text-text-muted hover:text-text-primary hover:bg-bg-surface border-transparent'
                  }`
                }
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Appearance</span>
              </NavLink>
            </div>
          </div>

          {/* Mobile Auth CTAs */}
          <div className="pt-6 border-t border-border-token flex flex-col gap-2.5 mt-8">
            <Link
              to="/login"
              className="w-full text-center py-2.5 text-sm font-medium rounded-btn border border-border-token bg-bg-surface text-text-primary hover:bg-bg-surface-hover transition-colors duration-fast"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="w-full text-center py-2.5 text-sm font-medium rounded-btn bg-text-primary text-bg-primary hover:opacity-90 transition-opacity duration-fast shadow-subtle"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
