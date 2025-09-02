'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingBag, Heart, Receipt, Download, FileText, BarChart3, Languages, CheckCircle, XCircle, X, Loader2 } from 'lucide-react'
import { exportAnalyticsToPDF } from '@/utils/pdfExport'
import { exportAnalyticsWithChartsToPDF } from '@/utils/pdfExportAdvanced'

interface AnalyticsProps {
  auctionItems: any[]
  membershipItems: any[]
  spentItems: any[]
  donationItems: any[]
  duesItems: any[]
}

interface ToastNotification {
  id: number
  message: string
  type: 'success' | 'error'
  show: boolean
}

export default function Analytics({ 
  auctionItems = [], 
  membershipItems = [], 
  spentItems = [], 
  donationItems = [], 
  duesItems = [] 
}: AnalyticsProps) {
  
  const router = useRouter()
  const [isExporting, setIsExporting] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [navigatingCard, setNavigatingCard] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<ToastNotification[]>([])
  const [nextId, setNextId] = useState(1)

  // Function to show toast notification
  const showToast = (message: string, type: 'success' | 'error') => {
    const id = nextId
    setNextId(prev => prev + 1)
    
    const newNotification: ToastNotification = {
      id,
      message,
      type,
      show: true
    }
    
    setNotifications(prev => [...prev, newNotification])
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, show: false } : notif
        )
      )
      // Remove from array after fade out animation
      setTimeout(() => {
        setNotifications(prev => prev.filter(notif => notif.id !== id))
      }, 300)
    }, 4000)
  }

  // Function to manually close toast
  const closeToast = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, show: false } : notif
      )
    )
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id))
    }, 300)
  }
  
  // Function to handle navigation to different sections
  const handleNavigateToSection = async (route: string, cardName: string) => {
    setIsNavigating(true)
    setNavigatingCard(cardName)
    
    try {
      await router.push(route)
    } catch (error) {
      console.error('Navigation error:', error)
      showToast('❌ Navigation failed. Please try again.', 'error')
    } finally {
      // Small delay to show loader even if navigation is fast
      setTimeout(() => {
        setIsNavigating(false)
        setNavigatingCard(null)
      }, 500)
    }
  }
  
  // Helper function to safely convert to number
  const safeNumber = (value: any): number => {
    if (value === null || value === undefined || value === '') return 0
    const num = Number(value)
    return isNaN(num) ? 0 : num
  }

  // Helper function to format currency with proper error handling
  const formatCurrency = (amount: number): string => {
    if (isNaN(amount) || !isFinite(amount)) return '0'
    return Math.round(amount).toLocaleString()
  }
  
  // Calculate totals for each category with proper null/undefined handling
  const categoryTotals = [
    { 
      name: 'Auction (సవాల్)',
      total: auctionItems.reduce((sum, item) => sum + safeNumber(item.amount), 0),
      paid: auctionItems.reduce((sum, item) => sum + safeNumber(item.paid), 0),
      due: auctionItems.reduce((sum, item) => sum + safeNumber(item.due), 0),
      count: auctionItems.length,
      icon: ShoppingBag,
      color: '#8b5cf6',
      route: '/dashboard/auction'
    },
    { 
      name: 'Membership (సబ్యత్వం)',
      total: membershipItems.reduce((sum, item) => sum + safeNumber(item.amount), 0),
      paid: membershipItems.reduce((sum, item) => sum + safeNumber(item.paid), 0),
      due: membershipItems.reduce((sum, item) => sum + safeNumber(item.due), 0),
      count: membershipItems.length,
      icon: Users,
      color: '#3b82f6',
      route: '/dashboard/membership'
    },
    { 
      name: 'Expenses (కర్చులు)',
      total: spentItems.reduce((sum, item) => sum + safeNumber(item.amount), 0),
      paid: spentItems.reduce((sum, item) => sum + safeNumber(item.paid), 0),
      due: spentItems.reduce((sum, item) => sum + safeNumber(item.due), 0),
      count: spentItems.length,
      icon: Receipt,
      color: '#10b981',
      route: '/dashboard/expenses'
    },
    { 
      name: 'Donations (చంద)',
      total: donationItems.reduce((sum, item) => sum + safeNumber(item.amount), 0),
      paid: donationItems.reduce((sum, item) => sum + safeNumber(item.paid), 0),
      due: donationItems.reduce((sum, item) => sum + safeNumber(item.due), 0),
      count: donationItems.length,
      icon: Heart,
      color: '#f59e0b',
      route: '/dashboard/donations'
    },
    { 
      name: 'Dues',
      total: duesItems.reduce((sum, item) => sum + safeNumber(item.amount), 0),
      paid: duesItems.reduce((sum, item) => sum + safeNumber(item.paid), 0),
      due: duesItems.reduce((sum, item) => sum + safeNumber(item.due), 0),
      count: duesItems.length,
      icon: DollarSign,
      color: '#06b6d4',
      route: '/dashboard/dues'
    }
  ]

  // Calculate overall statistics
  const overallStats = {
    totalAmount: categoryTotals.reduce((sum, cat) => sum + cat.total, 0),
    totalPaid: categoryTotals.reduce((sum, cat) => sum + cat.paid, 0),
    totalDue: categoryTotals.reduce((sum, cat) => sum + cat.due, 0),
    totalItems: categoryTotals.reduce((sum, cat) => sum + cat.count, 0)
  }

  // Add validation to check if calculations are consistent
  const isDataConsistent = categoryTotals.every(cat => {
    const calculatedTotal = cat.paid + cat.due
    return Math.abs(cat.total - calculatedTotal) < 0.01 // Allow for small floating point differences
  })

  // Log inconsistencies for debugging
  if (!isDataConsistent) {
    console.warn('Analytics: Data inconsistency detected in calculations')
    categoryTotals.forEach(cat => {
      const calculatedTotal = cat.paid + cat.due
      if (Math.abs(cat.total - calculatedTotal) >= 0.01) {
        console.warn(`${cat.name}: Total=${cat.total}, Paid=${cat.paid}, Due=${cat.due}, Expected Total=${calculatedTotal}`)
      }
    })
  }

  // Handle PDF export
  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      await exportAnalyticsToPDF({
        auctionItems,
        membershipItems,
        spentItems,
        donationItems,
        duesItems
      })
      showToast('📄 PDF exported successfully! Check your downloads folder.', 'success')
    } catch (error) {
      console.error('Error exporting PDF:', error)
      showToast('❌ Error exporting PDF. Please try again.', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  // Handle Visual PDF export
  const handleExportVisualPDF = async () => {
    setIsExporting(true)
    try {
      await exportAnalyticsWithChartsToPDF({
        auctionItems,
        membershipItems,
        spentItems,
        donationItems,
        duesItems
      })
      showToast('📊 Visual PDF exported successfully! Check your downloads folder.', 'success')
    } catch (error) {
      console.error('Error exporting visual PDF:', error)
      showToast('❌ Error exporting visual PDF. Please try again.', 'error')
    } finally {
      setIsExporting(false)
    }
  }



  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 to-white p-1 rounded-xl">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`transform transition-all duration-300 ease-in-out ${
              notification.show 
                ? 'translate-x-0 opacity-100' 
                : 'translate-x-full opacity-0'
            }`}
          >
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-80 max-w-md ${
              notification.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {notification.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              )}
              <p className="flex-1 text-sm font-medium">{notification.message}</p>
              <button
                onClick={() => closeToast(notification.id)}
                className={`p-1 rounded-full transition-colors ${
                  notification.type === 'success'
                    ? 'hover:bg-green-100 text-green-600'
                    : 'hover:bg-red-100 text-red-600'
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Header with Export Buttons */}
      <div className="flex justify-between items-center mb-6">
        <div className="w-full">
            <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-50 active:bg-red-100 disabled:bg-gray-100 text-red-600 border-2 border-red-600 hover:border-red-700 active:border-red-800 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:shadow-inner disabled:cursor-not-allowed text-sm transform active:scale-95"
            >
          <FileText className="h-4 w-4" />
          <span className="whitespace-nowrap">{isExporting ? 'Exporting...' : 'Export PDF'}</span>
            </button>
          {/* <button
        onClick={handleExportVisualPDF}
        disabled={isExporting}
        className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:cursor-not-allowed text-sm"
          >
        <BarChart3 className="h-4 w-4" />
        <span className="whitespace-nowrap">{isExporting ? 'Exporting...' : 'Export Visual'}</span>
          </button> */}
        </div>
      </div>

      {/* Summary Cards - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
        {/* First Row */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Amount</p>
              <p className="text-2xl font-bold mt-1">₹{formatCurrency(overallStats.totalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Paid</p>
              <p className="text-2xl font-bold mt-1">₹{formatCurrency(overallStats.totalPaid)}</p>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Total Due</p>
              <p className="text-2xl font-bold mt-1">₹{formatCurrency(overallStats.totalDue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Items</p>
              <p className="text-2xl font-bold mt-1">{overallStats.totalItems}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {categoryTotals.map((category, index) => {
          const IconComponent = category.icon
          const isCardLoading = isNavigating && navigatingCard === category.name
          const gradients = [
            'bg-gradient-to-br from-blue-50 to-blue-100',
            'bg-gradient-to-br from-green-50 to-green-100', 
            'bg-gradient-to-br from-purple-50 to-purple-100',
            'bg-gradient-to-br from-orange-50 to-orange-100',
            'bg-gradient-to-br from-pink-50 to-pink-100'
          ]
          return (
            <div 
              key={category.name} 
              className={`${gradients[index % gradients.length]} rounded-lg border border-gray-200 p-3 transition-all duration-200 relative ${
                isCardLoading 
                  ? 'cursor-wait opacity-75' 
                  : 'cursor-pointer hover:shadow-md hover:scale-105 hover:border-gray-300 active:scale-95'
              }`}
              onClick={() => !isNavigating && handleNavigateToSection(category.route, category.name)}
              role="button"
              tabIndex={isNavigating ? -1 : 0}
              onKeyDown={(e) => {
                if (!isNavigating && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  handleNavigateToSection(category.route, category.name)
                }
              }}
            >
              {/* Loading Overlay */}
              {isCardLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg flex items-center justify-center z-10">
                  <div className="flex flex-col items-center space-y-2">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
                    <span className="text-xs text-gray-600 font-medium">Loading...</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-2">
                <IconComponent className="h-5 w-5" style={{ color: category.color }} />
                <span className="text-xs font-medium text-gray-600">{category.count} items</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">{category.name}</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium text-blue-600">₹{formatCurrency(category.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Paid:</span>
                  <span className="font-medium text-green-600">₹{formatCurrency(category.paid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Due:</span>
                  <span className="font-medium text-red-600">₹{formatCurrency(category.due)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Debug Information (only shown if there are data inconsistencies) */}
      {!isDataConsistent && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-yellow-800 font-medium mb-2">⚠️ Data Calculation Warning</h3>
          <p className="text-yellow-700 text-sm mb-2">
            Some calculations may be inconsistent. Please check the data in individual tabs.
          </p>
          <details className="text-xs text-yellow-600">
            <summary className="cursor-pointer">View Details</summary>
            <div className="mt-2 space-y-1">
              {categoryTotals.map(cat => {
                const calculatedTotal = cat.paid + cat.due
                const difference = Math.abs(cat.total - calculatedTotal)
                if (difference >= 0.01) {
                  return (
                    <div key={cat.name}>
                      {cat.name}: Expected Total={formatCurrency(calculatedTotal)}, Actual Total={formatCurrency(cat.total)}, Difference={formatCurrency(difference)}
                    </div>
                  )
                }
                return null
              })}
            </div>
          </details>
        </div>
      )}
    </div>
  )
}
