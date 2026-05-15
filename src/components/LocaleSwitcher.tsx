'use client'

import { usePathname, useRouter } from '@/i18n'
import { useLocale } from 'next-intl'
import { locales } from '@/i18n'

const labels: Record<string, string> = {
  en: 'EN',
  zh: '中文',
}

export default function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  function switchLocale(next: (typeof locales)[number]) {
    router.replace(pathname, { locale: next })
  }

  return (
    <div className="flex items-center gap-1 text-xs border rounded-lg overflow-hidden">
      {locales.map(l => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`px-2 py-1 transition-colors ${
            locale === l
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          {labels[l] || l}
        </button>
      ))}
    </div>
  )
}
