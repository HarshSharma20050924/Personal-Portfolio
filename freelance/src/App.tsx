
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Work from './pages/Work';
import ServiceDetail from './pages/ServiceDetail';
import { HeroData, Project, Skill, SocialLink, Article, Testimonial } from './types';
import { API_BASE, FALLBACK_DATA } from './config';

interface AppData {
  heroData: HeroData;
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLink[];
  articles: Article[];
  testimonials: Testimonial[];
}

const App: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/data`);
        if (!response.ok) throw new Error('Unstable uplink');
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('API Error: System defaulting to stable fallback.', err);
        // Default to fallback data so the app doesn't stay stuck
        setData(FALLBACK_DATA as any);
      }
    };
    fetchData();
  }, []);

  if (!data) return (
    <div className="min-h-screen bg-[#0D0D0D]"></div>
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
