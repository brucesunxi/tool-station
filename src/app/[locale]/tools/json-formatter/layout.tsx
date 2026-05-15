import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'JSON Formatter', 'Format, validate, and minify JSON data online free. Pretty-print JSON with syntax highlighting. Fix invalid JSON. No sign-up required.', 'json-formatter')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
