
import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    
    // 1. Base Ambient Motion
    float wave1 = sin(pos.x * 0.2 + uTime * 0.3);
    float wave2 = cos(pos.z * 0.15 + uTime * 0.2);
    float baseHeight = (wave1 + wave2) * 0.5;
    
    // 2. Mouse Interaction 
    vec2 mouseWorld = uMouse * 15.0; 
    float dist = distance(pos.xz, mouseWorld);
    float radius = 6.0;
    float interaction = smoothstep(radius, 0.0, dist);
    
    float lift = interaction * 3.0;
    float ripple = interaction * sin(dist * 2.0 - uTime * 3.0) * 0.5;
    
    pos.y += baseHeight + lift + ripple;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // 3. Dynamic Point Size
    gl_PointSize = (1.2 + interaction * 4.0) * (10.0 / -mvPosition.z);
    
    float edgeMask = smoothstep(25.0, 5.0, length(pos.xz));
    vAlpha = edgeMask * (0.3 + interaction * 0.7);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    if (dist > 0.5) discard;
    float glow = 1.0 - (dist * 2.0);
    glow = pow(glow, 1.5); 
    gl_FragColor = vec4(uColor, vAlpha * glow);
  }
`;

interface LivingGridProps {
  isDark: boolean;
  interactive: boolean;
  enableTilt: boolean;
}

const LivingGrid = ({ isDark, interactive, enableTilt }: LivingGridProps) => {
  const meshRef = useRef<THREE.Points>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const { mouse } = useThree();
  
  const count = 100*10; // 120x120 = 14,400 particles (High density)
  const size = 30;   // Large size to prevent edges showing on tilt
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, -10) }, // Default mouse far away
    uColor: { value: new THREE.Color(isDark ? '#ffffff' : '#000000') },
  }), []);

  // Update colors and blending when theme changes
  useEffect(() => {
    if (meshRef.current) {
        const material = meshRef.current.material as THREE.ShaderMaterial;
        material.uniforms.uColor.value.set(isDark ? '#ffffff' : '#000000');
        // Critical: Additive for Dark (Glow), Normal for Light (Solid)
        material.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
        material.needsUpdate = true;
    }
  }, [isDark]);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * count * 3);
    for(let i = 0; i < count; i++) {
      for(let j = 0; j < count; j++) {
        const index = (i * count + j) * 3;
        // Grid layout centered at 0,0
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
    
    // Smoothly toggle between user mouse and a neutral "off-screen" position based on interactivity
    // If interactive is false, the mouse ripples are disabled.
    const targetMouse = interactive ? mouse : new THREE.Vector2(0, -2);
    meshRef.current.material.uniforms.uMouse.value.lerp(targetMouse, 0.05);
    
    // Parallax tilt logic
    // If enableTilt is false, the grid stays at base rotation (static).
    const targetRotY = enableTilt ? mouse.x * 0.10 : 0;
    const targetRotX = enableTilt ? -mouse.y * 0.08 : 0;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.2 + targetRotX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
  });

  return (
    <group ref={groupRef}>
        <points ref={meshRef} geometry={geometry} position={[0, -1, 0]}>
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
                depthWrite={false}
                // Initial blending, dynamic update via useEffect
                blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending} 
            />
        </points>
    </group>
  );
};

interface TechOrbProps {
    isDark?: boolean;
    interactive?: boolean; // Controls mouse ripple effect on particles
    enableTilt?: boolean;  // Controls whether the entire grid tilts with the mouse
}

const TechOrb: React.FC<TechOrbProps> = ({ isDark = true, interactive = true, enableTilt = false }) => {
  return (
    <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out 
      ${interactive ? 'cursor-default' : 'cursor-none'} pointer-events-auto`}>
      
      <Canvas 
        camera={{ position: [0, 2, 12], fov: 35 }} 
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]} 
      >
        <LivingGrid isDark={isDark} interactive={interactive} enableTilt={enableTilt} />
      </Canvas>
      
      {/* Background Blending Gradients */}
      <div className="absolute inset-0 pointer-events-none transition-colors duration-500"
           style={{ 
               background: isDark 
                ? 'radial-gradient(circle at center, transparent 0%, #050505 100%)' 
                : 'radial-gradient(circle at center, transparent 0%, #ffffff 100%)' 
           }} 
      />
      {/* Bottom fade for seamless integration */}
      <div className={`absolute bottom-0 left-0 w-full h-1/2 pointer-events-none bg-gradient-to-t 
        ${isDark ? 'from-[#050505]' : 'from-white'} to-transparent transition-colors duration-500`} />
    </div>
  );
};

export default TechOrb;
