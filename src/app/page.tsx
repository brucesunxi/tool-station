import ToolCard from '@/components/ToolCard'
import AdBanner from '@/components/AdBanner'

const tools = [
  {
    title: 'Image Compress',
    description: 'Compress JPG, PNG, WebP images online for free. Reduce file size while keeping quality.',
    icon: '🗜️',
    href: '/tools/image-compress',
    isNew: true,
  },
  {
    title: 'Background Remover',
    description: 'Remove image backgrounds automatically using AI. Perfect for product photos and portraits.',
    icon: '✂️',
    href: '#',
    isPremium: true,
  },
  {
    title: 'Format Converter',
    description: 'Convert images between JPG, PNG, WebP, GIF, and SVG formats instantly.',
    icon: '🔄',
    href: '#',
  },
  {
    title: 'PDF Merge',
    description: 'Combine multiple PDF files into one document. Fast and free.',
    icon: '📄',
    href: '#',
  },
  {
    title: 'AI Text Summary',
    description: 'Summarize long articles and documents with AI. Get key points in seconds.',
    icon: '🤖',
    href: '#',
    isPremium: true,
  },
  {
    title: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs in any text.',
    icon: '📝',
    href: '/tools/word-counter',
  },
  {
    title: 'JSON Formatter',
    description: 'Format, validate, and beautify JSON data. Works offline in your browser.',
    icon: '{}',
    href: '/tools/json-formatter',
  },
  {
    title: 'Base64 Encoder',
    description: 'Encode and decode Base64 strings, including image to Base64 conversion.',
    icon: '🔐',
    href: '#',
  },
]

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Free Online Tools
          <span className="block text-blue-600 mt-1">Powered by AI</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
          Compress, convert, edit, and transform your files directly in your browser.
          No installation required. 100% free.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
          <span>✓ No sign-up required</span>
          <span>✓ Files auto-delete</span>
          <span>✓ Fast processing</span>
        </div>
      </section>

      {/* Ad Banner */}
      <AdBanner className="mb-12 h-24" />

      {/* Tools Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-8">All Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.title} {...tool} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">Lightning Fast</h3>
          <p className="text-sm text-gray-500">Process files in seconds with our optimized engine.</p>
        </div>
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">100% Secure</h3>
          <p className="text-sm text-gray-500">Files are processed in memory and automatically deleted.</p>
        </div>
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">Works Everywhere</h3>
          <p className="text-sm text-gray-500">Access from any device - desktop, tablet, or phone.</p>
        </div>
      </section>
    </div>
  )
}
