import React from 'react';
import { PageContainer } from '../components/PageContainer';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <PageContainer>
      <div className="max-w-md mx-auto py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-bg-surface-hover border border-border-token flex items-center justify-center text-text-muted mx-auto mb-6 shadow-subtle">
          <Compass className="w-8 h-8 text-accent-gold" />
        </div>
        <span className="font-mono text-4xl sm:text-5xl font-extrabold text-text-primary tracking-tight block mb-2">
          404
        </span>
        <h1 className="text-lg font-semibold text-text-primary mb-2">
          Market Asset or Page Not Found
        </h1>
        <p className="text-sm text-text-muted mb-8 leading-relaxed">
          The requested route does not exist in the StockPulse registry or may have been relocated.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-btn bg-text-primary text-bg-primary hover:opacity-90 transition-opacity duration-fast text-sm font-medium shadow-subtle focus:outline-none focus:ring-2 focus:ring-accent-gold/40"
        >
          <Home className="w-4 h-4" />
          <span>Return to Home</span>
        </Link>
      </div>
    </PageContainer>
  );
};
