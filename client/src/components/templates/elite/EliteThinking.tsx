import React from 'react';
import { motion } from 'framer-motion';
import { Skill, Article } from '../../../types';

const EliteThinking: React.FC<{ skills: Skill[]; articles: Article[] }> = ({ skills = [], articles = [] }) => {
  const safeSkills = skills || [];
  const safeArticles = articles || [];

  return (
    <section id="philosophy" className="py-32 px-6 bg-[#080808]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24">
        
        {/* Skills - Visualized as a System */}
        <div>
          <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-12">Technical Arsenal</h3>
          <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10">
            {safeSkills.map((skill) => (
              <motion.div 
                key={skill.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-[#080808] p-6 hover:bg-[#0f0f0f] transition-colors duration-300 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-gray-400 font-mono text-xs">SYS.0{skill.id || Math.floor(Math.random()*99)}</span>
                  <div className="w-1 h-1 bg-gray-700 rounded-full group-hover:bg-blue-500 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-all" />
                </div>
                <h4 className="text-xl text-white font-medium mb-2">{skill.name}</h4>
                <div className="w-full bg-gray-900 h-[2px] mt-4">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-white/40"
                  />
                </div>
              </motion.div>
            ))}
            {safeSkills.length === 0 && <div className="p-6 text-gray-500 font-mono text-sm">No skills listed.</div>}
          </div>
        </div>

        {/* Philosophy / Articles */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-12">Thinking</h3>
            <div className="space-y-12">
               {safeArticles.length > 0 ? safeArticles.slice(0, 3).map((article) => (
                 <a 
                   key={article.title} 
                   href={article.url}
                   className="block group elite-interactive"
                 >
                   <div className="flex items-baseline gap-4 mb-2">
                      <span className="text-xs text-gray-600 font-mono">{article.date}</span>
                      <h4 className="text-2xl text-white font-light group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </h4>
                   </div>
                   <p className="text-gray-500 text-sm line-clamp-2 pl-24 border-l border-white/10 group-hover:border-blue-500/50 transition-colors">
                     {article.excerpt}
                   </p>
                 </a>
               )) : (
                 <div className="text-gray-500 font-mono text-sm">No articles to display.</div>
               )}
            </div>
          </div>
          
          <div className="mt-20 p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
             <p className="text-white text-lg italic font-serif">
               "Good design is obvious. Great design is transparent."
             </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default EliteThinking;