'use client'

import { X, Smartphone, Share, Plus, Download } from 'lucide-react'
import { useEffect } from 'react'

interface PWAInstallModalProps {
  isOpen: boolean
  onClose: () => void
  isIOS: boolean
  onInstall?: () => Promise<void>
}

export default function PWAInstallModal({ isOpen, onClose, isIOS, onInstall }: PWAInstallModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleInstall = async () => {
    if (onInstall) {
      await onInstall()
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Smartphone className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold">Install Project Ganesh</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 text-blue-100">
            Get the best experience with our mobile app
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {isIOS ? (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Share className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Add to Home Screen
                </h3>
                <p className="text-gray-600 text-sm">
                  Follow these simple steps to install the app on your iPhone/iPad
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Tap the Share button</p>
                    <p className="text-gray-600 text-sm">Look for the <Share className="inline h-4 w-4 mx-1" /> icon in Safari's toolbar</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Select "Add to Home Screen"</p>
                    <p className="text-gray-600 text-sm">Scroll down and tap <Plus className="inline h-4 w-4 mx-1" /> "Add to Home Screen"</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Tap "Add"</p>
                    <p className="text-gray-600 text-sm">Confirm by tapping "Add" in the top right</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-green-800 text-sm font-medium">
                    The app will appear on your home screen and work like a native app!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Download className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Install App
                </h3>
                <p className="text-gray-600 text-sm">
                  Install Project Ganesh for the best mobile experience
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-blue-800 font-medium text-sm">Why install?</p>
                    <ul className="text-blue-700 text-sm mt-1 space-y-1">
                      <li>• Works offline</li>
                      <li>• Faster loading</li>
                      <li>• Native app experience</li>
                      <li>• Home screen access</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={handleInstall}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Install Now
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  )
}
