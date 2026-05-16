import { Link } from '@/i18n'
import { useTranslations } from 'next-intl'
import { ToolData } from '@/lib/tools'
import ToolCard from '@/components/ToolCard'
import ToolSearch from '@/components/ToolSearch'
import ShareButton from '@/components/ShareButton'
import AdBanner from '@/components/AdBanner'
import { tools } from '@/lib/tools'

const categoryConfig = [
  { icon: '🖼️', color: 'border-l-blue-500', key: 'image' },
  { icon: '📄', color: 'border-l-red-500', key: 'pdf' },
  { icon: '🤖', color: 'border-l-purple-500', key: 'ai' },
  { icon: '⚙️', color: 'border-l-green-500', key: 'dev' },
  { icon: '✏️', color: 'border-l-amber-500', key: 'text' },
  { icon: '🎨', color: 'border-l-pink-500', key: 'color' },
]

export default function HomePage() {
  const t = useTranslations('home')
  const toolsT = useTranslations('tools')
  const catLabels = t.raw('categories') as { name: string; description: string }[]
  const stats = t.raw('stats') as Record<string, string>
  const features = t.raw('features') as { title: string; description: string }[]
  const ctaItems = t.raw('cta.items') as string[]

  const getToolKey = (href: string) => href.replace('/tools/', '')
  const translateTool = (tool: ToolData) => ({
    ...tool,
    title: toolsT(`${getToolKey(tool.href)}.title`),
    description: toolsT(`${getToolKey(tool.href)}.desc`),
  })
  const translatedTools = tools.map(translateTool)

  const categories = categoryConfig.map((c, i) => ({
    ...c,
    name: catLabels[i]?.name || c.key,
    description: catLabels[i]?.description || '',
    tools: translatedTools.filter(t => t.category === c.key),
  }))

  const totalTools = tools.length
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <section className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs font-medium rounded-full mb-4">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          {t('badge', { count: totalTools })}
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">{t('title')}<span className="block text-blue-600 mt-1">{t('subtitle')}</span></h1>
        <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-6">{t('heroText')}</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map(cat => (
            <a key={cat.key} href={`#cat-${cat.key}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs font-medium rounded-full transition-colors">
              {cat.icon} {cat.name}
            </a>
          ))}
        </div>
      </section>
      <AdBanner className="mb-10 h-20" />
      <ToolSearch tools={translatedTools} />
      <div className="space-y-8">
        {categories.filter(c => c.tools.length > 0).map(cat => (
          <section key={cat.key} id={`cat-${cat.key}`}>
            <div className={`flex items-center gap-3 mb-4 pl-4 border-l-4 ${cat.color}`}>
              <span className="text-2xl">{cat.icon}</span>
              <div><h2 className="text-lg font-bold">{cat.name}</h2><p className="text-xs text-gray-400">{cat.description}</p></div>
              <span className="ml-auto text-xs text-gray-400">{cat.tools.length} {t('tools')}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {cat.tools.map(tool => (<ToolCard key={tool.href} {...tool} />))}
            </div>
          </section>
        ))}
      </div>
      <section className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl border border-blue-200/50 dark:border-blue-800/30">
          <p className="text-2xl font-bold text-blue-600">{totalTools}</p><p className="text-xs text-gray-500 mt-0.5">{stats.freeTools}</p>
        </div>
        <div className="text-center p-5 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 rounded-xl border border-green-200/50 dark:border-green-800/30">
          <p className="text-2xl font-bold text-green-600">36</p><p className="text-xs text-gray-500 mt-0.5">{stats.apiEndpoints}</p>
        </div>
        <div className="text-center p-5 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl border border-purple-200/50 dark:border-purple-800/30">
          <p className="text-2xl font-bold text-purple-600">100%</p><p className="text-xs text-gray-500 mt-0.5">{stats.browserBased}</p>
        </div>
        <div className="text-center p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
          <p className="text-2xl font-bold text-amber-600">Free</p><p className="text-xs text-gray-500 mt-0.5">{stats.noSignup}</p>
        </div>
      </section>
      <section className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div key={i} className="text-center p-5 rounded-xl border">
            <div className={`w-10 h-10 ${i === 0 ? 'bg-blue-100 dark:bg-blue-900/30' : i === 1 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-purple-100 dark:bg-purple-900/30'} rounded-full flex items-center justify-center mx-auto mb-3`}>
              {i === 0 && <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              {i === 1 && <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
              {i === 2 && <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /></svg>}
            </div>
            <h3 className="font-semibold text-sm mb-1">{f.title}</h3><p className="text-xs text-gray-400">{f.description}</p>
          </div>
        ))}
      </section>
      <section className="mt-14 text-center p-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-750 rounded-2xl border">
        <h2 className="text-xl font-bold mb-2">{t('cta.title')}</h2>
        <p className="text-sm text-gray-500 mb-4">{t('cta.description')}</p>
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-400">
          {ctaItems.map((item, i) => (
            <span key={i}>✓ {item}</span>
          ))}
        </div>
      </section>

      {/* Floating share button */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-2">
        <ShareButton title="ToolStation - Free Online Tools" description={t('heroText')} />
      </div>
      <div className="lg:hidden flex items-center justify-end gap-2 max-w-7xl mx-auto px-4 pb-4">
        <ShareButton title="ToolStation - Free Online Tools" description={t('heroText')} />
      </div>
    </div>
  )
}
