import React from 'react';
import Header from '../Header';
import ProfileCard from '../ProfileCard';
import Contact from '../Contact';
import Footer from '../Footer';
import type { HeroData, SocialLink, Article, Project } from '../../types';

interface TemplateProps {
  heroData: HeroData;
  socialLinks: SocialLink[];
  articles: Article[];
  projects: Project[]; // Keep for prop consistency
}

const TemplateProfileCard: React.FC<TemplateProps> = ({
  heroData,
  socialLinks,
  articles,
}) => {
  return (
    <div className="bg-dark-background text-dark-text">
      <Header articles={articles} />
      <main className="min-h-screen flex flex-col items-center justify-center p-4 pt-24">
        <ProfileCard
          name={heroData.name}
          title={heroData.title}
          handle={socialLinks.find(s => s.icon === 'github')?.url.split('/').pop() || 'username'}
          status="Online"
          contactText="Contact Me"
          avatarUrl={heroData.profileImageUrl}
          showUserInfo={true}
          enableTilt={true}
          onContactClick={() => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
        <div className="w-full max-w-4xl mx-auto px-6">
            <Contact socialLinks={socialLinks} heroData={heroData} />
        </div>
      </main>
      <Footer name={heroData.name} />
    </div>
  );
};

export default TemplateProfileCard;