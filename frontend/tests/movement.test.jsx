import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HistoricalViewer from '../src/pages/HistoricalViewer';
import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('HistoricalViewer - Camera Mode & Movement', () => {
  beforeEach(() => {
    // Reset localStorage before each test
    localStorage.clear();
    
    // Mock fetch responses
    global.fetch.mockImplementation((url) => {
      if (url.includes('/data/historical-snapshots.json')) {
        return Promise.resolve({
          json: () => Promise.resolve({
            snapshots: [
              {
                year: 1905,
                era: 'Early 1900s',
                population: 200000,
                buildings: [],
                streets: []
              }
            ]
          })
        });
      }
      if (url.includes('/api/building-specs')) {
        return Promise.resolve({
          json: () => Promise.resolve([])
        });
      }
      if (url.includes('/api/reconstructions')) {
        return Promise.resolve({
          json: () => Promise.resolve([])
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render camera mode toggle button', async () => {
    render(
      <BrowserRouter>
        <HistoricalViewer />
      </BrowserRouter>
    );

    await waitFor(() => {
      const toggleButton = screen.getByRole('button', { name: /enable first-person/i });
      expect(toggleButton).toBeInTheDocument();
    });
  });

  it('should toggle between orbit and first-person mode', async () => {
    render(
      <BrowserRouter>
        <HistoricalViewer />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /enable first-person/i })).toBeInTheDocument();
    });

    const toggleButton = screen.getByRole('button', { name: /enable first-person/i });
    
    // Click to enable first-person
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /disable first-person/i })).toBeInTheDocument();
    });

    // Click to disable first-person
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /enable first-person/i })).toBeInTheDocument();
    });
  });

  it('should persist camera mode preference in localStorage', async () => {
    render(
      <BrowserRouter>
        <HistoricalViewer />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /enable first-person/i })).toBeInTheDocument();
    });

    // Initially should be orbit mode
    expect(localStorage.getItem('saintpaul-camera-mode')).toBe('orbit');

    const toggleButton = screen.getByRole('button', { name: /enable first-person/i });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(localStorage.getItem('saintpaul-camera-mode')).toBe('first-person');
    });

    // Toggle back
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(localStorage.getItem('saintpaul-camera-mode')).toBe('orbit');
    });
  });

  it('should restore camera mode from localStorage on mount', async () => {
    // Set localStorage to first-person before mounting
    localStorage.setItem('saintpaul-camera-mode', 'first-person');

    render(
      <BrowserRouter>
        <HistoricalViewer />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /disable first-person/i })).toBeInTheDocument();
    });
  });

  it('should display appropriate controls instructions for orbit mode', async () => {
    render(
      <BrowserRouter>
        <HistoricalViewer />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/left click \+ drag: rotate/i)).toBeInTheDocument();
      expect(screen.getByText(/scroll: zoom/i)).toBeInTheDocument();
    });
  });

  it('should display appropriate controls instructions for first-person mode', async () => {
    render(
      <BrowserRouter>
        <HistoricalViewer />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /enable first-person/i })).toBeInTheDocument();
    });

    const toggleButton = screen.getByRole('button', { name: /enable first-person/i });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText(/w\/a\/s\/d: move/i)).toBeInTheDocument();
      expect(screen.getByText(/shift: sprint/i)).toBeInTheDocument();
      expect(screen.getByText(/mouse move: look/i)).toBeInTheDocument();
    });
  });

  it('should toggle grid visibility', async () => {
    render(
      <BrowserRouter>
        <HistoricalViewer />
      </BrowserRouter>
    );

    await waitFor(() => {
      const gridButton = screen.getByRole('button', { name: /toggle grid/i });
      expect(gridButton).toBeInTheDocument();
    });

    const gridButton = screen.getByRole('button', { name: /toggle grid/i });
    
    // Grid should be visible initially (Visibility icon)
    fireEvent.click(gridButton);
    
    // After click, grid should be hidden (VisibilityOff icon)
    // This is a basic interaction test; actual 3D rendering behavior would need more complex mocking
  });
});

describe('HeatmapOverlay Controls', () => {
  beforeEach(() => {
    localStorage.clear();
    
    global.fetch.mockImplementation((url) => {
      if (url.includes('/data/historical-snapshots.json')) {
        return Promise.resolve({
          json: () => Promise.resolve({ snapshots: [{ year: 1905, era: 'Test', population: 100000, buildings: [], streets: [] }] })
        });
      }
      if (url.includes('/api/insights/heatmap/')) {
        return Promise.resolve({
          json: () => Promise.resolve({ grid: [] })
        });
      }
      return Promise.resolve({ json: () => Promise.resolve([]) });
    });
  });

  it('should render heatmap controls panel', async () => {
    render(
      <BrowserRouter>
        <HistoricalViewer />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/insight heatmap/i)).toBeInTheDocument();
    });
  });

  it('should toggle heatmap visibility via switch', async () => {
    render(
      <BrowserRouter>
        <HistoricalViewer />
      </BrowserRouter>
    );

    await waitFor(() => {
      const heatmapSwitch = screen.getByRole('checkbox', { name: /show heatmap/i });
      expect(heatmapSwitch).toBeInTheDocument();
      expect(heatmapSwitch).not.toBeChecked();
    });

    const heatmapSwitch = screen.getByRole('checkbox', { name: /show heatmap/i });
    fireEvent.click(heatmapSwitch);

    await waitFor(() => {
      expect(heatmapSwitch).toBeChecked();
    });
  });

  it('should show metric selector when heatmap is enabled', async () => {
    render(
      <BrowserRouter>
        <HistoricalViewer />
      </BrowserRouter>
    );

    await waitFor(() => {
      const heatmapSwitch = screen.getByRole('checkbox', { name: /show heatmap/i });
      fireEvent.click(heatmapSwitch);
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/metric/i)).toBeInTheDocument();
    });
  });
});
