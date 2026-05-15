import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'ToolStation terms of service — rules and guidelines for using our tools.',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-400">
        <p><strong>Last updated:</strong> May 13, 2026</p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">1. Acceptance of Terms</h2>
          <p>
            By accessing or using ToolStation (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
            If you do not agree, please do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">2. Description of Service</h2>
          <p>
            ToolStation provides free online tools for image processing, PDF manipulation, text analysis,
            format conversion, and AI-powered text processing. Tools are provided &quot;as is&quot; without warranty.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">3. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Upload illegal, harmful, or infringing content</li>
            <li>Attempt to disrupt or overload the Service</li>
            <li>Reverse engineer or scrape the Service</li>
            <li>Use the Service for automated or bulk processing without permission</li>
            <li>Submit content that violates third-party rights</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">4. Intellectual Property</h2>
          <p>
            The Service, including its design, code, and branding, is owned by ToolStation.
            You retain all rights to the content you upload or create using the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">5. Disclaimer</h2>
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTY OF ANY KIND.
            We do not guarantee that the Service will be uninterrupted, timely, secure, or error-free.
            Output from AI tools may contain inaccuracies and should be reviewed before use.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">6. Limitation of Liability</h2>
          <p>
            ToolStation shall not be liable for any indirect, incidental, special, or consequential damages
            arising from your use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">7. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective immediately
            upon posting to this page. Continued use of the Service constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">8. Contact</h2>
          <p>For questions about these terms, contact us at terms@toolstation.app.</p>
        </section>
      </div>
    </div>
  )
}
