
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
    Float, 
    Stars, 
    Sparkles, 
    Cloud, 
    CameraControls, 
    Html, 
    Text, 
    MeshDistortMaterial,
    MeshTransmissionMaterial,
    Trail,
    useCursor
} from '@react-three/drei';
import * as THREE from 'three';
import { HeroData, Project, Skill, SocialLink } from '../../../types';
import { motion } from 'framer-motion-3d'; 

// --- Types ---
type ViewState = 'intro' | 'overview' | 'projects' | 'skills' | 'contact';

interface SceneProps {
    view: ViewState;
    setView: (v: ViewState) => void;
    heroData: HeroData;
    projects: Project[];
    skills: Skill[];
    socialLinks: SocialLink[];
}

// --- Components ---

// 1. The Ancient Tree (Skills Section)
const AncientTree = ({ position, onClick }: { position: [number, number, number], onClick: () => void }) => {
    const group = useRef<THREE.Group>(null);
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    return (
        <group position={position} ref={group} onClick={(e) => { e.stopPropagation(); onClick(); }} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
            {/* Trunk */}
            <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[0.8, 1.2, 4, 8]} />
                <meshStandardMaterial color="#3e2723" roughness={0.9} />
            </mesh>
            {/* Leaves (Purple Fantasy Style) */}
            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
                <mesh position={[0, 5, 0]}>
                    <dodecahedronGeometry args={[2.5, 0]} />
                    <meshStandardMaterial color={hovered ? "#d500f9" : "#aa00ff"} emissive="#4a148c" emissiveIntensity={0.2} roughness={0.8} />
                </mesh>
                <Sparkles count={20} scale={6} size={4} speed={0.4} opacity={0.5} color="#d500f9" position={[0, 5, 0]} />
            </Float>
            {/* Label */}
            <Html position={[0, 8, 0]} center distanceFactor={15} style={{ pointerEvents: 'none' }}>
                <div className={`transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'} text-white font-fantasy text-sm tracking-widest drop-shadow-lg`}>
                    THE ARTIFACTS (SKILLS)
                </div>
            </Html>
        </group>
    );
};

// 2. The Ruins (Projects Section)
const Ruins = ({ position, onClick }: { position: [number, number, number], onClick: () => void }) => {
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    return (
        <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
            {/* Pillars */}
            <mesh position={[-1.5, 1.5, 0]} castShadow>
                <boxGeometry args={[0.5, 3, 0.5]} />
                <meshStandardMaterial color="#546e7a" />
            </mesh>
            <mesh position={[1.5, 1, 0.5]} rotation={[0.2, 0, 0.1]} castShadow>
                <boxGeometry args={[0.5, 2, 0.5]} />
                <meshStandardMaterial color="#546e7a" />
            </mesh>
            {/* Floating Crystal */}
            <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
                <mesh position={[0, 2.5, 0]}>
                    <octahedronGeometry args={[0.8]} />
                    <MeshTransmissionMaterial 
                        distortion={0.5} 
                        color={hovered ? "#00e5ff" : "#00bcd4"} 
                        thickness={2} 
                        roughness={0} 
                        transmission={1}
                        ior={1.5}
                        chromaticAberration={1}
                    />
                </mesh>
                <pointLight position={[0, 2.5, 0]} color="#00e5ff" intensity={hovered ? 2 : 1} distance={5} />
            </Float>
             <Html position={[0, 5, 0]} center distanceFactor={15} style={{ pointerEvents: 'none' }}>
                <div className={`transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'} text-white font-fantasy text-sm tracking-widest drop-shadow-lg`}>
                    THE ARCHIVES (PROJECTS)
                </div>
            </Html>
        </group>
    );
};

// 3. The Campfire (Contact Section)
const Campfire = ({ position, onClick }: { position: [number, number, number], onClick: () => void }) => {
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    return (
        <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
            {/* Logs */}
            <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0.5]}>
                <cylinderGeometry args={[0.1, 0.1, 1.5]} />
                <meshStandardMaterial color="#3e2723" />
            </mesh>
            <mesh position={[0, 0.2, 0]} rotation={[0, 1.5, -0.5]}>
                <cylinderGeometry args={[0.1, 0.1, 1.5]} />
                <meshStandardMaterial color="#3e2723" />
            </mesh>
            {/* Fire Particle Simulation (Simple Meshes) */}
            <Float speed={10} rotationIntensity={0} floatIntensity={0.5}>
                <mesh position={[0, 0.8, 0]}>
                    <dodecahedronGeometry args={[0.4]} />
                    <meshBasicMaterial color="#ff3d00" transparent opacity={0.8} />
                </mesh>
            </Float>
            <pointLight position={[0, 1, 0]} color="#ff6d00" intensity={2} distance={8} decay={2} />
            <Html position={[0, 3, 0]} center distanceFactor={15} style={{ pointerEvents: 'none' }}>
                <div className={`transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'} text-white font-fantasy text-sm tracking-widest drop-shadow-lg`}>
                    SEND RAVEN (CONTACT)
                </div>
            </Html>
        </group>
    );
};

