export interface ToolData {
  title: string
  description: string
  icon: string
  href: string
  isNew: boolean
  category: string
}

export const tools: ToolData[] = [
  { title: 'Image Compress', description: 'Reduce image file size while keeping quality', icon: '🗜️', href: '/tools/image-compress', isNew: false, category: 'image' },
  { title: 'Image Resize', description: 'Resize and crop images to exact dimensions', icon: '📐', href: '/tools/image-crop', isNew: false, category: 'image' },
  { title: 'Format Converter', description: 'Convert between JPG, PNG, WebP, GIF, AVIF', icon: '🔄', href: '/tools/format-converter', isNew: false, category: 'image' },
  { title: 'Image OCR', description: 'Extract text from images (browser-based)', icon: '🖼️', href: '/tools/image-ocr', isNew: true, category: 'image' },
  { title: 'QR Code Generator', description: 'Generate QR codes with custom colors', icon: '▣', href: '/tools/qr-code', isNew: true, category: 'image' },
  { title: 'PDF Merge', description: 'Combine multiple PDFs into one document', icon: '📑', href: '/tools/pdf-merge', isNew: false, category: 'pdf' },
  { title: 'PDF to PPT', description: 'Convert PDF pages into PowerPoint slides', icon: '📽️', href: '/tools/pdf-to-ppt', isNew: true, category: 'pdf' },
  { title: 'PDF Compress', description: 'Reduce PDF file size online', icon: '📦', href: '/tools/pdf-compress', isNew: true, category: 'pdf' },
  { title: 'Doc Converter', description: 'Convert Word ↔ PDF with images preserved', icon: '📄', href: '/tools/doc-converter', isNew: true, category: 'pdf' },
  { title: 'AI Text Summary', description: 'Summarize articles with AI in seconds', icon: '🤖', href: '/tools/ai-summary', isNew: false, category: 'ai' },
  { title: 'AI Translator', description: 'Translate text between 20+ languages', icon: '🌐', href: '/tools/ai-translator', isNew: true, category: 'ai' },
  { title: 'AI Rewriter', description: 'Rewrite text in formal, casual, or marketing tone', icon: '✍️', href: '/tools/ai-rewriter', isNew: true, category: 'ai' },
  { title: 'AI Chat', description: 'Chat with AI for help with any task', icon: '💬', href: '/tools/ai-assistant', isNew: true, category: 'ai' },
  { title: 'AI Grammar Check', description: 'Check spelling, grammar, and punctuation', icon: '✓', href: '/tools/ai-grammar', isNew: true, category: 'ai' },
  { title: 'AI Email Generator', description: 'Generate professional emails instantly', icon: '✉️', href: '/tools/ai-email', isNew: true, category: 'ai' },
  { title: 'AI Title Generator', description: 'Generate catchy titles for blogs & videos', icon: '🏷️', href: '/tools/ai-title', isNew: true, category: 'ai' },
  { title: 'AI Keyword Extractor', description: 'Extract keywords for SEO optimization', icon: '🔑', href: '/tools/ai-keywords', isNew: true, category: 'ai' },
  { title: 'AI Blog Generator', description: 'Generate blog outlines and full posts', icon: '📝', href: '/tools/ai-blog', isNew: true, category: 'ai' },
  { title: 'AI Pros & Cons', description: 'Get balanced analysis of any decision', icon: '⚖️', href: '/tools/ai-pros-cons', isNew: true, category: 'ai' },
  { title: 'AI Cover Letter', description: 'Generate cover letters with AI', icon: '✉️', href: '/tools/cover-letter', isNew: true, category: 'ai' },
  { title: 'AI Hashtag Generator', description: 'Generate hashtags for social media', icon: '#', href: '/tools/ai-hashtags', isNew: true, category: 'ai' },
  { title: 'AI Bio Generator', description: 'Generate bios for any platform', icon: '👤', href: '/tools/ai-bio', isNew: true, category: 'ai' },
  { title: 'AI Copywriter', description: 'Generate ad copy and descriptions', icon: '✍️', href: '/tools/ai-copy', isNew: true, category: 'ai' },
  { title: 'AI Readability Checker', description: 'Analyze and improve text readability', icon: '📊', href: '/tools/ai-readability', isNew: true, category: 'ai' },
  { title: 'AI Interview Questions', description: 'Generate questions for any role', icon: '💼', href: '/tools/ai-interview', isNew: true, category: 'ai' },
  { title: 'AI Flashcard Generator', description: 'Turn text into study flashcards', icon: '📇', href: '/tools/ai-flashcards', isNew: true, category: 'ai' },
  { title: 'AI Resume Builder', description: 'Build a resume and download as PDF', icon: '📄', href: '/tools/resume-builder', isNew: true, category: 'dev' },
  { title: 'Citation Generator', description: 'MLA, APA & Chicago citations', icon: '📚', href: '/tools/citation-generator', isNew: true, category: 'dev' },
  { title: 'Loan Calculator', description: 'Loan payments & compound interest', icon: '🏠', href: '/tools/loan-calculator', isNew: true, category: 'dev' },
  { title: 'Invoice Generator', description: 'Create invoices and download PDF', icon: '📋', href: '/tools/invoice-generator', isNew: true, category: 'dev' },
  { title: 'AI Regex Generator', description: 'Generate regex from plain English', icon: '🔍', href: '/tools/ai-regex', isNew: true, category: 'dev' },
  { title: 'AI SQL Generator', description: 'Natural language to SQL queries', icon: '💾', href: '/tools/ai-sql', isNew: true, category: 'dev' },
  { title: 'AI Code Converter', description: 'Convert code between 19 languages', icon: '🔄', href: '/tools/ai-code-convert', isNew: true, category: 'dev' },
  { title: 'JSON Formatter', description: 'Format, validate & minify JSON data', icon: '{}', href: '/tools/json-formatter', isNew: false, category: 'dev' },
  { title: 'Base64 Encoder', description: 'Encode text/files or decode Base64', icon: '🔐', href: '/tools/base64', isNew: false, category: 'dev' },
  { title: 'URL Encoder', description: 'Encode & decode URLs and query params', icon: '🌐', href: '/tools/url-encode', isNew: false, category: 'dev' },
  { title: 'UUID Generator', description: 'Generate UUID v4/v7 in bulk', icon: '🔢', href: '/tools/uuid-generator', isNew: false, category: 'dev' },
  { title: 'Password Generator', description: 'Generate strong, secure passwords', icon: '🔑', href: '/tools/password-generator', isNew: true, category: 'dev' },
  { title: 'Diff Checker', description: 'Compare text and code differences', icon: '⇔', href: '/tools/diff-checker', isNew: true, category: 'dev' },
  { title: 'Data Converter', description: 'Convert between JSON and YAML', icon: '⇄', href: '/tools/data-converter', isNew: true, category: 'dev' },
  { title: 'Case Converter', description: 'Convert text between 11 case formats', icon: 'Aa', href: '/tools/case-converter', isNew: true, category: 'dev' },
  { title: 'Markdown Editor', description: 'Write Markdown with live preview', icon: '📝', href: '/tools/markdown-editor', isNew: true, category: 'dev' },
  { title: 'Random Tools', description: 'Number, dice, coin, lottery, choices', icon: '🎲', href: '/tools/random-tools', isNew: true, category: 'dev' },
  { title: 'Unit Converter', description: 'Length, weight, temp, area, volume, more', icon: '📏', href: '/tools/unit-converter', isNew: true, category: 'dev' },
  { title: 'Regex Tester', description: 'Test regex patterns with live highlighting', icon: '🔍', href: '/tools/regex-tester', isNew: false, category: 'dev' },
  { title: 'Code Beautifier', description: 'Format & minify HTML, CSS, JavaScript', icon: '✨', href: '/tools/code-beautifier', isNew: false, category: 'dev' },
  { title: 'Word Counter', description: 'Count words, chars, sentences & reading time', icon: '📝', href: '/tools/word-counter', isNew: false, category: 'text' },
  { title: 'Color Converter', description: 'Convert between HEX, RGB, HSL with preview', icon: '🎨', href: '/tools/color-converter', isNew: false, category: 'color' },
]
