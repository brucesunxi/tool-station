import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'AI Cover Letter Generator',
  description: 'Generate professional cover letters tailored to any job. AI writes complete letters with subject line, salutation, and closing. Free for job seekers.',
  keywords: ['cover letter generator', 'AI cover letter', 'cover letter writer', 'job application letter'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
