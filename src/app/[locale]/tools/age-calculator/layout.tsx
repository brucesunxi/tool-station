import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Age Calculator Free Online — Calculate Exact Age', 'Free online age calculator. Calculate your exact age in years, months, and days. Find out how many days until your next birthday.', 'age-calculator')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
