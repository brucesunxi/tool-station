import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'ToolStation privacy policy — how we handle your data and privacy.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-400">
        <p><strong>Last updated:</strong> May 13, 2026</p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">1. Introduction</h2>
          <p>
            ToolStation (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">2. Information We Collect</h2>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Files You Upload</h3>
          <p>
            When you use our tools (image compression, PDF processing, etc.), the files you upload are processed
            in memory and are automatically deleted after the operation completes. We do not store your files
            on our servers.
          </p>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Text You Submit</h3>
          <p>
            Text submitted to AI-powered tools (Summarize, Translate, Rewrite, Chat) is sent to third-party AI
            API services for processing. We do not log or store your text beyond the processing request.
          </p>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Automatically Collected Data</h3>
          <p>
            We may collect standard web analytics data including your IP address, browser type, referring pages,
            and pages visited. This data is anonymized and used to improve our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">3. Cookies</h2>
          <p>
            We use cookies and similar technologies to enhance your experience and serve personalized advertisements.
            Google AdSense may use cookies to serve ads based on your visits to our site and other websites.
          </p>
          <p>You can control cookies through your browser settings. Opting out of cookies may affect ad personalization.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">4. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>DeepSeek API</strong> — AI text processing (summarization, translation, rewriting, chat)</li>
            <li><strong>Vercel</strong> — Web hosting and infrastructure</li>
            <li><strong>Google AdSense</strong> — Advertising (may use cookies)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">5. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your data. All file processing
            happens in memory and files are not persisted to disk. Communication with our servers is encrypted via HTTPS.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">6. Contact</h2>
          <p>If you have questions about this Privacy Policy, please contact us at privacy@toolstation.app.</p>
        </section>
      </div>
    </div>
  )
}
