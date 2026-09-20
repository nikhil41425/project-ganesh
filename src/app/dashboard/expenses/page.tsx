'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Expenses from '@/components/Expenses'
import { useYear } from '@/context/YearContext'
import { useAccess } from '@/context/AccessContext'

// Define types for spent items
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

export default function ExpensesPage() {
  const { selectedYear } = useYear()
  const { user, isAdmin } = useAccess()
  const [spentItems, setSpentItems] = useState<SpentItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    getSpentItems(searchTerm)
  }, [user, searchTerm, selectedYear])

  const getSpentItems = async (search?: string) => {
    let query = supabase
      .from('spent_items')
      .select('*')
      .eq('year', selectedYear)
      .order('created_at', { ascending: false })

    if (user) query = query.eq('user_id', user.id)

    if (search) {
      query = query.or(`item.ilike.%${search}%,comment.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching spent items:', error)
    } else {
      setSpentItems(data)
    }
  }

  const addSpentItem = async (data: { item: string; amount: number; paid?: number; comment?: string }) => {
    if (!user) return

    const paid = data.paid || 0
    const due = data.amount - paid

    const { error } = await supabase
      .from('spent_items')
      .insert([{ 
        ...data, 
        paid,
        due,
        user_id: user.id,
        year: selectedYear
      }])

    if (error) {
      console.error('Error adding spent item:', error)
    } else {
      getSpentItems(searchTerm)
    }
  }

  const updateSpentItem = async (id: string, updates: Partial<SpentItem>) => {
    const { error } = await supabase
      .from('spent_items')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user?.id)

    if (error) {
      console.error('Error updating spent item:', error)
    } else {
      getSpentItems(searchTerm)
    }
  }

  const deleteSpentItem = async (id: string) => {
    const { error } = await supabase
      .from('spent_items')
      .delete()
      .eq('id', id)
      .eq('user_id', user?.id)

    if (error) {
      console.error('Error deleting spent item:', error)
    } else {
      getSpentItems(searchTerm)
    }
  }

  return (
    <div className="dashboard-detail-page space-y-6">
        <h1 className="px-4 pt-5 text-xl font-bold text-slate-100 sm:px-0 sm:pt-0">Expenses (కర్చులు) — {selectedYear}</h1>
      
      <Expenses
        items={spentItems}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showAddForm={showAddForm}
        onShowAddForm={setShowAddForm}
        onAddItem={addSpentItem}
        onUpdateItem={updateSpentItem}
        onDeleteItem={deleteSpentItem}
        canManage={isAdmin}
      />
    </div>
  )
}
