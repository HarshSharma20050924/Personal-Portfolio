
import React, { useEffect, useState } from 'react';
import EliteHeader from './elite/EliteHeader';
import EliteHero from './elite/EliteHero';
import EliteMetrics from './elite/EliteMetrics';
import EliteWork from './elite/EliteWork';
import EliteThinking from './elite/EliteThinking';
import EliteExperience from './elite/EliteExperience';
import EliteContact from './elite/EliteContact';
import EliteCursor from './elite/EliteCursor';
import { HeroData, Skill, Project, SocialLink, Article, Experience, Education } from '../../types';

interface TemplateProps {
  heroData: HeroData;
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLink[];
  articles: Article[];
  experience: Experience[];
  education: Education[];
}

const TemplateElite: React.FC<TemplateProps> = ({
  heroData,
  skills,
  projects,
  socialLinks,
  articles,
  experience,
  education
}) => {
  const [isDark, setIsDark] = useState(() => {
      const saved = localStorage.getItem('elite-theme');
      if (saved) return saved === 'dark';
      return true; 
  });

  const toggleTheme = () => {
      setIsDark(prev => !prev);
  };
  
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
        root.classList.add('dark');
        localStorage.setItem('elite-theme', 'dark');
        document.body.style.backgroundColor = '#050505';
    } else {
        root.classList.remove('dark');
        localStorage.setItem('elite-theme', 'light');
        document.body.style.backgroundColor = '#ffffff';
    }
    
    document.body.classList.add('elite-scroll');
    
    const noise = document.createElement('div');
    noise.classList.add('elite-noise');
    document.body.appendChild(noise);

    return () => {
      document.body.style.backgroundColor = '';
      document.body.classList.remove('elite-scroll');
      if (document.body.contains(noise)) document.body.removeChild(noise);
    };
  }, [isDark]);

  return (
    <div className={`min-h-screen selection:bg-blue-500 selection:text-white dark:selection:bg-blue-500 dark:selection:text-white overflow-x-hidden relative transition-colors duration-500 bg-white dark:bg-[#050505] text-black dark:text-white`}>
      <EliteCursor />
      
      {/* GLOBAL AMBIENT NEBULA - Blue & Indigo (Restored) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Top Left: Deep Blue Glow */}
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[150px] animate-pulse-slow mix-blend-multiply dark:mix-blend-screen" />
          
          {/* Bottom Right: Midnight Indigo */}
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[150px] animate-pulse-slow mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: '2s' }} />
      </div>

      <EliteHeader name={heroData.name} isDark={isDark} toggleTheme={toggleTheme} />
      
      <main className="relative z-10">
        <EliteHero data={heroData} socialLinks={socialLinks} isDark={isDark} />
        <EliteMetrics socialLinks={socialLinks} isDark={isDark} />
        <EliteWork projects={projects} />
        <EliteExperience experience={experience} education={education} />
        <EliteThinking skills={skills} articles={articles} socialLinks={socialLinks} />
        <EliteContact data={heroData} socialLinks={socialLinks} />
      </main>
    </div>
  );
};

export default TemplateElite;
