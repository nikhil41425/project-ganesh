'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { BarChart3, CalendarDays, ChevronDown, Gavel, HandCoins, Heart, Home, LogOut, Menu, ReceiptText, Users, X } from 'lucide-react'
import { useYear } from '@/context/YearContext'

interface HeaderProps { onLogout: () => void }

const tabs = [
  { id: 'dashboard', name: 'Dashboard', shortName: 'Home', href: '/dashboard', icon: Home },
  { id: 'auction', name: 'Auction', shortName: 'Auction', href: '/dashboard/auction', icon: Gavel },
  { id: 'membership', name: 'Membership', shortName: 'Members', href: '/dashboard/membership', icon: Users },
  { id: 'expenses', name: 'Expenses', shortName: 'Expenses', href: '/dashboard/expenses', icon: ReceiptText },
  { id: 'donations', name: 'Donations', shortName: 'Donations', href: '/dashboard/donations', icon: Heart },
  { id: 'dues', name: 'Dues', shortName: 'Dues', href: '/dashboard/dues', icon: HandCoins },
  { id: 'analytics', name: 'Reports', shortName: 'Reports', href: '/dashboard/analytics', icon: BarChart3 },
]

const mobileTabs = tabs.slice(0, 5)

export default function Header({ onLogout }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const { selectedYear, setSelectedYear, availableYears } = useYear()
  const router = useRouter()
  const pathname = usePathname()
  const isActive = (href: string) => href === '/dashboard' ? pathname === href : pathname.startsWith(href)
  const navigate = (href: string) => {
    setIsNavigating(true)
    setIsMobileMenuOpen(false)
    router.push(href)
    setTimeout(() => setIsNavigating(false), 350)
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-700/70 bg-[#071b25]/95 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between gap-3">
            <Link href="/dashboard" className="flex min-w-0 items-center gap-3" aria-label="Friendz Youth dashboard">
              <Image src="/icons/friendyouthlogo.png" alt="" width={42} height={42} className="h-10 w-10 rounded-xl object-cover" priority />
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[15px] font-bold text-white sm:text-lg">Friendz Youth</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Choller</p>
              </div>
            </Link>
            <div className="flex shrink-0 items-center gap-2">
              <div className="relative flex h-11 min-w-[104px] items-center gap-2 rounded-xl border border-slate-600 bg-[#102a36] px-2.5 shadow-sm transition hover:border-slate-500 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/20 sm:min-w-[116px]">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-400/10 text-emerald-300">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1 leading-none" aria-hidden="true">
                  <span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">Year</span>
                  <span className="mt-1 block text-sm font-bold text-white">{selectedYear}</span>
                </span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                <label className="sr-only" htmlFor="dashboard-year">Financial year</label>
                <select id="dashboard-year" value={selectedYear} onChange={(event) => setSelectedYear(Number(event.target.value))} className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent text-transparent outline-none" aria-label="Select financial year">
                  {availableYears.map((year) => <option key={year} value={year} className="bg-white text-slate-900">{year}</option>)}
                </select>
              </div>
              <button type="button" onClick={() => setIsMobileMenuOpen((open) => !open)} className="h-11 rounded-xl border border-slate-600 px-3 text-xs font-bold uppercase tracking-wider text-slate-200 transition hover:border-slate-400 md:hidden" aria-expanded={isMobileMenuOpen} aria-controls="mobile-menu">
                {isMobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
                <span className="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
              </button>
            </div>
          </div>
          <nav aria-label="Desktop navigation" className="hidden h-12 items-center gap-5 border-t border-slate-700/50 md:flex lg:gap-7">
            {tabs.map((tab) => { const Icon = tab.icon; return <Link key={tab.id} href={tab.href} aria-current={isActive(tab.href) ? 'page' : undefined} className={`flex h-full items-center gap-2 border-b-2 text-sm font-semibold transition ${isActive(tab.href) ? 'border-emerald-400 text-white' : 'border-transparent text-slate-400 hover:text-white'}`}><Icon className="h-4 w-4" aria-hidden="true" />{tab.name}</Link> })}
            <button type="button" onClick={onLogout} className="ml-auto flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"><LogOut className="h-4 w-4" aria-hidden="true" />Sign out</button>
          </nav>
        </div>
        {isMobileMenuOpen ? (
          <div id="mobile-menu" className="border-t border-slate-700 bg-[#0b222d] px-4 py-3 md:hidden">
            <nav aria-label="Menu navigation" className="mx-auto max-w-7xl space-y-1">
              {tabs.map((tab) => { const Icon = tab.icon; return <button key={tab.id} type="button" onClick={() => navigate(tab.href)} disabled={isNavigating} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${isActive(tab.href) ? 'bg-[#173642] text-emerald-300' : 'text-slate-300 hover:bg-[#102a36]'}`}><Icon className="h-5 w-5" aria-hidden="true" /><span>{tab.name}</span>{isActive(tab.href) ? <span className="ml-auto text-[10px] uppercase tracking-wider">Current</span> : null}</button> })}
              <div className="my-2 border-t border-slate-700" />
              <button type="button" onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-rose-300 hover:bg-[#102a36]"><LogOut className="h-5 w-5" aria-hidden="true" />Sign out</button>
            </nav>
          </div>
        ) : null}
      </header>
      <nav aria-label="Primary navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-700 bg-[#102a36]/98 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-5">
          {mobileTabs.map((tab) => { const Icon = tab.icon; return <Link key={tab.id} href={tab.href} aria-current={isActive(tab.href) ? 'page' : undefined} className={`relative flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-[10px] font-semibold transition ${isActive(tab.href) ? 'text-emerald-300' : 'text-slate-400'}`}>{isActive(tab.href) ? <span className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-emerald-400" /> : null}<Icon className="h-[18px] w-[18px]" aria-hidden="true" /><span className="truncate">{tab.shortName}</span></Link> })}
        </div>
      </nav>
      {isNavigating ? <div className="fixed inset-0 z-[60] grid place-items-center bg-[#071b25]/70 backdrop-blur-sm"><div className="rounded-xl border border-slate-600 bg-[#102a36] px-5 py-3 text-sm font-semibold text-white">Loading…</div></div> : null}
    </>
  )
}
