import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { HeroData, Skill, Project, SocialLink, Article, PlaygroundConfig } from './types';

type AppData = {
  heroData: HeroData;
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLink[];
  articles: Article[];
  playgroundConfig: PlaygroundConfig;
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('apiKey'));
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data for editing when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setData(null); // Clear data on logout
      return;
    }

    const fetchData = async () => {
      try {
        setError(null);
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Failed to fetch portfolio data.');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError((err as Error).message);
        console.error(err);
      }
    };
    fetchData();
  }, [isAuthenticated]);

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

  if (!isAuthenticated) {
    return (
       <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
         <Login onLogin={handleLogin} />
       </div>
    );
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-700 p-8">{error}</div>;
  }

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-500">Loading Editor...</div>;
  }

  return (
    <Dashboard
      onLogout={handleLogout}
      onSave={handleSave}
      heroData={data.heroData}
      setHeroData={(d) => setData(prev => ({ ...prev!, heroData: typeof d === 'function' ? d(prev!.heroData) : d }))}
      skills={data.skills}
      setSkills={(s) => setData(prev => ({ ...prev!, skills: typeof s === 'function' ? s(prev!.skills) : s }))}
      projects={data.projects}
      setProjects={(p) => setData(prev => ({ ...prev!, projects: typeof p === 'function' ? p(prev!.projects) : p }))}
      socialLinks={data.socialLinks}
      setSocialLinks={(sl) => setData(prev => ({ ...prev!, socialLinks: typeof sl === 'function' ? sl(prev!.socialLinks) : sl }))}
      articles={data.articles}
      setArticles={(a) => setData(prev => ({...prev!, articles: typeof a === 'function' ? a(prev!.articles) : a }))}
      playgroundConfig={data.playgroundConfig}
      setPlaygroundConfig={(pc) => setData(prev => ({...prev!, playgroundConfig: typeof pc === 'function' ? pc(prev!.playgroundConfig) : pc }))}
    />
  );
};

export default App;