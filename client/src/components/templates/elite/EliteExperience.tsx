
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Experience, Education } from '../../../types';
import { Briefcase, GraduationCap } from 'lucide-react';

const M = motion as any;

interface EliteExperienceProps {
  experience: Experience[];
  education: Education[];
}

type Track = 'engineering' | 'academic';

const Chapter = ({ exp, index, total, isEdu }: { exp: Experience | Education; index: number; total: number; isEdu: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 0.5, 1], [60, 0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <M.div
      ref={ref}
      style={{ opacity, y }}
      className="relative min-h-[40vh] flex flex-col justify-center py-16"
    >
      <div className="flex flex-col md:flex-row gap-8 md:gap-20 items-baseline">
        <span className="text-7xl md:text-[8rem] font-display font-bold leading-none text-slate-200 dark:text-slate-800/30 select-none">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="flex-1 max-w-2xl">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs font-mono tracking-widest text-blue-500 uppercase font-medium">{exp.period}</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>
          <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 text-slate-900 dark:text-white leading-tight">
            {isEdu ? (exp as Education).degree : (exp as Experience).position}
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-normal">
            {isEdu ? (exp as Education).institution : (exp as Experience).description}
          </p>
          <div className="mt-8 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">
            {isEdu ? <GraduationCap size={14} /> : <Briefcase size={14} />}
            <span>{isEdu ? 'Academic' : 'Experience'}_Track</span>
          </div>
        </div>
      </div>
    </M.div>
  );
};

const EliteExperience: React.FC<EliteExperienceProps> = ({ experience = [], education = [] }) => {
  const [activeTrack, setActiveTrack] = useState<Track>('engineering');

  if (!experience.length && !education.length) return null;

  return (
    <section id="experience" className="bg-transparent text-black dark:text-white py-24 px-6 relative z-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black/10 dark:border-white/10 pb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-blue-500 font-mono text-[11px] uppercase tracking-[0.4em] block mb-4 font-bold"
            >
              My Journey
            </motion.span>
            <h2 className="text-5xl md:text-8xl font-display font-medium tracking-tighter uppercase leading-none">
              {activeTrack === 'engineering' ? 'Engineering' : 'Academic'}
              <span className="block text-slate-300 dark:text-white/20">History</span>
            </h2>
          </div>

          <div className="flex flex-col gap-6 md:items-end">
            <div className="inline-flex rounded-xl border border-slate-200 dark:border-white/10 p-1 bg-white/50 dark:bg-white/[0.03] backdrop-blur-md">
              <button
                onClick={() => setActiveTrack('engineering')}
                className={`px-6 py-2.5 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all duration-300 ${activeTrack === 'engineering'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 font-bold'
                  : 'text-slate-500 hover:text-black dark:hover:text-white'
                  }`}
              >
                Engineering
              </button>
              <button
                onClick={() => setActiveTrack('academic')}
                className={`px-6 py-2.5 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all duration-300 ${activeTrack === 'academic'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 font-bold'
                  : 'text-slate-500 hover:text-black dark:hover:text-white'
                  }`}
              >
                Academic
              </button>
            </div>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest max-w-[250px] md:text-right leading-relaxed">
              {activeTrack === 'engineering'
                ? "// Work experience and professional projects"
                : "// Educational background and certifications"
              }
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTrack}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {(activeTrack === 'engineering' ? experience : education).map((item, idx) => (
              <Chapter
                key={idx}
                exp={item}
                index={idx}
                total={activeTrack === 'engineering' ? experience.length : education.length}
                isEdu={activeTrack === 'academic'}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default EliteExperience;
