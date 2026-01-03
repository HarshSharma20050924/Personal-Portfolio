
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FantasyScene from './fantasy/FantasyScene';
import { HeroData, Skill, Project, SocialLink, Article } from '../../types';
import { ArrowLeft, Github, ExternalLink, Shield, Swords, Scroll, RotateCcw } from 'lucide-react';

const M = motion as any;

interface TemplateProps {
  heroData: HeroData;
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLink[];
  articles: Article[];
}

type ViewState = 'intro' | 'overview' | 'projects' | 'skills' | 'contact';

const TemplateFantasy: React.FC<TemplateProps> = ({
  heroData,
  skills,
  projects,
  socialLinks,
  articles,
}) => {
  const [view, setView] = useState<ViewState>('intro');

  // Audio effect placeholder (browser requires interaction first usually)
  const playSound = () => {
      // Implement sound effects here if desired
  };

  const handleStart = () => {
      playSound();
      setView('overview');
  };

  const handleBack = () => {
      playSound();
      setView('overview');
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-[#050011] text-white relative font-sans select-none">
      
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
          <FantasyScene 
            view={view} 
            setView={setView} 
            heroData={heroData} 
            projects={projects} 
            skills={skills} 
            socialLinks={socialLinks} 
          />
      </div>

      {/* UI Overlay Layer (HUD) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
          
          {/* INTRO SCREEN */}
          <AnimatePresence>
            {view === 'intro' && (
                <M.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 1 }}
                    className="w-full h-full flex flex-col items-center justify-center pointer-events-auto bg-black/40 backdrop-blur-sm"
                >
                    <M.h1 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-6xl md:text-9xl font-fantasy tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-purple-200 to-purple-900 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] mb-8 text-center"
                    >
                        {heroData.name.split(' ')[0].toUpperCase()}
                    </M.h1>
                    <M.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="text-gray-300 font-serif italic text-xl mb-12"
                    >
                        "{heroData.title}"
                    </M.p>
                    
                    <M.button
                        onClick={handleStart}
                        whileHover={{ scale: 1.05, textShadow: "0 0 8px rgb(255,255,255)" }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative px-12 py-4 bg-transparent border-2 border-purple-500/50 text-purple-200 font-fantasy text-xl tracking-[0.2em] overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-purple-600/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative z-10">ENTER REALM</span>
                    </M.button>
                </M.div>
            )}
          </AnimatePresence>

          {/* HUD Navigation (Visible when not in intro) */}
          <AnimatePresence>
              {view !== 'intro' && (
                  <M.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-auto"
                  >
                      <div className="flex flex-col">
                          <h2 className="text-xl font-fantasy tracking-widest text-purple-200">{heroData.name}</h2>
                          <div className="flex items-center gap-2 text-xs text-purple-400 font-mono">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                              ONLINE
                          </div>
                      </div>

                      {view !== 'overview' && (
                          <button 
                            onClick={handleBack}
                            className="flex items-center gap-2 text-sm font-fantasy tracking-widest text-gray-400 hover:text-white transition-colors group"
                          >
                              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                              RETURN TO MAP
                          </button>
                      )}
                  </M.div>
              )}
          </AnimatePresence>

          {/* SECTION CONTENT OVERLAYS */}
          
          {/* PROJECTS VIEW */}
          <AnimatePresence>
              {view === 'projects' && (
                  <M.div 
                    initial={{ opacity: 0, x: 50 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="absolute right-0 top-0 h-full w-full md:w-[500px] bg-gradient-to-l from-black/90 to-transparent p-8 md:p-12 flex flex-col justify-center pointer-events-auto overflow-y-auto"
                  >
                      <div className="flex items-center gap-3 mb-8 text-purple-400">
                          <Swords size={32} />
                          <h2 className="text-3xl font-fantasy tracking-widest text-white">CONQUESTS</h2>
                      </div>
                      
                      <div className="space-y-8 pb-20">
                          {projects.map((project, idx) => (
                              <div key={idx} className="group relative bg-white/5 border border-white/10 p-6 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300">
                                  <h3 className="text-xl font-bold text-purple-100 mb-2 font-fantasy tracking-wide">{project.title}</h3>
                                  <p className="text-sm text-gray-400 mb-4 leading-relaxed font-serif">{project.description}</p>
                                  <div className="flex gap-4">
                                      {project.liveUrl && (
                                          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs uppercase tracking-widest text-purple-400 hover:text-white transition-colors">
                                              <ExternalLink size={14} /> Visit
                                          </a>
                                      )}
                                      {project.repoUrl && (
                                          <a href={project.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                                              <Github size={14} /> Code
                                          </a>
                                      )}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </M.div>
              )}
          </AnimatePresence>

          {/* SKILLS VIEW */}
          <AnimatePresence>
              {view === 'skills' && (
                  <M.div 
                    initial={{ opacity: 0, x: -50 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -50 }}
                    className="absolute left-0 top-0 h-full w-full md:w-[400px] bg-gradient-to-r from-black/90 to-transparent p-8 md:p-12 flex flex-col justify-center pointer-events-auto"
                  >
                      <div className="flex items-center gap-3 mb-8 text-purple-400">
                          <Shield size={32} />
                          <h2 className="text-3xl font-fantasy tracking-widest text-white">ARSENAL</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                          {skills.map((skill, idx) => (
                              <M.div 
                                key={idx} 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-center justify-between p-3 border-b border-white/10"
                              >
                                  <span className="font-fantasy tracking-widest text-gray-300">{skill.name}</span>
                                  <div className="flex gap-1">
                                      {[...Array(5)].map((_, i) => (
                                          <div 
                                            key={i} 
                                            className={`w-2 h-2 rotate-45 ${i < (skill.level / 20) ? 'bg-purple-500' : 'bg-gray-800'}`} 
                                          />
                                      ))}
                                  </div>
                              </M.div>
                          ))}
                      </div>
                  </M.div>
              )}
          </AnimatePresence>

          {/* CONTACT VIEW */}
          <AnimatePresence>
              {view === 'contact' && (
                  <M.div 
                    initial={{ opacity: 0, y: 50 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: 50 }}
                    className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center justify-end pb-20 pointer-events-auto"
                  >
                      <div className="text-center max-w-2xl px-6">
                          <div className="flex justify-center mb-6 text-purple-400"><Scroll size={48} /></div>
                          <h2 className="text-4xl font-fantasy tracking-widest text-white mb-6">SEND A RAVEN</h2>
                          
                          {heroData.email && (
                              <a 
                                href={`mailto:${heroData.email}`} 
                                className="inline-block text-2xl md:text-4xl text-purple-200 hover:text-white font-serif italic mb-8 hover:scale-105 transition-transform"
                              >
                                  {heroData.email}
                              </a>
                          )}

                          <div className="flex justify-center gap-8">
                              {socialLinks.map(link => (
                                  <a 
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer" 
                                    className="text-xs font-fantasy tracking-[0.2em] text-gray-500 hover:text-purple-400 transition-colors uppercase border-b border-transparent hover:border-purple-400"
                                  >
                                      {link.name}
                                  </a>
                              ))}
                          </div>
                      </div>
                  </M.div>
              )}
          </AnimatePresence>

          {/* Footer Controls */}
          {view !== 'intro' && (
             <div className="absolute bottom-6 right-6 flex items-center gap-4 pointer-events-auto">
                 <button onClick={() => setView('intro')} className="p-2 text-gray-500 hover:text-white transition-colors" title="Restart">
                     <RotateCcw size={20} />
                 </button>
             </div>
          )}
          
          {/* Tutorial Hint */}
          <AnimatePresence>
            {view === 'overview' && (
                <M.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center pointer-events-none"
                >
                    <p className="text-[10px] font-fantasy tracking-[0.3em] text-white/50 animate-pulse">
                        TOUCH & DRAG TO LOOK AROUND • TAP LOCATIONS TO TRAVEL
                    </p>
                </M.div>
            )}
          </AnimatePresence>

      </div>
    </div>
  );
};

export default TemplateFantasy;
