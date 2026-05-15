import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Random Color Generator Free Online — Random HEX, RGB & HSL Colors',
  description: 'Free random color generator. Generate random HEX, RGB, and HSL colors with live preview. Copy colors instantly for your design projects.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
