import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Splitter Free Online — Split Images Into Grid Pieces',
  description: 'Free online image splitter. Split images into equal rows and columns. Great for creating Instagram grids, puzzles, and dividing large images into smaller pieces.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
