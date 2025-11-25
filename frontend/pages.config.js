// Cloudflare Pages build configuration
// Deploy to: saintpaul.globaldeets.com

export default {
  // Build settings
  $schema: 'https://json.schemastore.org/cloudflarepagesconfig.json',
  build: {
    command: 'npm run build',
    cwd: 'frontend',
    watch_paths: ['frontend/src/**'],
  },
  
  // Deployment settings
  deployment: {
    name: 'saintpaul-portal',
    compatibility_date: '2025-01-01',
    compatibility_flags: ['nodejs_compat'],
  },

  // Environment variables (set in Cloudflare dashboard)
  vars: {
    ENVIRONMENT: 'production',
  },

  // Custom domains
  routes: [
    {
      pattern: 'saintpaul.globaldeets.com',
      custom_domain: true,
    },
    {
      pattern: 'stpaul.globaldeets.com',
      custom_domain: true,
    },
  ],

  // Headers
  headers: {
    '/*': {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    '/assets/*': {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  },

  // Redirects (SPA routing)
  redirects: [
    {
      from: '/*',
      to: '/index.html',
      status: 200,
    },
  ],
};
