import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI SQL Generator', 'Describe what data you need in plain English and get the SQL query. Supports PostgreSQL, MySQL, SQLite, and SQL Server. Free AI tool for developers.', 'ai-sql')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
