'use client';

import { usePWA, useDeviceInfo } from '@/hooks/usePWA';
import { useEffect, useState } from 'react';

export default function PWAStatus() {
  const { isInstalled, isStandalone, platform, canInstall, isPWASupported } = usePWA();
  const { isMobile, isTablet, isDesktop } = useDeviceInfo();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only show in development and after client-side hydration
  if (!isClient || process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-2 left-2 z-40 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-50 font-mono">
      <div>Platform: {platform}</div>
      <div>Device: {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}</div>
      <div>PWA: {isInstalled ? '✅ Installed' : canInstall ? '⚡ Can Install' : '❌ Not Available'}</div>
      <div>Mode: {isStandalone ? 'Standalone' : 'Browser'}</div>
      <div>Support: {isPWASupported ? '✅ Yes' : '❌ No'}</div>
    </div>
  );
}
