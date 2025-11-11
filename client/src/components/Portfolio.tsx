import React from 'react';
import Header from './Header';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Contact from './Contact';
import Footer from './Footer';
import type { HeroData, Skill, Project, SocialLink } from '../types';

interface PortfolioProps {
  heroData: HeroData;
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLink[];
}

const Portfolio: React.FC<PortfolioProps> = ({
  heroData,
  skills,
  projects,
  socialLinks,
}) => {
  return (
    <div className="text-text">
      <Header />
      <main className="max-w-[1200px] mx-auto px-8">
        <Hero data={heroData} />
        <About data={heroData} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Contact socialLinks={socialLinks} heroData={heroData} />
      </main>
      <Footer name={heroData.name} />
    </div>
  );
};

export default Portfolio;