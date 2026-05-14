import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Color Converter',
  description: 'Convert colors between HEX, RGB, HSL, and HSV formats online free. Live color preview. Copy color values with one click. No sign-up required.',
  keywords: ['color converter', 'HEX to RGB', 'RGB to HEX', 'color code converter'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
