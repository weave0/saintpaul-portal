import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import StatusPanel from '../components/StatusPanel';

describe('StatusPanel', () => {
  const queryClient = new QueryClient();
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders loading then status chip', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ status: 'connected', ready: true, timestamp: new Date().toISOString() }) })));
    render(
      <QueryClientProvider client={queryClient}>
        <StatusPanel />
      </QueryClientProvider>
    );
    expect(screen.getByText(/Loading/i)).toBeTruthy();
    await waitFor(() => expect(screen.getByText(/connected/i)).toBeTruthy());
  });
});