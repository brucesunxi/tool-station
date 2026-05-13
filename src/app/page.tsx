import Link from 'next/link'
import ToolCard from '@/components/ToolCard'
import AdBanner from '@/components/AdBanner'

interface CategoryGroup {
  name: string
  icon: string
  description: string
  color: string
  tools: typeof tools
}

const tools = [
  { title: 'Image Compress', description: 'Reduce image file size while keeping quality', icon: '🗜️', href: '/tools/image-compress', isNew: false, category: 'image' },
  { title: 'Image Resize', description: 'Resize and crop images to exact dimensions', icon: '📐', href: '/tools/image-crop', isNew: false, category: 'image' },
  { title: 'Format Converter', description: 'Convert between JPG, PNG, WebP, GIF, AVIF', icon: '🔄', href: '/tools/format-converter', isNew: false, category: 'image' },
  { title: 'PDF Merge', description: 'Combine multiple PDFs into one document', icon: '📑', href: '/tools/pdf-merge', isNew: false, category: 'pdf' },
  { title: 'PDF to PPT', description: 'Convert PDF pages into PowerPoint slides', icon: '📽️', href: '/tools/pdf-to-ppt', isNew: true, category: 'pdf' },
  { title: 'Doc Converter', description: 'Convert Word ↔ PDF with images preserved', icon: '📄', href: '/tools/doc-converter', isNew: true, category: 'pdf' },
  { title: 'AI Text Summary', description: 'Summarize articles with AI in seconds', icon: '🤖', href: '/tools/ai-summary', isNew: false, category: 'ai' },
  { title: 'AI Translator', description: 'Translate text between 20+ languages', icon: '🌐', href: '/tools/ai-translator', isNew: true, category: 'ai' },
  { title: 'AI Rewriter', description: 'Rewrite text in formal, casual, or marketing tone', icon: '✍️', href: '/tools/ai-rewriter', isNew: true, category: 'ai' },
  { title: 'AI Chat', description: 'Chat with AI for help with any task', icon: '💬', href: '/tools/ai-assistant', isNew: true, category: 'ai' },
  { title: 'JSON Formatter', description: 'Format, validate & minify JSON data', icon: '{}', href: '/tools/json-formatter', isNew: false, category: 'dev' },
  { title: 'Base64 Encoder', description: 'Encode text/files or decode Base64', icon: '🔐', href: '/tools/base64', isNew: false, category: 'dev' },
  { title: 'URL Encoder', description: 'Encode & decode URLs and query params', icon: '🌐', href: '/tools/url-encode', isNew: false, category: 'dev' },
  { title: 'UUID Generator', description: 'Generate UUID v4/v7 in bulk', icon: '🔢', href: '/tools/uuid-generator', isNew: false, category: 'dev' },
  { title: 'Regex Tester', description: 'Test regex patterns with live highlighting', icon: '🔍', href: '/tools/regex-tester', isNew: false, category: 'dev' },
  { title: 'Code Beautifier', description: 'Format & minify HTML, CSS, JavaScript', icon: '✨', href: '/tools/code-beautifier', isNew: false, category: 'dev' },
  { title: 'Word Counter', description: 'Count words, chars, sentences & reading time', icon: '📝', href: '/tools/word-counter', isNew: false, category: 'text' },
  { title: 'Color Converter', description: 'Convert between HEX, RGB, HSL with preview', icon: '🎨', href: '/tools/color-converter', isNew: false, category: 'color' },
]

const categories: CategoryGroup[] = [
  {
    name: 'Image & Photo',
    icon: '🖼️',
    description: 'Compress, resize, and convert your images',
    color: 'border-l-blue-500',
    tools: tools.filter(t => t.category === 'image'),
  },
  {
    name: 'PDF & Documents',
    icon: '📄',
    description: 'Merge PDFs, convert between Word and PDF',
    color: 'border-l-red-500',
    tools: tools.filter(t => t.category === 'pdf'),
  },
  {
    name: 'AI Tools',
    icon: '🤖',
    description: 'Summarize, translate, rewrite, and chat with AI',
    color: 'border-l-purple-500',
    tools: tools.filter(t => t.category === 'ai'),
  },
  {
    name: 'Developer Utilities',
    icon: '⚙️',
    description: 'Format, encode, test & generate code',
    color: 'border-l-green-500',
    tools: tools.filter(t => t.category === 'dev'),
  },
  {
    name: 'Text & Writing',
    icon: '✏️',
    description: 'Analyze and process text content',
    color: 'border-l-amber-500',
    tools: tools.filter(t => t.category === 'text'),
  },
  {
    name: 'Color & Design',
    icon: '🎨',
    description: 'Convert and preview colors',
    color: 'border-l-pink-500',
    tools: tools.filter(t => t.category === 'color'),
  },
]

