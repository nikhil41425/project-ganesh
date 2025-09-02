'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Expenses from '@/components/Expenses'

// Define types for spent items
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

export default function ExpensesPage() {
  const [user, setUser] = useState<any>(null)
  const [spentItems, setSpentItems] = useState<SpentItem[]>([])
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
      getSpentItems(searchTerm)
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

  const getSpentItems = async (search?: string) => {
    if (!user) return
    
    let query = supabase
      .from('spent_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

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
        user_id: user.id 
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
        <h1 className="text-xl font-bold text-gray-600">Expenses (కర్చులు)</h1>
      
      <Expenses
        items={spentItems}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showAddForm={showAddForm}
        onShowAddForm={setShowAddForm}
        onAddItem={addSpentItem}
        onUpdateItem={updateSpentItem}
        onDeleteItem={deleteSpentItem}
      />
    </div>
  )
}
