import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Invoice Generator', 'Create professional invoices online free. Add items, tax, and notes. Download as PDF. Perfect for freelancers and small businesses. No sign-up.', 'invoice-generator')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
