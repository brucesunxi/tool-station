import { Link } from '@/i18n'
import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">T</span>
              </div>
              <span className="font-bold">ToolStation</span>
            </div>
            <p className="text-sm text-gray-500">{t('description')}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">{t('toolsHeading')}</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/tools/image-compress" className="hover:text-blue-600 transition-colors">Image Compress</Link></li>
              <li><Link href="/tools/pdf-merge" className="hover:text-blue-600 transition-colors">PDF Merge</Link></li>
              <li><Link href="/tools/format-converter" className="hover:text-blue-600 transition-colors">Format Converter</Link></li>
              <li><Link href="/tools/ai-summary" className="hover:text-blue-600 transition-colors">AI Summary</Link></li>
              <li><Link href="/tools/ai-translator" className="hover:text-blue-600 transition-colors">AI Translator</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">{t('moreHeading')}</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/about" className="hover:text-blue-600 transition-colors">{t('about')}</Link></li>
              <li><Link href="/tools/ai-assistant" className="hover:text-blue-600 transition-colors">AI Chat</Link></li>
              <li><Link href="/tools/code-beautifier" className="hover:text-blue-600 transition-colors">Code Beautifier</Link></li>
              <li><Link href="/tools/regex-tester" className="hover:text-blue-600 transition-colors">Regex Tester</Link></li>
              <li><Link href="/tools/color-converter" className="hover:text-blue-600 transition-colors">Color Converter</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">{t('legalHeading')}</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">{t('privacy')}</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 transition-colors">{t('terms')}</Link></li>
              <li><a href="mailto:hello@toolstation.app" className="hover:text-blue-600 transition-colors">{t('contact')}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} {t('copyright')}
        </div>
      </div>
    </footer>
  )
}
