// Scope: network foundation notes + network practice labs. Run before every VitePress build.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const networkRoot = join(root, 'docs/networking');
const labsRoot = join(root, 'docs/projects/networking-labs');
const paths = [];
const errors = [];

function visit(path) {
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const child = join(path, entry.name);
    if (entry.isDirectory()) {
      if (!existsSync(join(child, 'README.md'))) {
        errors.push('missing directory map: ' + relative(root, child) + '/README.md');
      }
      visit(child);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      paths.push(child);
    }
  }
}
visit(networkRoot);
visit(labsRoot);

const config = readFileSync(join(root, '.vitepress/config.mjs'), 'utf8');
const requiredCategories = ['foundations', 'lan', 'internet', 'transport', 'application', 'programming', 'operations', 'advanced', 'networking-labs'];
for (const name of requiredCategories) {
  if (!config.includes(name + ':') && !config.includes("'" + name + "':")) {
    errors.push('missing Chinese directoryNames mapping for ' + name);
  }
}
const dateRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

for (const path of paths) {
  const name = relative(root, path).split(sep).join('/');
  const raw = readFileSync(path, 'utf8');
  let parsed;
  try { parsed = matter(raw); }
  catch (e) { errors.push(name + ': invalid front matter: ' + e.message); continue; }
  const meta = parsed.data;
  const content = parsed.content;
  const expected = path.startsWith(networkRoot + sep) ? 'networking' : 'projects';

  for (const key of ['title', 'description', 'author', 'category', 'tags', 'status', 'created', 'updated']) {
    if (meta[key] === undefined || meta[key] === null || meta[key] === '') {
      errors.push(name + ': required frontmatter ' + key + ' missing');
    }
  }
  if (meta.category !== expected) errors.push(name + ': category must be ' + expected);
  if (meta.author !== 'zmd6s6') errors.push(name + ': author must be zmd6s6');
  if (!Array.isArray(meta.tags) || meta.tags.length === 0) errors.push(name + ': tags must be a nonempty array');
  if (!['draft','active','stable','deprecated'].includes(meta.status)) errors.push(name + ': invalid status');
  for (const key of ['created', 'updated']) {
    const value = meta[key];
    const normalized = value instanceof Date ? value.toISOString().slice(0, 10) : String(value);
    if (!dateRegex.test(normalized)) errors.push(name + ': invalid ' + key + ' date');
  }
  if (!name.endsWith('/README.md') && !/\/[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(name)) {
    errors.push(name + ': non-stable filename slug');
  }
  if (!/^#\s+.+/m.test(content)) errors.push(name + ': missing H1 heading');
  if (!/^## 修订记录$/m.test(content)) errors.push(name + ': missing revision history section');
  if (!/^\|\s*日期\s*\|\s*作者\s*\|\s*变更\s*\|/m.test(content)) errors.push(name + ': missing revision history table header');
  if (!/^\|\s*2026-10-15\s*\|\s*zmd6s6\s*\|/m.test(content) && name.includes('/networking/')) {
    errors.push(name + ': missing October 15 revision entry');
  }
  const pattern = /!?\[[^\]]*\]\(([^)]+)\)/g;
  for (const m of content.matchAll(pattern)) {
    let href = m[1].trim();
    if (!href || /^(?:https?:\/\/|mailto:|#|data:)/i.test(href)) continue;
    href = href.split('#')[0].split('?')[0];
    if (!href || href.startsWith('/')) continue; // VitePress base-relative URL, not a local file link.
    const target = resolve(dirname(path), decodeURIComponent(href));
    if (!target.startsWith(root + sep)) {
      errors.push(name + ': link leaves repository: ' + href);
    } else if (!existsSync(target)) {
      errors.push(name + ': broken relative link: ' + href);
    } else if (path.startsWith(networkRoot + sep) &&
               target.startsWith(join(root, 'docs/projects') + sep)) {
      errors.push(name + ': knowledge domain links directly to project domain: ' + href);
    }
  }
}

if (errors.length) {
  console.error('AGENTS.md network content checks failed: ' + errors.length);
  for (const err of errors) console.error(' - ' + err);
  process.exit(1);
}
console.log('AGENTS.md network checks passed for ' + paths.length + ' Markdown pages.');
