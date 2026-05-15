import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'CSS Box Shadow Generator Free Online — Shadow Effects Maker', 'Free online CSS box-shadow generator. Create custom shadow effects with visual controls. Adjust offset, blur, spread, and color. Copy CSS code. Perfect for web design.', 'box-shadow')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
