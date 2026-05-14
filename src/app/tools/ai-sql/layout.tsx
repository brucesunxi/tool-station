import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'AI SQL Generator',
  description: 'Describe what data you need in plain English and get the SQL query. Supports PostgreSQL, MySQL, SQLite, and SQL Server. Free AI tool for developers.',
  keywords: ['SQL generator', 'AI SQL', 'natural language to SQL', 'SQL query builder'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
