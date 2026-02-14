
import React, { useEffect, useState } from 'react';
import { HeroData, Project, Skill, SocialLink, Article, Service } from '../../types';
import { FreelanceNavigation } from './freelance/FreelanceNavigation';
import { FreelanceHero } from './freelance/FreelanceHero';
import { FreelanceTrust } from './freelance/FreelanceTrust';
import { FreelanceServices } from './freelance/FreelanceServices';
import { FreelanceAbout } from './freelance/FreelanceAbout';
import { FreelanceProcess } from './freelance/FreelanceProcess';
import { FreelanceWork } from './freelance/FreelanceWork';
import { FreelanceFooter } from './freelance/FreelanceFooter';
import FreelanceCursor from './freelance/FreelanceCursor';

interface TemplateProps {
  heroData: HeroData;
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLink[];
  articles: Article[];
}

const TemplateFreelance: React.FC<TemplateProps> = ({ heroData, projects, socialLinks }) => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    // Force Dark Mode for this template
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = '#0D0D0D';
    
    // Fetch Services dynamically
    fetch('/api/data')
        .then(res => res.json())
        .then(data => {
            if(data && data.services) setServices(data.services);
        });

    return () => {
       document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <div className="bg-[#0D0D0D] text-white min-h-screen font-sans selection:bg-white/20 selection:text-white cursor-none">
      <FreelanceCursor />
      <FreelanceNavigation />
      
      <main>
        <FreelanceHero data={heroData} socialLinks={socialLinks} />
        <FreelanceTrust />
        <FreelanceServices services={services} />
        <FreelanceAbout />
        <FreelanceProcess />
        <FreelanceWork projects={projects} services={services} />
      </main>

      <FreelanceFooter socialLinks={socialLinks} name={heroData.name} />
    </div>
  );
};

export default TemplateFreelance;
