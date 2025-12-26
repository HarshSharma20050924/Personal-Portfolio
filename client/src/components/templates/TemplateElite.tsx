
import React, { useEffect } from 'react';
import EliteHeader from './elite/EliteHeader';
import EliteHero from './elite/EliteHero';
import EliteWork from './elite/EliteWork';
import EliteThinking from './elite/EliteThinking';
import EliteContact from './elite/EliteContact';
import EliteCursor from './elite/EliteCursor';
import { HeroData, Skill, Project, SocialLink, Article } from '../../types';

interface TemplateProps {
  heroData: HeroData;
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLink[];
  articles: Article[];
}

const TemplateElite: React.FC<TemplateProps> = ({
  heroData,
  skills,
  projects,
  socialLinks,
  articles,
}) => {
  
  useEffect(() => {
    // Force dark mode logic for this template
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = '#050505';
    document.body.classList.add('elite-scroll');
    
    // Add noise texture globally for that cinematic grain
    const noise = document.createElement('div');
    noise.classList.add('elite-noise');
    document.body.appendChild(noise);

    return () => {
      document.body.style.backgroundColor = '';
      document.body.classList.remove('elite-scroll');
      if (document.body.contains(noise)) document.body.removeChild(noise);
      if (localStorage.getItem('theme') !== 'dark') {
          document.documentElement.classList.remove('dark');
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black overflow-x-hidden relative">
      <EliteCursor />
      
      <EliteHeader name={heroData.name} />
      
      <main className="relative z-10">
        <EliteHero data={heroData} />
        <EliteWork projects={projects} />
        <EliteThinking skills={skills} articles={articles} />
        <EliteContact data={heroData} socialLinks={socialLinks} />
      </main>
    </div>
  );
};

export default TemplateElite;
