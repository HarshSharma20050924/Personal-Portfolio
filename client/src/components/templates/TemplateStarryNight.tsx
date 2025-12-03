import React from 'react';
import Hero from '../Hero';
import StarrySkills from './starrynight/StarrySkills';
import StarryContact from './starrynight/StarryContact';
import Footer from '../Footer';
import StarryNight from '../StarryNight';
import MagicBento from '../MagicBento';
import ChromaGrid from '../ChromaGrid';
import Dock from '../Dock';
import AnimatedButton from '../AnimatedButton';
import { User, Wrench, LayoutGrid, BookOpen, Mail } from 'lucide-react';
import type { HeroData, Skill, Project, SocialLink, Article } from '../../types';

interface TemplateProps {
  heroData: HeroData;
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLink[];
  articles: Article[];
}

const TemplateStarryNight: React.FC<TemplateProps> = ({
  heroData,
  skills,
  projects,
  socialLinks,
  articles,
}) => {
  // This template is designed for dark mode, so we'll force it
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {
      // Clean up if the user navigates away or template changes
      if (localStorage.getItem('theme') !== 'dark') {
         document.documentElement.classList.remove('dark');
      }
    };
  }, []);
  
  const profileChromaItem = {
      image: heroData.profileImageUrl,
      title: heroData.name,
      subtitle: heroData.title,
      handle: heroData.email,
      borderColor: "#8B5CF6",
      gradient: "linear-gradient(225deg, #8B5CF6, #000)",
  };

  const blogProjects = articles.map((article, index) => ({
    id: index,
    title: article.title,
    description: article.excerpt,
    imageUrl: `https://picsum.photos/seed/${encodeURIComponent(article.title)}/400/300`,
    tags: [article.date],
    liveUrl: article.url,
  }));
  
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const dockItems = [
    { icon: <User size={24} />, label: 'About', onClick: () => scrollToSection('about') },
    { icon: <Wrench size={24} />, label: 'Skills', onClick: () => scrollToSection('skills') },
    { icon: <LayoutGrid size={24} />, label: 'Projects', onClick: () => scrollToSection('projects') },
  ];
  if (articles && articles.length > 0) {
    dockItems.push({ icon: <BookOpen size={24} />, label: 'Blog', onClick: () => scrollToSection('blog') });
  }
  dockItems.push({ icon: <Mail size={24} />, label: 'Contact', onClick: () => scrollToSection('contact') });

  const resumeLink = heroData.resumeUrl && heroData.resumeUrl !== '#' ? heroData.resumeUrl : null;


  return (
    <div className="dark bg-transparent text-dark-text">
      <StarryNight />
      <main className="max-w-[1200px] mx-auto px-8 relative z-10">
        <Hero data={heroData} template="starrynight" />
        
        <section id="about" className="starry-section">
            <h2 className="font-heading text-4xl font-bold text-center mb-12">About Me</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="flex justify-center">
                    <ChromaGrid items={[profileChromaItem]} columns={1} rows={1} />
                </div>
                <div className="text-lg">
                    <p className="text-dark-secondary mb-6 leading-relaxed">
                        {heroData.description}
                    </p>
                    {heroData.quote && (
                        <p className="text-dark-primary italic mb-8">
                        “{heroData.quote}”
                        </p>
                    )}
                    <div className="flex space-x-4">
                        {resumeLink && (
                          <AnimatedButton
                              href={resumeLink}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="border border-[#8400ff] text-[#8400ff] font-medium py-3 px-8 rounded-full hover:bg-[#8400ff] hover:text-dark-background transition-all duration-300 active:scale-95"
                              particleColor="#8400ff"
                          >
                              Download Resume
                          </AnimatedButton>
                        )}
                        <AnimatedButton
                            href="#contact"
                            className="bg-[#8400ff] text-dark-background font-medium py-3 px-8 rounded-full hover:bg-[#8400ff]/80 transition-all duration-300 active:scale-95"
                            particleColor="#ffffff"
                        >
                            Contact
                        </AnimatedButton>
                    </div>
                </div>
            </div>
        </section>

        <section id="skills" className="py-20">
          <div className="starry-section">
            <StarrySkills skills={skills} />
          </div>
        </section>

        <section id="projects" className="py-20">
            <div className="starry-section">
              <div className="text-center mb-16">
                  <h2 className="font-heading text-4xl font-bold">Portfolio Highlights</h2>
                  <p className="mt-4 text-lg text-secondary dark:text-dark-secondary max-w-3xl mx-auto">
                      A collection of my favorite projects.
                  </p>
              </div>
              <MagicBento 
                projects={projects}
                enableStars={true}
                enableBorderGlow={true}
                enableTilt={true}
                enableMagnetism={true}
                clickEffect={true}
              />
            </div>
        </section>
        
        {articles && articles.length > 0 && (
          <section id="blog" className="py-20">
            <div className="starry-section">
              <div className="text-center mb-16">
                  <h2 className="font-heading text-4xl font-bold">Articles & Insights</h2>
                  <p className="mt-4 text-lg text-secondary dark:text-dark-secondary max-w-3xl mx-auto">
                      I enjoy writing about technology, AI, and development.
                  </p>
              </div>
              <MagicBento 
                projects={blogProjects}
                enableStars={true}
                enableBorderGlow={true}
                enableTilt={true}
                enableMagnetism={true}
                clickEffect={true}
              />
            </div>
          </section>
        )}
        <section id="contact" className="starry-section">
          <StarryContact socialLinks={socialLinks} heroData={heroData} />
        </section>
      </main>
      <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <Dock items={dockItems} />
      </div>
      <Footer name={heroData.name} />
    </div>
  );
};

export default TemplateStarryNight;