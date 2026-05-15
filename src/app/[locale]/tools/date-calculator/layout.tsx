import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Date Calculator Free Online — Date Difference & Add Days', 'Free online date calculator. Calculate days between dates or add/subtract days from any date. Get results in years, months, and days.', 'date-calculator')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
