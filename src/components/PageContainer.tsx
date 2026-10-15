import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  title,
  subtitle,
  action,
  className = '',
}) => {
  return (
    <div className={`w-full max-w-page mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            {title && (
              <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary tracking-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-text-muted">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-3">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
