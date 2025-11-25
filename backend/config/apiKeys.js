// Centralized API key access. Never commit real private keys.
// Loads from process.env; ensure .env is present locally and secrets are stored securely in production.

function getApiKeys() {
  const publicKey = process.env.API_PUBLIC_KEY;
  const privateKey = process.env.API_PRIVATE_KEY; // Keep out of logs
  if (!publicKey) {
    throw new Error('Missing API_PUBLIC_KEY environment variable');
  }
  if (!privateKey) {
    // For some APIs public operations may still work; warn instead of throwing.
    console.warn('Warning: Missing API_PRIVATE_KEY environment variable');
  }
  return { publicKey, privateKey };
}

module.exports = { getApiKeys };