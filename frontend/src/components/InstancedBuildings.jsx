import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import { Instances, Instance, Text } from '@react-three/drei';

// Determine display color for each building based on material and UI state
const resolveColor = (building, { isHighlighted, isHovered, inSnapshot }) => {
  if (isHighlighted) return '#ffeb3b';
  if (isHovered) return '#90caf9';
  if (inSnapshot) return '#ffd54f';

  switch (building.material) {
    case 'limestone': return '#d4c5b9';
    case 'marble': return '#f5f5f5';
    case 'brick': return '#8b4513';
    case 'sandstone': return '#c2b280';
    case 'wood': return '#8b7355';
    case 'steel_glass': return '#b0c4de';
    default: return '#cccccc';
  }
};

const normalizeBuilding = (building) => {
  if (!building?.location?.coordinates) return null;
  const [lon, lat] = building.location.coordinates;
  const length = building.dimensions?.length || 10;
  const width = building.dimensions?.width || 10;
  const stories = building.stories || 0;
  const height = building.height || (stories > 0 ? stories * 4 : 20);

  const x = (lon - (-93.1)) * 10000;
  const z = (lat - 44.95) * 10000;

  return {
    building,
    position: new THREE.Vector3(x, height / 2, z),
    scale: new THREE.Vector3(length, height, width),
    labelPosition: new THREE.Vector3(x, height + 5, z),
    inSnapshot: Boolean(building.inSnapshot)
  };
};

const matchesSelected = (candidate, selected) => {
  if (!candidate || !selected) return false;
  const { building } = candidate;
  return (
    (building._id && selected._id && building._id === selected._id) ||
    (building.id && selected.id && building.id === selected.id) ||
    (building.name && selected.name && building.name === selected.name)
  );
};

const InstancedBuildings = ({ buildings, selectedBuilding, onSelect }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const prepared = useMemo(
    () => buildings.map(normalizeBuilding).filter(Boolean),
    [buildings]
  );

  const activeLabel = useMemo(() => {
    if (hoveredIndex !== null && prepared[hoveredIndex]) return prepared[hoveredIndex];
    return prepared.find((candidate) => matchesSelected(candidate, selectedBuilding)) || null;
  }, [hoveredIndex, prepared, selectedBuilding]);

  if (prepared.length === 0) return null;

  return (
    <group>
      <Instances limit={prepared.length} range={prepared.length} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial vertexColors roughness={0.7} metalness={0.2} />
        {prepared.map((item, index) => {
          const isHighlighted = matchesSelected(item, selectedBuilding);
          const isHovered = hoveredIndex === index;
          const color = resolveColor(item.building, {
            isHighlighted,
            isHovered,
            inSnapshot: item.inSnapshot
          });
          return (
            <Instance
              key={item.building._id || item.building.id || `${item.building.name}-${index}`}
              position={item.position}
              scale={item.scale}
              color={color}
              onPointerOver={(event) => {
                event.stopPropagation();
                setHoveredIndex(index);
              }}
              onPointerOut={() => setHoveredIndex(null)}
              onClick={(event) => {
                event.stopPropagation();
                if (onSelect) onSelect(item.building);
              }}
            />
          );
        })}
      </Instances>
      {activeLabel?.building?.name && (
        <Text
          position={activeLabel.labelPosition}
          fontSize={2}
          color="#1a4d7d"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.2}
          outlineColor="#ffffff"
        >
          {activeLabel.building.name}
        </Text>
      )}
    </group>
  );
};

InstancedBuildings.propTypes = {
  buildings: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number)
    }),
    dimensions: PropTypes.shape({
      length: PropTypes.number,
      width: PropTypes.number
    }),
    material: PropTypes.string,
    stories: PropTypes.number,
    height: PropTypes.number,
    inSnapshot: PropTypes.bool
  })).isRequired,
  selectedBuilding: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string
  }),
  onSelect: PropTypes.func
};

InstancedBuildings.defaultProps = {
  selectedBuilding: null,
  onSelect: undefined
};

export default InstancedBuildings;