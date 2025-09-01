'use client'

import { LogOut, Download } from 'lucide-react'
import { useState } from 'react'
import { usePWAInstall } from '@/hooks/usePWAInstall'
import PWAInstallModal from './PWAInstallModal'

interface HeaderProps {
  onLogout: () => void
}

export default function Header({ onLogout }: HeaderProps) {
  const { canInstall, isInstalled, isIOS, installPWA } = usePWAInstall()
  const [showInstallModal, setShowInstallModal] = useState(false)

  const handlePWAInstall = () => {
    setShowInstallModal(true)
  }

  const handleInstallFromModal = async () => {
    await installPWA()
  }

  // Always show download button on mobile for now (for testing)
  const showDownloadButton = true

  return (
    <>
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-0.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                {/* Friends Youth Logo */}
                <img 
                  src="/icons/friendyouthlogo.png" 
                  alt="Friends Youth Logo" 
                  className="h-10 w-10 object-contain"
                />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                Friendz Youth - Choller
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {/* PWA Install Button - Always show for testing */}
              {showDownloadButton && (
                <button
                  onClick={handlePWAInstall}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-blue-600 hover:text-white hover:bg-blue-500 bg-blue-50 rounded-lg transition-all duration-200 hover:shadow-lg"
                  title="Install App"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Install App</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* PWA Install Modal */}
      <PWAInstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        isIOS={isIOS}
        onInstall={handleInstallFromModal}
      />
    </>
  )
}
