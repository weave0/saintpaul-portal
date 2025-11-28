import fs from 'fs';
import path from 'path';
import { gzipSync, brotliCompressSync, constants } from 'zlib';

const distDir = path.resolve(process.cwd(), 'dist');
const outJson = path.join(distDir, 'dist-bundles.json');

function* walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

function isAsset(p) {
  return /(\.js|\.css|\.mjs)$/i.test(p);
}

function formatKB(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

function summarize() {
  if (!fs.existsSync(distDir)) {
    console.error('dist/ not found. Run build first.');
    process.exit(1);
  }
  const files = Array.from(walk(distDir)).filter(isAsset);
  const rows = files.map((p) => {
    const buf = fs.readFileSync(p);
    const gz = gzipSync(buf);
    const br = brotliCompressSync(buf, {
      params: {
        [constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_TEXT,
        [constants.BROTLI_PARAM_QUALITY]: 11,
      },
    });
    return {
      path: path.relative(distDir, p).replaceAll('\\', '/'),
      bytes: buf.length,
      gzipBytes: gz.length,
      brotliBytes: br.length,
    };
  });

  rows.sort((a, b) => b.bytes - a.bytes);
  fs.writeFileSync(outJson, JSON.stringify(rows, null, 2));

  const top = rows.slice(0, 10);
  console.log('Top bundles by raw size (bytes | gzip | br):');
  for (const r of top) {
    console.log(
      `${r.path.padEnd(40)} ${String(r.bytes).padStart(9)} | ${formatKB(r.gzipBytes).padStart(10)} | ${formatKB(r.brotliBytes).padStart(10)}`
    );
  }
  console.log(`\nWrote JSON: ${outJson}`);
}

summarize();
