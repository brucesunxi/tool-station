import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'
import TrackingScript from '@/components/TrackingScript'

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }]
}

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CookieConsent />
      <TrackingScript />
    </NextIntlClientProvider>
  )
}
