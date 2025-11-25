// Shared TypeScript type declarations for both frontend and backend (incremental adoption)

export interface BuildingSpecSource {
  name?: string;
  year?: number;
  url?: string;
  type?: string;
  rawReference?: string;
  confidence?: 'very_high' | 'high' | 'medium' | 'low' | 'estimated';
}

export interface BuildingSpecHeight {
  roofHeight_m?: number;
  eaveHeight_m?: number;
  stories?: number;
  storyHeight_m?: number;
}

export interface BuildingSpecDimensions {
  length_m?: number;
  width_m?: number;
  area_m2?: number;
  footprintAccuracy_m?: number;
}

export interface BuildingSpecMaterialEntry {
  material?: string;
  percentage?: number;
}

export interface BuildingAlteration {
  year?: number;
  description?: string;
  type?: string;
}

export interface BuildingSpecRevision {
  version?: number;
  notes?: string;
}

export interface BuildingSpec {
  _id?: string;
  name: string;
  centroid: { lat: number; lon: number };
  footprint?: [number, number][];
  dimensions?: BuildingSpecDimensions;
  height?: BuildingSpecHeight;
  materials?: BuildingSpecMaterialEntry[];
  roof?: { type?: string; material?: string; geometryNotes?: string };
  architecturalStyle?: string;
  yearConstructed?: number;
  status: 'existing' | 'demolished' | 'under_construction' | 'planned';
  sources?: BuildingSpecSource[];
  alterations?: BuildingAlteration[];
  revision?: BuildingSpecRevision;
}

export interface ReconstructionSnapshot {
  _id?: string;
  year: number;
  label?: string;
  description?: string;
  specRefs: string[]; // BuildingSpec IDs
  completenessPercent?: number;
}

export interface HistoricalEvent {
  _id?: string;
  title: string;
  description: string;
  date: string; // ISO
  endDate?: string;
  category?: 'political' | 'cultural' | 'economic' | 'social' | 'infrastructure' | 'other';
  significance?: 'local' | 'regional' | 'national' | 'international';
  tags?: string[];
}

export interface LocationCoordinates { latitude: number; longitude: number; }

export interface Location {
  _id?: string;
  name: string;
  description: string;
  coordinates: LocationCoordinates;
  category?: string;
  yearEstablished?: number;
}

export interface HistoricalSnapshotMeta {
  year: number;
  era: string;
  description: string;
  population: number;
  buildings: { name: string; location?: { coordinates: [number, number] }; height?: number; stories?: number; material?: string; built?: number; established?: number; status?: string; roofType?: string; }[];
  streets: { coordinates: [ [number, number], [number, number] ]; width: number }[];
}

export interface HeatmapCell { center: [number, number]; value: number; }
export interface HeatmapResponse { metric: string; grid: HeatmapCell[]; }

// Utility discriminated unions could follow here as project evolves.