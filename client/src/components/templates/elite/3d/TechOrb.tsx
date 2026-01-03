
import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Instance, Instances, Line } from '@react-three/drei';
import * as THREE from 'three';

const NeuralNetwork = ({ count = 40, radius = 2, color = "#ffffff" }) => {
  const lines = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const connections: THREE.Vector3[][] = [];
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.cbrt(Math.random());
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      points.push(new THREE.Vector3(x, y, z));
    }

    points.forEach((point, i) => {
      points.forEach((other, j) => {
        if (i !== j) {
          const dist = point.distanceTo(other);
          if (dist < 1.2) {
            connections.push([point, other]);
          }
        }
      });
    });

    return { points, connections };
  }, [count, radius]);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
        groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Instances range={lines.points.length}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
        {lines.points.map((point, i) => (
          <Instance key={i} position={point} />
        ))}
      </Instances>

      {lines.connections.map((pair, i) => (
        <Line
          key={i}
          points={pair}
          color="#60a5fa"
          transparent
          opacity={0.15}
          lineWidth={1}
        />
      ))}
    </group>
  );
};

interface TechOrbProps {
    isDark?: boolean;
}

const TechOrb: React.FC<TechOrbProps> = ({ isDark = true }) => {
  const fogColor = isDark ? '#050505' : '#ffffff';
  const networkColor = isDark ? '#ffffff' : '#000000';

  return (
    <div className="absolute inset-0 z-0 pointer-events-auto transition-opacity duration-1000 ease-in-out opacity-100">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <fog attach="fog" args={[fogColor, 5, 12]} />
        
        {isDark && <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={0.5} />}
        
        <NeuralNetwork count={60} radius={2.5} color={networkColor} />
        
        <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.5}
            rotateSpeed={0.5}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
        />
      </Canvas>
      
      {/* Vignette Overlay to blend edges */}
      <div className={`absolute inset-0 pointer-events-none transition-colors duration-500`}
           style={{ 
               background: isDark 
                ? 'radial-gradient(circle at center, transparent 0%, #050505 95%)' 
                : 'radial-gradient(circle at center, transparent 0%, #ffffff 95%)' 
           }} 
      />
    </div>
  );
};

export default TechOrb;
