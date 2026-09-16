'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Auction from '@/components/Auction'
import { useYear } from '@/context/YearContext'

// Define types for auction items
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

export default function AuctionPage() {
  const { selectedYear } = useYear()
  const [user, setUser] = useState<any>(null)
  const [auctionItems, setAuctionItems] = useState<AuctionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    if (user) {
      getAuctionItems(searchTerm)
    }
  }, [user, searchTerm, selectedYear])

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
      .eq('year', selectedYear)
      .order('created_at', { ascending: false })

    if (search) {
      query = query.or(`name.ilike.%${search}%,item.ilike.%${search}%,comment.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching auction items:', error)
    } else {
      setAuctionItems(data)
    }
  }

  const addAuctionItem = async (data: { name: string; item: string; amount: number; paid?: number; comment?: string }) => {
    if (!user) return

    const paid = data.paid || 0
    const due = data.amount - paid

    const { error } = await supabase
      .from('auction_items')
      .insert([{ 
        ...data, 
        paid,
        due,
        user_id: user.id,
        year: selectedYear
      }])

    if (error) {
      console.error('Error adding auction item:', error)
    } else {
      getAuctionItems(searchTerm)
    }
  }

  const updateAuctionItem = async (id: string, updates: Partial<AuctionItem>) => {
    const { error } = await supabase
      .from('auction_items')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user?.id)

    if (error) {
      console.error('Error updating auction item:', error)
    } else {
      getAuctionItems(searchTerm)
    }
  }

  const deleteAuctionItem = async (id: string) => {
    const { error } = await supabase
      .from('auction_items')
      .delete()
      .eq('id', id)
      .eq('user_id', user?.id)

    if (error) {
      console.error('Error deleting auction item:', error)
    } else {
      getAuctionItems(searchTerm)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="dashboard-detail-page space-y-6">
        <h1 className="px-4 pt-5 text-xl font-bold text-slate-100 sm:px-0 sm:pt-0">Auction (సవాల్) — {selectedYear}</h1>
      
      <Auction
        items={auctionItems}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showAddForm={showAddForm}
        onShowAddForm={setShowAddForm}
        onAddItem={addAuctionItem}
        onUpdateItem={updateAuctionItem}
        onDeleteItem={deleteAuctionItem}
      />
    </div>
  )
}
