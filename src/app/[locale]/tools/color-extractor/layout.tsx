import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Image Color Extractor Free Online — Extract Colors From Photos', 'Free online color extractor. Upload any image and extract its dominant colors. Get HEX, RGB, and HSL values for each color. Perfect for designers and artists.', 'color-extractor')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
