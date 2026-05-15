import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Cover Letter Generator', 'Generate professional cover letters tailored to any job. AI writes complete letters with subject line, salutation, and closing. Free for job seekers.', 'cover-letter')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
