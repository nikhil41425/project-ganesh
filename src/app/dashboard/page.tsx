'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Users, Receipt, Heart, DollarSign, Menu, X, BarChart3, LogOut } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Auction from '@/components/Auction'
import Membership from '@/components/Membership'
import Expenses from '@/components/Expenses'
import Donations from '@/components/Donations'
import Dues from '@/components/Dues'
import Analytics from '@/components/Analytics'

// Define types
interface AuctionItem {
  id: string
  name: string
  item: string
  amount: number
  paid: number
  due: number
  comment: string
  user_id: string
  created_at: string
  updated_at: string
}

interface MembershipItem {
  id: string
  name: string
  amount: number
  due: number
  comment: string
  paid: number
  user_id: string
  created_at: string
  updated_at: string
}

interface SpentItem {
  id: string
  item: string
  amount: number
  paid: number
  due: number
  comment: string
  user_id: string
  created_at: string
  updated_at: string
}

interface DonationItem {
  id: string
  name: string
  amount: number
  paid: number
  due: number
  comment: string
  user_id: string
  created_at: string
  updated_at: string
}

interface DuesItem {
  id: string
  name: string
  amount: number
  paid: number
  due: number
  comment: string
  user_id: string
  created_at: string
  updated_at: string
}

type TabType = 'auction' | 'membership' | 'expenses' | 'donations' | 'dues' | 'analytics'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<TabType>('auction')
  const [auctionItems, setAuctionItems] = useState<AuctionItem[]>([])
  const [membershipItems, setMembershipItems] = useState<MembershipItem[]>([])
  const [spentItems, setSpentItems] = useState<SpentItem[]>([])
  const [donationItems, setDonationItems] = useState<DonationItem[]>([])
  const [duesItems, setDuesItems] = useState<DuesItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  // Hardcoded tabs with icons and colors
  const tabs = [
    { 
      id: 'auction' as TabType, 
      name: 'Auction', 
      icon: ShoppingBag,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    { 
      id: 'membership' as TabType, 
      name: 'Membership', 
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      id: 'expenses' as TabType, 
      name: 'Expenses', 
      icon: Receipt,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    { 
      id: 'donations' as TabType, 
      name: 'Donations', 
      icon: Heart,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    { 
      id: 'dues' as TabType, 
      name: 'Dues', 
      icon: DollarSign,
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600'
    },
    { 
      id: 'analytics' as TabType, 
      name: 'Analytics', 
      icon: BarChart3,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    }
  ]

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    if (user) {
      if (activeTab === 'auction') {
        getAuctionItems(searchTerm)
      } else if (activeTab === 'membership') {
        getMembershipItems(searchTerm)
      } else if (activeTab === 'expenses') {
        getSpentItems(searchTerm)
      } else if (activeTab === 'donations') {
        getDonationItems(searchTerm)
      } else if (activeTab === 'dues') {
        getDuesItems(searchTerm)
      }
    }
  }, [user, activeTab, searchTerm])

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
    } else {
      router.push('/auth/login')
    }
    setLoading(false)
  }

  const getAuctionItems = async (search?: string) => {
    if (!user) return
    
    let query = supabase
      .from('auction_items')
      .select('*')
      .eq('user_id', user.id)
    
    if (search && search.trim()) {
      query = query.or(`name.ilike.%${search}%,item.ilike.%${search}%`)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })

    if (data && !error) {
      setAuctionItems(data)
    } else if (error) {
      console.error('Error fetching auction items:', error)
    }
  }

  const getMembershipItems = async (search?: string) => {
    if (!user) return
    
    let query = supabase
      .from('membership_items')
      .select('*')
      .eq('user_id', user.id)
    
    if (search && search.trim()) {
      query = query.or(`name.ilike.%${search}%,comment.ilike.%${search}%`)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })

    if (data && !error) {
      setMembershipItems(data)
    } else if (error) {
      console.error('Error fetching membership items:', error)
    }
  }

  const getSpentItems = async (search?: string) => {
    if (!user) return
    
    let query = supabase
      .from('spent_items')
      .select('*')
      .eq('user_id', user.id)
    
    if (search && search.trim()) {
      query = query.or(`item.ilike.%${search}%,comment.ilike.%${search}%`)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })

    if (data && !error) {
      setSpentItems(data)
    } else if (error) {
      console.error('Error fetching spent items:', error)
    }
  }

  const getDonationItems = async (search?: string) => {
    if (!user) return
    
    let query = supabase
      .from('donation_items')
      .select('*')
      .eq('user_id', user.id)
    
    if (search && search.trim()) {
      query = query.or(`name.ilike.%${search}%,comment.ilike.%${search}%`)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })

    if (data && !error) {
      setDonationItems(data)
    } else if (error) {
      console.error('Error fetching donation items:', error)
    }
  }

  const getDuesItems = async (search?: string) => {
    if (!user) return
    
    let query = supabase
      .from('dues_items')
      .select('*')
      .eq('user_id', user.id)
    
    if (search && search.trim()) {
      query = query.or(`name.ilike.%${search}%,comment.ilike.%${search}%`)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })

    if (data && !error) {
      setDuesItems(data)
    } else if (error) {
      console.error('Error fetching dues items:', error)
    }
  }

  // Auction handlers
  const handleAddAuctionItem = async (data: any) => {
    if (!user) return

    const { error } = await supabase
      .from('auction_items')
      .insert({
        name: data.name,
        item: data.item,
        amount: data.amount,
        paid: data.paid || 0,
        due: data.due || 0,
        comment: data.comment || '',
        user_id: user.id,
      })

    if (!error) {
      getAuctionItems(searchTerm)
    }
  }

  const handleDeleteAuctionItem = async (itemId: string) => {
    const { error } = await supabase
      .from('auction_items')
      .delete()
      .eq('id', itemId)

    if (!error) {
      getAuctionItems(searchTerm)
    }
  }

  const handleUpdateAuctionItem = async (id: string, data: Partial<AuctionItem>) => {
    const { error } = await supabase
      .from('auction_items')
      .update(data)
      .eq('id', id)
      .eq('user_id', user.id)

    if (!error) {
      getAuctionItems(searchTerm)
    } else {
      console.error('Error updating auction item:', error)
    }
  }

  // Membership handlers
  const handleAddMembershipItem = async (data: any) => {
    if (!user) return

    const { error } = await supabase
      .from('membership_items')
      .insert({
        name: data.name,
        amount: data.amount,
        due: data.due || 0,
        comment: data.comment || '',
        paid: data.paid || 0,
        user_id: user.id,
      })

    if (!error) {
      getMembershipItems(searchTerm)
    }
  }

  const handleDeleteMembershipItem = async (itemId: string) => {
    const { error } = await supabase
      .from('membership_items')
      .delete()
      .eq('id', itemId)

    if (!error) {
      getMembershipItems(searchTerm)
    }
  }

  const handleUpdateMembershipItem = async (id: string, data: Partial<MembershipItem>) => {
    const { error } = await supabase
      .from('membership_items')
      .update(data)
      .eq('id', id)
      .eq('user_id', user.id)

    if (!error) {
      getMembershipItems(searchTerm)
    } else {
      console.error('Error updating membership item:', error)
    }
  }

  // Expenses handlers
  const handleAddSpentItem = async (data: any) => {
    if (!user) return

    const { error } = await supabase
      .from('spent_items')
      .insert({
        item: data.item,
        amount: data.amount,
        paid: data.paid || 0,
        due: data.due || 0,
        comment: data.comment || '',
        user_id: user.id,
      })

    if (!error) {
      getSpentItems(searchTerm)
    }
  }

  const handleDeleteSpentItem = async (itemId: string) => {
    const { error } = await supabase
      .from('spent_items')
      .delete()
      .eq('id', itemId)

    if (!error) {
      getSpentItems(searchTerm)
    }
  }

  const handleUpdateSpentItem = async (id: string, data: Partial<SpentItem>) => {
    const { error } = await supabase
      .from('spent_items')
      .update(data)
      .eq('id', id)
      .eq('user_id', user.id)

    if (!error) {
      getSpentItems(searchTerm)
    } else {
      console.error('Error updating spent item:', error)
    }
  }

  // Donations handlers
  const handleAddDonationItem = async (data: any) => {
    if (!user) return

    const { error } = await supabase
      .from('donation_items')
      .insert({
        name: data.name,
        amount: data.amount,
        paid: data.paid || 0,
        due: data.due || 0,
        comment: data.comment || '',
        user_id: user.id,
      })

    if (!error) {
      getDonationItems(searchTerm)
    }
  }

  const handleDeleteDonationItem = async (itemId: string) => {
    const { error } = await supabase
      .from('donation_items')
      .delete()
      .eq('id', itemId)

    if (!error) {
      getDonationItems(searchTerm)
    }
  }

  const handleUpdateDonationItem = async (id: string, data: Partial<DonationItem>) => {
    const { error } = await supabase
      .from('donation_items')
      .update(data)
      .eq('id', id)
      .eq('user_id', user.id)

    if (!error) {
      getDonationItems(searchTerm)
    } else {
      console.error('Error updating donation item:', error)
    }
  }

  // Dues handlers
  const handleAddDuesItem = async (data: any) => {
    if (!user) return

    const { error } = await supabase
      .from('dues_items')
      .insert({
        name: data.name,
        amount: data.amount,
        paid: data.paid || 0,
        due: data.due || 0,
        comment: data.comment || '',
        user_id: user.id,
      })

    if (!error) {
      getDuesItems(searchTerm)
    }
  }

  const handleDeleteDuesItem = async (itemId: string) => {
    const { error } = await supabase
      .from('dues_items')
      .delete()
      .eq('id', itemId)

    if (!error) {
      getDuesItems(searchTerm)
    }
  }

  const handleUpdateDuesItem = async (id: string, data: Partial<DuesItem>) => {
    const { error } = await supabase
      .from('dues_items')
      .update(data)
      .eq('id', id)
      .eq('user_id', user.id)

    if (!error) {
      getDuesItems(searchTerm)
    } else {
      console.error('Error updating dues item:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-gray-200"></div>
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-600 absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 text-lg font-medium text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <Header onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Navigation - Desktop Tabs / Mobile Hamburger */}
        <div className="mb-6 sm:mb-8">
          {/* Desktop Tabs - Hidden on Mobile */}
          <div className="hidden md:block">
            <div className="bg-white/60 backdrop-blur-lg rounded-xl p-2 shadow-lg border border-white/20">
              <nav className="flex space-x-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id)
                        setShowAddForm(false)
                        setSearchTerm('')
                      }}
                      className={`flex items-center gap-2 whitespace-nowrap py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex-shrink-0 ${
                        activeTab === tab.id
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                          : `${tab.bgColor} ${tab.textColor} hover:shadow-md hover:scale-102`
                      }`}
                    >
                      <IconComponent size={18} />
                      {tab.name}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <div className="bg-white/60 backdrop-blur-lg rounded-xl shadow-lg border border-white/20">
              {/* Hamburger Button and Current Tab */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {(() => {
                    const currentTab = tabs.find(tab => tab.id === activeTab)
                    const IconComponent = currentTab?.icon || ShoppingBag
                    return (
                      <>
                        <div className={`p-2 rounded-lg ${currentTab?.bgColor} ${currentTab?.textColor}`}>
                          <IconComponent size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">{currentTab?.name}</h2>
                      </>
                    )
                  })()}
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-3 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors text-gray-800 flex items-center justify-center shadow-sm min-w-[44px] min-h-[44px]"
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {isMobileMenuOpen ? (
                    <X size={20} className="text-gray-800 stroke-current" />
                  ) : (
                    <Menu size={20} className="text-gray-800 stroke-current" />
                  )}
                </button>
              </div>

              {/* Mobile Menu Dropdown */}
              {isMobileMenuOpen && (
                <div className="border-t border-gray-200 bg-white/80 backdrop-blur-lg">
                  <nav className="p-2 space-y-1">
                    {tabs.map((tab) => {
                      const IconComponent = tab.icon
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id)
                            setShowAddForm(false)
                            setSearchTerm('')
                            setIsMobileMenuOpen(false)
                          }}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                            activeTab === tab.id
                              ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                              : `${tab.bgColor} ${tab.textColor} hover:shadow-md`
                          }`}
                        >
                          <IconComponent size={18} />
                          {tab.name}
                        </button>
                      )
                    })}
                    
                    {/* Logout Button */}
                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsMobileMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg font-medium text-sm transition-all duration-200 bg-red-50 text-red-600 hover:bg-red-100 hover:shadow-md"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl border-2 border-gray-200/60 shadow-gray-200/50 overflow-hidden p-6">
          {activeTab === 'auction' && (
            <Auction
              items={auctionItems}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              showAddForm={showAddForm}
              onShowAddForm={setShowAddForm}
              onAddItem={handleAddAuctionItem}
              onDeleteItem={handleDeleteAuctionItem}
              onUpdateItem={handleUpdateAuctionItem}
            />
          )}

          {activeTab === 'membership' && (
            <Membership
              items={membershipItems}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              showAddForm={showAddForm}
              onShowAddForm={setShowAddForm}
              onAddItem={handleAddMembershipItem}
              onDeleteItem={handleDeleteMembershipItem}
              onUpdateItem={handleUpdateMembershipItem}
            />
          )}

          {activeTab === 'expenses' && (
            <Expenses
              items={spentItems}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              showAddForm={showAddForm}
              onShowAddForm={setShowAddForm}
              onAddItem={handleAddSpentItem}
              onDeleteItem={handleDeleteSpentItem}
              onUpdateItem={handleUpdateSpentItem}
            />
          )}

          {activeTab === 'donations' && (
            <Donations
              items={donationItems}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              showAddForm={showAddForm}
              onShowAddForm={setShowAddForm}
              onAddItem={handleAddDonationItem}
              onDeleteItem={handleDeleteDonationItem}
              onUpdateItem={handleUpdateDonationItem}
            />
          )}

          {activeTab === 'dues' && (
            <Dues
              items={duesItems}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              showAddForm={showAddForm}
              onShowAddForm={setShowAddForm}
              onAddItem={handleAddDuesItem}
              onDeleteItem={handleDeleteDuesItem}
              onUpdateItem={handleUpdateDuesItem}
            />
          )}

          {activeTab === 'analytics' && (
            <Analytics
              auctionItems={auctionItems}
              membershipItems={membershipItems}
              spentItems={spentItems}
              donationItems={donationItems}
              duesItems={duesItems}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
