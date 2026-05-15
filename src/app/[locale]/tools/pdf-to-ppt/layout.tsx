import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'PDF to PowerPoint Converter', 'Convert PDF to editable PowerPoint PPTX online free. Text and formatting are preserved as real text boxes. No screenshots, no sign-up required.', 'pdf-to-ppt')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
