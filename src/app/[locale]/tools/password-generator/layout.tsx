import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Password Generator', 'Generate strong, secure passwords online free. Customize length, character types, and strength requirements. Password strength indicator included.', 'password-generator')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
