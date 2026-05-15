import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Color Contrast Checker Free Online — WCAG Accessibility Checker',
  description: 'Free color contrast checker. Check if your color combinations meet WCAG accessibility standards for normal text, large text, and UI components.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
