import React, { useState, useEffect } from 'react';
import Header from '../Header';
import Hero from '../Hero';
import About from '../About';
import Skills from '../Skills';
import Projects from '../Projects';
import Blog from '../Blog';
import Contact from '../Contact';
import Footer from '../Footer';
import DotGrid from '../DotGrid';
import type { HeroData, Skill, Project, SocialLink, Article } from '../../types';

interface TemplateProps {
  heroData: HeroData;
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLink[];
  articles: Article[];
}

const TemplateDotGrid: React.FC<TemplateProps> = ({
  heroData,
  skills,
  projects,
  socialLinks,
  articles,
}) => {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    // Set initial theme state
    setIsDark(document.documentElement.classList.contains('dark'));

    // Observe changes to the class attribute on the html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
    });

    return () => observer.disconnect();
  }, []);
  
  const baseColor = isDark ? '#444444' : '#cccccc';
  const activeColor = isDark ? '#4D9FFF' : '#007FFF';

  return (
    <div className="text-text dark:text-dark-text relative">
      <div 
        className="bg-background dark:bg-dark-background"
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1 }}
      >
        <DotGrid
          dotSize={2}
          gap={25}
          baseColor={baseColor}
          activeColor={activeColor}
          proximity={100}
          shockRadius={200}
          shockStrength={2}
          resistance={500}
          returnDuration={1.5}
        />
      </div>
      <div className="bg-background/95 dark:bg-dark-background/95">
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
    </div>
  );
};

export default TemplateDotGrid;