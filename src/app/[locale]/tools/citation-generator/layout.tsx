import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Citation Generator', 'Generate citations in MLA, APA, and Chicago style for books, websites, articles, and videos. Free academic citation tool. No sign-up required.', 'citation-generator')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
