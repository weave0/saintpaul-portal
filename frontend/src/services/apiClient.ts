const base: string = import.meta.env.VITE_API_BASE_URL || '';

export async function apiGet<T = any>(path: string): Promise<T> {
  const r = await fetch(base + path);
  if (!r.ok) throw new Error(`GET ${path} failed: ${r.status}`);
  return r.json();
}

export async function apiPost<T = any>(path: string, body: unknown): Promise<T> {
  const r = await fetch(base + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(`POST ${path} failed: ${r.status}`);
  return r.json();
}

export async function apiPut<T = any>(path: string, body: unknown): Promise<T> {
  const r = await fetch(base + path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(`PUT ${path} failed: ${r.status}`);
  return r.json();
}

export async function apiDelete<T = any>(path: string): Promise<T> {
  const r = await fetch(base + path, { method: 'DELETE' });
  if (!r.ok) throw new Error(`DELETE ${path} failed: ${r.status}`);
  return r.json();
}

export function getBaseUrl(): string { return base; }
