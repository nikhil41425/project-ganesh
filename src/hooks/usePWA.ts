'use client';

import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => {
    // Return true on server-side to prevent hydration mismatch
    if (typeof window === 'undefined') return true;
    return navigator.onLine;
  });

  useEffect(() => {
    // Set the actual online status after hydration
    setIsOnline(navigator.onLine);

    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export function usePWA() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [platform, setPlatform] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [canInstall, setCanInstall] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Only run client-side logic after marking as client
    if (typeof window === 'undefined') return;
    // Detect platform
    const detectPlatform = () => {
      const userAgent = navigator.userAgent;
      const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isTablet = /iPad|Android.*Tablet|Kindle|PlayBook/i.test(userAgent);
      const isDesktop = !isMobile && !isTablet;
      
      if (isDesktop || window.innerWidth >= 1024) {
        setPlatform('desktop');
      } else if (isTablet || (window.innerWidth >= 768 && window.innerWidth < 1024)) {
        setPlatform('tablet');
      } else {
        setPlatform('mobile');
      }
    };

    // Check if PWA is installed/standalone
    const checkInstalled = () => {
      // Check if running in standalone mode (installed PWA)
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      const isWindowControlsOverlay = window.matchMedia('(display-mode: window-controls-overlay)').matches;
      
      const standalone = isStandaloneMode || isIOSStandalone || isWindowControlsOverlay;
      setIsStandalone(standalone);
      setIsInstalled(standalone);
    };

    // Check if app can be installed
    const checkCanInstall = () => {
      // PWA is installable if not already installed and supports installation
      const supportsInstall = 'serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window;
      setCanInstall(supportsInstall && !isInstalled);
    };

    detectPlatform();
    checkInstalled();
    checkCanInstall();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => checkInstalled();
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = () => {
      setCanInstall(true);
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('resize', detectPlatform);

    return () => {
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('resize', detectPlatform);
    };
  }, [isInstalled]);

  return { 
    isInstalled: isClient ? isInstalled : false, 
    isStandalone: isClient ? isStandalone : false, 
    platform: isClient ? platform : 'desktop', 
    canInstall: isClient ? canInstall : false,
    isPWASupported: isClient ? ('serviceWorker' in navigator) : false
  };
}

export function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true, // Default to desktop for SSR
    isIOS: false,
    isAndroid: false,
    isWindows: false,
    isMac: false,
    supportsTouch: false,
    screenSize: { width: 1024, height: 768 }, // Default desktop size
    orientation: 'landscape' as 'portrait' | 'landscape'
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (typeof window === 'undefined') return;

    const updateDeviceInfo = () => {
      const userAgent = navigator.userAgent;
      const platform = navigator.platform;
      
      const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isTablet = /iPad|Android.*Tablet|Kindle|PlayBook/i.test(userAgent);
      const isDesktop = !isMobile && !isTablet;
      
      const isIOS = /iPad|iPhone|iPod/.test(userAgent);
      const isAndroid = /Android/.test(userAgent);
      const isWindows = /Win/.test(platform);
      const isMac = /Mac/.test(platform);
      
      const supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      const screenSize = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      
      const orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isIOS,
        isAndroid,
        isWindows,
        isMac,
        supportsTouch,
        screenSize,
        orientation
      });
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return isClient ? deviceInfo : {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isIOS: false,
    isAndroid: false,
    isWindows: false,
    isMac: false,
    supportsTouch: false,
    screenSize: { width: 1024, height: 768 },
    orientation: 'landscape' as const
  };
}
