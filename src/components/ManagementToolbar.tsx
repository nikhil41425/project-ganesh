'use client'

import { Plus, Search } from 'lucide-react'
import { PaymentStatusSelect, type PaymentStatusFilter } from '@/components/PaymentStatus'

interface ManagementToolbarProps {
  title: string
  description: string
  itemCount: number
  itemLabel: string
  searchTerm: string
  searchPlaceholder: string
  onSearchChange: (term: string) => void
  statusFilter: PaymentStatusFilter
  onStatusFilterChange: (status: PaymentStatusFilter) => void
  canManage: boolean
  addLabel: string
  onAdd: () => void
}

export default function ManagementToolbar({
  title,
  description,
  itemCount,
  itemLabel,
  searchTerm,
  searchPlaceholder,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  canManage,
  addLabel,
  onAdd,
}: ManagementToolbarProps) {
  const headingId = `${title.toLowerCase().replace(/\s+/g, '-')}-heading`

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-600/60 bg-[#102a36] shadow-xl" aria-labelledby={headingId}>
      <div className="flex items-start justify-between gap-4 border-b border-slate-600/50 px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 id={headingId} className="text-lg font-bold tracking-tight text-slate-50 sm:text-xl">
              {title}
            </h2>
            <span className="rounded-full border border-slate-600 bg-slate-800/70 px-2.5 py-1 text-[0.7rem] font-bold text-slate-300">
              {itemCount} {itemLabel}
            </span>
          </div>
          <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:text-sm">{description}</p>
        </div>
      </div>

      <div className={`management-toolbar-controls grid gap-3 bg-[#0c242f] p-4 sm:p-5 ${canManage ? 'grid-cols-2 sm:grid-cols-[minmax(15rem,1fr)_auto_auto]' : 'sm:grid-cols-[minmax(15rem,1fr)_auto]'}`}>
        <label className={`group relative block min-w-0 ${canManage ? 'col-span-2 sm:col-span-1' : ''}`}>
          <span className="sr-only">{searchPlaceholder}</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-emerald-400" size={18} aria-hidden="true" />
          <input
            type="search"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            className="input-visible h-11 w-full rounded-xl border border-slate-600 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          />
        </label>

        <PaymentStatusSelect value={statusFilter} onChange={onStatusFilterChange} />

        {canManage ? (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex h-11 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-emerald-500 px-3 text-sm font-bold text-[#052018] shadow-lg shadow-emerald-950/25 transition hover:-translate-y-0.5 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c242f] sm:px-4"
          >
            <Plus size={17} strokeWidth={2.5} aria-hidden="true" />
            {addLabel}
          </button>
        ) : null}
      </div>
    </section>
  )
}
