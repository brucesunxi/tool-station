import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'
import TrackingScript from '@/components/TrackingScript'

export const metadata: Metadata = {
  title: {
    default: 'ToolStation - Free Online Tools',
    template: '%s | ToolStation',
  },
  description: 'Free online tools for image compression, PDF processing, AI text processing, format conversion and more. No sign-up required.',
  keywords: ['image compressor', 'online tools', 'free tools', 'compress image', 'AI tools', 'PDF tools', 'text summarizer', 'translator'],
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-icon.svg',
  },
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
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-icon.svg" />
        <meta name="google-site-verification" content="chpRNsaxkKZhXmUrEObpCpQwVmXNeIrg6Abr-0cvOgY" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9711589934416529" crossOrigin="anonymous"></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('toolstation-theme');
                  if (saved === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (prefersDark) document.documentElement.classList.add('dark');
                  }
                  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
                    var saved = localStorage.getItem('toolstation-theme');
                    if (!saved || saved === 'system') {
                      if (e.matches) document.documentElement.classList.add('dark');
                      else document.documentElement.classList.remove('dark');
                    }
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
        <TrackingScript />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-31H909PX6R" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-31H909PX6R');`}
        </Script>
      </body>
    </html>
  )
}
