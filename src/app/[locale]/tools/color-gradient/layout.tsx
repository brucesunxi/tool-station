import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'CSS Gradient Generator Free Online — Color Gradient Maker', 'Free online gradient generator. Create beautiful CSS gradients with two colors. Choose direction and preview in real-time. Copy CSS code instantly.', 'color-gradient')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
