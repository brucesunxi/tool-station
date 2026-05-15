import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Favicon Generator Free Online — Create Favicons From Images', 'Free online favicon generator. Upload any image and generate favicons at all standard sizes. Preview how your favicon will look at 16x16, 32x32, 48x48 and more.', 'favicon-generator')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
