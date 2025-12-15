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
    
    return () => {
      document.body.style.backgroundColor = '';
      document.body.classList.remove('elite-scroll');
      if (localStorage.getItem('theme') !== 'dark') {
          document.documentElement.classList.remove('dark');
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black overflow-x-hidden">
      <div className="elite-noise" />
      <EliteCursor />
      
      <EliteHeader name={heroData.name} />
      
      <main>
        <EliteHero data={heroData} />
        <EliteWork projects={projects} />
        <EliteThinking skills={skills} articles={articles} />
        <EliteContact data={heroData} socialLinks={socialLinks} />
      </main>
    </div>
  );
};

export default TemplateElite;