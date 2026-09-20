'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Dues from '@/components/Dues'
import { useYear } from '@/context/YearContext'
import { useAccess } from '@/context/AccessContext'

// Define types for dues items
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

export default function DuesPage() {
  const { selectedYear } = useYear()
  const { user, isAdmin } = useAccess()
  const [duesItems, setDuesItems] = useState<DuesItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    getDuesItems(searchTerm)
  }, [user, searchTerm, selectedYear])

  const getDuesItems = async (search?: string) => {
    let query = supabase
      .from('dues_items')
      .select('*')
      .eq('year', selectedYear)
      .order('created_at', { ascending: false })

    if (user) query = query.eq('user_id', user.id)

    if (search) {
      query = query.or(`name.ilike.%${search}%,comment.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching dues items:', error)
    } else {
      setDuesItems(data)
    }
  }

  const addDuesItem = async (data: { name: string; amount: number; paid?: number; comment?: string }) => {
    if (!user) return

    const paid = data.paid || 0
    const due = data.amount - paid

    const { error } = await supabase
      .from('dues_items')
      .insert([{ 
        ...data, 
        paid,
        due,
        user_id: user.id,
        year: selectedYear
      }])

    if (error) {
      console.error('Error adding dues item:', error)
    } else {
      getDuesItems(searchTerm)
    }
  }

  const updateDuesItem = async (id: string, updates: Partial<DuesItem>) => {
    const { error } = await supabase
      .from('dues_items')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user?.id)

    if (error) {
      console.error('Error updating dues item:', error)
    } else {
      getDuesItems(searchTerm)
    }
  }

  const deleteDuesItem = async (id: string) => {
    const { error } = await supabase
      .from('dues_items')
      .delete()
      .eq('id', id)
      .eq('user_id', user?.id)

    if (error) {
      console.error('Error deleting dues item:', error)
    } else {
      getDuesItems(searchTerm)
    }
  }

  return (
    <div className="dashboard-detail-page space-y-6">
        <h1 className="px-4 pt-5 text-xl font-bold text-slate-100 sm:px-0 sm:pt-0">Dues Management — {selectedYear}</h1>
      
      <Dues
        items={duesItems}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showAddForm={showAddForm}
        onShowAddForm={setShowAddForm}
        onAddItem={addDuesItem}
        onUpdateItem={updateDuesItem}
        onDeleteItem={deleteDuesItem}
        canManage={isAdmin}
      />
    </div>
  )
}
