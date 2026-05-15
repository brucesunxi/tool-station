import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Palindrome Checker Free Online — Check Text & Phrases',
  description: 'Free online palindrome checker. Check if any word, phrase, or sentence reads the same forwards and backwards. Test "A man, a plan, a canal: Panama" and more.',
  keywords: ['palindrome checker', 'palindrome test', 'check palindrome', 'palindrome phrase', 'is it a palindrome'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
