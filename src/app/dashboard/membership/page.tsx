'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Membership from '@/components/Membership'
import { useYear } from '@/context/YearContext'
import { useAccess } from '@/context/AccessContext'

// Define types for membership items
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

export default function MembershipPage() {
  const { selectedYear } = useYear()
  const { user, isAdmin } = useAccess()
  const [membershipItems, setMembershipItems] = useState<MembershipItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    getMembershipItems(searchTerm)
  }, [user, searchTerm, selectedYear])

  const getMembershipItems = async (search?: string) => {
    let query = supabase
      .from('membership_items')
      .select('*')
      .eq('year', selectedYear)
      .order('created_at', { ascending: false })

    if (user) query = query.eq('user_id', user.id)

    if (search) {
      query = query.or(`name.ilike.%${search}%,comment.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching membership items:', error)
    } else {
      setMembershipItems(data)
    }
  }

  const addMembershipItem = async (data: { name: string; amount: number; paid?: number; comment?: string }) => {
    if (!user) return

    const paid = data.paid || 0
    const due = data.amount - paid

    const { error } = await supabase
      .from('membership_items')
      .insert([{ 
        ...data, 
        paid,
        due,
        user_id: user.id,
        year: selectedYear
      }])

    if (error) {
      console.error('Error adding membership item:', error)
    } else {
      getMembershipItems(searchTerm)
    }
  }

  const updateMembershipItem = async (id: string, updates: Partial<MembershipItem>) => {
    const { error } = await supabase
      .from('membership_items')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user?.id)

    if (error) {
      console.error('Error updating membership item:', error)
    } else {
      getMembershipItems(searchTerm)
    }
  }

  const deleteMembershipItem = async (id: string) => {
    const { error } = await supabase
      .from('membership_items')
      .delete()
      .eq('id', id)
      .eq('user_id', user?.id)

    if (error) {
      console.error('Error deleting membership item:', error)
    } else {
      getMembershipItems(searchTerm)
    }
  }

  return (
    <div className="dashboard-detail-page space-y-6">
        <h1 className="px-4 pt-5 text-xl font-bold text-slate-100 sm:px-0 sm:pt-0">Membership (సబ్యత్వం) — {selectedYear}</h1>
      
      <Membership
        items={membershipItems}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showAddForm={showAddForm}
        onShowAddForm={setShowAddForm}
        onAddItem={addMembershipItem}
        onUpdateItem={updateMembershipItem}
        onDeleteItem={deleteMembershipItem}
        canManage={isAdmin}
      />
    </div>
  )
}
