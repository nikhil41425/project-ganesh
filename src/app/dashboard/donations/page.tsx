'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Donations from '@/components/Donations'
import { useYear } from '@/context/YearContext'
import { useAccess } from '@/context/AccessContext'

// Define types for donation items
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

export default function DonationsPage() {
  const { selectedYear } = useYear()
  const { user, isAdmin } = useAccess()
  const [donationItems, setDonationItems] = useState<DonationItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    getDonationItems(searchTerm)
  }, [user, searchTerm, selectedYear])

  const getDonationItems = async (search?: string) => {
    let query = supabase
      .from('donation_items')
      .select('*')
      .eq('year', selectedYear)
      .order('created_at', { ascending: false })

    if (user) query = query.eq('user_id', user.id)

    if (search) {
      query = query.or(`name.ilike.%${search}%,comment.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching donation items:', error)
    } else {
      setDonationItems(data)
    }
  }

  const addDonationItem = async (data: { name: string; amount: number; paid?: number; comment?: string }) => {
    if (!user) return

    const paid = data.paid || 0
    const due = data.amount - paid

    const { error } = await supabase
      .from('donation_items')
      .insert([{ 
        ...data, 
        paid,
        due,
        user_id: user.id,
        year: selectedYear
      }])

    if (error) {
      console.error('Error adding donation item:', error)
    } else {
      getDonationItems(searchTerm)
    }
  }

  const updateDonationItem = async (id: string, updates: Partial<DonationItem>) => {
    const { error } = await supabase
      .from('donation_items')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user?.id)

    if (error) {
      console.error('Error updating donation item:', error)
    } else {
      getDonationItems(searchTerm)
    }
  }

  const deleteDonationItem = async (id: string) => {
    const { error } = await supabase
      .from('donation_items')
      .delete()
      .eq('id', id)
      .eq('user_id', user?.id)

    if (error) {
      console.error('Error deleting donation item:', error)
    } else {
      getDonationItems(searchTerm)
    }
  }

  return (
    <div className="dashboard-detail-page space-y-6">
        <h1 className="px-4 pt-5 text-xl font-bold text-slate-100 sm:px-0 sm:pt-0">Donations (చంద) — {selectedYear}</h1>
      
      <Donations
        items={donationItems}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showAddForm={showAddForm}
        onShowAddForm={setShowAddForm}
        onAddItem={addDonationItem}
        onUpdateItem={updateDonationItem}
        onDeleteItem={deleteDonationItem}
        canManage={isAdmin}
      />
    </div>
  )
}
