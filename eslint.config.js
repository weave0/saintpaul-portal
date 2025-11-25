import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactPlugin from 'eslint-plugin-react';

// Prettier plugin exports rule namespace via default require; adjust access pattern.
// eslint-plugin-prettier doesn't need to be explicitly imported for flat config; rules referenced by 'prettier/prettier'.

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module'
    },
    plugins: {
      'react-hooks': reactHooks,
      'react': reactPlugin
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': 'warn'
    }
  },
  {
    ignores: [
      'dist/',
      'coverage/',
      'node_modules/',
      '**/vendor/',
      '**/*.d.ts'
    ]
  }
];