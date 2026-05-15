import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Morse Code Converter Free Online — Text to Morse Code',
  description: 'Free online Morse code converter. Convert text to Morse code and decode Morse to text. Includes sound playback and visual dot-dash representation.',
  keywords: ['Morse code converter', 'text to Morse', 'Morse code translator', 'Morse decoder', 'Morse code sound'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
