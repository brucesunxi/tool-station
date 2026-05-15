import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Color Extractor Free Online — Extract Colors From Photos',
  description: 'Free online color extractor. Upload any image and extract its dominant colors. Get HEX, RGB, and HSL values for each color. Perfect for designers and artists.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
