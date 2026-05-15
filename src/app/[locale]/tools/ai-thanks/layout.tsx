import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Thank You Note Generator — Thank You Message Writer', 'Free AI thank you note generator. Write heartfelt thank-you messages for any occasion. Choose from formal, warm, or casual tones.', 'ai-thanks')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
