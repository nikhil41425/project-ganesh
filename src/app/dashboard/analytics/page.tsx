'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Analytics from '@/components/Analytics'

// Define types for data items
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

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null)
  const [auctionItems, setAuctionItems] = useState<AuctionItem[]>([])
  const [membershipItems, setMembershipItems] = useState<MembershipItem[]>([])
  const [spentItems, setSpentItems] = useState<SpentItem[]>([])
  const [donationItems, setDonationItems] = useState<DonationItem[]>([])
  const [duesItems, setDuesItems] = useState<DuesItem[]>([])
  const [loading, setLoading] = useState(true)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    if (user) {
      getAllDataForAnalytics()
    }
  }, [user])

  // Function to load all data for analytics
  const getAllDataForAnalytics = async () => {
    if (!user) return
    
    // Load all data in parallel
    await Promise.all([
      getAuctionItems(),
      getMembershipItems(),
      getSpentItems(),
      getDonationItems(),
      getDuesItems()
    ])
  }

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
    } else {
      router.push('/auth/login')
    }
    setLoading(false)
  }

  const getAuctionItems = async () => {
    if (!user) return
    
    const { data, error } = await supabase
      .from('auction_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching auction items:', error)
    } else {
      setAuctionItems(data || [])
    }
  }

  const getMembershipItems = async () => {
    if (!user) return
    
    const { data, error } = await supabase
      .from('membership_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching membership items:', error)
    } else {
      setMembershipItems(data || [])
    }
  }

  const getSpentItems = async () => {
    if (!user) return
    
    const { data, error } = await supabase
      .from('spent_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching spent items:', error)
    } else {
      setSpentItems(data || [])
    }
  }

  const getDonationItems = async () => {
    if (!user) return
    
    const { data, error } = await supabase
      .from('donation_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching donation items:', error)
    } else {
      setDonationItems(data || [])
    }
  }

  const getDuesItems = async () => {
    if (!user) return
    
    const { data, error } = await supabase
      .from('dues_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching dues items:', error)
    } else {
      setDuesItems(data || [])
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      
      <Analytics
        auctionItems={auctionItems}
        membershipItems={membershipItems}
        spentItems={spentItems}
        donationItems={donationItems}
        duesItems={duesItems}
      />
    </div>
  )
}