// 4. Main Island
const FloatingIsland = ({ setView }: { setView: (v: ViewState) => void }) => {
    return (
        <group>
            {/* Landmass */}
            <mesh position={[0, -2, 0]} receiveShadow>
                <cylinderGeometry args={[12, 4, 6, 6]} />
                <meshStandardMaterial color="#263238" flatShading />
            </mesh>
            {/* Grass Top */}
            <mesh position={[0, 1.1, 0]} receiveShadow>
                <cylinderGeometry args={[12.2, 12, 0.5, 6]} />
                <meshStandardMaterial color="#1b5e20" flatShading />
            </mesh>

            {/* Waterfall */}
            <mesh position={[8, -1, 4]} rotation={[0, 0, 0.2]}>
                <boxGeometry args={[2, 12, 0.5]} />
                <MeshTransmissionMaterial 
                    color="#4fc3f7" 
                    transmission={0.8} 
                    opacity={0.8} 
                    transparent 
                    distortion={2} 
                    distortionScale={0.5} 
                    roughness={0.1}
                />
            </mesh>
            <Sparkles count={50} position={[8, -6, 4]} scale={[2, 4, 2]} color="#e1f5fe" speed={2} />

            {/* Interactive Areas */}
            <AncientTree position={[-5, 1.2, -3]} onClick={() => setView('skills')} />
            <Ruins position={[5, 1.2, -2]} onClick={() => setView('projects')} />
            <Campfire position={[0, 1.2, 6]} onClick={() => setView('contact')} />

            {/* Decorative Rocks */}
            <mesh position={[-8, 0, 4]} rotation={[0.5, 0.5, 0]}>
                <dodecahedronGeometry args={[1]} />
                <meshStandardMaterial color="#546e7a" />
            </mesh>
        </group>
    );
};

// 5. Navigation Points (The "Dots")
const NavPoint = ({ position, label, onClick, isActive }: { position: [number, number, number], label: string, onClick: () => void, isActive: boolean }) => {
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    return (
        <group position={position}>
            <Html center zIndexRange={[100, 0]}>
                <div 
                    className={`relative cursor-pointer group flex flex-col items-center transition-all duration-300 ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    onClick={(e) => { e.stopPropagation(); onClick(); }}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    <div className={`w-4 h-4 rounded-full border-2 border-white transition-all duration-300 ${hovered ? 'bg-white scale-150' : 'bg-transparent'}`} />
                    <div className={`absolute top-6 whitespace-nowrap text-white font-fantasy text-xs tracking-widest transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                        {label}
                    </div>
                </div>
            </Html>
            {/* 3D Ring visual */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.3, 0.35, 32]} />
                <meshBasicMaterial color="white" transparent opacity={0.5} />
            </mesh>
        </group>
    );
};

const CameraController = ({ view }: { view: ViewState }) => {
    const controls = useRef<CameraControls>(null);

    useEffect(() => {
        if (!controls.current) return;

        // Smoothly transition camera based on view state
        switch (view) {
            case 'intro':
                // Far away looking at clouds/title
                controls.current.setLookAt(0, 10, 40, 0, 10, 0, true);
                break;
            case 'overview':
                // Bird's eye view of island
                controls.current.setLookAt(0, 20, 25, 0, 0, 0, true);
                break;
            case 'skills':
                // Close up on Tree
                controls.current.setLookAt(-8, 5, 8, -5, 4, -3, true);
                break;
            case 'projects':
                // Close up on Ruins
                controls.current.setLookAt(8, 6, 10, 5, 3, -2, true);
                break;
            case 'contact':
                // Close up on Campfire
                controls.current.setLookAt(0, 4, 12, 0, 1, 6, true);
                break;
        }
    }, [view]);

    return (
        <CameraControls 
            ref={controls} 
            maxPolarAngle={Math.PI / 2 - 0.1} // Don't go below ground
            minDistance={5}
            maxDistance={50}
            smoothTime={1.5}
        />
    );
};

const FantasyScene: React.FC<SceneProps> = ({ view, setView }) => {
  return (
    <Canvas shadows camera={{ position: [0, 10, 40], fov: 45 }} gl={{ antialias: true }} className="bg-[#050011]">
        <fog attach="fog" args={['#050011', 10, 90]} />
        
        <CameraController view={view} />

        {/* Lighting */}
        <ambientLight intensity={0.4} color="#4a148c" />
        <directionalLight 
            position={[10, 20, 10]} 
            intensity={1.5} 
            castShadow 
            color="#b39ddb"
            shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-10, 5, -10]} intensity={0.5} color="#29b6f6" />

        {/* Environment */}
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />
        <Cloud position={[0, -10, 0]} args={[10, 2]} opacity={0.3} speed={0.2} color="#311b92" segments={20} />
        <Cloud position={[-20, 10, -20]} args={[5, 2]} opacity={0.2} speed={0.1} color="#4527a0" />
        <Cloud position={[20, 5, -10]} args={[5, 2]} opacity={0.2} speed={0.15} color="#4527a0" />

        {/* The World */}
        <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
            <FloatingIsland setView={setView} />
        </Float>

        {/* Navigation Dots (Only visible in overview) */}
        {view === 'overview' && (
            <>
                <NavPoint position={[-5, 6, -3]} label="ARSENAL" onClick={() => setView('skills')} isActive={view === 'skills'} />
                <NavPoint position={[5, 6, -2]} label="CONQUESTS" onClick={() => setView('projects')} isActive={view === 'projects'} />
                <NavPoint position={[0, 4, 6]} label="RAVEN" onClick={() => setView('contact')} isActive={view === 'contact'} />
            </>
        )}

    </Canvas>
  );
};

export default FantasyScene;
