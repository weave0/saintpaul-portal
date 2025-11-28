import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const reportsDir = path.resolve(process.cwd(), '.lighthouseci');

if (!fs.existsSync(reportsDir)) {
  console.error('No .lighthouseci directory found. Run `pnpm lhci` first.');
  process.exit(1);
}

const files = fs
  .readdirSync(reportsDir)
  .filter((f) => f.endsWith('.html'))
  .map((f) => ({ f, t: fs.statSync(path.join(reportsDir, f)).mtimeMs }))
  .sort((a, b) => b.t - a.t);

if (files.length === 0) {
  console.error('No LHCI HTML reports found.');
  process.exit(1);
}

const latest = path.join(reportsDir, files[0].f);
console.log(`Opening: ${latest}`);

const isWin = process.platform === 'win32';
const isMac = process.platform === 'darwin';

if (isWin) {
  spawn('powershell', ['-NoProfile', '-Command', `Start-Process \"${latest}\"`], { stdio: 'inherit' });
} else if (isMac) {
  spawn('open', [latest], { stdio: 'inherit' });
} else {
  spawn('xdg-open', [latest], { stdio: 'inherit' });
}
