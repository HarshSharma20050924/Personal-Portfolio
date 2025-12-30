
import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Instance, Instances, Line } from '@react-three/drei';
import * as THREE from 'three';

const NeuralNetwork = ({ count = 40, radius = 2 }) => {
  const lines = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const connections: THREE.Vector3[][] = [];
    
    // Generate random points within a sphere
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.cbrt(Math.random()); // Even distribution inside sphere
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      points.push(new THREE.Vector3(x, y, z));
    }

    // Create connections based on distance
    points.forEach((point, i) => {
      points.forEach((other, j) => {
        if (i !== j) {
          const dist = point.distanceTo(other);
          if (dist < 1.2) { // Connection threshold
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
      {/* Nodes - Reduced Opacity */}
      <Instances range={lines.points.length}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
        {lines.points.map((point, i) => (
          <Instance key={i} position={point} />
        ))}
      </Instances>

      {/* Connections - Subtle Lines */}
      {lines.connections.map((pair, i) => (
        <Line
          key={i}
          points={pair}
          color="#60a5fa"
          transparent
          opacity={0.08}
          lineWidth={1}
        />
      ))}
    </group>
  );
};

const TechOrb: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto transition-opacity duration-1000 ease-in-out opacity-100">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <fog attach="fog" args={['#050505', 5, 12]} />
        
        {/* Background Environment */}
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={0.5} />
        
        {/* Neural Network Model */}
        <NeuralNetwork count={60} radius={2.5} />
        
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
      
      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_95%)] pointer-events-none" />
    </div>
  );
};

export default TechOrb;