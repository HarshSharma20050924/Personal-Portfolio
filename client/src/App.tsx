import React, { useState, useEffect } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import Portfolio from './components/Portfolio';
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
    return <div className="min-h-screen flex items-center justify-center text-secondary dark:text-dark-secondary">Loading...</div>;
  }

  return (
    <ReactLenis root>
      <Portfolio
        heroData={data.heroData}
        skills={data.skills}
        projects={data.projects}
        socialLinks={data.socialLinks}
        articles={data.articles}
        playgroundConfig={data.playgroundConfig}
      />
    </ReactLenis>
  );
};

export default App;