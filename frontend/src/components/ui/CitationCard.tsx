import React from 'react';
import { tokens } from '../../theme/tokens';

interface ProvenanceSource {
  id: string;
  type: 'book' | 'url' | 'archive' | 'document' | 'photo';
  citation: string;
  link?: string;
}

interface Provenance {
  confidence: 'bronze' | 'silver' | 'gold' | 'platinum';
  sources: ProvenanceSource[];
  lastVerified: Date;
  contributors?: string[];
}

interface CitationCardProps {
  provenance: Provenance;
  onViewOriginal?: (source: ProvenanceSource) => void;
}

const confidenceBadgeStyles = {
  bronze: {
    bg: tokens.colors.provenance.bronze,
    text: '#fff',
    label: '🥉 Bronze',
  },
  silver: {
    bg: tokens.colors.provenance.silver,
    text: '#000',
    label: '🥈 Silver',
  },
  gold: {
    bg: tokens.colors.provenance.gold,
    text: '#000',
    label: '🥇 Gold',
  },
  platinum: {
    bg: tokens.colors.provenance.platinum,
    text: '#000',
    label: '💎 Platinum',
  },
};

export const CitationCard: React.FC<CitationCardProps> = ({
  provenance,
  onViewOriginal,
}) => {
  const badgeStyle = confidenceBadgeStyles[provenance.confidence];

  return (
    <div
      style={{
        border: `${tokens.borders.width.normal} solid ${tokens.colors.neutral[300]}`,
        borderRadius: tokens.borders.radius.md,
        padding: tokens.spacing.md,
        backgroundColor: '#fff',
        boxShadow: tokens.shadows.md,
      }}
    >
      {/* Confidence Badge */}
      <div
        style={{
          display: 'inline-block',
          backgroundColor: badgeStyle.bg,
          color: badgeStyle.text,
          padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
          borderRadius: tokens.borders.radius.sm,
          fontFamily: tokens.typography.fonts.body,
          fontSize: tokens.typography.sizes.sm,
          fontWeight: tokens.typography.weights.semibold,
          marginBottom: tokens.spacing.sm,
        }}
      >
        {badgeStyle.label}
      </div>

      {/* Sources List */}
      <div style={{ marginBottom: tokens.spacing.md }}>
        <h4
          style={{
            fontFamily: tokens.typography.fonts.heading,
            fontSize: tokens.typography.sizes.lg,
            fontWeight: tokens.typography.weights.semibold,
            marginBottom: tokens.spacing.sm,
            color: tokens.colors.neutral[900],
          }}
        >
          Sources ({provenance.sources.length})
        </h4>

        {provenance.sources.map((source) => (
          <div
            key={source.id}
            style={{
              marginBottom: tokens.spacing.sm,
              paddingBottom: tokens.spacing.sm,
              borderBottom: `${tokens.borders.width.thin} solid ${tokens.colors.neutral[200]}`,
            }}
          >
            <cite
              style={{
                fontFamily: tokens.typography.fonts.historic,
                fontSize: tokens.typography.sizes.sm,
                fontStyle: 'italic',
                color: tokens.colors.neutral[700],
                display: 'block',
                marginBottom: tokens.spacing.xs,
              }}
            >
              {source.citation}
            </cite>

            {source.link && (
              <button
                onClick={() => onViewOriginal?.(source)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: tokens.colors.primary[600],
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontFamily: tokens.typography.fonts.body,
                  fontSize: tokens.typography.sizes.sm,
                  padding: 0,
                }}
              >
                View Original →
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Metadata Footer */}
      <div
        style={{
          fontSize: tokens.typography.sizes.xs,
          color: tokens.colors.neutral[600],
          borderTop: `${tokens.borders.width.thin} solid ${tokens.colors.neutral[200]}`,
          paddingTop: tokens.spacing.sm,
        }}
      >
        <p style={{ margin: 0 }}>
          Last verified: {new Date(provenance.lastVerified).toLocaleDateString()}
        </p>
        {provenance.contributors && provenance.contributors.length > 0 && (
          <p style={{ margin: `${tokens.spacing.xs} 0 0 0` }}>
            Contributors: {provenance.contributors.join(', ')}
          </p>
        )}
      </div>
    </div>
  );
};

// Export helper function to calculate confidence level
export const calculateConfidence = (
  sourceCount: number
): Provenance['confidence'] => {
  if (sourceCount >= 5) return 'platinum';
  if (sourceCount >= 4) return 'gold';
  if (sourceCount >= 2) return 'silver';
  return 'bronze';
};
