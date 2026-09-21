import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, UsersRound } from 'lucide-react'

export default function Home() {
  return (
    <main className="auth-shell">
      <div className="auth-glow auth-glow-left" aria-hidden="true" />
      <div className="auth-glow auth-glow-right" aria-hidden="true" />

      <section className="auth-card" aria-labelledby="welcome-heading">
        <div className="auth-brand-mark">
          <Image src="/icons/friendyouthlogo.png" alt="Friendz Youth Association" width={112} height={112} className="h-full w-full object-cover" priority />
        </div>

        <div className="text-center">
          <p className="auth-eyebrow">Friendz Youth Association</p>
          <h1 id="welcome-heading" className="auth-title mt-3">Welcome to Choller</h1>
          <p className="auth-description mx-auto mt-3 max-w-sm">Stay connected with your community and keep every activity in one trusted place.</p>
        </div>

        <div className="mt-8 space-y-3">
          <Link href="/dashboard" className="auth-button auth-button-primary group">
            <span className="flex items-center gap-2.5"><UsersRound aria-hidden="true" size={19} strokeWidth={2} />View dashboard</span>
            <ArrowRight aria-hidden="true" size={19} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <Link href="/auth/login" className="auth-button auth-button-secondary group">
            <span className="flex items-center gap-2.5"><ShieldCheck aria-hidden="true" size={19} strokeWidth={2} />Admin sign in</span>
            <ArrowRight aria-hidden="true" size={19} className="text-slate-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-slate-300" />
          </Link>
        </div>

        <p className="mt-7 flex items-center justify-center gap-2 text-center text-xs font-medium text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />Community dashboard is available
        </p>
      </section>

      <p className="auth-footer">Friendz Youth · Choller</p>
    </main>
  )
}
