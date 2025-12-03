import React, { useRef } from 'react';
import Header from '../Header';
import Hero from '../Hero';
import About from '../About';
import Skills from '../Skills';
import MagicBento, { ParticleCard, GlobalSpotlight } from '../MagicBento';
import Blog from '../Blog';
import Contact from '../Contact';
import Footer from '../Footer';
import LiquidEther from '../LiquidEther';
import type { HeroData, Skill, Project, SocialLink, Article } from '../../types';

interface TemplateProps {
  heroData: HeroData;
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLink[];
  articles: Article[];
}

const TemplateMagicBento: React.FC<TemplateProps> = ({
  heroData,
  skills,
  projects,
  socialLinks,
  articles,
}) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const glowColor = '132, 0, 255';
  const particleCount = 8; // Performance optimization

  return (
    <div className="bg-dark-background text-dark-text relative" ref={mainRef}>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1 }}>
         <LiquidEther
            resolution={0.25} // Performance optimization
            colors={['#1D0C33', '#3B1F6E', '#2A104E']}
            mouseForce={30}
            cursorSize={120}
            isViscous={false}
            autoDemo={true}
            autoSpeed={0.6}
            autoIntensity={2.5}
         />
      </div>
      
      <GlobalSpotlight gridRef={mainRef} glowColor={glowColor} />

      <Header articles={articles} />
      <main className="max-w-[1200px] mx-auto px-8">
        <Hero data={heroData} />

        <ParticleCard className="magic-bento-card magic-bento-card--section mb-20" enableStars={true} glowColor={glowColor} particleCount={particleCount}>
            <About data={heroData} />
        </ParticleCard>

        <ParticleCard className="magic-bento-card magic-bento-card--section mb-20" enableStars={true} glowColor={glowColor} particleCount={particleCount}>
            <Skills skills={skills} />
        </ParticleCard>

        <section id="projects" className="py-20 flex flex-col items-center">
            <div className="text-center mb-16">
                <h2 className="font-heading text-4xl font-bold">Featured Work</h2>
                <div className="w-20 h-1 bg-primary dark:bg-dark-primary mx-auto mt-4"></div>
            </div>
            <MagicBento 
              projects={projects}
              enableStars={true}
              enableSpotlight={false} // Handled by GlobalSpotlight
              enableBorderGlow={true}
              enableTilt={true}
              enableMagnetism={true}
              clickEffect={true}
              glowColor={glowColor}
              particleCount={particleCount}
            />
        </section>

        {articles && articles.length > 0 && (
            <ParticleCard className="magic-bento-card magic-bento-card--section mb-20" enableStars={true} glowColor={glowColor} particleCount={particleCount}>
                <Blog articles={articles} />
            </ParticleCard>
        )}

        <ParticleCard className="magic-bento-card magic-bento-card--section" enableStars={true} glowColor={glowColor} particleCount={particleCount}>
            <Contact socialLinks={socialLinks} heroData={heroData} />
        </ParticleCard>
      </main>
      <Footer name={heroData.name} />
    </div>
  );
};

export default TemplateMagicBento;