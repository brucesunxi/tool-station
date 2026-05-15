import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Birthday Wish Generator — Birthday Greeting Writer', 'Free AI birthday wish generator. Create personalized birthday greetings for friends, family, colleagues, and partners. Multiple options.', 'ai-birthday-wish')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
