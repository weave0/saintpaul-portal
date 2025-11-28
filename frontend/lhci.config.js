// Lighthouse CI configuration for local static dist testing
// Uses LHCI's built-in static server to avoid preview/headless quirks
/** @type {import('@lhci/cli').AssertOptions & any} */
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      numberOfRuns: 1,
      settings: {
        formFactor: 'desktop',
        screenEmulation: { mobile: false, width: 1366, height: 768, deviceScaleFactor: 1, disabled: false },
        disableStorageReset: true,
        chromeFlags: '--allow-insecure-localhost --disable-dev-shm-usage --no-first-run --no-default-browser-check --no-sandbox',
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci',
      reportFilenamePattern: 'lhci-%%DATETIME%%-report.%%EXTENSION%%',
    },
  },
};
