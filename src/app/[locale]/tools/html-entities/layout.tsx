import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'HTML Entity Encoder Free Online — Encode & Decode HTML Entities', 'Free online HTML entity encoder and decoder. Safely encode special characters to HTML entities and decode them back. Includes a reference chart of common entities.', 'html-entities')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
