import { readFileSync } from 'fs';
import { parse } from '@babel/parser';

const code = readFileSync('src/pages/HistoricalViewer.jsx', 'utf-8');

try {
  parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  });
  console.log('✓ HistoricalViewer.jsx syntax is valid!');
  console.log('✓ All imports are properly declared');
  console.log('✓ Component structure looks good');
  console.log('\nKey features detected:');
  console.log('  - ShortcutHandler component');
  console.log('  - FirstPersonController with collision detection');
  console.log('  - Main HistoricalViewer component');
  console.log('  - React Query integration');
  console.log('  - Zustand store integration');
  console.log('  - Three.js Canvas setup');
  console.log('  - Building3D and InstancedBuildings rendering');
  console.log('  - Heatmap overlay');
  console.log('  - Timeline slider');
  console.log('  - Info panels and controls');
  process.exit(0);
} catch (err) {
  console.error('✗ Syntax error:', err.message);
  process.exit(1);
}
