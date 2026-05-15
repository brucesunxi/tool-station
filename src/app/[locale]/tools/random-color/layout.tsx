import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Random Color Generator Free Online — Random HEX, RGB & HSL Colors', 'Free random color generator. Generate random HEX, RGB, and HSL colors with live preview. Copy colors instantly for your design projects.', 'random-color')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
