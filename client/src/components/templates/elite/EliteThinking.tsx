import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Skill, Article, SocialLink } from '../../../types';
import { ArrowRight, Cpu, ArrowUpRight } from 'lucide-react';

const M = motion as any;

const MARQUEE = [
  'Distributed Systems',
  'Backend Infrastructure',
  'Systems Architecture',
  'Platform Engineering',
  'Scalable Systems',
  'Cloud Infrastructure',
  'Software Engineering',
];

const SpecCard = ({ skill, index }: { skill: Skill, index: number }) => {
    return (
        <M.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className="group relative h-36 rounded-2xl border border-black/5 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm overflow-hidden elite-interactive cursor-none hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-500"
        >
            {/* Soft Blue Gradient Reveal */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 h-full p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 group-hover:text-blue-500 transition-colors">
                        MODULE_0{index + 1}
                    </span>
                    <Cpu size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                </div>
                
                <div>
                    <h4 className="text-xl font-bold text-black dark:text-white group-hover:translate-x-1 transition-transform duration-300">
                        {skill.name}
                    </h4>
                    {/* Smooth Progress Bar */}
                    <div className="w-full h-1 bg-black/5 dark:bg-white/5 mt-4 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-black dark:bg-white group-hover:bg-blue-500 transition-colors duration-500" 
                            style={{ width: `${skill.level}%` }}
                        />
                    </div>
                </div>
            </div>
        </M.div>
    );
};

// 2. Freelance-Style Kinetic Journal Row (Blue Theme) — slowed sweep + slowed content drift
const JournalRow = ({ article, index }: { article: Article; index: number }) => (
  <Link to={`/blog/${article.id || index}`} className="group block relative cursor-none">
    <div className="relative py-10 border-t border-black/5 dark:border-white/5 overflow-hidden transition-all duration-500">
      {/* Blue accent strip */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-blue-500/60 via-blue-500/10 to-transparent opacity-60" />

      {/* Hover sweep background (SLOW) */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-[2600ms] delay-150 ease-[0.12,1,0.22,1]" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-0">
        <div className="flex flex-col gap-2 group-hover:translate-x-2 transition-transform duration-[1400ms] delay-75 ease-[0.12,1,0.22,1]">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
              View Article
            </span>
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest group-hover:text-blue-400/60 transition-colors duration-400">
              {article.date || `LOG_${String(index + 1).padStart(3, '0')}`}
            </span>
          </div>

          <h3 className="text-2xl md:text-4xl font-light text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-400">
            {article.title}
          </h3>
        </div>

        <div className="flex items-center gap-4 pr-4">
          <div className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
            <ArrowUpRight className="w-5 h-5 transform group-hover:rotate-45 transition-transform duration-500" />
          </div>
        </div>
      </div>
    </div>
  </Link>
);

const EliteThinking: React.FC<{ skills: Skill[]; articles: Article[]; socialLinks: SocialLink[] }> = ({
  skills = [],
  articles = [],
}) => {
  const safeSkills = skills || [];
  const safeArticles = articles || [];
  const displayArticles = safeArticles.slice(0, 4);

  return (
    <section className="relative overflow-hidden bg-transparent text-black dark:text-white transition-colors duration-500 z-10">
      {/* BLUE ambient nebula (section background) */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-44 -left-44 h-[520px] w-[520px] rounded-full blur-[130px] bg-blue-500/10" />
        <div className="absolute top-1/3 -right-44 h-[560px] w-[560px] rounded-full blur-[150px] bg-indigo-500/10" />
        <div className="absolute -bottom-56 left-1/4 h-[680px] w-[680px] rounded-full blur-[170px] bg-sky-500/8" />
      </div>

      {/* 1. Technology Stack */}
      <div className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
            <div>
              <span className="text-blue-500 font-mono text-xs tracking-widest uppercase mb-4 block">
                Technical Capabilities
              </span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Technology Stack</h2>
            </div>

            <p className="text-sm font-mono text-gray-500 max-w-sm text-right mt-4 md:mt-0">
              Technologies leveraged to architect scalable, reliable, and high-performance systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {safeSkills.map((skill, i) => (
              <SpecCard key={i} skill={skill} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* 2. Infinite Marquee Divider (Blue Edition) */}
      <div className="py-8 bg-[#050505] border-y border-white/[0.08] overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none" />

        <div className="flex whitespace-nowrap">
          <motion.div
            animate={{ x: '-50%' }}
            transition={{ repeat: Infinity, ease: 'linear', duration: 20 }}
            className="flex gap-16 items-center pr-16"
          >
            {[...Array(20)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 group/item">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] group-hover/item:scale-150 transition-transform duration-300" />
                <span className="text-sm font-mono tracking-[0.2em] text-white/50 group-hover/item:text-white transition-colors duration-300 uppercase">
                  {MARQUEE[i % MARQUEE.length]}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 3. Technical Articles */}
      <div className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-24">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Technical Articles</h2>
            <Link
              to="/blogs"
              className="group flex items-center gap-2 text-xs font-mono uppercase tracking-widest px-6 py-3 rounded-full border border-black/10 dark:border-white/10 hover:border-blue-500 hover:text-blue-500 transition-all"
            >
              View All Articles <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex flex-col">
            {displayArticles.length > 0 ? (
              displayArticles.map((article, idx) => <JournalRow key={idx} article={article} index={idx} />)
            ) : (
              <div className="py-20 border-y border-dashed border-black/10 dark:border-white/10 text-center font-mono text-sm text-gray-500">
                No articles available.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EliteThinking;
