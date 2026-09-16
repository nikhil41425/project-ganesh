'use client'

import { Github, Heart, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="border-t border-slate-700/70 bg-[#081e28]">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-7 sm:px-6 md:py-7 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold text-slate-200">Friendz Youth — Choller</p>
            <p className="mt-1 text-xs text-slate-500">Community finances, clearly managed.</p>
          </div>
          <div className="flex items-center gap-2">
            <a href="https://github.com/nikhil41425/" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid h-10 w-10 place-items-center rounded-full border border-slate-700 text-slate-400 transition hover:border-emerald-500 hover:text-emerald-300"><Github className="h-4 w-4" /></a>
            <a href="https://in.linkedin.com/in/nikhil-are-7440a1207" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="grid h-10 w-10 place-items-center rounded-full border border-slate-700 text-slate-400 transition hover:border-emerald-500 hover:text-emerald-300"><Linkedin className="h-4 w-4" /></a>
            <a href="mailto:nikhilaree@gmail.com" aria-label="Email" className="grid h-10 w-10 place-items-center rounded-full border border-slate-700 text-slate-400 transition hover:border-emerald-500 hover:text-emerald-300"><Mail className="h-4 w-4" /></a>
          </div>
        </div>
        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-slate-700/70 pt-5 text-xs text-slate-500 sm:flex-row">
          <p>© {currentYear} Friendz Youth. All rights reserved.</p>
          <p className="flex items-center gap-1.5">Designed and developed with <Heart className="h-3.5 w-3.5 fill-rose-400 text-rose-400" aria-hidden="true" /> by <a href="https://github.com/nikhil41425/" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-300 transition hover:text-emerald-200">Nikhil Are</a></p>
        </div>
      </div>
    </footer>
  )
}
