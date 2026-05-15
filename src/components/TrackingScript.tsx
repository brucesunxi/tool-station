'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function TrackingScript() {
  const pathname = usePathname()
  const startRef = useRef(Date.now())

  useEffect(() => {
    const referrer = document.referrer || ''
    const currentPath = pathname

    // Track page view
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: currentPath, referrer }),
      keepalive: true,
    })

    // Track duration when leaving
    function handleLeave() {
      const duration = Math.round((Date.now() - startRef.current) / 1000)
      if (duration > 2) {
        navigator.sendBeacon('/api/track', JSON.stringify({
          path: currentPath,
          duration,
        }))
      }
    }

    window.addEventListener('beforeunload', handleLeave)
    return () => {
      window.removeEventListener('beforeunload', handleLeave)
      handleLeave()
    }
  }, [pathname])

  return null
}
