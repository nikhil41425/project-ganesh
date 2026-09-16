'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Download, Heart, Loader2, Receipt, Share2, ShoppingBag, Users } from 'lucide-react'
import { exportAnalyticsToPDF } from '@/utils/pdfExport'
import type { AuctionItem, DonationItem, DuesItem, MembershipItem, SpentItem } from '@/types'

interface AnalyticsProps {
  auctionItems: AuctionItem[]
  membershipItems: MembershipItem[]
  spentItems: SpentItem[]
  donationItems: DonationItem[]
  duesItems: DuesItem[]
  year: number
}

interface FinancialItem {
  amount: number
  paid: number
  due: number
}

const formatCurrency = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`
const sumField = (items: FinancialItem[], field: keyof FinancialItem) =>
  items.reduce((total, item) => total + Number(item[field] || 0), 0)

export default function Analytics({ auctionItems, membershipItems, spentItems, donationItems, duesItems, year }: AnalyticsProps) {
  const router = useRouter()
  const [isExporting, setIsExporting] = useState(false)

  const dashboard = useMemo(() => {
    const incomingItems: FinancialItem[] = [...membershipItems, ...auctionItems, ...donationItems]
    const incomingTotal = sumField(incomingItems, 'amount')
    const incomingPaid = sumField(incomingItems, 'paid')
    const incomingDue = sumField(incomingItems, 'due')
    const expenseTotal = sumField(spentItems, 'amount')
    const expensePaid = sumField(spentItems, 'paid')
    const expenseDue = sumField(spentItems, 'due')
    const status = incomingItems.reduce((counts, item) => {
      const paid = Number(item.paid || 0)
      const due = Number(item.due || 0)
      if (due <= 0) counts.paid += 1
      else if (paid > 0) counts.partial += 1
      else counts.due += 1
      return counts
    }, { paid: 0, partial: 0, due: 0 })

    return {
      incomingItems, incomingTotal, incomingPaid, incomingDue,
      expenseTotal, expensePaid, expenseDue,
      accountBalance: incomingPaid - expensePaid,
      collectionProgress: incomingTotal > 0 ? (incomingPaid / incomingTotal) * 100 : 0,
      status,
    }
  }, [auctionItems, donationItems, membershipItems, spentItems])

  const summaryRows = [
    { label: 'Membership (Contributions)', entries: `${membershipItems.length} people`, total: sumField(membershipItems, 'amount'), paid: sumField(membershipItems, 'paid'), due: sumField(membershipItems, 'due'), route: '/dashboard/membership', icon: Users },
    { label: 'Expenses', entries: `${spentItems.length} items`, total: dashboard.expenseTotal, paid: dashboard.expensePaid, due: dashboard.expenseDue, route: '/dashboard/expenses', icon: Receipt },
    { label: 'Auction', entries: `${auctionItems.length} items`, total: sumField(auctionItems, 'amount'), paid: sumField(auctionItems, 'paid'), due: sumField(auctionItems, 'due'), route: '/dashboard/auction', icon: ShoppingBag },
    { label: 'Donations', entries: `${donationItems.length} people`, total: sumField(donationItems, 'amount'), paid: sumField(donationItems, 'paid'), due: sumField(donationItems, 'due'), route: '/dashboard/donations', icon: Heart },
  ]

  const quickActions = [
    { label: 'Membership dues', route: '/dashboard/membership', icon: Users },
    { label: 'Auction dues', route: '/dashboard/auction', icon: ShoppingBag },
    { label: 'Donation dues', route: '/dashboard/donations', icon: Heart },
    { label: 'Expense dues', route: '/dashboard/expenses', icon: Receipt },
  ]

  const totalStatuses = dashboard.incomingItems.length
  const paidPercent = totalStatuses > 0 ? (dashboard.status.paid / totalStatuses) * 100 : 0
  const partialPercent = totalStatuses > 0 ? (dashboard.status.partial / totalStatuses) * 100 : 0
  const duePercent = totalStatuses > 0 ? (dashboard.status.due / totalStatuses) * 100 : 0

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await exportAnalyticsToPDF({ auctionItems, membershipItems, spentItems, donationItems, duesItems })
    } finally {
      setIsExporting(false)
    }
  }

  const handleShare = async () => {
    const message = `${year} Friends Youth - Choller: ${formatCurrency(dashboard.incomingPaid)} collected of ${formatCurrency(dashboard.incomingTotal)}; ${formatCurrency(dashboard.incomingDue)} due.`
    if (navigator.share) {
      await navigator.share({ title: `Friends Youth - Choller ${year}`, text: message })
      return
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="min-h-[calc(100dvh-4rem)] bg-[#071b25] px-4 py-5 text-slate-100 sm:min-h-0 sm:rounded-3xl sm:p-7 sm:shadow-2xl lg:p-10">
      <div className="mb-5 sm:mb-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">Dashboard · {year}</p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">Overview</h1>
        <p className="mt-2 text-sm text-slate-400">Payment status across contributions, donations, auction, and expenses</p>
      </div>

      <div className="space-y-5">
        <article className="overflow-hidden rounded-2xl border border-slate-600/60 bg-[#102a36] shadow-xl">
          <div className="flex flex-col gap-2 border-b border-slate-600/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold">Financial Overview</h2>
            <span className="text-xs text-slate-400">Membership + Auction + Donations</span>
          </div>
          <div className="px-4 py-4 sm:px-5 sm:py-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Account balance</p>
            <p className={`mt-1 text-3xl font-black sm:text-4xl ${dashboard.accountBalance >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>{formatCurrency(dashboard.accountBalance)}</p>
          </div>
          <div className="grid grid-cols-2 border-y border-slate-600/60 lg:grid-cols-4">
            {[
              ['Incoming total', dashboard.incomingTotal, 'text-white'],
              ['Collected', dashboard.incomingPaid, 'text-emerald-300'],
              ['Incoming due', dashboard.incomingDue, 'text-orange-300'],
              ['Outgoing due (Expenses)', dashboard.expenseDue, 'text-rose-300'],
            ].map(([label, value, color]) => (
              <div key={String(label)} className="border-b border-r border-slate-600/60 p-4 even:border-r-0 [&:nth-child(n+3)]:border-b-0 lg:border-b-0 lg:border-r lg:even:border-r lg:last:border-r-0">
                <p className="min-h-9 text-xs leading-4 text-slate-400 sm:text-sm">{label}</p>
                <p className={`text-xl font-black sm:text-2xl ${color}`}>{formatCurrency(Number(value))}</p>
              </div>
            ))}
          </div>
          <p className="px-4 py-3 text-xs leading-5 text-slate-400 sm:px-5 sm:py-4 sm:text-sm">Balance = {formatCurrency(dashboard.incomingPaid)} collected − {formatCurrency(dashboard.expensePaid)} paid expenses</p>
        </article>

        <article className="rounded-2xl border border-slate-600/60 bg-[#102a36] p-4 shadow-xl sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Collection progress</p>
          <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-2xl font-black">{dashboard.collectionProgress.toFixed(1)}% collected</h2>
            <p className="text-sm text-slate-400"><strong className="text-cyan-400">{formatCurrency(dashboard.incomingPaid)}</strong> of {formatCurrency(dashboard.incomingTotal)}</p>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-700" role="progressbar" aria-label="Collection progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(dashboard.collectionProgress)}>
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300" style={{ width: `${Math.min(dashboard.collectionProgress, 100)}%` }} />
          </div>
          <div className="mt-6 border-t border-slate-600/60 pt-5">
            <div className="flex items-center justify-between gap-3"><h3 className="font-bold">Incoming payment status</h3><span className="text-xs text-slate-400">{totalStatuses} records</span></div>
            <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-slate-700" aria-label={`${dashboard.status.paid} paid, ${dashboard.status.partial} partially paid, ${dashboard.status.due} due`}>
              <div className="bg-emerald-500" style={{ width: `${paidPercent}%` }} /><div className="bg-amber-500" style={{ width: `${partialPercent}%` }} /><div className="bg-rose-500" style={{ width: `${duePercent}%` }} />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-xs"><p className="text-emerald-300">● Paid <strong>{dashboard.status.paid}</strong></p><p className="text-center text-amber-300">● Partial <strong>{dashboard.status.partial}</strong></p><p className="text-right text-rose-300">● Due <strong>{dashboard.status.due}</strong></p></div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-600/60 bg-[#102a36] p-4 shadow-xl sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Quick actions</p>
          <h2 className="mt-2 text-xl font-bold">What do you want to check?</h2>
          <div className="mt-4 hidden gap-3 sm:grid sm:grid-cols-2">
            {quickActions.map(({ label, route, icon: Icon }) => (
              <button key={label} onClick={() => router.push(route)} className="group flex items-center justify-between rounded-xl border border-slate-600 bg-[#173642] px-4 py-4 text-left font-semibold transition hover:border-emerald-400 hover:bg-[#1b4050]">
                <span className="flex items-center gap-3"><Icon className="h-5 w-5 text-emerald-300" />{label}</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            ))}
            <button onClick={handleShare} className="flex items-center justify-center gap-2 rounded-xl border border-emerald-700 bg-emerald-950/70 px-4 py-4 font-semibold text-emerald-200 transition hover:bg-emerald-900"><Share2 className="h-5 w-5" /> Share summary</button>
            <button onClick={handleExport} disabled={isExporting} className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-4 font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-wait disabled:opacity-70">
              {isExporting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}{isExporting ? 'Preparing report…' : 'Download full report'}
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:hidden">
            <button onClick={handleShare} className="flex items-center justify-center gap-2 rounded-xl border border-emerald-700 bg-emerald-950/70 px-4 py-4 font-semibold text-emerald-200 transition hover:bg-emerald-900"><Share2 className="h-5 w-5" /> Share summary</button>
            <button onClick={handleExport} disabled={isExporting} className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-4 font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-wait disabled:opacity-70">
              {isExporting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}{isExporting ? 'Preparing…' : 'Report'}
            </button>
          </div>
        </article>

        <article className="overflow-hidden rounded-2xl border border-slate-600/60 bg-[#102a36] shadow-xl">
          <div className="flex flex-col gap-1 border-b border-slate-600/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"><h2 className="text-xl font-bold">Summary</h2><span className="text-xs text-slate-400">Membership · Expenses · Auction · Donations</span></div>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead className="bg-[#173642] text-xs uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-4">Section</th><th className="px-5 py-4">Entries</th><th className="px-5 py-4">Total</th><th className="px-5 py-4">Paid</th><th className="px-5 py-4">Due</th><th className="px-5 py-4"><span className="sr-only">Open</span></th></tr></thead>
              <tbody className="divide-y divide-slate-600/60">
                {summaryRows.map((row) => <tr key={row.label} className="transition hover:bg-white/5"><td className="px-5 py-5 font-semibold">{row.label}</td><td className="px-5 py-5 text-slate-400">{row.entries}</td><td className="px-5 py-5 font-bold">{formatCurrency(row.total)}</td><td className="px-5 py-5 font-bold text-emerald-300">{formatCurrency(row.paid)}</td><td className="px-5 py-5 font-bold text-rose-300">{formatCurrency(row.due)}</td><td className="px-5 py-5 text-right"><button onClick={() => router.push(row.route)} className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold transition hover:bg-emerald-600">View →</button></td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="divide-y divide-slate-600/60 md:hidden">
            {summaryRows.map((row) => { const Icon = row.icon; return <button key={row.label} onClick={() => router.push(row.route)} className="block w-full p-5 text-left transition hover:bg-white/5"><div className="flex items-center justify-between gap-3"><span className="flex items-center gap-3 font-bold"><Icon className="h-5 w-5 text-emerald-300" />{row.label}</span><ArrowRight className="h-4 w-4" /></div><p className="mt-2 text-xs text-slate-400">{row.entries}</p><div className="mt-3 grid grid-cols-3 gap-2 text-sm"><p><span className="block text-xs text-slate-500">Total</span><strong>{formatCurrency(row.total)}</strong></p><p><span className="block text-xs text-slate-500">Paid</span><strong className="text-emerald-300">{formatCurrency(row.paid)}</strong></p><p><span className="block text-xs text-slate-500">Due</span><strong className="text-rose-300">{formatCurrency(row.due)}</strong></p></div></button> })}
          </div>
        </article>
      </div>
    </section>
  )
}
