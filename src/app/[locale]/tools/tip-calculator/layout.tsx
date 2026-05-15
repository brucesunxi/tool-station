import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Tip Calculator Free Online — Calculate Restaurant Tips & Split Bills', 'Free online tip calculator. Calculate tip amounts, total bill, and split between multiple people. Choose from common tip percentages or set your own.', 'tip-calculator')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
