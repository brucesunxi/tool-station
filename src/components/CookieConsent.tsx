'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/i18n'

const CONSENT_KEY = 'toolstation-cookie-consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY)
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 flex-1">
          We use cookies to improve your experience and show personalized ads.{' '}
          <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
            Learn more
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button onClick={accept}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
