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

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (typeof window === 'undefined') return;

    // Detect iOS
    const checkIsIOS = () => {
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
      setIsIOS(isIOSDevice);
      return isIOSDevice;
    };

    const isIOSDevice = checkIsIOS();

    // Check if already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isIOSStandalone);
      
      // For iOS, show install option if not in standalone mode
      if (isIOSDevice && !isIOSStandalone && !isStandalone) {
        setCanInstall(true);
      }
    };

    checkInstalled();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
    };

    // Only add beforeinstallprompt listener for non-iOS devices
    if (!isIOSDevice) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }
    
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      if (!isIOSDevice) {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      }
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = async () => {
    if (isIOS) {
      // For iOS, we can't programmatically install, so return instructions
      return false;
    }
    
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setCanInstall(false);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('PWA install error:', error);
      return false;
    }
  };

  return {
    canInstall: isClient ? canInstall : false,
    isInstalled: isClient ? isInstalled : false,
    isIOS: isClient ? isIOS : false,
    installPWA
  };
}
