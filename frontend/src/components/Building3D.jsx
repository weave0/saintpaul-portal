import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

// 3D representation of a single building. Pure render component – no global controls.
const Building3D = ({ building, isHighlighted, inSnapshot, onClick, onInsight }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Safety check for building data
  if (!building || !building.location || !building.location.coordinates) {
    return null;
  }
  
  // Convert lat/lon to local XZ coordinates (simplified)
  // In production, use proper projection transformation
  const x = (building.location.coordinates[0] - (-93.1)) * 10000;
  const z = (building.location.coordinates[1] - 44.95) * 10000;
  const height = building.height || (building.stories * 4) || 20; // 4 meters per story, default 20m

  // Create building color based on material and era
  const getMaterialColor = () => {
    if (isHighlighted) return '#ffeb3b';
    if (hovered) return '#90caf9';
    if (inSnapshot) return '#ffd54f';
    
    switch(building.material) {
      case 'limestone': return '#d4c5b9';
      case 'marble': return '#f5f5f5';
      case 'brick': return '#8b4513';
      case 'sandstone': return '#c2b280';
      case 'wood': return '#8b7355';
      case 'steel_glass': return '#b0c4de';
      default: return '#cccccc';
    }
  };

  useFrame((state) => {
    if (meshRef.current && (hovered || isHighlighted)) {
      meshRef.current.position.y = height / 2 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <group position={[x, 0, z]}>
      {/* Building mesh */}
      <mesh
        ref={meshRef}
        position={[0, height / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick(e);
          if (onInsight) onInsight(building._id || building.id);
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[building.dimensions.length, height, building.dimensions.width]} />
        <meshStandardMaterial 
          color={getMaterialColor()}
          roughness={0.7}
          metalness={building.material === 'steel_glass' ? 0.5 : 0.1}
        />
      </mesh>

      {/* Roof */}
      {building.roofType === 'dome' && (
        <mesh position={[0, height, 0]}>
          <sphereGeometry args={[Math.max(building.dimensions.length, building.dimensions.width) / 2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#98d8c8" roughness={0.3} metalness={0.6} />
        </mesh>
      )}

      {/* Building label (show on hover or highlight) */}
      {(hovered || isHighlighted) && (
        <Text
          position={[0, height + 5, 0]}
          fontSize={2}
          color="#1a4d7d"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.2}
          outlineColor="#ffffff"
        >
          {building.name}
        </Text>
      )}

      {/* Construction period indicator */}
      {building.status === 'under_construction' && (
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.5, 0.5, height - 2, 8]} />
          <meshBasicMaterial color="#ff9800" wireframe />
        </mesh>
      )}

      {/* PointerLockControls removed from here – now managed at scene level */}
    </group>
  );
};

export default Building3D;
