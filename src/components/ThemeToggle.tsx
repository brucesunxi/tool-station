'use client'

import { useState, useEffect } from 'react'

type Theme = 'system' | 'dark' | 'light'

const THEME_KEY = 'toolstation-theme'

const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
)

const MonitorIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem(THEME_KEY) as Theme | null
    if (saved) setTheme(saved)
  }, [])

  const applyTheme = (t: Theme) => {
    const root = document.documentElement
    if (t === 'dark') {
      root.classList.add('dark')
    } else if (t === 'light') {
      root.classList.remove('dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', prefersDark)
    }
    localStorage.setItem(THEME_KEY, t)
    setTheme(t)
  }

  const cycle = () => {
    const order: Theme[] = ['system', 'dark', 'light']
    const idx = order.indexOf(theme)
    applyTheme(order[(idx + 1) % order.length])
  }

  if (!mounted) return <div className="w-9 h-9" />

  return (
    <button
      onClick={cycle}
      title={`Theme: ${theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System'}`}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
    >
      {theme === 'dark' ? <MoonIcon /> : theme === 'light' ? <SunIcon /> : <MonitorIcon />}
    </button>
  )
}
