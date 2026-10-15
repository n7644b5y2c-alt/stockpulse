import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(() => {
    return typeof navigator !== 'undefined' ? !navigator.onLine : false;
  });

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="assertive"
      className="w-full bg-loss text-white px-4 py-2 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md transition-all duration-fast"
    >
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>You are currently offline. Showing cached market quotes. Reconnecting...</span>
    </div>
  );
};
