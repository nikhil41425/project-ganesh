'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<void>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side to prevent hydration mismatch
    setIsClient(true);

    // Detect if device is desktop/tablet
    const checkDevice = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isLargeScreen = window.innerWidth >= 768;
      setIsDesktop(!isMobile || isLargeScreen);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('🎉 PWA install prompt triggered!');
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    // Log PWA status for debugging
    console.log('PWA Install Component: Setting up event listeners');
    console.log('Current URL:', window.location.href);
    console.log('Service Worker supported:', 'serviceWorker' in navigator);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Debug: Check if already in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    console.log('Already in standalone mode:', isStandalone);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  // Don't render anything on server-side to prevent hydration mismatch
  if (!isClient || !showInstallButton) return null;

  return (
    <div className={`fixed z-50 ${isDesktop ? 'top-4 right-4' : 'bottom-4 left-4 right-4'}`}>
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-4 ${isDesktop ? 'max-w-sm' : 'max-w-full'}`}>
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Install Project Ganesh
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isDesktop 
                ? 'Add to your desktop for quick access' 
                : 'Add to your home screen for a native app experience'
              }
            </p>
          </div>
        </div>
        <div className={`mt-3 flex ${isDesktop ? 'space-x-2' : 'space-x-2'}`}>
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors"
          >
            {isDesktop ? 'Add to Desktop' : 'Add to Home Screen'}
          </button>
          <button
            onClick={() => setShowInstallButton(false)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white text-xs font-medium py-2 px-3 rounded-md transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
