import { createContext, useEffect, useState, type ReactNode } from 'react'
import { LOCAL_STORAGE_THEME_KEY } from '@/lib/constants'
import type { AppTheme } from '@/types'

interface ThemeContextValue {
  theme: AppTheme
  setTheme: (theme: AppTheme) => void
  resolvedTheme: 'light' | 'dark'
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    return (localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as AppTheme) ?? 'system'
  })

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const root = document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = (t: AppTheme) => {
      const isDark = t === 'dark' || (t === 'system' && mediaQuery.matches)
      root.classList.toggle('dark', isDark)
      setResolvedTheme(isDark ? 'dark' : 'light')
    }

    applyTheme(theme)

    if (theme === 'system') {
      const handler = () => applyTheme('system')
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
  }, [theme])

  const setTheme = (newTheme: AppTheme) => {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme)
    setThemeState(newTheme)
  }

  return (
    <ThemeContext value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext>
  )
}
