import React from 'react';

function formatNumber(num, decimals = 0) {
  if (num === null || num === undefined) return '—';
  return num.toLocaleString(undefined, { maximumFractionDigits: decimals });
}

export default function InsightPanel({ data, onClose }) {
  if (!data) return null;

  const {
    building,
    address,
    property,
    metrics,
    demographics,
    historical,
    environmental
  } = data;

  return (
    <div style={styles.container}>
      <button style={styles.close} onClick={onClose}>×</button>
      <h2 style={styles.title}>{building?.name || address?.street || 'Location Insight'}</h2>
      {address?.street && (
        <div style={styles.subtle}>{address.street}, {address.city} {address.state}</div>
      )}

      <section style={styles.section}>
        <h3 style={styles.heading}>Building</h3>
        <div style={styles.grid}>
          <label>Year Built</label><span>{building?.yearBuilt || '—'}</span>
          <label>Stories</label><span>{building?.stories || '—'}</span>
          <label>Height (m)</label><span>{building?.heightMeters || '—'}</span>
          <label>Style</label><span>{building?.architecturalStyle || '—'}</span>
          <label>Square Ft</label><span>{formatNumber(building?.squareFeet)}</span>
        </div>
      </section>

      <section style={styles.section}>
        <h3 style={styles.heading}>Metrics</h3>
        <div style={styles.grid}>
          <label>Walkability</label><span>{metrics?.walkability ?? '—'}</span>
          <label>Transit Score</label><span>{metrics?.transitScore ?? '—'}</span>
          <label>Green Space %</label><span>{metrics?.greenSpace?.percentCanopy ? metrics.greenSpace.percentCanopy.toFixed(1) : '—'}</span>
        </div>
      </section>

      <section style={styles.section}>
        <h3 style={styles.heading}>Demographics (BG)</h3>
        <div style={styles.grid}>
          <label>Population</label><span>{formatNumber(demographics?.population)}</span>
          <label>Median Income</label><span>{demographics?.medianIncome ? `$${formatNumber(demographics.medianIncome)}` : '—'}</span>
          <label>Diversity Index</label><span>{demographics?.diversityIndex ? demographics.diversityIndex.toFixed(2) : '—'}</span>
        </div>
      </section>

      <section style={styles.section}>
        <h3 style={styles.heading}>Property</h3>
        <div style={styles.grid}>
          <label>Assessed Value</label><span>{property?.assessedValue ? `$${formatNumber(property.assessedValue)}` : '—'}</span>
          <label>Market Value</label><span>{property?.marketValue ? `$${formatNumber(property.marketValue)}` : '—'}</span>
          <label>Zoning</label><span>{property?.zoning || '—'}</span>
        </div>
      </section>

      <section style={styles.section}>
        <h3 style={styles.heading}>Environmental</h3>
        <div style={styles.grid}>
          <label>Tree Canopy %</label><span>{environmental?.treeCanopy?.percentCoverage ? environmental.treeCanopy.percentCoverage.toFixed(1) : '—'}</span>
          <label>Flood Risk</label><span>{environmental?.floodRisk?.riskLevel || '—'}</span>
          <label>Heat Island Δ°C</label><span>{environmental?.heatIsland ? environmental.heatIsland.toFixed(1) : '—'}</span>
        </div>
      </section>

      {historical?.significance && (
        <section style={styles.section}>
          <h3 style={styles.heading}>Historical</h3>
          <div style={styles.block}>{historical.significance}</div>
          {historical.events?.length > 0 && (
            <ul style={styles.list}>
              {historical.events.slice(0,5).map(evt => (
                <li key={evt._id}>{evt.year}: {evt.title}</li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    width: '340px',
    maxHeight: '90vh',
    overflowY: 'auto',
    background: 'rgba(20,25,30,0.92)',
    color: '#fff',
    padding: '1rem 1.25rem',
    borderRadius: '8px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
    backdropFilter: 'blur(4px)',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '14px',
    zIndex: 10
  },
  close: {
    position: 'absolute',
    top: '6px',
    right: '8px',
    border: 'none',
    background: 'transparent',
    color: '#aaa',
    fontSize: '20px',
    cursor: 'pointer'
  },
  title: { margin: '0 0 4px', fontSize: '18px' },
  subtle: { marginBottom: '12px', fontSize: '12px', color: '#ccc' },
  section: { marginBottom: '1.25rem' },
  heading: { margin: '0 0 6px', fontSize: '15px', letterSpacing: '0.5px', textTransform: 'uppercase', color: '#6eb7ff' },
  grid: {
    display: 'grid',
    gridTemplateColumns: '110px 1fr',
    rowGap: '4px',
    columnGap: '8px'
  },
  block: {
    background: 'rgba(255,255,255,0.08)',
    padding: '6px 8px',
    borderRadius: '4px',
    lineHeight: '1.4'
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '8px 0 0 0',
    maxHeight: '160px',
    overflowY: 'auto'
  }
};
