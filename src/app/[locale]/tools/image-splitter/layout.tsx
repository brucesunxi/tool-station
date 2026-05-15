import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Image Splitter Free Online — Split Images Into Grid Pieces', 'Free online image splitter. Split images into equal rows and columns. Great for creating Instagram grids, puzzles, and dividing large images into smaller pieces.', 'image-splitter')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