export default function HomePage() {
  const totalTools = tools.length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero */}
      <section className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs font-medium rounded-full mb-4">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          {totalTools} Free Online Tools — No Sign-up Required
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
          Free Online Tools
          <span className="block text-blue-600 mt-1">Powered by AI</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-6">
          Process images, PDFs, code, and text directly in your browser.
          No uploads to external servers — fast, secure, and 100% free.
        </p>

        {/* Quick search / filter chips */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map(cat => (
            <a
              key={cat.name}
              href={`#cat-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs font-medium rounded-full transition-colors"
            >
              {cat.icon} {cat.name}
            </a>
          ))}
        </div>
      </section>

      <AdBanner className="mb-10 h-20" />

      {/* Categories */}
      <div className="space-y-8">
        {categories.filter(c => c.tools.length > 0).map(cat => (
          <section key={cat.name} id={`cat-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}>
            {/* Category Header */}
            <div className={`flex items-center gap-3 mb-4 pl-4 border-l-4 ${cat.color}`}>
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <h2 className="text-lg font-bold">{cat.name}</h2>
                <p className="text-xs text-gray-400">{cat.description}</p>
              </div>
              <span className="ml-auto text-xs text-gray-400">{cat.tools.length} tool{cat.tools.length > 1 ? 's' : ''}</span>
            </div>
            {/* Tool Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {cat.tools.map(tool => (
                <ToolCard key={tool.title} {...tool} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Stats */}
      <section className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl border border-blue-200/50 dark:border-blue-800/30">
          <p className="text-2xl font-bold text-blue-600">{totalTools}</p>
          <p className="text-xs text-gray-500 mt-0.5">Free Tools</p>
        </div>
        <div className="text-center p-5 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 rounded-xl border border-green-200/50 dark:border-green-800/30">
          <p className="text-2xl font-bold text-green-600">7</p>
          <p className="text-xs text-gray-500 mt-0.5">API Endpoints</p>
        </div>
        <div className="text-center p-5 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl border border-purple-200/50 dark:border-purple-800/30">
          <p className="text-2xl font-bold text-purple-600">100%</p>
          <p className="text-xs text-gray-500 mt-0.5">Browser-based</p>
        </div>
        <div className="text-center p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
          <p className="text-2xl font-bold text-amber-600">Free</p>
          <p className="text-xs text-gray-500 mt-0.5">No Sign-up</p>
        </div>
      </section>

      {/* Features */}
      <section className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-5 rounded-xl border">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 className="font-semibold text-sm mb-1">Lightning Fast</h3>
          <p className="text-xs text-gray-400">Process files in seconds with our optimized engine.</p>
        </div>
        <div className="text-center p-5 rounded-xl border">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h3 className="font-semibold text-sm mb-1">100% Secure</h3>
          <p className="text-xs text-gray-400">Files processed in memory, auto-deleted after use.</p>
        </div>
        <div className="text-center p-5 rounded-xl border">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /></svg>
          </div>
          <h3 className="font-semibold text-sm mb-1">Works Everywhere</h3>
          <p className="text-xs text-gray-400">Desktop, tablet, or phone — all major browsers.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-14 text-center p-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-750 rounded-2xl border">
        <h2 className="text-xl font-bold mb-2">Start Using Free Tools Now</h2>
        <p className="text-sm text-gray-500 mb-4">No registration, no limits, no hidden fees.</p>
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-400">
          <span>✓ No sign-up</span>
          <span>✓ Private & secure</span>
          <span>✓ Files auto-delete</span>
          <span>✓ Always free</span>
        </div>
      </section>
    </div>
  )
}
