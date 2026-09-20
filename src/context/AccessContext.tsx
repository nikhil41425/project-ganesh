'use client'

import type { User } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'

interface AccessContextValue {
  user: User | null
  isAdmin: boolean
}

const AccessContext = createContext<AccessContextValue | null>(null)

export function AccessProvider({ children, user }: { children: React.ReactNode; user: User | null }) {
  return (
    <AccessContext.Provider value={{ user, isAdmin: Boolean(user) }}>
      {children}
    </AccessContext.Provider>
  )
}

export function useAccess() {
  const context = useContext(AccessContext)

  if (!context) {
    throw new Error('useAccess must be used within an AccessProvider')
  }

  return context
}
