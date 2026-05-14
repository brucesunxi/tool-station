import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Invoice Generator',
  description: 'Create professional invoices online free. Add items, tax, and notes. Download as PDF. Perfect for freelancers and small businesses. No sign-up.',
  keywords: ['invoice generator', 'free invoice', 'invoice creator', 'invoice PDF generator'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
