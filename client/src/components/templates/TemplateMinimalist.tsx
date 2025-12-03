import React from 'react';
import Header from '../Header';
import Hero from '../Hero';
import About from '../About';
import Skills from '../Skills';
import Projects from '../Projects';
import Blog from '../Blog';
import Contact from '../Contact';
import Footer from '../Footer';
import type { HeroData, Skill, Project, SocialLink, Article } from '../../types';

interface TemplateProps {
  heroData: HeroData;
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLink[];
  articles: Article[];
}

const TemplateMinimalist: React.FC<TemplateProps> = ({
  heroData,
  skills,
  projects,
  socialLinks,
  articles,
}) => {
  return (
    <div className="bg-slate-50 dark:bg-gray-900 text-text dark:text-dark-text">
      <Header articles={articles} />
      <main className="max-w-4xl mx-auto px-6">
        <Hero data={heroData} template={heroData.template || 'minimalist'} />
        <About data={heroData} />
        <Skills skills={skills} template={heroData.template || 'minimalist'} />
        <Projects projects={projects} template={heroData.template || 'minimalist'} />
        {articles && articles.length > 0 && <Blog articles={articles} />}
        <Contact socialLinks={socialLinks} heroData={heroData} />
      </main>
      <Footer name={heroData.name} />
    </div>
  );
};

export default TemplateMinimalist;