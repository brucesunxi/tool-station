import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'HTML Previewer Free Online — Live HTML Editor & Viewer', 'Free online HTML previewer. Write HTML code and see the rendered result in real-time. Perfect for testing HTML snippets, learning web development, and debugging layouts.', 'html-preview')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
