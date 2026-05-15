import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Color Converter', 'Convert colors between HEX, RGB, HSL, and HSV formats online free. Live color preview. Copy color values with one click. No sign-up required.', 'color-converter')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
