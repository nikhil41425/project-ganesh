'use client'

import { LogOut, Download, Menu, X, ShoppingBag, Users, Receipt, Heart, DollarSign, BarChart3 } from 'lucide-react'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { usePWAInstall } from '@/hooks/usePWAInstall'
import PWAInstallModal from './PWAInstallModal'

interface HeaderProps {
  onLogout: () => void
}

export default function Header({ onLogout }: HeaderProps) {
  const { canInstall, isInstalled, isIOS, installPWA } = usePWAInstall()
  const [showInstallModal, setShowInstallModal] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  
  const router = useRouter()
  const pathname = usePathname()

  // Navigation tabs
  const tabs = [
    { 
      id: 'analytics',
      name: 'Dashboard (విశ్లేషణ)', 
      icon: BarChart3,
      href: '/dashboard',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    { 
      id: 'auction',
      name: 'Auction (సవాల్)', 
      icon: ShoppingBag,
      href: '/dashboard/auction',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    { 
      id: 'membership',
      name: 'Membership (సబ్యత్వం)', 
      icon: Users,
      href: '/dashboard/membership',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      id: 'expenses',
      name: 'Expenses (కర్చులు)', 
      icon: Receipt,
      href: '/dashboard/expenses',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    { 
      id: 'donations',
      name: 'Donations (చంద)', 
      icon: Heart,
      href: '/dashboard/donations',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    { 
      id: 'dues',
      name: 'Dues', 
      icon: DollarSign,
      href: '/dashboard/dues',
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600'
    }
  ]

  const handlePWAInstall = () => {
    setShowInstallModal(true)
  }

  const handleInstallFromModal = async () => {
    await installPWA()
  }

  const isActiveTab = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const handleNavigation = (href: string) => {
    setIsNavigating(true)
    setIsMobileMenuOpen(false)
    router.push(href)
    
    // Reset loading state after a short delay to ensure smooth transition
    setTimeout(() => {
      setIsNavigating(false)
    }, 500)
  }

  const handleLogout = () => {
    setIsMobileMenuOpen(false)
    onLogout()
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
              {/* Hamburger Menu Button for Mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg">
            <div className="px-4 py-2 space-y-1 max-h-96 overflow-y-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = isActiveTab(tab.href)
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleNavigation(tab.href)}
                    disabled={isNavigating}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 w-full text-left ${
                      isActive
                        ? `${tab.bgColor} ${tab.textColor} font-medium shadow-sm`
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    } ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {/* <Icon className="h-5 w-5" /> */}
                    <span>{tab.name}</span>
                    {isNavigating && (
                      <div className="ml-auto">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                      </div>
                    )}
                  </button>
                )
              })}
              
              {/* Divider */}
              <div className="border-t border-gray-200 my-2"></div>
              
              {/* Mobile Sign Out Button */}
              <button
                onClick={handleLogout}
                disabled={isNavigating}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors w-full text-left ${
                  isNavigating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Navigation Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-700 font-medium">Loading page...</p>
          </div>
        </div>
      )}

      
    </>
  )
}
