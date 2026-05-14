import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'PDF to PowerPoint Converter',
  description: 'Convert PDF to editable PowerPoint PPTX online free. Text and formatting are preserved as real text boxes. No screenshots, no sign-up required.',
  keywords: ['PDF to PPT', 'PDF to PowerPoint', 'convert PDF to PPTX', 'PDF converter'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
