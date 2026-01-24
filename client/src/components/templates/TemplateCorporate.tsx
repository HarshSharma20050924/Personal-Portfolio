
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Mail, 
  Linkedin, 
  Github, 
  Download, 
  ExternalLink, 
  ChevronRight,
  Code2,
  Terminal,
  Cpu,
  Globe
} from 'lucide-react';
import { HeroData, Skill, Project, SocialLink, Article, Experience, Education } from '../../types';

const M = motion as any;

interface TemplateProps {
  heroData: HeroData;
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLink[];
  articles: Article[];
  experience: Experience[];
  education: Education[];
}

const CorporateTemplate: React.FC<TemplateProps> = ({
  heroData,
  skills,
  projects,
  socialLinks,
  articles,
  experience,
  education
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects'>('overview');

  // --- Helpers ---
  const getSocialIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('linkedin')) return <Linkedin size={18} />;
    if (n.includes('github')) return <Github size={18} />;
    if (n.includes('email') || n.includes('mail')) return <Mail size={18} />;
    return <Globe size={18} />;
  };

  const githubLink = socialLinks.find(s => s.icon.toLowerCase().includes('github') || s.url.includes('github.com'));
  const githubUsername = githubLink ? githubLink.url.split('/').filter(Boolean).pop() : null;

  // --- Components ---

  const SectionTitle = ({ title, icon: Icon }: { title: string, icon?: any }) => (
    <div className="flex items-center gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
      {Icon && <Icon size={20} className="text-[#1a73e8] dark:text-[#8ab4f8]" />}
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wide">{title}</h3>
    </div>
  );

  const Badge = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 mr-2 mb-2 border border-gray-200 dark:border-gray-600">
      {children}
    </span>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#202124] text-[#3c4043] dark:text-[#bdc1c6] font-sans selection:bg-[#1a73e8] selection:text-white transition-colors duration-300">
      
      {/* --- Header / Navigation --- */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#202124]/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">
            {heroData.name} <span className="text-[#1a73e8] dark:text-[#8ab4f8]">.CV</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <button 
                onClick={() => setActiveTab('overview')} 
                className={`hover:text-[#1a73e8] dark:hover:text-[#8ab4f8] transition-colors ${activeTab === 'overview' ? 'text-[#1a73e8] dark:text-[#8ab4f8]' : ''}`}
            >
                Overview
            </button>
            <button 
                onClick={() => setActiveTab('projects')} 
                className={`hover:text-[#1a73e8] dark:hover:text-[#8ab4f8] transition-colors ${activeTab === 'projects' ? 'text-[#1a73e8] dark:text-[#8ab4f8]' : ''}`}
            >
                Projects
            </button>
            <a href="#contact" className="hover:text-[#1a73e8] dark:hover:text-[#8ab4f8] transition-colors">Contact</a>
          </nav>
          {heroData.resumeUrl && heroData.resumeUrl !== '#' && (
             <a href={heroData.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                <Download size={16} /> Resume
             </a>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        
        {/* --- Hero Section --- */}
        <section className="mb-16">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <img 
                    src={heroData.profileImageUrl} 
                    alt={heroData.name} 
                    className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover border border-gray-200 dark:border-gray-700 shadow-sm"
                />
                <div className="flex-1">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                        {heroData.name}
                    </h1>
                    <h2 className="text-xl md:text-2xl text-[#1a73e8] dark:text-[#8ab4f8] font-medium mb-4">
                        {heroData.title}
                    </h2>
                    <p className="text-base md:text-lg leading-relaxed max-w-2xl mb-6">
                        {heroData.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 items-center text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                            <MapPin size={16} />
                            <span>Remote / Relocate</span>
                        </div>
                        {heroData.email && (
                            <a href={`mailto:${heroData.email}`} className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-[#1a73e8] dark:hover:text-[#8ab4f8]">
                                <Mail size={16} />
                                <span>{heroData.email}</span>
                            </a>
                        )}
                        <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 hidden md:block"></div>
                        <div className="flex gap-3">
                            {socialLinks.map((link) => (
                                <a 
                                    key={link.name} 
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-gray-500 hover:text-[#1a73e8] dark:hover:text-[#8ab4f8] transition-colors"
                                    title={link.name}
                                >
                                    {getSocialIcon(link.name)}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {activeTab === 'overview' && (
            <M.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* --- Left Column: Experience & Education --- */}
                    <div className="lg:col-span-2 space-y-12">
                        
                        {/* Experience */}
                        <section>
                            <SectionTitle title="Experience" icon={Briefcase} />
                            <div className="space-y-8">
                                {experience.map((exp, idx) => (
                                    <div key={idx} className="group relative border-l-2 border-gray-200 dark:border-gray-700 pl-6 pb-2">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white dark:bg-[#202124] border-2 border-gray-300 dark:border-gray-600 group-hover:border-[#1a73e8] dark:group-hover:border-[#8ab4f8] transition-colors" />
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#1a73e8] dark:group-hover:text-[#8ab4f8] transition-colors">
                                                {exp.position}
                                            </h4>
                                            <span className="text-sm font-mono text-gray-500 dark:text-gray-400 whitespace-nowrap bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                                                {exp.period}
                                            </span>
                                        </div>
                                        <div className="text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            {exp.company}
                                        </div>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Education */}
                        <section>
                            <SectionTitle title="Education" icon={Briefcase} />
                            <div className="grid gap-6">
                                {education.map((edu, idx) => (
                                    <div key={idx} className="flex justify-between items-start p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors bg-gray-50 dark:bg-gray-800/30">
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white">{edu.institution}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{edu.degree}</p>
                                        </div>
                                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{edu.period}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Latest Articles */}
                        {articles.length > 0 && (
                            <section>
                                <SectionTitle title="Latest Writing" icon={Terminal} />
                                <div className="space-y-4">
                                    {articles.slice(0, 3).map((article, idx) => (
                                        <a 
                                            key={idx} 
                                            href={article.url ? article.url : `/blog/${article.id || idx}`}
                                            target={article.url ? "_blank" : "_self"}
                                            className="block p-5 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all bg-white dark:bg-[#202124]"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-gray-900 dark:text-white">{article.title}</h4>
                                                <span className="text-xs text-gray-500">{article.date}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                {article.excerpt}
                                            </p>
                                        </a>
                                    ))}
                                    <button 
                                        onClick={() => window.location.href='/blogs'} 
                                        className="text-sm font-medium text-[#1a73e8] dark:text-[#8ab4f8] hover:underline flex items-center gap-1"
                                    >
                                        View all articles <ChevronRight size={14} />
                                    </button>
                                </div>
                            </section>
                        )}

                    </div>

                    {/* --- Right Column: Skills & Metrics --- */}
                    <div className="space-y-12">
                        
                        {/* Skills */}
                        <section>
                            <SectionTitle title="Competencies" icon={Cpu} />
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, idx) => (
                                        <div key={idx} className="flex flex-col mb-3 w-full">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-semibold text-gray-700 dark:text-gray-200">{skill.name}</span>
                                                <span className="text-gray-500">{skill.level}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                                <div 
                                                    className="bg-[#1a73e8] dark:bg-[#8ab4f8] h-1.5 rounded-full" 
                                                    style={{ width: `${skill.level}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* GitHub Activity (Using Image from Elite) */}
                        {githubUsername && (
                            <section>
                                <SectionTitle title="Activity" icon={Code2} />
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-[#202124] overflow-hidden">
                                    <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">GitHub Contributions</div>
                                    <div className="overflow-x-auto">
                                        <img 
                                            src={`https://ghchart.rshah.org/1a73e8/${githubUsername}`} 
                                            alt="GitHub Chart"
                                            className="w-full min-w-[300px] opacity-80 hover:opacity-100 transition-opacity"
                                        />
                                    </div>
                                    <div className="mt-2 text-right text-[10px] text-gray-400">
                                        Source: GitHub API
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Contact Card */}
                        <section id="contact">
                            <SectionTitle title="Get In Touch" icon={Mail} />
                            <div className="p-6 bg-[#1a73e8]/5 dark:bg-[#8ab4f8]/5 border border-[#1a73e8]/20 dark:border-[#8ab4f8]/20 rounded-xl">
                                <p className="text-sm mb-4">
                                    Open to discussing new opportunities and collaborations.
                                </p>
                                <a 
                                    href={`mailto:${heroData.email}`} 
                                    className="block w-full text-center bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium py-2 rounded-lg transition-colors"
                                >
                                    Email Me
                                </a>
                            </div>
                        </section>

                    </div>
                </div>
            </M.div>
        )}

        {activeTab === 'projects' && (
            <M.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Selected Works</h2>
                    <p className="text-gray-500 dark:text-gray-400">A collection of technical projects and case studies.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project, idx) => (
                        <div key={idx} className="flex flex-col border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all bg-white dark:bg-[#202124] h-full">
                            <div className="h-48 overflow-hidden border-b border-gray-100 dark:border-gray-800">
                                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{project.title}</h3>
                                    {project.featured && <span className="text-[10px] uppercase font-bold text-[#1a73e8] bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">Featured</span>}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
                                    {project.description}
                                </p>
                                
                                <div className="flex flex-wrap mb-4">
                                    {project.tags.slice(0, 3).map(tag => (
                                        <Badge key={tag}>{tag}</Badge>
                                    ))}
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    {project.liveUrl && (
                                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#1a73e8] hover:underline flex items-center gap-1">
                                            <ExternalLink size={14} /> Live Demo
                                        </a>
                                    )}
                                    {project.repoUrl && (
                                        <a href={project.repoUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
                                            <Github size={14} /> Repository
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </M.div>
        )}

      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#171717] py-8 mt-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                &copy; {new Date().getFullYear()} {heroData.name}. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
                Designed with a focus on usability and performance.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default CorporateTemplate;
