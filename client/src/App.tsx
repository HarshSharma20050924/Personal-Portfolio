
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ReactLenis } from '@studio-freight/react-lenis';
import { AnimatePresence, motion } from 'framer-motion';
import Portfolio from './components/Portfolio';
import ProjectDetails from './pages/ProjectDetails';
import ProjectGallery from './pages/ProjectGallery';
import BlogDetails from './pages/BlogDetails';
import BlogList from './pages/BlogList'; 
import ContactPage from './pages/FreelanceContactPage'; // New
import { WorkPage } from './pages/FreelanceWorkPage'; // New
import ServiceDetail from './pages/FreelanceServiceDetail'; // New
import CinematicIntro from './components/CinematicIntro';
import { HeroData, Skill, Project, SocialLink, Article, Experience, Education, PlaygroundConfig } from './types';

type AppData = {
  heroData: HeroData;
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLink[];
  articles: Article[];
  experience: Experience[];
  education: Education[];
  playgroundConfig: PlaygroundConfig;
};

// Fallback data
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
  ],
  projects: [],
  socialLinks: [],
  articles: [],
  experience: [],
  education: [],
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
  const [showIntro, setShowIntro] = useState(() => {
      return !sessionStorage.getItem('introShown');
  });
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
        setTimeout(() => setData(finalData), 500);

      } catch (err) {
        console.warn("API unavailable, using fallback data:", err);
        setTimeout(() => setData(defaultAppData), 500);
      }
    };
    fetchData();
  }, []);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    sessionStorage.setItem('introShown', 'true');
    setTimeout(() => setIsAppVisible(true), 100); 
  }, []);

  return (
    <Router>
        <ScrollToTop />
        <ReactLenis root>
            <AnimatePresence mode="wait">
                {showIntro && (
                    <CinematicIntro 
                        key="intro" 
                        name={data?.heroData?.name || "LOADING..."} 
                        onComplete={handleIntroComplete}
                        loaded={!!data} 
                    />
                )}

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
                                    experience={data.experience}
                                    education={data.education}
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
                            <Route path="/blogs" element={
                                <BlogList 
                                    articles={data.articles}
                                    heroData={data.heroData}
                                />
                            } />
                            <Route path="/blog/:id" element={
                                <BlogDetails 
                                    articles={data.articles}
                                    template={data.heroData.template}
                                />
                            } />
                            
                            {/* Freelance Specific Routes */}
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/work" element={<WorkPage />} />
                            <Route path="/service/:id" element={<ServiceDetail />} />
                        </Routes>
                    </motion.div>
                )}
            </AnimatePresence>
        </ReactLenis>
    </Router>
  );
};

export default App;
