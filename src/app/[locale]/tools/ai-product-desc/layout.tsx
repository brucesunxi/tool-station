import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Product Description Generator Free Online — E-commerce Copy', 'Free AI product description generator. Create compelling e-commerce product descriptions with features, benefits, and calls to action.', 'ai-product-desc')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
