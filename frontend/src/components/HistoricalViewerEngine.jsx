import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Sky } from '@react-three/drei';
import { Perf } from 'r3f-perf';

// Lazy-loadable 3D engine shell. Page passes scene children.
const HistoricalViewerEngine = ({ children, showOrbitControls = true, enablePerf = false, cameraProps = { position: [0, 20, 60], fov: 60 } }) => {
  return (
    <Canvas shadows camera={cameraProps}>
      <Suspense fallback={null}>
        <Sky sunPosition={[100, 20, 100]} turbidity={8} />
        <Environment preset="city" />
        {showOrbitControls && <OrbitControls enableDamping makeDefault />}
        {enablePerf && <Perf position="bottom-left" minimal />}
        {children}
      </Suspense>
    </Canvas>
  );
};

export default HistoricalViewerEngine;