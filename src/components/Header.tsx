'use client'

import Image from 'next/image'
import { LogOut, Menu, X, ShoppingBag, Users, Receipt, Heart, DollarSign, BarChart3, CalendarDays } from 'lucide-react'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { usePWAInstall } from '@/hooks/usePWAInstall'
import PWAInstallModal from './PWAInstallModal'
import { useYear } from '@/context/YearContext'

interface HeaderProps {
  onLogout: () => void
}

export default function Header({ onLogout }: HeaderProps) {
  const { canInstall, isInstalled, isIOS, installPWA } = usePWAInstall()
  const [showInstallModal, setShowInstallModal] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const { selectedYear, setSelectedYear, availableYears } = useYear()
  
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
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 pt-[env(safe-area-inset-top)] shadow-sm backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div className="p-0.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <Image
                  src="/icons/friendyouthlogo.png" 
                  alt="Friends Youth Logo" 
                  width={40}
                  height={40}
                  className="h-9 w-9 object-contain sm:h-10 sm:w-10"
                />
              </div>
              <div className="min-w-0 leading-tight">
                <h1 className="truncate text-sm font-extrabold text-slate-900 sm:text-2xl">Friendz Youth</h1>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:hidden">Choller</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 sm:gap-2" htmlFor="dashboard-year">
                <CalendarDays className="hidden h-5 w-5 text-indigo-600 sm:block" aria-hidden="true" />
                <span className="hidden sm:inline">Year</span>
                <select
                  id="dashboard-year"
                  value={selectedYear}
                  onChange={(event) => setSelectedYear(Number(event.target.value))}
                  className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-2 text-sm font-bold text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  aria-label="Select financial year"
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </label>
              {/* Hamburger Menu Button for Mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-xl p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 md:hidden"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white/98 shadow-lg backdrop-blur-lg md:hidden">
            <div className="max-h-[calc(100dvh-5rem)] space-y-1 overflow-y-auto px-3 py-3">
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
                    <Icon className="h-5 w-5" />
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

      <nav aria-label="Primary navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-5">
          {tabs.filter((tab) => tab.id !== 'dues').map((tab) => {
            const Icon = tab.icon
            const active = isActiveTab(tab.href)
            const label = tab.id === 'analytics' ? 'Home' : tab.id === 'membership' ? 'Members' : tab.name.split(' ')[0]
            return (
              <Link
                key={tab.id}
                href={tab.href}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-[10px] font-semibold transition-colors ${active ? 'text-indigo-600' : 'text-slate-500'}`}
              >
                <Icon className={`h-5 w-5 ${active ? 'stroke-[2.5]' : ''}`} aria-hidden="true" />
                <span className="max-w-full truncate">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

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
