import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Text to Slug Converter Free Online — URL Slug Generator', 'Free online slug generator. Convert any text to clean, SEO-friendly URL slugs. Supports lowercase, hyphen-separated, and custom separator options.', 'text-to-slug')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
