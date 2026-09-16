'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Analytics from '@/components/Analytics'
import { useYear } from '@/context/YearContext'
import type { 
  AuctionItem, 
  MembershipItem, 
  SpentItem, 
  DonationItem, 
  DuesItem
} from '@/types'

export default function DashboardPage() {
  const { selectedYear } = useYear()
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
  }, [user, selectedYear])

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
      .eq('year', selectedYear)
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
      .eq('year', selectedYear)
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
      .eq('year', selectedYear)
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
      .eq('year', selectedYear)
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
      .eq('year', selectedYear)
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
    <div>
      <Analytics
        auctionItems={auctionItems}
        membershipItems={membershipItems}
        spentItems={spentItems}
        donationItems={donationItems}
        duesItems={duesItems}
        year={selectedYear}
      />
    </div>
  )
}
