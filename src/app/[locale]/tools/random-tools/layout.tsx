import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Random Tools', 'Random tools collection: random number generator, dice roller, coin flip, lottery picker, and decision maker. All free, no sign-up.', 'random-tools')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
