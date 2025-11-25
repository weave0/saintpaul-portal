import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import HistoricalViewer from '../pages/HistoricalViewer';

// Mock three/fiber heavy components to avoid WebGL in test environment
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => <div data-testid="canvas">{children}</div>,
  useThree: () => ({ camera: { position: { y: 10 }, getWorldDirection: () => ({}) } }),
  useFrame: () => {}
}));
vi.mock('@react-three/drei', () => ({ OrbitControls: () => null, Environment: () => null, Sky: () => null, Grid: () => null }));
vi.mock('../components/Building3D', () => ({ default: () => <div data-testid="building" /> }));
vi.mock('../components/TimelineSlider', () => ({ default: ({ value }) => <div>Year:{value}</div> }));
vi.mock('../components/HeatmapOverlay', () => ({ default: () => null, HeatmapControls: () => null }));

describe('HistoricalViewer smoke', () => {
  const queryClient = new QueryClient();
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders after data loads', async () => {
    const snapshotsPayload = { snapshots: [{ year: 1905, era: 'Gilded Age', population: 1000, buildings: [], streets: [] }] };
    const reconPayload = [];
    const buildingSpecsPayload = { data: [] };
    vi.stubGlobal('fetch', vi.fn((url) => {
      if (url.includes('historical-snapshots')) return Promise.resolve({ ok: true, json: async () => snapshotsPayload });
      if (url.includes('/api/reconstructions')) return Promise.resolve({ ok: true, json: async () => reconPayload });
      if (url.includes('/api/building-specs')) return Promise.resolve({ ok: true, json: async () => buildingSpecsPayload });
      if (url.includes('/api/reconstructions/diff')) return Promise.resolve({ ok: true, json: async () => ({ summary: { added: 0, removed: 0, changed: 0 } }) });
      return Promise.resolve({ ok: true, json: async () => ({}) });
    }));
    render(
      <QueryClientProvider client={queryClient}>
        <HistoricalViewer />
      </QueryClientProvider>
    );
    await waitFor(() => expect(screen.getByText(/Year:1905/)).toBeTruthy());
    expect(screen.getByTestId('canvas')).toBeTruthy();
  });
});