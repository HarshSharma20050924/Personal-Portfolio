
import React, { useEffect, useState } from 'react';
import { HeroData, Project, Skill, SocialLink, Article, Service } from '../types';
import { FreelanceNavigation } from '../components/FreelanceNavigation';
import { FreelanceHero } from '../components/FreelanceHero';
import { FreelanceTrust } from '../components/FreelanceTrust';
import { FreelanceServices } from '../components/FreelanceServices';
import { FreelanceAbout } from '../components/FreelanceAbout';
import { FreelanceProcess } from '../components/FreelanceProcess';
import { FreelanceWork } from '../components/FreelanceWork';
import { FreelanceFooter } from '../components/FreelanceFooter';
import FreelanceCursor from '../components/FreelanceCursor';
import { AIGlobe } from '../components/AIGlobe';
import { FreelanceIntro } from '../components/FreelanceIntro';
import { API_BASE } from '../config';

import { FreelanceTestimonials } from '../components/FreelanceTestimonials';

interface TemplateProps {
  heroData: HeroData;
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLink[];
  articles: Article[];
}

const HomePage: React.FC<TemplateProps> = ({ heroData, projects, socialLinks }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [introComplete, setIntroComplete] = useState(() => {
    return sessionStorage.getItem('freelance_intro_seen') === 'true';
  });
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    // Force Dark Mode for this template
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = '#0D0D0D';

    // Fetch Services dynamically
    fetch(`${API_BASE}/api/data`)
      .then(res => res.json())
      .then(data => {
        if (data && data.services) setServices(data.services);
        setDataLoaded(true);
      })
      .catch(() => setDataLoaded(true));

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <>
      {!introComplete && (
        <FreelanceIntro
          loaded={dataLoaded}
          onComplete={() => {
            setIntroComplete(true);
            sessionStorage.setItem('freelance_intro_seen', 'true');
          }}
        />
      )}

      <div className={`bg-[#0D0D0D] text-white min-h-screen font-sans selection:bg-white/20 selection:text-white ${!introComplete ? 'h-screen overflow-hidden' : ''}`}>
        <FreelanceCursor />
        <FreelanceNavigation name={heroData.name} />

        <main>
          <FreelanceHero data={heroData} socialLinks={socialLinks} />
          <FreelanceTrust />
          <FreelanceServices services={services} />
          <FreelanceAbout />
          <FreelanceProcess />
          <FreelanceWork projects={projects} services={services} />
          <FreelanceTestimonials />
        </main>


        <FreelanceFooter socialLinks={socialLinks} name={heroData.name} />
      </div>
    </>
  );
};

export default HomePage;
