module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  settings: {
    react: { version: 'detect' }
  },
  plugins: ['react', 'react-hooks', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  rules: {
    'prettier/prettier': 'warn',
    'react/prop-types': 'off',
    'react/jsx-uses-react': 'off', // React 17+ JSX transform
    'react/react-in-jsx-scope': 'off'
  },
  ignorePatterns: ['dist/', 'coverage/', 'node_modules/', 'frontend/dist/', 'backend/node_modules/']
};