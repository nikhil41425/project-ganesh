'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Analytics from '@/components/Analytics'
import { useYear } from '@/context/YearContext'
import { useAccess } from '@/context/AccessContext'

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
  year: number
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
  year: number
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
  year: number
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
  year: number
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
  year: number
  created_at: string
  updated_at: string
}

export default function AnalyticsPage() {
  const { selectedYear } = useYear()
  const { user } = useAccess()
  const [auctionItems, setAuctionItems] = useState<AuctionItem[]>([])
  const [membershipItems, setMembershipItems] = useState<MembershipItem[]>([])
  const [spentItems, setSpentItems] = useState<SpentItem[]>([])
  const [donationItems, setDonationItems] = useState<DonationItem[]>([])
  const [duesItems, setDuesItems] = useState<DuesItem[]>([])
  const supabase = createClient()

  useEffect(() => {
    getAllDataForAnalytics()
  }, [user, selectedYear])

  // Function to load all data for analytics
  const getAllDataForAnalytics = async () => {
    // Load all data in parallel
    await Promise.all([
      getAuctionItems(),
      getMembershipItems(),
      getSpentItems(),
      getDonationItems(),
      getDuesItems()
    ])
  }

  const getAuctionItems = async () => {
    let query = supabase
      .from('auction_items')
      .select('*')
      .eq('year', selectedYear)
      .order('created_at', { ascending: false })
    if (user) query = query.eq('user_id', user.id)
    const { data, error } = await query

    if (error) {
      console.error('Error fetching auction items:', error)
    } else {
      setAuctionItems(data || [])
    }
  }

  const getMembershipItems = async () => {
    let query = supabase
      .from('membership_items')
      .select('*')
      .eq('year', selectedYear)
      .order('created_at', { ascending: false })
    if (user) query = query.eq('user_id', user.id)
    const { data, error } = await query

    if (error) {
      console.error('Error fetching membership items:', error)
    } else {
      setMembershipItems(data || [])
    }
  }

  const getSpentItems = async () => {
    let query = supabase
      .from('spent_items')
      .select('*')
      .eq('year', selectedYear)
      .order('created_at', { ascending: false })
    if (user) query = query.eq('user_id', user.id)
    const { data, error } = await query

    if (error) {
      console.error('Error fetching spent items:', error)
    } else {
      setSpentItems(data || [])
    }
  }

  const getDonationItems = async () => {
    let query = supabase
      .from('donation_items')
      .select('*')
      .eq('year', selectedYear)
      .order('created_at', { ascending: false })
    if (user) query = query.eq('user_id', user.id)
    const { data, error } = await query

    if (error) {
      console.error('Error fetching donation items:', error)
    } else {
      setDonationItems(data || [])
    }
  }

  const getDuesItems = async () => {
    let query = supabase
      .from('dues_items')
      .select('*')
      .eq('year', selectedYear)
      .order('created_at', { ascending: false })
    if (user) query = query.eq('user_id', user.id)
    const { data, error } = await query

    if (error) {
      console.error('Error fetching dues items:', error)
    } else {
      setDuesItems(data || [])
    }
  }

  return (
    <div className="space-y-6">
      
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
