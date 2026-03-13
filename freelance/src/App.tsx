
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Work from './pages/Work';
import ServiceDetail from './pages/ServiceDetail';
import { HeroData, Project, Skill, SocialLink, Article } from './types';

interface AppData {
  heroData: HeroData;
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLink[];
  articles: Article[];
}

const App: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  if (!data) return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center text-white font-mono uppercase tracking-[0.3em] text-xs">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-px bg-white/20 animate-pulse" />
        Initializing System...
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Home 
            heroData={data.heroData} 
            projects={data.projects} 
            socialLinks={data.socialLinks}
            skills={data.skills}
            articles={data.articles}
          />
        } />
        <Route path="/contact" element={<Contact name={data.heroData.name} />} />
        <Route path="/work" element={<Work name={data.heroData.name} />} />
        <Route path="/service/:id" element={<ServiceDetail name={data.heroData.name} />} />
      </Routes>
    </Router>
  );
};

export default App;
