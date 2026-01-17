
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Skill, Article, SocialLink } from '../../../types';
import { ArrowRight } from 'lucide-react';

const M = motion as any;

const EliteThinking: React.FC<{ skills: Skill[]; articles: Article[]; socialLinks: SocialLink[] }> = ({ skills = [], articles = [], socialLinks = [] }) => {
  const safeSkills = skills || [];
  const safeArticles = articles || [];
  
  // Filter for featured articles only
  const featuredArticles = safeArticles.filter(article => article.featured);
  // Fallback: If no featured articles, show the latest 3, otherwise show featured ones.
  const displayArticles = featuredArticles.length > 0 ? featuredArticles.slice(0, 3) : safeArticles.slice(0, 3);

  return (
    <section id="philosophy" className="py-32 px-6 bg-gray-50 dark:bg-[#080808] transition-colors duration-500">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24">
        
        {/* Skills & Activity */}
        <div>
          <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-12 flex items-center gap-2">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             System Capabilities
          </h3>
          
          <div className="flex flex-wrap gap-2 mb-16">
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
          </div>
        </div>

        {/* 3D Interactive Articles */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-12">
                <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest">
                    {featuredArticles.length > 0 ? "Featured Transmissions" : "Latest Transmissions"}
                </h3>
                {safeArticles.length > 0 && (
                    <Link to="/blogs" className="text-[10px] font-mono uppercase tracking-widest text-black dark:text-white border-b border-current hover:opacity-60 transition-opacity">
                        View Archive
                    </Link>
                )}
            </div>
            
            <div className="space-y-6">
               {displayArticles.length > 0 ? displayArticles.map((article, idx) => (
                 <M.div
                   key={article.title}
                   initial={{ opacity: 0, x: 20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.1 }}
                   whileHover={{ 
                       scale: 1.02, 
                       x: 10,
                   }}
                 >
                   <Link 
                     to={`/blog/${article.id || idx}`}
                     className="block group elite-interactive p-6 border border-black/5 dark:border-white/5 bg-white dark:bg-white/[0.02] rounded-xl transition-all duration-300 shadow-sm dark:shadow-none cursor-pointer"
                   >
                     <div className="flex justify-between items-start mb-3">
                        <h4 className="text-xl text-black dark:text-white font-light group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors max-w-[80%]">
                          {article.title}
                        </h4>
                        <span className="text-[10px] text-gray-500 font-mono border border-black/10 dark:border-white/10 px-2 py-1 rounded">
                            {article.date || 'LOG.' + String(idx + 1).padStart(3, '0')}
                        </span>
                     </div>
                     <p className="text-gray-600 dark:text-gray-500 text-sm line-clamp-2 leading-relaxed">
                       {article.excerpt}
                     </p>
                     <div className="mt-4 flex items-center gap-2 text-xs font-mono text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors">
                         ACCESS_FILE <div className="w-4 h-[1px] bg-gray-400 dark:bg-gray-600 group-hover:bg-black dark:group-hover:bg-white transition-colors" />
                     </div>
                   </Link>
                 </M.div>
               )) : (
                 <div className="text-gray-500 font-mono text-sm py-10 border border-dashed border-black/10 dark:border-white/10 rounded-lg text-center">
                    No articles to display.
                 </div>
               )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default EliteThinking;
