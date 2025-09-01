'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Trash2, Edit2, Save, X, Plus, Users, Search } from 'lucide-react'
import { isEditEnabled, isDeleteEnabled } from '@/lib/config'

// Define types
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

// Form schema
const membershipItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  comment: z.string().optional(),
  paid: z.number().min(0, 'Paid amount must be positive').optional(),
})

type MembershipItemForm = z.infer<typeof membershipItemSchema>

// Currency formatter for INR
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

interface MembershipProps {
  items: MembershipItem[]
  searchTerm: string
  onSearchChange: (term: string) => void
  showAddForm: boolean
  onShowAddForm: (show: boolean) => void
  onAddItem: (data: MembershipItemForm) => Promise<void>
  onDeleteItem: (id: string) => Promise<void>
  onUpdateItem: (id: string, data: Partial<MembershipItem>) => Promise<void>
}

export default function Membership({
  items,
  searchTerm,
  onSearchChange,
  showAddForm,
  onShowAddForm,
  onAddItem,
  onDeleteItem,
  onUpdateItem
}: MembershipProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<any>(null)

  const form = useForm<MembershipItemForm>({
    resolver: zodResolver(membershipItemSchema),
    defaultValues: {
      name: '',
      amount: undefined,
      comment: '',
      paid: undefined,
    },
  })

  const startEditing = (item: MembershipItem) => {
    setEditingItem(item.id)
    setEditFormData({ ...item })
  }

  const cancelEditing = () => {
    setEditingItem(null)
    setEditFormData(null)
  }

  const handleEditFormChange = (field: string, value: any) => {
    setEditFormData((prev: any) => {
      const updated = {
        ...prev,
        [field]: value
      }
      
      // Auto-calculate due when amount or paid changes
      if (field === 'amount' || field === 'paid') {
        const amount = field === 'amount' ? value : (prev?.amount || 0)
        const paid = field === 'paid' ? value : (prev?.paid || 0)
        updated.due = Math.max(0, amount - paid)
      }
      
      return updated
    })
  }

  const saveEdit = () => {
    if (!editingItem || !editFormData) return
    const { id, created_at, updated_at, user_id, ...updateData } = editFormData
    // Ensure due is calculated correctly before saving
    updateData.due = Math.max(0, (updateData.amount || 0) - (updateData.paid || 0))
    onUpdateItem(editingItem, updateData)
    setEditingItem(null)
    setEditFormData(null)
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const handleAddSubmit = async (data: MembershipItemForm) => {
    // Calculate due amount automatically
    const due = Math.max(0, data.amount - (data.paid || 0))
    const itemWithDue = { ...data, due }
    await onAddItem(itemWithDue)
    form.reset()
    onShowAddForm(false)
  }

  const calculateSummary = () => {
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)
    const totalPaid = items.reduce((sum, item) => sum + item.paid, 0)
    const totalDue = items.reduce((sum, item) => sum + item.due, 0)
    const totalMembers = items.length
    return { totalAmount, totalPaid, totalDue, totalMembers }
  }

  const { totalAmount, totalPaid, totalDue, totalMembers } = calculateSummary()

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-2 md:p-6 text-white shadow-lg">
          <h3 className="text-xs md:text-sm font-medium opacity-90">Members</h3>
          <p className="text-sm md:text-2xl font-bold">{totalMembers}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-2 md:p-6 text-white shadow-lg">
          <h3 className="text-xs md:text-sm font-medium opacity-90">Amount</h3>
          <p className="text-sm md:text-2xl font-bold">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-2 md:p-6 text-white shadow-lg">
          <h3 className="text-xs md:text-sm font-medium opacity-90">Paid</h3>
          <p className="text-sm md:text-2xl font-bold">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-2 md:p-6 text-white shadow-lg">
          <h3 className="text-xs md:text-sm font-medium opacity-90">Due</h3>
          <p className="text-sm md:text-2xl font-bold">{formatCurrency(totalDue)}</p>
        </div>
      </div>

      {/* Header with Search and Add Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Membership
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white input-visible shadow-sm text-gray-800 placeholder-gray-500"
            />
          </div>
          <button
            onClick={() => onShowAddForm(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={16} />
            Add Member
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white input-visible rounded-lg p-6 shadow-lg border border-white/20">
          <form
            onSubmit={form.handleSubmit(handleAddSubmit)}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
          >
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input
                {...form.register('name')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white input-visible shadow-sm transition-all duration-200 text-gray-800 placeholder-gray-500"
                placeholder="Enter name"
              />
              {form.formState.errors.name && (
                <p className="mt-2 text-xs text-red-600 font-medium">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₹)</label>
              <input
                {...form.register('amount', { valueAsNumber: true })}
                type="number"
                step="1"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white input-visible shadow-sm transition-all duration-200 text-gray-800 placeholder-gray-500"
                placeholder="0"
              />
              {form.formState.errors.amount && (
                <p className="mt-2 text-xs text-red-600 font-medium">{form.formState.errors.amount.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Comment <span className="text-gray-500 font-normal">(optional)</span></label>
              <input
                {...form.register('comment')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white input-visible shadow-sm transition-all duration-200 text-gray-800 placeholder-gray-500"
                placeholder="Enter comment"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Paid (₹) <span className="text-gray-500 font-normal">(optional)</span></label>
              <input
                {...form.register('paid', { valueAsNumber: true })}
                type="number"
                step="1"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white input-visible shadow-sm transition-all duration-200 text-gray-800 placeholder-gray-500"
                placeholder="0"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:col-span-2 lg:col-span-3 xl:col-span-1">
              <button type="submit" className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">Add</button>
              <button type="button" onClick={() => { onShowAddForm(false); form.reset() }} className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Items Table */}
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200/50 min-w-[1160px]">
              <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px] border-r border-gray-200">Name</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] border-r border-gray-200">Amount</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] border-r border-gray-200">Due</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] border-r border-gray-200">Paid</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px] border-r border-gray-200">Comment</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px] border-r border-gray-200">Created</th>
                  {/* <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px] border-r border-gray-200">Updated</th> */}
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white/60 backdrop-blur-sm divide-y divide-gray-200/30">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-500 text-sm">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="p-4 bg-gray-100 rounded-full">
                          <Users size={24} className="text-gray-400" />
                        </div>
                        <p className="font-medium">No members added yet</p>
                        <p className="text-xs text-gray-400">Click &quot;Add Member&quot; to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const isEditing = editingItem === item.id
                    return (
                      <tr key={item.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                        <td className="px-3 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editFormData?.name || ''}
                              onChange={(e) => handleEditFormChange('name', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-white input-visible focus:ring-1 focus:ring-blue-500 focus:border-transparent text-gray-800"
                            />
                          ) : (
                            <div className="truncate font-semibold" title={item.name}>{item.name}</div>
                          )}
                        </td>
                        <td className="px-3 py-4 text-sm font-semibold text-gray-900 border-r border-gray-200">
                          {isEditing ? (
                            <input
                              type="number"
                              step="1"
                              value={editFormData?.amount || 0}
                              onChange={(e) => handleEditFormChange('amount', parseInt(e.target.value) || 0)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-white input-visible focus:ring-1 focus:ring-blue-500 focus:border-transparent text-gray-800"
                            />
                          ) : (
                            <div className="text-blue-600 font-bold">₹{item.amount}</div>
                          )}
                        </td>
                        <td className="px-3 py-4 text-sm font-semibold text-gray-900 border-r border-gray-200">
                          <div className="text-red-600 font-bold">₹{isEditing ? (editFormData?.due || 0) : item.due}</div>
                        </td>
                        <td className="px-3 py-4 text-sm font-semibold text-gray-900 border-r border-gray-200">
                          {isEditing ? (
                            <input
                              type="number"
                              step="1"
                              value={editFormData?.paid || 0}
                              onChange={(e) => handleEditFormChange('paid', parseInt(e.target.value) || 0)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-white input-visible focus:ring-1 focus:ring-blue-500 focus:border-transparent text-gray-800"
                            />
                          ) : (
                            <div className="text-green-600 font-bold">₹{item.paid}</div>
                          )}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-900 border-r border-gray-200">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editFormData?.comment || ''}
                              onChange={(e) => handleEditFormChange('comment', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-white input-visible focus:ring-1 focus:ring-blue-500 focus:border-transparent text-gray-800"
                            />
                          ) : (
                            <div className="truncate text-gray-600" title={item.comment}>{item.comment || '-'}</div>
                          )}
                        </td>
                        <td className="px-2 py-4 text-sm text-gray-400 border-r border-gray-200">
                          <div className="truncate">{formatDateTime(item.created_at)}</div>
                        </td>
                        {/* <td className="px-2 py-4 text-sm text-gray-400 border-r border-gray-200">
                          <div className="truncate">{formatDateTime(item.updated_at)}</div>
                        </td> */}
                        <td className="px-3 py-4 text-sm font-medium">
                          <div className="flex gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={saveEdit}
                                  className="text-green-600 hover:text-green-800 hover:bg-green-100 p-2 rounded transition-all duration-200"
                                  title="Save"
                                >
                                  <Save size={16} />
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 rounded transition-all duration-200"
                                  title="Cancel"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            ) : (
                              <>
                                {isEditEnabled() && (
                                  <button
                                    onClick={() => startEditing(item)}
                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-2 rounded transition-all duration-200"
                                    title="Edit"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                )}
                                {isDeleteEnabled() && (
                                  <button
                                    onClick={() => onDeleteItem(item.id)}
                                    className="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded transition-all duration-200"
                                    title="Delete"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View - Table Format */}
        <div className="md:hidden">
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Users size={24} className="text-gray-400" />
                </div>
                <p className="font-medium">No members added yet</p>
                <p className="text-xs text-gray-400">Click &quot;Add Member&quot; to get started</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200/50 min-w-[700px]">
                <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm">
                  <tr>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] border-r border-gray-200">Name</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px] border-r border-gray-200">Amount</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px] border-r border-gray-200">Due</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px] border-r border-gray-200">Paid</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] border-r border-gray-200">Comment</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[90px] border-r border-gray-200">Created</th>
                    {/* <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[90px] border-r border-gray-200">Updated</th> */}
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white/60 backdrop-blur-sm divide-y divide-gray-200/30">
                  {items.map((item) => {
                    const isEditing = editingItem === item.id
                    return (
                      <tr key={item.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                        <td className="px-2 py-3 text-sm border-r border-gray-200">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editFormData?.name || ''}
                              onChange={(e) => handleEditFormChange('name', e.target.value)}
                              className="w-full px-1 py-1 border border-gray-300 rounded text-xs bg-white input-visible focus:ring-1 focus:ring-blue-500 focus:border-transparent text-gray-800"
                            />
                          ) : (
                            <div className="font-medium text-gray-900 truncate" title={item.name}>{item.name}</div>
                          )}
                        </td>
                        <td className="px-2 py-3 text-sm border-r border-gray-200">
                          {isEditing ? (
                            <input
                              type="number"
                              step="1"
                              value={editFormData?.amount || ''}
                              onChange={(e) => handleEditFormChange('amount', parseInt(e.target.value) || 0)}
                              className="w-full px-1 py-1 border border-gray-300 rounded text-xs bg-white input-visible focus:ring-1 focus:ring-blue-500 focus:border-transparent text-gray-800"
                            />
                          ) : (
                            <div className="font-semibold text-blue-600">{formatCurrency(item.amount)}</div>
                          )}
                        </td>
                        <td className="px-2 py-3 text-sm border-r border-gray-200">
                          <div className={`font-semibold ${item.due > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatCurrency(item.due)}
                          </div>
                        </td>
                        <td className="px-2 py-3 text-sm border-r border-gray-200">
                          {isEditing ? (
                            <input
                              type="number"
                              step="1"
                              value={editFormData?.paid || ''}
                              onChange={(e) => handleEditFormChange('paid', parseInt(e.target.value) || 0)}
                              className="w-full px-1 py-1 border border-gray-300 rounded text-xs bg-white input-visible focus:ring-1 focus:ring-blue-500 focus:border-transparent text-gray-800"
                            />
                          ) : (
                            <div className="font-semibold text-green-600">{formatCurrency(item.paid)}</div>
                          )}
                        </td>
                        <td className="px-2 py-3 text-sm border-r border-gray-200">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editFormData?.comment || ''}
                              onChange={(e) => handleEditFormChange('comment', e.target.value)}
                              className="w-full px-1 py-1 border border-gray-300 rounded text-xs bg-white input-visible focus:ring-1 focus:ring-blue-500 focus:border-transparent text-gray-800"
                            />
                          ) : (
                            <div className="truncate text-gray-600 text-xs" title={item.comment}>{item.comment || '-'}</div>
                          )}
                        </td>
                        <td className="px-2 py-3 text-xs text-gray-400 border-r border-gray-200">
                          <div className="truncate">{formatDateTime(item.created_at)}</div>
                        </td>
                        {/* <td className="px-2 py-3 text-xs text-gray-400 border-r border-gray-200">
                          <div className="truncate">{formatDateTime(item.updated_at)}</div>
                        </td> */}
                        <td className="px-2 py-3 text-sm font-medium">
                          <div className="flex gap-1">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={saveEdit}
                                  className="text-green-600 hover:text-green-800 hover:bg-green-100 p-1 rounded transition-all duration-200"
                                  title="Save"
                                >
                                  <Save size={14} />
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-1 rounded transition-all duration-200"
                                  title="Cancel"
                                >
                                  <X size={14} />
                                </button>
                              </>
                            ) : (
                              <>
                                {isEditEnabled() && (
                                  <button
                                    onClick={() => startEditing(item)}
                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1 rounded transition-all duration-200"
                                    title="Edit"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                )}
                                {isDeleteEnabled() && (
                                  <button
                                    onClick={() => onDeleteItem(item.id)}
                                    className="text-red-600 hover:text-red-800 hover:bg-red-100 p-1 rounded transition-all duration-200"
                                    title="Delete"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
