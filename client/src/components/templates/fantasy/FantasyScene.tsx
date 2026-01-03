
import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
    useGLTF, 
    Float, 
    Stars, 
    Sparkles, 
    Cloud, 
    CameraControls, 
    Html, 
    MeshTransmissionMaterial,
    useCursor,
    Environment,
    ContactShadows,
    Clone
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise, BrightnessContrast, TiltShift2 } from '@react-three/postprocessing';
import * as THREE from 'three';
import { HeroData, Project, Skill, SocialLink } from '../../../types';

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

// --- GENERIC MODEL LOADER ---
const Model = ({ url, scale = 1, position = [0,0,0], rotation = [0,0,0], onClick, onPointerOver, onPointerOut, emissiveIntensity = 1 }: any) => {
    const { scene } = useGLTF(url);
    
    // Clone the scene so we can reuse the same asset multiple times
    // and apply specific materials or shadows
    return (
        <group 
            position={position} 
            rotation={rotation} 
            scale={scale} 
            onClick={(e) => { 
                if(onClick) {
                    e.stopPropagation(); 
                    onClick(); 
                }
            }}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
        >
            <Clone object={scene} traverse={(child) => {
                if ((child as THREE.Mesh).isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    // Boost emission for "glowy" game assets
                    if ((child as THREE.Mesh).material) {
                        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
                        if (mat.emissive) {
                            mat.emissiveIntensity = emissiveIntensity;
                        }
                    }
                }
            }} />
        </group>
    );
};

// Preload your models for instant loading
// useGLTF.preload('/models/the_throne_of_the_viking_king.glb');
useGLTF.preload('/models/knight_artorias.glb');
useGLTF.preload('/models/dark_souls_bonfire.glb');
useGLTF.preload('/models/a_fantasy_tree.glb');

// --- Interactive Components ---

