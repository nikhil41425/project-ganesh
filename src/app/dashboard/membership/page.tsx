'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Membership from '@/components/Membership'

// Define types for membership items
interface MembershipItem {
  id: string
  name: string
  amount: number
  due: number
  comment: string
  paid: number
  user_id: string
  created_at: string
  updated_at: string
}

export default function MembershipPage() {
  const [user, setUser] = useState<any>(null)
  const [membershipItems, setMembershipItems] = useState<MembershipItem[]>([])
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
      getMembershipItems(searchTerm)
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

  const getMembershipItems = async (search?: string) => {
    if (!user) return
    
    let query = supabase
      .from('membership_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

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
        user_id: user.id 
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
        <h1 className="text-xl font-bold text-gray-600 text-gary-600">Membership Management</h1>
      
      <Membership
        items={membershipItems}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showAddForm={showAddForm}
        onShowAddForm={setShowAddForm}
        onAddItem={addMembershipItem}
        onUpdateItem={updateMembershipItem}
        onDeleteItem={deleteMembershipItem}
      />
    </div>
  )
}
