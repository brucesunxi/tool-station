import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Color Contrast Checker Free Online — WCAG Accessibility Checker', 'Free color contrast checker. Check if your color combinations meet WCAG accessibility standards for normal text, large text, and UI components.', 'contrast-checker')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
