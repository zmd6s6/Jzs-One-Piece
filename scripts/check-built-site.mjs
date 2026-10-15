import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const dist = join(process.cwd(), '.vitepress/dist');
const required = [
  'index.html',
  'docs/README.html',
  'docs/networking/README.html',
  'docs/networking/foundations/first-network-request.html',
  'docs/networking/foundations/bits-bytes-and-packets.html',
  'docs/networking/lan/home-network-devices.html',
  'docs/networking/application/browser-request-walkthrough.html',
  'docs/projects/networking-labs/lab00-browser-observation.html',
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
if (!html.includes('分阶段学习地图') || !html.includes('逐步掌握技术')) {
  console.error('Built networking page does not contain its learning roadmap.');
  process.exit(1);
}
const beginner = readFileSync(join(dist, 'docs/networking/foundations/first-network-request.html'), 'utf8');
if (!beginner.includes('浏览器') || !beginner.includes('客户端')) {
  console.error('Beginner lesson does not explain the communication participants.');
  process.exit(1);
}
const synthesis = readFileSync(join(dist, 'docs/networking/application/browser-request-walkthrough.html'), 'utf8');
if (!synthesis.includes('DNS') || !synthesis.includes('TLS')) {
  console.error('The post-prerequisite HTTPS synthesis is missing core stages.');
  process.exit(1);
}
console.log('VitePress output verified: ' + required.length + ' key pages exist, including novice lessons and deferred synthesis.');
