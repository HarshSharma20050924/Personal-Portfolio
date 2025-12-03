import React from 'react';
import { motion } from 'framer-motion';
import type { HeroData, Skill, Project, SocialLink, Article, PlaygroundConfig } from '../../types';
import { Github, Linkedin, Twitter, Instagram, ExternalLink } from 'lucide-react';
import DotGrid from '../DotGrid';
import StarryNight from '../StarryNight';
import Particles from '../Particles';
import FloatingLines from '../FloatingLines';

interface TemplateProps {
  heroData: HeroData;
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLink[];
  articles: Article[];
  config: PlaygroundConfig;
}

const iconMap: { [key: string]: any } = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
};

const TemplatePlayground: React.FC<TemplateProps> = ({
  heroData,
  skills,
  projects,
  socialLinks,
  config,
}) => {
  
  // Dynamic styles based on config
  const bgStyle: React.CSSProperties = {
    backgroundColor: config.bgColor1,
    color: config.textColor,
  };
  
  if (config.bgType === 'gradient') {
    bgStyle.backgroundImage = `linear-gradient(135deg, ${config.bgColor1}, ${config.bgColor2})`;
  }

  const getCardStyle = () => {
    const base = `p-6 transition-all duration-300 ${config.borderRadius} `;
    switch (config.cardStyle) {
        case 'glass':
            return base + "bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg";
        case 'solid':
            return base + "bg-white text-black shadow-md";
        case 'outline':
            return base + "bg-transparent border-2 border-current";
        case 'neobrutalism':
            return base + "bg-white text-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
        default:
            return base + "bg-white/5";
    }
  };

  const cardClassName = getCardStyle();
  const primaryColorStyle = { color: config.primaryColor };
  const buttonStyle = config.cardStyle === 'neobrutalism' 
    ? { backgroundColor: config.primaryColor, color: 'black', border: '2px solid black', boxShadow: '4px 4px 0px 0px black' }
    : { backgroundColor: config.primaryColor, color: '#fff' };

  // Animation settings
  const duration = config.animationSpeed === 'slow' ? 1.5 : config.animationSpeed === 'fast' ? 0.3 : 0.8;
  
  return (
    <div className="min-h-screen w-full relative overflow-x-hidden" style={bgStyle}>
        
        {/* Background Effects */}
        {config.bgType === 'mesh' && (
             <div className="absolute inset-0 z-0 opacity-50">
                <DotGrid baseColor={config.textColor} activeColor={config.primaryColor} />
             </div>
        )}
        
        {config.bgType === 'stars' && (
            <div className="absolute inset-0 z-0">
                <StarryNight />
            </div>
        )}

        {config.bgType === 'particles' && (
            <div className="absolute inset-0 z-0">
               <Particles
                  particleColors={[config.bgColor1, config.bgColor2, config.primaryColor]}
                  particleCount={config.particleCount}
                  particleSpread={config.particleSpread}
                  speed={config.particleSpeed}
                  particleBaseSize={config.particleBaseSize}
                  moveParticlesOnHover={config.moveParticlesOnHover}
                  disableRotation={config.disableRotation}
               />
            </div>
        )}

        {config.bgType === 'floatingLines' && (
            <div className="absolute inset-0 z-0">
               <FloatingLines
                  linesGradient={[config.bgColor1, config.bgColor2, config.primaryColor]}
                  enabledWaves={['top', 'middle', 'bottom']}
                  lineCount={config.flLineCount}
                  lineDistance={config.flLineDistance}
                  bendRadius={config.flBendRadius}
                  bendStrength={config.flBendStrength}
                  parallax={config.flParallax}
                  interactive={true}
                  animationSpeed={config.animationSpeed === 'slow' ? 0.5 : config.animationSpeed === 'fast' ? 2 : 1}
               />
            </div>
        )}

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 space-y-32">
            
            {/* Header / Hero */}
            {config.showHero && (
                <motion.section 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration }}
                    className="text-center flex flex-col items-center justify-center min-h-[60vh]"
                >
                    <div className="mb-8 relative">
                        <img 
                            src={heroData.profileImageUrl} 
                            alt="Profile" 
                            className={`w-32 h-32 object-cover ${config.borderRadius} border-4`}
                            style={{ borderColor: config.primaryColor }}
                        />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {config.heroTitle || heroData.name}
                    </h1>
                    <p className="text-xl md:text-2xl opacity-80 max-w-2xl mx-auto">
                        {config.heroSubtitle || heroData.title}
                    </p>
                    <div className="mt-8 flex gap-4">
                        <a href="#contact" className="px-8 py-3 rounded font-bold transition-transform active:scale-95" style={buttonStyle}>
                            Contact Me
                        </a>
                    </div>
                </motion.section>
            )}

            {/* Skills */}
            {config.showSkills && (
                <section>
                    <h2 className="text-3xl font-bold mb-12 text-center">Skills</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {skills.map((skill, i) => (
                            <motion.div 
                                key={skill.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                className={`${config.cardStyle === 'neobrutalism' ? 'border-2 border-black bg-white text-black px-6 py-3 font-bold' : 'px-6 py-3 bg-white/10 backdrop-blur border border-white/10' } ${config.borderRadius}`}
                            >
                                {skill.name}
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {config.showProjects && (
                <section>
                     <h2 className="text-3xl font-bold mb-12 text-center">Projects</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project, i) => (
                            <motion.div 
                                key={project.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration, delay: i * 0.1 }}
                                className={cardClassName}
                            >
                                <div className={`h-48 mb-4 overflow-hidden ${config.borderRadius}`}>
                                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-2" style={primaryColorStyle}>{project.title}</h3>
                                <p className="text-sm opacity-80 mb-4">{project.description}</p>
                                <div className="flex gap-4 mt-auto">
                                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="hover:opacity-70"><ExternalLink size={20} /></a>}
                                    {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noreferrer" className="hover:opacity-70"><Github size={20} /></a>}
                                </div>
                            </motion.div>
                        ))}
                     </div>
                </section>
            )}

            {/* Contact */}
            {config.showContact && (
                <section id="contact" className="text-center py-20">
                    <div className={cardClassName + " max-w-2xl mx-auto"}>
                        <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
                        <p className="opacity-80 mb-8">Let's build something amazing together.</p>
                        <div className="flex justify-center gap-6">
                            {socialLinks.map(link => {
                                const Icon = iconMap[link.icon] || ExternalLink;
                                return (
                                    <a key={link.name} href={link.url} target="_blank" rel="noreferrer" className="hover:text-[var(--primary)] transition-colors" style={{ '--primary': config.primaryColor } as any}>
                                        <Icon size={32} />
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                </section>
            )}

        </div>
    </div>
  );
};

export default TemplatePlayground;
