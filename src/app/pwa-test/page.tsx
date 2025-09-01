'use client';

import { useState } from 'react';

export default function PWATestPage() {
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);

  // Force install prompt for testing
  const handleForceInstall = async () => {
    if (installPromptEvent) {
      installPromptEvent.prompt();
      const { outcome } = await installPromptEvent.userChoice;
      console.log('Install outcome:', outcome);
      setInstallPromptEvent(null);
    } else {
      alert('No install prompt available. Check DevTools → Application → Manifest for PWA requirements.');
    }
  };

  // Check PWA status
  const checkPWAStatus = () => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInstalled = (navigator as any).standalone || isStandalone;
    
    alert(`
PWA Status:
- Service Worker: ${'serviceWorker' in navigator ? 'Supported' : 'Not supported'}
- Standalone Mode: ${isStandalone ? 'Yes' : 'No'}
- Already Installed: ${isInstalled ? 'Yes' : 'No'}
- Install Prompt Available: ${installPromptEvent ? 'Yes' : 'No'}
    `);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">PWA Installation Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">PWA Install Tests</h2>
            
            <div className="space-y-4">
              <button
                onClick={checkPWAStatus}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Check PWA Status
              </button>
              
              <button
                onClick={handleForceInstall}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Force Install Prompt
              </button>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-3">Manual Install Methods</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>🔍 <strong>Edge:</strong> Look for install icon (⊞) in address bar</p>
              <p>📱 <strong>Chrome:</strong> Menu → Install app</p>
              <p>🍎 <strong>Safari:</strong> Share → Add to Home Screen</p>
              <p>🔧 <strong>DevTools:</strong> F12 → Application → Manifest → Add to homescreen</p>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-3">Requirements Check</h3>
            <div className="text-sm space-y-1">
              <p>✅ HTTPS/localhost</p>
              <p>✅ Web App Manifest</p>
              <p>✅ Service Worker</p>
              <p>✅ Multiple icon sizes</p>
              <p>✅ Start URL defined</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Note:</strong> In development mode, caching is disabled but installation should still work. 
            For full PWA features, run <code className="bg-yellow-100 px-1 rounded">npm run build && npm start</code>
          </p>
        </div>
      </div>
    </div>
  );
}
