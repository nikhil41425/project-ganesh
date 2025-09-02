'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Dues from '@/components/Dues'

// Define types for dues items
interface DuesItem {
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

export default function DuesPage() {
  const [user, setUser] = useState<any>(null)
  const [duesItems, setDuesItems] = useState<DuesItem[]>([])
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
      getDuesItems(searchTerm)
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

  const getDuesItems = async (search?: string) => {
    if (!user) return
    
    let query = supabase
      .from('dues_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

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
        user_id: user.id 
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
        <h1 className="text-xl font-bold text-gray-600">Dues Management</h1>
      
      <Dues
        items={duesItems}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showAddForm={showAddForm}
        onShowAddForm={setShowAddForm}
        onAddItem={addDuesItem}
        onUpdateItem={updateDuesItem}
        onDeleteItem={deleteDuesItem}
      />
    </div>
  )
}
