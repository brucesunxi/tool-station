import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Color Blindness Simulator Free Online — Color Vision Deficiency Test',
  description: 'Free color blindness simulator. Simulate Protanopia, Deuteranopia, and Tritanopia. See how your colors appear to users with color vision deficiency.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
