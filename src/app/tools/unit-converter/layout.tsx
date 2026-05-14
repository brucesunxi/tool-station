import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Unit Converter',
  description: 'Convert between 50+ units across 8 categories: length, weight, temperature, area, volume, speed, data, and time. Free online unit converter.',
  keywords: ['unit converter', 'length converter', 'weight converter', 'temperature converter', 'metric converter'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
