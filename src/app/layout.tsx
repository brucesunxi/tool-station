import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'

export const metadata: Metadata = {
  title: {
    default: 'ToolStation - Free Online Tools',
    template: '%s | ToolStation',
  },
  description: 'Free online tools for image compression, PDF processing, AI text processing, format conversion and more. No sign-up required.',
  keywords: ['image compressor', 'online tools', 'free tools', 'compress image', 'AI tools', 'PDF tools', 'text summarizer', 'translator'],
  openGraph: {
    title: 'ToolStation - Free Online Tools',
    description: 'Free online tools for image compression, PDF processing, format conversion, and AI-powered text tools.',
    type: 'website',
    locale: 'en_US',
    siteName: 'ToolStation',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ToolStation',
  url: 'https://toolstation.top',
  description: 'Free online tools for image compression, PDF processing, format conversion and more. Powered by AI.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://toolstation.top/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (dark) document.documentElement.classList.add('dark');
                  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
                    if (e.matches) document.documentElement.classList.add('dark');
                    else document.documentElement.classList.remove('dark');
                  });
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  )
}
