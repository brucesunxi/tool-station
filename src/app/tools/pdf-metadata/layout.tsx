import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Metadata Viewer Free Online — View PDF Properties',
  description: 'Free online PDF metadata viewer. View PDF document properties including title, author, subject, keywords, and creation date.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
