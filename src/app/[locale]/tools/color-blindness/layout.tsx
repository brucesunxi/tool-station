import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Color Blindness Simulator Free Online — Color Vision Deficiency Test', 'Free color blindness simulator. Simulate Protanopia, Deuteranopia, and Tritanopia. See how your colors appear to users with color vision deficiency.', 'color-blindness')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
