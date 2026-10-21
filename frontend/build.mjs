// esbuild 构建脚本：打出单文件 dist/dq-widget.js（IIFE，零依赖宿主）。
import { build } from 'esbuild';
import { statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const out = 'dist/dq-widget.js';

await build({
  entryPoints: ['src/bundle.js'],
  bundle: true,
  format: 'iife',
  minify: true,
  outfile: out,
  target: ['es2018'],
  // CSS 以文本形式打进 JS（Shadow DOM 内注入）。
  loader: { '.css': 'text' },
  legalComments: 'none',
  logLevel: 'info',
});

const raw = statSync(out).size;
const gz = gzipSync(await (await import('node:fs/promises')).readFile(out)).length;
console.log(`\n[OK] ${out}`);
console.log(`   raw:   ${(raw / 1024).toFixed(0)} KB`);
console.log(`   gzip:  ${(gz / 1024).toFixed(0)} KB`);
