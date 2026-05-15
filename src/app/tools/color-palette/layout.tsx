import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Color Palette Generator Free Online — Harmonious Color Schemes',
  description:
    'Free online color palette generator. Create harmonious color schemes using color theory rules. Generate complementary, analogous, triadic, and tetradic palettes from any color.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
