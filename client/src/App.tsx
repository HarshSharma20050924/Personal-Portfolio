
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ReactLenis } from '@studio-freight/react-lenis';
import { AnimatePresence, motion } from 'framer-motion';
import Portfolio from './components/Portfolio';
import ProjectDetails from './pages/ProjectDetails';
import ProjectGallery from './pages/ProjectGallery';
import CinematicIntro from './components/CinematicIntro';
import { HeroData, Skill, Project, SocialLink, Article, PlaygroundConfig } from './types';

type AppData = {
  heroData: HeroData;
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLink[];
  articles: Article[];
  playgroundConfig: PlaygroundConfig;
};

// Fallback data for local development or API failure
const defaultAppData: AppData = {
  heroData: {
    name: "Harsh Sharma",
    title: "Creative Developer",
    description: "Welcome. This is a local preview instance. The system is operating in offline mode.",
    profileImageUrl: "https://github.com/shadcn.png", 
    template: "elite", 
    email: "local@dev.env"
  },
  skills: [
    { name: "React", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "Node.js", level: 80 },
    { name: "System Design", level: 75 }
  ],
  projects: [
    {
        title: "System Core",
        description: "Primary operating system kernel for distributed computing tasks.",
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=3870",
        tags: ["System", "Kernel"],
        featured: true
    },
    {
        title: "Neural Interface",
        description: "Direct brain-computer interface prototype.",
        imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=3870",
        tags: ["AI", "Neural"],
        featured: true
    }
  ],
  socialLinks: [],
  articles: [],
  playgroundConfig: {
    heroTitle: "Playground",
    heroSubtitle: "Experimental Area",
    bgType: "gradient",
    bgColor1: "#0f172a",
    bgColor2: "#1e293b",
    textColor: "#f8fafc",
    primaryColor: "#38bdf8",
    cardStyle: "glass",
    borderRadius: "rounded-2xl",
    showHero: true,
    showSkills: true,
    showProjects: true,
    showContact: true,
    animationSpeed: "normal"
  }
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);
  
  // Initialize intro state from sessionStorage to avoid showing it repeatedly on refresh
  const [showIntro, setShowIntro] = useState(() => {
      return !sessionStorage.getItem('introShown');
  });
  
  // If intro is skipped (already shown), app is visible immediately once data loads
  const [isAppVisible, setIsAppVisible] = useState(() => {
      return !!sessionStorage.getItem('introShown');
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Failed to fetch portfolio data.');
        const result = await response.json();
        
        const projectsWithIds = result.projects.map((p: Project, i: number) => ({
             ...p,
             id: p.id || i
        }));
        
        const finalData = { ...result, projects: projectsWithIds };
        // Simulate a tiny delay so loading animation feels real even if fast
        setTimeout(() => setData(finalData), 500);

      } catch (err) {
        console.warn("API unavailable, using fallback data for local dev:", err);
        // Use default data so the app still works locally
        const projectsWithIds = defaultAppData.projects.map((p: Project, i: number) => ({
             ...p,
             id: p.id || i
        }));
        setTimeout(() => setData({ ...defaultAppData, projects: projectsWithIds }), 500);
      }
    };
    fetchData();
  }, []);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    // Mark intro as shown in session storage
    sessionStorage.setItem('introShown', 'true');
    
    // Smooth transition to app
    setTimeout(() => setIsAppVisible(true), 100); 
  }, []);

  return (
    <Router>
        <ScrollToTop />
        <ReactLenis root>
            <AnimatePresence mode="wait">
                {/* 1. Universal Cinematic Intro - Acts as loading screen */}
                {showIntro && (
                    <CinematicIntro 
                        key="intro" 
                        name={data?.heroData?.name || "LOADING..."} 
                        onComplete={handleIntroComplete}
                        loaded={!!data} // Pause at 99% until data is true
                    />
                )}

                {/* 2. Main Application - Shown after intro completes */}
                {isAppVisible && data && (
                    <motion.div
                        key="main-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.0, ease: "easeOut" }}
                    >
                        <Routes>
                            <Route path="/" element={
                                <Portfolio
                                    heroData={data.heroData}
                                    skills={data.skills}
                                    projects={data.projects}
                                    socialLinks={data.socialLinks}
                                    articles={data.articles}
                                    playgroundConfig={data.playgroundConfig}
                                />
                            } />
                            <Route path="/project/:id" element={
                                <ProjectDetails 
                                    projects={data.projects} 
                                    template={data.heroData.template} 
                                />
                            } />
                            <Route path="/gallery" element={
                                <ProjectGallery 
                                    projects={data.projects} 
                                    template={data.heroData.template} 
                                />
                            } />
                        </Routes>
                    </motion.div>
                )}
            </AnimatePresence>
        </ReactLenis>
    </Router>
  );
};

export default App;
