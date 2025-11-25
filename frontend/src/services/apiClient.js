// Simple API client wrapper allowing a configurable base URL via VITE_API_BASE_URL
const base = import.meta.env.VITE_API_BASE_URL || '';

export async function apiGet(path) {
  const r = await fetch(base + path);
  if (!r.ok) throw new Error(`GET ${path} failed: ${r.status}`);
  return r.json();
}

export async function apiPost(path, body) {
  const r = await fetch(base + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(`POST ${path} failed: ${r.status}`);
  return r.json();
}

export async function apiPut(path, body) {
  const r = await fetch(base + path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(`PUT ${path} failed: ${r.status}`);
  return r.json();
}

export async function apiDelete(path) {
  const r = await fetch(base + path, { method: 'DELETE' });
  if (!r.ok) throw new Error(`DELETE ${path} failed: ${r.status}`);
  return r.json();
}

export function getBaseUrl() { return base; }
