
import React from 'react';
import { motion } from 'framer-motion';
import { Skill, Article } from '../../../types';

const M = motion as any;

const EliteThinking: React.FC<{ skills: Skill[]; articles: Article[] }> = ({ skills = [], articles = [] }) => {
  const safeSkills = skills || [];
  const safeArticles = articles || [];

  return (
    <section id="philosophy" className="py-32 px-6 bg-gray-50 dark:bg-[#080808] transition-colors duration-500">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24">
        
        {/* Playful Interactive Skills Grid */}
        <div>
          <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-12 flex items-center gap-2">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             System Capabilities
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {safeSkills.map((skill, i) => (
              <M.div 
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="relative group cursor-default"
              >
                <div className="
                    px-4 py-3 bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-lg 
                    group-hover:border-black/40 dark:group-hover:border-white/40 group-hover:bg-gray-100 dark:group-hover:bg-[#1a1a1a] 
                    transition-all duration-300 relative z-10
                    flex items-center gap-2
                ">
                    <span className="text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white font-mono text-sm transition-colors">{skill.name}</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-600 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 duration-300">
                        {skill.level}%
                    </span>
                </div>
              </M.div>
            ))}
            {safeSkills.length === 0 && <div className="text-gray-500 font-mono text-sm">Initializing skills database...</div>}
          </div>

          <div className="mt-12 p-6 bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-xl shadow-sm dark:shadow-none">
             <div className="flex items-center gap-2 mb-4 text-xs font-mono text-gray-500 uppercase">
                <div className="w-1.5 h-1.5 bg-blue-500" />
                Live Metric
             </div>
             <div className="flex justify-between items-end h-24 gap-1">
                {[...Array(20)].map((_, i) => (
                    <M.div 
                        key={i}
                        className="flex-1 bg-black/10 dark:bg-white/10 hover:bg-blue-500/50 transition-colors"
                        initial={{ height: '20%' }}
                        animate={{ height: `${Math.random() * 80 + 20}%` }}
                        transition={{ 
                            repeat: Infinity, 
                            repeatType: 'mirror', 
                            duration: Math.random() * 1 + 0.5,
                            ease: "easeInOut"
                        }}
                    />
                ))}
             </div>
          </div>
        </div>

        {/* 3D Interactive Articles */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-12">Latest Transmissions</h3>
            <div className="space-y-6">
               {safeArticles.length > 0 ? safeArticles.slice(0, 3).map((article, idx) => (
                 <M.a 
                   key={article.title} 
                   href={article.url}
                   initial={{ opacity: 0, x: 20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.1 }}
                   whileHover={{ 
                       scale: 1.02, 
                       x: 10,
                   }}
                   className="block group elite-interactive p-6 border border-black/5 dark:border-white/5 bg-white dark:bg-white/[0.02] rounded-xl transition-all duration-300 shadow-sm dark:shadow-none"
                 >
                   <div className="flex justify-between items-start mb-3">
                      <h4 className="text-xl text-black dark:text-white font-light group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors max-w-[80%]">
                        {article.title}
                      </h4>
                      <span className="text-[10px] text-gray-500 font-mono border border-black/10 dark:border-white/10 px-2 py-1 rounded">
                          LOG.{String(idx + 1).padStart(3, '0')}
                      </span>
                   </div>
                   <p className="text-gray-600 dark:text-gray-500 text-sm line-clamp-2 leading-relaxed">
                     {article.excerpt}
                   </p>
                   <div className="mt-4 flex items-center gap-2 text-xs font-mono text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors">
                       READ_ENTRY <div className="w-4 h-[1px] bg-gray-400 dark:bg-gray-600 group-hover:bg-black dark:group-hover:bg-white transition-colors" />
                   </div>
                 </M.a>
               )) : (
                 <div className="text-gray-500 font-mono text-sm">No articles to display.</div>
               )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default EliteThinking;
