'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Donations from '@/components/Donations'

// Define types for donation items
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

export default function DonationsPage() {
  const [user, setUser] = useState<any>(null)
  const [donationItems, setDonationItems] = useState<DonationItem[]>([])
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
      getDonationItems(searchTerm)
    }
  }, [user, searchTerm])

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
    } else {
      router.push('/auth/login')
    }
    setLoading(false)
  }

  const getDonationItems = async (search?: string) => {
    if (!user) return
    
    let query = supabase
      .from('donation_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

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
        user_id: user.id 
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
        <h1 className="text-xl font-bold text-gray-600">Donations Management</h1>
      
      <Donations
        items={donationItems}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showAddForm={showAddForm}
        onShowAddForm={setShowAddForm}
        onAddItem={addDonationItem}
        onUpdateItem={updateDonationItem}
        onDeleteItem={deleteDonationItem}
      />
    </div>
  )
}
