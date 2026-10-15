import React from 'react';
import { PageContainer } from '../components/PageContainer';
import { Link } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, Activity, ShieldCheck } from 'lucide-react';

export const Signup: React.FC = () => {
  return (
    <PageContainer>
      <div className="max-w-md mx-auto pt-6 pb-12">
        <div className="rounded-card border border-border-token bg-bg-surface p-6 sm:p-8 shadow-subtle">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-10 h-10 rounded-btn bg-bg-surface-hover border border-border-token flex items-center justify-center text-profit mb-3 shadow-subtle">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold text-text-primary tracking-tight">
              Create your Account
            </h1>
            <p className="text-xs text-text-muted mt-1">
              Start building your simulated market watchlist and portfolio
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-text-muted block mb-1.5" htmlFor="signup-name">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  id="signup-name"
                  type="text"
                  placeholder="Jane Doe"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-btn bg-bg-surface-hover/50 border border-border-token text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent-gold/40 transition-colors duration-fast"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-text-muted block mb-1.5" htmlFor="signup-email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  id="signup-email"
                  type="email"
                  placeholder="investor@stockpulse.io"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-btn bg-bg-surface-hover/50 border border-border-token text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent-gold/40 transition-colors duration-fast"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-text-muted block mb-1.5" htmlFor="signup-password">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-btn bg-bg-surface-hover/50 border border-border-token text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent-gold/40 transition-colors duration-fast"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-medium rounded-btn bg-text-primary text-bg-primary hover:opacity-90 transition-opacity duration-fast flex items-center justify-center gap-2 shadow-subtle cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-gold/40"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-btn bg-bg-surface-hover/40 border border-border-token">
              <ShieldCheck className="w-4 h-4 text-profit shrink-0" />
              <p className="text-xs text-text-muted leading-tight">
                No credit card required. Pure simulation for retail users and students.
              </p>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-border-token text-center text-xs text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
