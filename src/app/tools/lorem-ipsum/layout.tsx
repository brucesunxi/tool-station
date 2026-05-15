import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator Free Online — Dummy Text Generator',
  description: 'Free online Lorem Ipsum generator. Generate placeholder text for your designs, mockups, and layouts. Choose paragraphs, words, or sentences.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
