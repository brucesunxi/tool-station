import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'ToolStation - Free Online Tools',
    template: '%s | ToolStation',
  },
  description: 'Free online tools for image compression, PDF processing, format conversion and more. Powered by AI.',
  keywords: ['image compressor', 'online tools', 'free tools', 'compress image', 'AI tools'],
  openGraph: {
    title: 'ToolStation - Free Online Tools',
    description: 'Free online tools for image compression, PDF processing, format conversion and more.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
