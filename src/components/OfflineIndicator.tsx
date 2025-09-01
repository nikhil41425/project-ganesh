'use client';

import { useOnlineStatus, useDeviceInfo } from '@/hooks/usePWA';
import { useEffect, useState } from 'react';

export default function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const { isMobile } = useDeviceInfo();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render on server-side to prevent hydration mismatch
  if (!isClient || isOnline) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 bg-red-500 text-white px-4 py-2 text-center ${isMobile ? 'text-sm' : 'text-base'}`}>
      <div className="flex items-center justify-center space-x-2">
        <svg
          className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2v4m0 12v4m10-10h-4M6 12H2"
          />
        </svg>
        <span>
          {isMobile 
            ? 'You&apos;re offline'
            : 'You&apos;re currently offline. Some features may not work.'
          }
        </span>
        {!isMobile && (
          <button
            onClick={() => window.location.reload()}
            className="ml-4 text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
