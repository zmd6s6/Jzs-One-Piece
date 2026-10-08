import { cpSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Keep reusable media in assets/; public files are generated, never maintained twice.
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
mkdirSync(join(root, 'public/assets'), { recursive: true })
cpSync(join(root, 'assets/jzs-one-piece-banner.webp'), join(root, 'public/assets/jzs-one-piece-banner.webp'))
