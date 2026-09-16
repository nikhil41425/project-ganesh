'use client'

import { createContext, useContext, useMemo, useState } from 'react'

const FIRST_DATA_YEAR = 2025

interface YearContextValue {
  selectedYear: number
  setSelectedYear: (year: number) => void
  availableYears: number[]
}

const YearContext = createContext<YearContextValue | null>(null)

export function YearProvider({ children }: { children: React.ReactNode }) {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)

  const availableYears = useMemo(() => {
    const startYear = Math.min(FIRST_DATA_YEAR, currentYear)
    const years = Array.from(
      { length: currentYear - startYear + 1 },
      (_, index) => currentYear - index
    )

    return years.includes(selectedYear)
      ? years
      : [selectedYear, ...years].sort((a, b) => b - a)
  }, [currentYear, selectedYear])

  return (
    <YearContext.Provider value={{ selectedYear, setSelectedYear, availableYears }}>
      {children}
    </YearContext.Provider>
  )
}

export function useYear() {
  const context = useContext(YearContext)

  if (!context) {
    throw new Error('useYear must be used within a YearProvider')
  }

  return context
}
