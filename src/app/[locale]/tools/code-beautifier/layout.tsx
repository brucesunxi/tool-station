import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Code Beautifier', 'Format and beautify HTML, CSS, and JavaScript code online free. Minify for production. No sign-up required. All processing in your browser.', 'code-beautifier')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
