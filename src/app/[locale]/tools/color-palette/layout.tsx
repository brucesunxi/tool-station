import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Color Palette Generator Free Online — Harmonious Color Schemes', 'Free online color palette generator. Create harmonious color schemes using color theory rules. Generate complementary, analogous, triadic, and tetradic palettes from any color.', 'color-palette')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
