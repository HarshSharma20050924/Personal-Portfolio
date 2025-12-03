import React from 'react';
import type { HeroData, Skill, Project, SocialLink, Article, PlaygroundConfig } from '../types';
import TemplateDefault from './templates/TemplateDefault';
import TemplateMinimalist from './templates/TemplateMinimalist';
import TemplateDotGrid from './templates/TemplateDotGrid';
import TemplateMagicBento from './templates/TemplateMagicBento';
import TemplateStarryNight from './templates/TemplateStarryNight';
import TemplatePlayground from './templates/TemplatePlayground';

interface PortfolioProps {
  heroData: HeroData;
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLink[];
  articles: Article[];
  playgroundConfig?: PlaygroundConfig;
}

const Portfolio: React.FC<PortfolioProps> = (props) => {
  const { heroData, playgroundConfig } = props;

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
    case 'default':
    default:
      return <TemplateDefault {...props} />;
  }
};

export default Portfolio;