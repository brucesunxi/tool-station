import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Email Reply Generator — Smart Reply Assistant', 'Free AI email reply generator. Draft professional email replies quickly. Choose from professional, friendly, or formal tones.', 'ai-email-reply')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
