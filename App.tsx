import React, { useState, useEffect } from 'react';
import Portfolio from './components/Portfolio';
import Admin from './components/admin/Admin';
import { HeroData, Skill, Project, Article, SocialLink } from './types';

type AppData = {
  heroData: HeroData;
  skills: Skill[];
  projects: Project[];
  articles: Article[];
  socialLinks: SocialLink[];
};

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  // --- Theme Management ---
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // --- View Management ---
  const [isAdminView, setIsAdminView] = useState(window.location.hash === '#/admin');

  useEffect(() => {
    const handleHashChange = () => setIsAdminView(window.location.hash === '#/admin');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  // --- Auth & Data Management ---
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('apiKey'));
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Failed to fetch portfolio data.');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
        console.error(err);
      }
    };
    fetchData();
  }, []);
  
  const handleLogin = (apiKey: string) => {
    sessionStorage.setItem('apiKey', apiKey);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('apiKey');
    setIsAuthenticated(false);
  };
  
  const handleSave = async () => {
    const apiKey = sessionStorage.getItem('apiKey');
    if (!apiKey || !data) {
      throw new Error('Not authenticated or no data to save.');
    }
    
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save data.');
    }
  };

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-700 p-8">{error}</div>;
  }

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center">Loading Portfolio...</div>;
  }

  if (isAdminView) {
    return (
      <Admin
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onSave={handleSave}
        heroData={data.heroData}
        setHeroData={(d) => setData(prev => ({ ...prev!, heroData: d }))}
        skills={data.skills}
        setSkills={(s) => setData(prev => ({ ...prev!, skills: s }))}
        projects={data.projects}
        setProjects={(p) => setData(prev => ({ ...prev!, projects: p }))}
        articles={data.articles}
        setArticles={(a) => setData(prev => ({ ...prev!, articles: a }))}
        socialLinks={data.socialLinks}
        setSocialLinks={(sl) => setData(prev => ({ ...prev!, socialLinks: sl }))}
      />
    );
  }

  return (
    <Portfolio
      theme={theme}
      toggleTheme={toggleTheme}
      heroData={data.heroData}
      skills={data.skills}
      projects={data.projects}
      articles={data.articles}
      socialLinks={data.socialLinks}
    />
  );
};

export default App;
