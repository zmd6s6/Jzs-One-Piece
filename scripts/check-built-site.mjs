import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const dist = join(process.cwd(), '.vitepress/dist');
const required = [
  'index.html',
  'docs/README.html',
  'docs/networking/README.html',
  'docs/networking/foundations/first-network-request.html',
  'docs/networking/programming/qt-network.html',
  'docs/projects/networking-labs/README.html',
  'docs/projects/networking-labs/lab08-network-debug.html'
];
const missing = required.filter(page => !existsSync(join(dist, page)));
if (missing.length) {
  console.error('Expected Pages output missing:', missing);
  process.exit(1);
}
const html = readFileSync(join(dist, 'docs/networking/README.html'), 'utf8');
if (!html.includes('16 周') || !html.includes('TCP')) {
  console.error('Built networking page does not contain its learning roadmap.');
  process.exit(1);
}
console.log('VitePress output verified: ' + required.length + ' key pages exist.');
