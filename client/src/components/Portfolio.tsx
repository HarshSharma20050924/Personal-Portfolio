import React from 'react';
import Header from './Header';
import Hero from './Hero';
import Skills from './Skills';
import Projects from './Projects';
import Blog from './Blog';
import Contact from './Contact';
import Footer from './Footer';
import type { HeroData, Skill, Project, Article, SocialLink } from '../types';

interface PortfolioProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  heroData: HeroData;
  skills: Skill[];
  projects: Project[];
  articles: Article[];
  socialLinks: SocialLink[];
}

const Portfolio: React.FC<PortfolioProps> = ({
  theme,
  toggleTheme,
  heroData,
  skills,
  projects,
  articles,
  socialLinks,
}) => {
  return (
    <div className="text-slate-700 dark:text-slate-300">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="container mx-auto px-6 md:px-12">
        <Hero data={heroData} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Blog articles={articles} />
        <Contact socialLinks={socialLinks} />
      </main>
      <Footer name={heroData.name} />
    </div>
  );
};

export default Portfolio;
