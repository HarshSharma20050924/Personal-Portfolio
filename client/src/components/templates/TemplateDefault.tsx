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

const TemplateDefault: React.FC<TemplateProps> = ({
  heroData,
  skills,
  projects,
  socialLinks,
  articles,
}) => {
  return (
    <div className="w-full min-h-screen bg-off-white dark:bg-dark-background text-text dark:text-dark-text transition-colors duration-300">
      <Header articles={articles} />
      <main className="max-w-[1200px] mx-auto px-8 space-y-24 pb-24">
        {/* Explicitly passing default template to Hero if no template is set */}
        <Hero data={heroData} template={heroData.template || 'default'} />
        <About data={heroData} />
        <Skills skills={skills} template={heroData.template || 'default'} />
        <Projects projects={projects} template={heroData.template || 'default'} />
        {articles && articles.length > 0 && <Blog articles={articles} />}
        <Contact socialLinks={socialLinks} heroData={heroData} />
      </main>
      <Footer name={heroData.name} />
    </div>
  );
};

export default TemplateDefault;