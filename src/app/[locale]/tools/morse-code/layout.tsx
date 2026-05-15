import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Morse Code Converter Free Online — Text to Morse Code', 'Free online Morse code converter. Convert text to Morse code and decode Morse to text. Includes sound playback and visual dot-dash representation.', 'morse-code')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
