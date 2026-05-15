import { createSharedPathnamesNavigation } from 'next-intl/navigation'
import { getRequestConfig } from 'next-intl/server'

export const locales = ['en', 'zh'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale = 'en' as const

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales })

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale
  }
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
