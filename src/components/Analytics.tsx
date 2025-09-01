'use client'

import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingBag, Heart, Receipt } from 'lucide-react'

interface AnalyticsProps {
  auctionItems: any[]
  membershipItems: any[]
  spentItems: any[]
  donationItems: any[]
  duesItems: any[]
}

export default function Analytics({ 
  auctionItems, 
  membershipItems, 
  spentItems, 
  donationItems, 
  duesItems 
}: AnalyticsProps) {
  
  // Calculate totals for each category
  const categoryTotals = [
    { 
      name: 'Auction',
      total: auctionItems.reduce((sum, item) => sum + item.amount, 0),
      paid: auctionItems.reduce((sum, item) => sum + item.paid, 0),
      due: auctionItems.reduce((sum, item) => sum + item.due, 0),
      count: auctionItems.length,
      icon: ShoppingBag,
      color: '#8b5cf6'
    },
    { 
      name: 'Membership',
      total: membershipItems.reduce((sum, item) => sum + item.amount, 0),
      paid: membershipItems.reduce((sum, item) => sum + item.paid, 0),
      due: membershipItems.reduce((sum, item) => sum + item.due, 0),
      count: membershipItems.length,
      icon: Users,
      color: '#3b82f6'
    },
    { 
      name: 'Expenses',
      total: spentItems.reduce((sum, item) => sum + item.amount, 0),
      paid: spentItems.reduce((sum, item) => sum + item.paid, 0),
      due: spentItems.reduce((sum, item) => sum + item.due, 0),
      count: spentItems.length,
      icon: Receipt,
      color: '#10b981'
    },
    { 
      name: 'Donations',
      total: donationItems.reduce((sum, item) => sum + item.amount, 0),
      paid: donationItems.reduce((sum, item) => sum + item.paid, 0),
      due: donationItems.reduce((sum, item) => sum + item.due, 0),
      count: donationItems.length,
      icon: Heart,
      color: '#f59e0b'
    },
    { 
      name: 'Dues',
      total: duesItems.reduce((sum, item) => sum + item.amount, 0),
      paid: duesItems.reduce((sum, item) => sum + item.paid, 0),
      due: duesItems.reduce((sum, item) => sum + item.due, 0),
      count: duesItems.length,
      icon: DollarSign,
      color: '#06b6d4'
    }
  ]

  // Calculate overall statistics
  const overallStats = {
    totalAmount: categoryTotals.reduce((sum, cat) => sum + cat.total, 0),
    totalPaid: categoryTotals.reduce((sum, cat) => sum + cat.paid, 0),
    totalDue: categoryTotals.reduce((sum, cat) => sum + cat.due, 0),
    totalItems: categoryTotals.reduce((sum, cat) => sum + cat.count, 0)
  }



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <TrendingUp className="h-4 w-4" />
          <span>Financial Overview</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Amount</p>
              <p className="text-2xl font-bold">₹{overallStats.totalAmount.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Paid</p>
              <p className="text-2xl font-bold">₹{overallStats.totalPaid.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Total Due</p>
              <p className="text-2xl font-bold">₹{overallStats.totalDue.toLocaleString()}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Items</p>
              <p className="text-2xl font-bold">{overallStats.totalItems}</p>
            </div>
            <Receipt className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {categoryTotals.map((category, index) => {
          const IconComponent = category.icon
          return (
            <div key={category.name} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <IconComponent className="h-6 w-6" style={{ color: category.color }} />
                <span className="text-sm font-medium text-gray-600">{category.count} items</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium">₹{category.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Paid:</span>
                  <span className="font-medium text-green-600">₹{category.paid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Due:</span>
                  <span className="font-medium text-red-600">₹{category.due.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
