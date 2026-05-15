import fs from 'fs'
import path from 'path'

const dir = path.join(process.cwd(), 'src/app/[locale]/tools')
const tools = fs.readdirSync(dir)
let count = 0

for (const tool of tools) {
  const layoutPath = path.join(dir, tool, 'layout.tsx')
  if (!fs.existsSync(layoutPath)) continue

  let content = fs.readFileSync(layoutPath, 'utf8')

  // Extract title and description from static metadata
  const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/)
  const descMatch = content.match(/description:\s*['"]([^'"]+)['"]/)

  if (!titleMatch || !descMatch) {
    console.log(`Skip ${tool}: no title/desc found`)
    continue
  }

  const title = titleMatch[1].replace(/\\'/g, "'")
  const desc = descMatch[1].replace(/\\'/g, "'")

  const newContent = `import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, '${title.replace(/'/g, "\\'")}', '${desc.replace(/'/g, "\\'")}', '${tool}')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
`

  // Replace the entire file content
  fs.writeFileSync(layoutPath, newContent)
  count++
}

console.log(`Updated ${count} layout files`)