const SkillsThrone = ({ position, onClick }: { position: [number, number, number], onClick: () => void }) => {
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    return (
        <group position={position}>
            {/* The Throne Model */}
            <Model 
                url="/models/dark_souls_bonfire.glb" 
                scale={hovered ? 1.1 : 1} // Gentle hover scale
                position={[0, 0, 0]}
                rotation={[0, -0.5, 0]} 
                onClick={onClick}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            />
            
            {/* Hover Indicator */}
            {hovered && <pointLight position={[0, 2, 0]} color="#fbbf24" intensity={2} distance={3} />}
            
            <Html position={[0, 4, 0]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
                <div className={`transition-all duration-500 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} text-amber-100 font-fantasy text-sm tracking-widest drop-shadow-[0_0_10px_rgba(251,191,36,0.8)] whitespace-nowrap`}>
                    THE ARSENAL (SKILLS)
                </div>
            </Html>
        </group>
    );
};

const ProjectsKnight = ({ position, onClick }: { position: [number, number, number], onClick: () => void }) => {
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    return (
        <group position={position}>
            {/* The Knight Model */}
            <Model 
                url="/models/knight_artorias.glb" 
                scale={hovered ? 1.55 : 1.5} 
                position={[0, 0, 0]}
                rotation={[0, -0.5, 0]}
                onClick={onClick}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            />

            {/* Blue mystical glow for Artorias */}
            <pointLight position={[0, 2, 1]} color="#60a5fa" intensity={hovered ? 3 : 1} distance={4} />

            <Html position={[0, 5, 0]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
                <div className={`transition-all duration-500 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} text-blue-200 font-fantasy text-sm tracking-widest drop-shadow-[0_0_10px_rgba(96,165,250,0.8)] whitespace-nowrap`}>
                    THE CONQUEST (PROJECTS)
                </div>
            </Html>
        </group>
    );
};

const ContactBonfire = ({ position, onClick }: { position: [number, number, number], onClick: () => void }) => {
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    return (
        <group position={position}>
            {/* The Bonfire Model */}
            <Model 
                url="/models/dark_souls_bonfire.glb" 
                scale={1.2} 
                position={[0, 0, 0]}
                rotation={[0, 0, 0]}
                onClick={onClick}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                emissiveIntensity={2}
            />

            {/* Fire particles */}
            <Sparkles count={40} scale={2} size={15} speed={0.8} opacity={0.8} color="#ff5500" position={[0, 1, 0]} />
            <pointLight position={[0, 1.5, 0]} color="#ff5500" intensity={hovered ? 4 : 2} distance={8} decay={2} />
            
            <Html position={[0, 3.5, 0]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
                <div className={`transition-all duration-500 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} text-orange-300 font-fantasy text-sm tracking-widest drop-shadow-[0_0_10px_rgba(251,146,60,0.8)] whitespace-nowrap`}>
                    IGNITE BONFIRE (CONTACT)
                </div>
            </Html>
        </group>
    );
};

const ProceduralIsland = () => {
    return (
        <group>
            {/* Main Platform - Low Poly Dark Rock */}
            <mesh position={[0, -2, 0]} receiveShadow>
                <cylinderGeometry args={[11, 4, 6, 7]} /> {/* 7 segments = jagged 7-sided polygon */}
                <meshStandardMaterial 
                    color="#b1a399ff" 
                    roughness={0.9} 
                    flatShading={true}
                />
            </mesh>
            
            {/* Grass/Moss Layer */}
            <mesh position={[0, 1.05, 0]} receiveShadow rotation={[0, 0.2, 0]}>
                <cylinderGeometry args={[11.2, 10, 0.5, 7]} />
                <meshStandardMaterial color="#42b476ff" roughness={1} flatShading={true} />
            </mesh>

            {/* Jagged Rocks under the island */}
            <mesh position={[4, -4, 2]} rotation={[0.5, 0.2, 0.4]} scale={2}>
                <dodecahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color="#d38d7bff" flatShading={true} />
            </mesh>
            <mesh position={[-5, -3, -3]} rotation={[0.2, 0.5, 0.1]} scale={1.5}>
                <dodecahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color="#292524" flatShading={true} />
            </mesh>
             <mesh position={[0, -5.5, 0]} rotation={[0, 0, 0]} scale={[3, 5, 3]}>
                <dodecahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color="#d4a7a7ff" flatShading={true} />
            </mesh>
        </group>
    );
}

const FloatingWorld = ({ setView }: { setView: (v: ViewState) => void }) => {
    return (
        <group>
            <ProceduralIsland />

            {/* -- PLACEMENT OF USER MODELS -- */}

            {/* 1. Skills: The Viking Throne (Left side) */}
            <SkillsThrone position={[-5, 1.2, 2]} onClick={() => setView('skills')} />

            {/* 2. Projects: Knight Artorias (Right side, facing center) */}
            <ProjectsKnight position={[5, 1.2, 2]} onClick={() => setView('projects')} />

            {/* 3. Contact: Bonfire (Center back, high visibility) */}
            <ContactBonfire position={[0, 1.2, -4]} onClick={() => setView('contact')} />

            {/* -- DECORATION -- */}
            
            {/* Decorative Trees (Using your a_fantasy_tree.glb) */}
            <Model url="/models/a_fantasy_tree.glb" position={[-8, 1, -2]} scale={0.001} rotation={[0, 1, 0]} />
            <Model url="/models/a_fantasy_tree.glb" position={[7, 1, -5]} scale={0.001} rotation={[0, 2, 0]} />
            <Model url="/models/a_fantasy_tree.glb" position={[-2, 1, 6]} scale={0.001} rotation={[0, 0.5, 0]} />

            {/* Floating Debris / Magic */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <mesh position={[0, 5, 0]}>
                    <octahedronGeometry args={[0.2]} />
                    <meshBasicMaterial color="#fff" wireframe />
                </mesh>
            </Float>
        </group>
    );
};

const CameraController = ({ view }: { view: ViewState }) => {
    const controls = useRef<CameraControls>(null);

    useEffect(() => {
        if (!controls.current) return;
        const transitionConfig = true;

        switch (view) {
            case 'intro':
                controls.current.setLookAt(0, 5, 50, 0, 5, 0, transitionConfig);
                break;
            case 'overview':
                controls.current.setLookAt(0, 25, 30, 0, 0, 0, transitionConfig);
                break;
            case 'skills':
                // Look at Throne
                controls.current.setLookAt(-8, 6, 8, -5, 2, 2, transitionConfig);
                break;
            case 'projects':
                // Look at Knight
                controls.current.setLookAt(8, 6, 8, 5, 3, 2, transitionConfig);
                break;
            case 'contact':
                // Look at Bonfire
                controls.current.setLookAt(0, 6, 4, 0, 1, -4, transitionConfig);
                break;
        }
    }, [view]);

    return (
        <CameraControls 
            ref={controls} 
            maxPolarAngle={Math.PI / 2 - 0.05} 
            minDistance={5}
            maxDistance={60}
            smoothTime={1.2}
            dollySpeed={0.5}
        />
    );
};

const FantasyScene: React.FC<SceneProps> = ({ view, setView }) => {
  return (
    <Canvas shadows camera={{ position: [0, 5, 50], fov: 35 }} gl={{ antialias: false, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.2 }} className="bg-[#020205]">
        <fog attach="fog" args={['#5151b4ff', 10, 60]} />
        
        {/* POST PROCESSING - DARK FANTASY LOOK */}
        <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.2} radius={0.5} />
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            <BrightnessContrast brightness={-0.05} contrast={0.1} />
            <TiltShift2 blur={0.1} />
        </EffectComposer>

        <CameraController view={view} />

        {/* LIGHTING - MOODY & DRAMATIC */}
        <Environment preset="night" background={false} blur={0.8} />
        <ambientLight intensity={0.2} color="#4c1d95" />
        
        {/* Moon light (Blue/Cool) */}
        <spotLight 
            position={[20, 40, 20]} 
            angle={0.5} 
            penumbra={0.5} 
            intensity={2} 
            castShadow 
            shadow-bias={-0.0001}
            color="#a3b8ff"
        />
        
        {/* Fire/Warm fill light from center */}
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#fbbf24" distance={20} />

        {/* BACKGROUND ELEMENTS */}
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.2} />
        <Cloud position={[0, -10, 0]} args={[15, 4]} opacity={0.1} speed={0.1} color="#000" segments={20} />
        <Cloud position={[-15, 10, -15]} args={[6, 3]} opacity={0.1} speed={0.05} color="#1a1025" />

        {/* THE WORLD */}
        <Suspense fallback={<Html center><div className="text-white font-mono animate-pulse">SUMMONING ASSETS...</div></Html>}>
            <Float speed={1} rotationIntensity={0.02} floatIntensity={0.1} floatingRange={[-0.2, 0.2]}>
                <FloatingWorld setView={setView} />
            </Float>
        </Suspense>

        <ContactShadows position={[0, -6, 0]} opacity={0.5} scale={40} blur={2.5} far={10} color="#000" />

    </Canvas>
  );
};

export default FantasyScene;
