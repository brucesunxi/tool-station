import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Binary Converter Free Online — Text to Binary & Binary to Text', 'Free online binary converter. Convert text to binary code and decode binary back to text. Perfect for learning binary encoding and computer science basics.', 'binary-converter')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
