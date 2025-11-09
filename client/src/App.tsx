import React, { useState, useEffect } from 'react';
import Portfolio from './components/Portfolio';
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

  // --- Data Management ---
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
    return <div className="min-h-screen flex items-center justify-center dark:bg-slate-900 text-slate-500">Loading Portfolio...</div>;
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
