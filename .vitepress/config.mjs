import { defineConfig } from 'vitepress'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const domains = [
  ['cpp', 'C++'], ['qt', 'Qt'], ['backend', '后端开发'], ['networking', '计算机网络'],
  ['devops', 'DevOps'], ['ai', 'AI 与 Agent'],
  ['architecture', '架构设计'], ['projects', '项目实践'],
  ['finance', '金融与投资'], ['notes', '随手记录']
]
const directoryNames = {
  handbook: '金融基础手册', casebook: '真实案例',
  'foundations-48-day': '48 天学习计划', templates: '研究模板',
  'medical-platform': '医疗信息化平台',
  kubernetes: 'Kubernetes', internals: '机制原理',
  foundations: '零基础网络直觉', lan: '局域网', internet: 'IP 与路由',
  transport: 'TCP 与 UDP', application: 'DNS、HTTP 与 TLS',
  programming: 'Socket 与网络编程', operations: '抓包与故障排查',
  advanced: '性能、安全与容器网络', 'networking-labs': '计算机网络动手实验'
}
// Preserve original Markdown URLs, but display the legacy network notes in their learning stage.
const networkingStageOrder = [
  'foundations', 'lan', 'internet', 'transport',
  'application', 'programming', 'operations', 'advanced'
];
const networkingLegacyRootPages = new Set([
  'ip-subnet-and-routing.md', 'nat-and-port-forward.md',
  'tcp-udp-refused-vs-timeout.md', 'dns-name-to-address.md'
]);
const networkingStageReferences = {
  'docs/networking/internet': ['docs/networking/ip-subnet-and-routing.md', 'docs/networking/nat-and-port-forward.md'],
  'docs/networking/transport': ['docs/networking/tcp-udp-refused-vs-timeout.md'],
  'docs/networking/application': ['docs/networking/dns-name-to-address.md']
};

const networkingLessonOrder = {
  'docs/networking/foundations': [
    'first-network-request', 'bits-bytes-and-packets', 'layers-and-encapsulation', 'four-kinds-of-address'
  ],
  'docs/networking/lan': [
    'home-network-devices', 'ethernet-switch-arp', 'dhcp-automatic-addressing', 'wifi-and-ethernet'
  ],
  'docs/networking/internet': [
    'ip-subnet-and-routing', 'icmp-and-path-probing', 'nat-and-port-forward', 'ipv6-first-look'
  ],
  'docs/networking/transport': [
    'tcp-vs-udp', 'tcp-udp-refused-vs-timeout', 'tcp-connection-lifecycle', 'tcp-reliability', 'tcp-congestion-control'
  ],
  'docs/networking/application': [
    'dns-name-to-address', 'http-core', 'https-tls', 'http-versions',
    'browser-request-walkthrough', 'websocket-grpc'
  ],
  'docs/networking/programming': [
    'socket-lifecycle', 'tcp-message-framing', 'io-multiplexing', 'java-nio-netty', 'qt-network'
  ],
  'docs/networking/operations': [
    'troubleshooting-order', 'packet-capture-basics',
    'timeouts-retries-idempotency', 'reverse-proxy-load-balancer'
  ],
  'docs/networking/advanced': [
    'network-performance', 'network-security', 'container-networking'
  ]
}

function title(path) {
  const source = readFileSync(join(root, path), 'utf8')
  const { data, content } = matter(source)
  return data.title || content.match(/^#\s+(.+)$/m)?.[1] || path.split('/').at(-1).replace(/\.md$/, '')
}
function items(path) {
  const entries = readdirSync(join(root, path), { withFileTypes: true })
    .filter(entry => !entry.name.startsWith('.'))
    .sort((a, b) => {
      // Root network sidebar follows the learning path, rather than alphabetic folders.
      if (path === 'docs/networking') {
        if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1
        if (a.isDirectory()) {
          return networkingStageOrder.indexOf(a.name) - networkingStageOrder.indexOf(b.name)
        }
      }
      return a.name.localeCompare(b.name, 'en', { numeric: true })
    })
  const readme = entries.find(entry => entry.name === 'README.md')
  const result = readme ? [{ text: '概览', link: `/${path}/README` }] : []
  for (const entry of entries) {
    const relative = `${path}/${entry.name}`
    if (entry.isDirectory()) {
      result.push({ text: directoryNames[entry.name] || entry.name, collapsed: true, items: items(relative) })
    } else if (entry.name.endsWith('.md') && entry.name !== 'README.md') {
      // Historical pages keep their stable URLs, but deprecated duplicates are not separate lessons.
      if (path === 'docs/networking' && networkingLegacyRootPages.has(entry.name)) continue
      if (path.startsWith('docs/networking/')) {
        const { data } = matter(readFileSync(join(root, relative), 'utf8'))
        if (data.status === 'deprecated') continue
      }
      result.push({ text: title(relative), link: `/${relative.slice(0, -3)}` })
    }
  }
  const extra = networkingStageReferences[path] || []
  // Keep the old physical pages under docs/networking/, but surface them under their logical stage.
  for (const page of [...extra].reverse()) {
    result.splice(1, 0, { text: title(page), link: `/${page.slice(0, -3)}` })
  }
  // The sidebar must follow prerequisite order, not the alphabetical English slugs.
  const stageOrder = networkingLessonOrder[path]
  if (stageOrder) {
    const ranked = result.slice(1).sort((a, b) => {
      const idA = a.link?.split('/').at(-1) || ''
      const idB = b.link?.split('/').at(-1) || ''
      const rank = id => {
        const index = stageOrder.indexOf(id)
        return index === -1 ? Number.MAX_SAFE_INTEGER : index
      }
      return rank(idA) - rank(idB)
    })
    result.splice(1, result.length - 1, ...ranked)
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
  markdown: {
    config(md) {
      // CMS authors enter the title separately from the body. Preserve existing H1s.
      md.core.ruler.after('block', 'cms-title', state => {
        const { title, layout } = state.env.frontmatter || {}
        if (!title || layout === 'home' || state.tokens.some(token => token.type === 'heading_open' && token.tag === 'h1')) return
        const opening = new state.Token('heading_open', 'h1', 1)
        opening.map = [0, 0]
        opening.markup = '#'
        const inline = new state.Token('inline', '', 0)
        inline.content = String(title)
        inline.children = []
        inline.level = 1
        const closing = new state.Token('heading_close', 'h1', -1)
        closing.markup = '#'
        state.tokens.unshift(opening, inline, closing)
      })
    }
  },
  themeConfig: {
    nav: [
      { text: '知识地图', link: '/docs/README' },
      { text: '金融手册', link: '/docs/finance/handbook/README' },
      { text: '48 天学习', link: '/docs/finance/foundations-48-day/README' },
      { text: '写文章', link: 'https://app.pagescms.org' },
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
