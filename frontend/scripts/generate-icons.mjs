import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const root = process.cwd();
const srcIcon = path.join(root, 'public', 'icon.svg');
const outDir = path.join(root, 'public', 'icons');

if (!fs.existsSync(srcIcon)) {
  console.error(`Missing source icon: ${srcIcon}`);
  process.exit(1);
}
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const targets = [
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' }
];

async function run() {
  for (const t of targets) {
    const out = path.join(outDir, t.name);
    await sharp(srcIcon)
      .resize(t.size, t.size, { fit: 'cover' })
      .png({ compressionLevel: 9 })
      .toFile(out);
    console.log(`Wrote ${out}`);
  }
}

run().catch((e) => { console.error(e); process.exit(1); });
