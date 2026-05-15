import type { Metadata } from 'next'
import Link from 'next/link'
import { tools } from '@/lib/tools'

export const metadata: Metadata = {
  title: 'About',
  description: 'About ToolStation — free online tools powered by AI for everyone.',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">About ToolStation</h1>

      <div className="space-y-8 text-gray-600 dark:text-gray-400">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">What is ToolStation?</h2>
          <p>
            ToolStation is a collection of {tools.length} free online tools designed to help you process images, PDFs, text,
            and code — all directly in your browser. Our AI-powered tools can summarize, translate, and rewrite text,
            while our utility tools handle image compression, format conversion, PDF merging, and more.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Why ToolStation?</h2>
          <ul className="space-y-2">
            <li><strong>✓ Completely Free</strong> — No sign-up, no hidden fees, no limits</li>
            <li><strong>✓ Privacy First</strong> — Files process in memory and are auto-deleted</li>
            <li><strong>✓ AI-Powered</strong> — Smart text processing with cutting-edge AI</li>
            <li><strong>✓ Works Everywhere</strong> — Desktop, tablet, and mobile</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">All Tools ({tools.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {tools.map(t => (
              <Link key={t.href} href={t.href}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                {t.title}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Technology</h2>
          <p>
            Built with Next.js, React, TypeScript, and Tailwind CSS. AI features powered by the DeepSeek API.
            Image processing powered by Sharp. Deployed on Vercel.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Contact</h2>
          <p>
            Have feedback or suggestions? Reach us at{' '}
            <a href="mailto:hello@toolstation.app" className="text-blue-600 dark:text-blue-400 hover:underline">
              hello@toolstation.app
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
