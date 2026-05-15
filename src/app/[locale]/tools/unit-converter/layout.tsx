import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Unit Converter', 'Convert between 50+ units across 8 categories: length, weight, temperature, area, volume, speed, data, and time. Free online unit converter.', 'unit-converter')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
