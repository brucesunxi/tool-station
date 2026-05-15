import type { Metadata } from 'next'
import zhMessages from '@/messages/zh.json'

const zhTools = (zhMessages as any).tools as Record<string, { title: string; desc: string }>

export async function getToolMetadata(
  params: { locale?: string },
  enTitle: string,
  enDesc: string,
  toolKey: string,
): Promise<Metadata> {
  const isZh = params.locale === 'zh'
  if (isZh && zhTools[toolKey]) {
    return {
      title: zhTools[toolKey].title,
      description: zhTools[toolKey].desc,
    }
  }
  return {
    title: enTitle,
    description: enDesc,
  }
}
