
import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    
    // Subtle flowing movement (Breathing effect)
    float wave = sin(pos.x * 0.1 + uTime * 0.2) * cos(pos.z * 0.1 + uTime * 0.15);
    pos.y += wave * 1.5; 
    
    // Very subtle mouse parallax, no deformation
    vec2 mouseWorld = uMouse * 5.0;
    float dist = distance(pos.xz, mouseWorld);
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Constant size, slightly varied by depth
    gl_PointSize = (2.0 + wave) * (15.0 / -mvPosition.z);
    
    // Soft vignette edges
    float edgeMask = smoothstep(40.0, 10.0, length(pos.xz));
    vAlpha = edgeMask * 0.4; // Low opacity for subtle background
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    if (dist > 0.5) discard;
    
    // Soft circle
    float alpha = smoothstep(0.5, 0.2, dist) * vAlpha;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

interface LivingGridProps {
  isDark: boolean;
  enableTilt: boolean;
}

const LivingGrid = ({ isDark, enableTilt }: LivingGridProps) => {
  const meshRef = useRef<THREE.Points>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const { mouse } = useThree();
  
  const count = 30; // Moderate density
  const size = 30;  // Wide spread
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uColor: { value: new THREE.Color(isDark ? '#ffffff' : '#000000') },
  }), []);

  useEffect(() => {
    if (meshRef.current) {
        const material = meshRef.current.material as THREE.ShaderMaterial;
        material.uniforms.uColor.value.set(isDark ? '#ffffff' : '#000000');
        material.needsUpdate = true;
    }
  }, [isDark]);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * count * 3);
    for(let i = 0; i < count; i++) {
      for(let j = 0; j < count; j++) {
        const index = (i * count + j) * 3;
        const x = (i / count - 0.5) * size;
        const z = (j / count - 0.5) * size;
        positions[index] = x;
        positions[index + 1] = 0; 
        positions[index + 2] = z;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    meshRef.current.material.uniforms.uTime.value = time;
    
    // Gentle parallax
    const targetRotX = enableTilt ? -mouse.y * 0.05 : 0;
    const targetRotY = enableTilt ? mouse.x * 0.05 : 0;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.1 + targetRotX, 0.02);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.02);
  });

  return (
    <group ref={groupRef}>
        <points ref={meshRef} geometry={geometry} position={[0, -2, 0]}>
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
                depthWrite={false}
                blending={THREE.NormalBlending} // Simpler blending for a clean look
            />
        </points>
    </group>
  );
};

interface TechOrbProps {
    isDark?: boolean;
    interactive?: boolean; 
    enableTilt?: boolean;  
}

const TechOrb: React.FC<TechOrbProps> = ({ isDark = true, interactive = true, enableTilt = true }) => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000">
      <Canvas 
        camera={{ position: [0, 5, 10], fov: 45 }} 
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]} // Limit DPR for performance
      >
        <LivingGrid isDark={isDark} enableTilt={enableTilt} />
      </Canvas>
      
      {/* Soft overlay to fade edges */}
      <div className={`absolute inset-0 pointer-events-none bg-gradient-to-t ${isDark ? 'from-[#050505] via-transparent to-[#050505]' : 'from-white via-transparent to-white'} opacity-80`} />
    </div>
  );
};

export default TechOrb;
