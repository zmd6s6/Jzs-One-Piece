import { defineConfig } from 'vitepress'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const domains = [
  ['cpp', 'C++'], ['qt', 'Qt'], ['backend', '后端开发'],
  ['devops', 'DevOps'], ['ai', 'AI 与 Agent'],
  ['architecture', '架构设计'], ['projects', '项目实践'],
  ['finance', '金融与投资'], ['notes', '随手记录']
]
const directoryNames = {
  handbook: '金融基础手册', casebook: '真实案例',
  'foundations-48-day': '48 天学习计划', templates: '研究模板'
}
function title(path) {
  const source = readFileSync(join(root, path), 'utf8')
  const { data, content } = matter(source)
  return data.title || content.match(/^#\s+(.+)$/m)?.[1] || path.split('/').at(-1).replace(/\.md$/, '')
}
function items(path) {
  const entries = readdirSync(join(root, path), { withFileTypes: true })
    .filter(entry => !entry.name.startsWith('.'))
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }))
  const readme = entries.find(entry => entry.name === 'README.md')
  const result = readme ? [{ text: '概览', link: `/${path}/README` }] : []
  for (const entry of entries) {
    const relative = `${path}/${entry.name}`
    if (entry.isDirectory()) {
      result.push({ text: directoryNames[entry.name] || entry.name, collapsed: true, items: items(relative) })
    } else if (entry.name.endsWith('.md') && entry.name !== 'README.md') {
      result.push({ text: title(relative), link: `/${relative.slice(0, -3)}` })
    }
  }
  return result
}

export default defineConfig({
  lang: 'zh-CN',
  title: 'Jzs-One-Piece',
  description: '个人知识地图：技术实践、架构设计、AI 与金融学习。',
  base: '/Jzs-One-Piece/',
  srcExclude: ['AGENTS.md', 'templates/**', 'assets/README.md'],
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: '知识地图', link: '/docs/README' },
      { text: '金融手册', link: '/docs/finance/handbook/README' },
      { text: '48 天学习', link: '/docs/finance/foundations-48-day/README' },
      { text: 'GitHub', link: 'https://github.com/zmd6s6/Jzs-One-Piece' }
    ],
    sidebar: domains.map(([directory, text]) => ({ text, collapsed: directory !== 'finance', items: items(`docs/${directory}`) })),
    search: {
      provider: 'local',
      options: {
        locales: { root: { translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: { noResultsText: '没有找到相关文档', resetButtonTitle: '清除搜索',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' } }
        } } }
      }
    },
    outline: { label: '本页目录', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最后更新', formatOptions: { dateStyle: 'medium' } },
    editLink: { pattern: 'https://github.com/zmd6s6/Jzs-One-Piece/edit/main/:path', text: '在 GitHub 上编辑此页' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/zmd6s6/Jzs-One-Piece' }],
    footer: { message: 'One piece at a time.' }
  }
})
