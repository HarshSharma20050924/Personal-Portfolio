
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ReactLenis } from '@studio-freight/react-lenis';
import Portfolio from './components/Portfolio';
import ProjectDetails from './pages/ProjectDetails';
import { HeroData, Skill, Project, SocialLink, Article, PlaygroundConfig } from './types';

type AppData = {
  heroData: HeroData;
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLink[];
  articles: Article[];
  playgroundConfig: PlaygroundConfig;
};

// ScrollToTop component to ensure navigation starts at top of page
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Failed to fetch portfolio data.');
        const result = await response.json();
        // Add IDs to projects if missing for routing
        const projectsWithIds = result.projects.map((p: Project, i: number) => ({
             ...p,
             id: p.id || i
        }));
        setData({ ...result, projects: projectsWithIds });
      } catch (err) {
        setError((err as Error).message);
        console.error(err);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-700 p-8">{error}</div>;
  }

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center text-secondary dark:text-dark-secondary">Loading...</div>;
  }

  return (
    <Router>
        <ScrollToTop />
        <ReactLenis root>
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
            </Routes>
        </ReactLenis>
    </Router>
  );
};

export default App;
