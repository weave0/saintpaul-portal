import { create } from 'zustand';

export const useUIStore = create((set) => ({
  showGrid: true,
  firstPerson: localStorage.getItem('saintpaul-camera-mode') === 'first-person',
  heatmapVisible: false,
  heatmapMetric: 'population',
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleFirstPerson: () => set((s) => {
    const next = !s.firstPerson;
    localStorage.setItem('saintpaul-camera-mode', next ? 'first-person' : 'orbit');
    return { firstPerson: next };
  }),
  toggleHeatmap: () => set((s) => ({ heatmapVisible: !s.heatmapVisible })),
  setHeatmapMetric: (metric) => set(() => ({ heatmapMetric: metric })),
}));
