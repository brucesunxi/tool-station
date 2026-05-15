import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Resume Builder', 'Build a professional resume online for free. Add experience, education, and skills. Download as PDF with print-ready formatting. No sign-up required.', 'resume-builder')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
