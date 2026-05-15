import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HTML Previewer Free Online — Live HTML Editor & Viewer',
  description:
    'Free online HTML previewer. Write HTML code and see the rendered result in real-time. Perfect for testing HTML snippets, learning web development, and debugging layouts.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
