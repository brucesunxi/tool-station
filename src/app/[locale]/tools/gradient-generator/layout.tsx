import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'CSS Gradient Generator Free Online — Beautiful Color Gradients', 'Free online CSS gradient generator. Create beautiful linear and radial gradients with multiple color stops. Preview in real-time and copy CSS code instantly.', 'gradient-generator')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
