import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Strikethrough Text Generator Free Online — S̶t̶r̶i̶k̶e̶t̶h̶r̶o̶u̶g̶h̶', 'Free strikethrough text generator using Unicode. Create cross-out text effect for social media, messages, and creative content. Works on all platforms.', 'strikethrough-text')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
