'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Auction from '@/components/Auction'
import { useYear } from '@/context/YearContext'
import { useAccess } from '@/context/AccessContext'

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
  const { user, isAdmin } = useAccess()
  const [auctionItems, setAuctionItems] = useState<AuctionItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    getAuctionItems(searchTerm)
  }, [user, searchTerm, selectedYear])

  const getAuctionItems = async (search?: string) => {
    let query = supabase
      .from('auction_items')
      .select('*')
      .eq('year', selectedYear)
      .order('created_at', { ascending: false })

    if (user) query = query.eq('user_id', user.id)

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
        canManage={isAdmin}
      />
    </div>
  )
}
