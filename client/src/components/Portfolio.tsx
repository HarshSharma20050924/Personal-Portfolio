import React from 'react';
import Header from './Header';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Blog from './Blog';
import Contact from './Contact';
import Footer from './Footer';
import type { HeroData, Skill, Project, SocialLink, Article } from '../types';

interface PortfolioProps {
  heroData: HeroData;
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLink[];
  articles: Article[];
}

const Portfolio: React.FC<PortfolioProps> = ({
  heroData,
  skills,
  projects,
  socialLinks,
  articles,
}) => {
  return (
    <div className="text-text dark:text-dark-text">
      <Header articles={articles} />
      <main className="max-w-[1200px] mx-auto px-8">
        <Hero data={heroData} />
        <About data={heroData} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        {articles && articles.length > 0 && <Blog articles={articles} />}
        <Contact socialLinks={socialLinks} heroData={heroData} />
      </main>
      <Footer name={heroData.name} />
    </div>
  );
};

export default Portfolio;
