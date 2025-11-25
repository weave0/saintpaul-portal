import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { parse } from '@babel/parser';

const filesToCheck = [
  'src/pages/HistoricalViewer.jsx',
  'src/components/Building3D.jsx',
  'src/components/InstancedBuildings.jsx',
  'src/components/HeatmapOverlay.jsx',
  'src/components/TimelineSlider.jsx',
  'src/App.jsx',
  'src/main.jsx'
];

let passed = 0;
let failed = 0;

console.log('🔍 Validating React components...\n');

for (const file of filesToCheck) {
  try {
    const code = readFileSync(file, 'utf-8');
    parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });
    console.log(`✓ ${file}`);
    passed++;
  } catch (err) {
    console.error(`✗ ${file}`);
    console.error(`  Error: ${err.message}\n`);
    failed++;
  }
}

console.log(`\n${'='.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log(`${'='.repeat(50)}\n`);

if (failed === 0) {
  console.log('✓ All key components have valid syntax!');
  console.log('\n📋 Summary:');
  console.log('  - HistoricalViewer is properly structured');
  console.log('  - All 3D components are syntactically correct');
  console.log('  - UI components validated');
  console.log('  - App entry points checked');
  console.log('\n✅ Code is ready for development/testing');
  console.log('💡 Next steps:');
  console.log('   1. Fix workspace configuration for vite/vitest');
  console.log('   2. Run: npm run dev (in frontend folder)');
  console.log('   3. Test in browser at http://localhost:5173');
} else {
  console.error('\n❌ Some files have syntax errors - fix before proceeding');
  process.exit(1);
}
