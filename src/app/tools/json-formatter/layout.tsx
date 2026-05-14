import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'JSON Formatter',
  description: 'Format, validate, and minify JSON data online free. Pretty-print JSON with syntax highlighting. Fix invalid JSON. No sign-up required.',
  keywords: ['JSON formatter', 'JSON validator', 'pretty print JSON', 'JSON beautifier'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
