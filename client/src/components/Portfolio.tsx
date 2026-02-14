
import React from 'react';
import type { HeroData, Skill, Project, SocialLink, Article, Experience, Education, PlaygroundConfig } from '../types';
import TemplateDefault from './templates/TemplateDefault';
import TemplateMinimalist from './templates/TemplateMinimalist';
import TemplateDotGrid from './templates/TemplateDotGrid';
import TemplateMagicBento from './templates/TemplateMagicBento';
import TemplateStarryNight from './templates/TemplateStarryNight';
import TemplatePlayground from './templates/TemplatePlayground';
import TemplateProfileCard from './templates/TemplateProfileCard';
import TemplateElite from './templates/TemplateElite';
import TemplateFantasy from './templates/TemplateFantasy';
import TemplateCorporate from './templates/TemplateCorporate';
import TemplateFreelance from './templates/TemplateFreelance';
import ChatWidget from './ChatWidget';

interface PortfolioProps {
  heroData: HeroData;
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLink[];
  articles: Article[];
  experience: Experience[];
  education: Education[];
  playgroundConfig?: PlaygroundConfig;
}

const Portfolio: React.FC<PortfolioProps> = (props) => {
  const { heroData, playgroundConfig } = props;

  const renderTemplate = () => {
    switch (heroData.template) {
        case 'playground':
            if (playgroundConfig) {
                return <TemplatePlayground {...props} config={playgroundConfig} />;
            }
            return <TemplateDefault {...props} />;
        case 'minimalist':
          return <TemplateMinimalist {...props} />;
        case 'dotgrid':
          return <TemplateDotGrid {...props} />;
        case 'magicbento':
          return <TemplateMagicBento {...props} />;
        case 'starrynight':
          return <TemplateStarryNight {...props} />;
        case 'profilecard':
          return <TemplateProfileCard {...props} />;
        case 'elite':
          return <TemplateElite {...props} />;
        case 'fantasy':
          return <TemplateFantasy {...props} />;
        case 'corporate':
          return <TemplateCorporate {...props} />;
        case 'freelance':
          return <TemplateFreelance {...props} />;
        case 'default':
        default:
          return <TemplateDefault {...props} />;
      }
  };

  return (
    <>
        {renderTemplate()}
        {/* Hide default ChatWidget on Freelance template because it has AIGlobe */}
        {heroData.template !== 'freelance' && <ChatWidget template={heroData.template} />}
    </>
  );
};

export default Portfolio;
