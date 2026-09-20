'use client'

export type PaymentStatus = 'paid' | 'partial' | 'due'
export type PaymentStatusFilter = 'all' | PaymentStatus

export interface PaymentRecord {
  amount: number
  paid: number
  due: number
}

const statusRank: Record<PaymentStatus, number> = { due: 0, partial: 1, paid: 2 }

export function getPaymentStatus(item: PaymentRecord): PaymentStatus {
  const paid = Number(item.paid || 0)
  const due = Number(item.due || 0)
  if (due <= 0) return 'paid'
  if (paid > 0) return 'partial'
  return 'due'
}

export function filterAndSortByStatus<T extends PaymentRecord>(items: T[], filter: PaymentStatusFilter) {
  const filtered = items.filter((item) => filter === 'all' || getPaymentStatus(item) === filter)
  return [...filtered].sort((a, b) => statusRank[getPaymentStatus(a)] - statusRank[getPaymentStatus(b)])
}

export function getStatusRowClass(item: PaymentRecord) {
  const status = getPaymentStatus(item)
  if (status === 'paid') return 'bg-emerald-50/80 hover:bg-emerald-100/80'
  if (status === 'partial') return 'bg-amber-50/80 hover:bg-amber-100/80'
  return 'bg-rose-50/80 hover:bg-rose-100/80'
}

export function PaymentStatusBadge({ item }: { item: PaymentRecord }) {
  const status = getPaymentStatus(item)
  const styles = {
    paid: 'border-emerald-200 bg-emerald-100 text-emerald-800',
    partial: 'border-amber-200 bg-amber-100 text-amber-800',
    due: 'border-rose-200 bg-rose-100 text-rose-800',
  }
  const labels = { paid: 'Paid', partial: 'Partially paid', due: 'Due' }

  return <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-bold ${styles[status]}`}>{labels[status]}</span>
}

export function PaymentStatusSelect({ value, onChange }: { value: PaymentStatusFilter; onChange: (value: PaymentStatusFilter) => void }) {
  return (
    <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-600 shadow-sm">
      <span className="whitespace-nowrap">Status</span>
      <select value={value} onChange={(event) => onChange(event.target.value as PaymentStatusFilter)} className="bg-transparent text-sm font-bold text-gray-900 outline-none" aria-label="Filter and sort by payment status">
        <option value="all">All: due first</option>
        <option value="due">Due</option>
        <option value="partial">Partially paid</option>
        <option value="paid">Paid</option>
      </select>
    </label>
  )
}
