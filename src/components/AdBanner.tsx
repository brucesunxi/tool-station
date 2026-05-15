'use client'

import { useTranslations } from 'next-intl'

export default function AdBanner({ className = '' }: { className?: string }) {
  const ct = useTranslations('common')
  return (
    <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 text-sm ${className}`}>
      <div className="text-center p-4">
        <p className="text-xs uppercase tracking-wider mb-1">{ct('advertisement')}</p>
        <p>{ct('adSpace')}</p>
      </div>
    </div>
  )
}
