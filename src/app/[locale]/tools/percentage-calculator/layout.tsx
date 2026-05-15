import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Percentage Calculator Free Online — Calculate Percentages Instantly', 'Free online percentage calculator. Find what is X% of Y, X is what percent of Y, and percentage increase/decrease. Fast and accurate calculations.', 'percentage-calculator')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
