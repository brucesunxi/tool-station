import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HTML Entity Encoder Free Online — Encode & Decode HTML Entities',
  description:
    'Free online HTML entity encoder and decoder. Safely encode special characters to HTML entities and decode them back. Includes a reference chart of common entities.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
