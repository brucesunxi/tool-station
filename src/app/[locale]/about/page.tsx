import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n'
import { tools } from '@/lib/tools'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  return {
    title: t('title'),
    description: 'About ToolStation — free online tools powered by AI for everyone.',
  }
}

export default function AboutPage() {
  const t = useTranslations('about')
  const toolsT = useTranslations('tools')

  const whyItems = t.raw('whyItems') as string[]
  const getToolKey = (href: string) => href.replace('/tools/', '')

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

      <div className="space-y-8 text-gray-600 dark:text-gray-400">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('whatIsHeading')}</h2>
          <p>{t('whatIsText', { count: tools.length })}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('whyHeading')}</h2>
          <ul className="space-y-2">
            {whyItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('allToolsHeading')} ({tools.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {tools.map(t => (
              <Link key={t.href} href={t.href}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                {toolsT(`${getToolKey(t.href)}.title`)}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('technologyHeading')}</h2>
          <p>{t('technologyText')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('contactHeading')}</h2>
          <p>
            {t('contactText')}{' '}
            <a href="mailto:hello@toolstation.app" className="text-blue-600 dark:text-blue-400 hover:underline">
              hello@toolstation.app
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
