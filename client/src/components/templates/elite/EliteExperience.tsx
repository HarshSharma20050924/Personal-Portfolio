
import React from 'react';
import { motion } from 'framer-motion';
import { Experience, Education } from '../../../types';

const M = motion as any;

interface EliteExperienceProps {
    experience: Experience[];
    education: Education[];
}

const EliteExperience: React.FC<EliteExperienceProps> = ({ experience, education }) => {
    if ((!experience || experience.length === 0) && (!education || education.length === 0)) return null;

    return (
        <section id="experience" className="py-24 px-6 bg-white dark:bg-[#050505] border-t border-black/5 dark:border-white/5 transition-colors duration-500">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    
                    {/* Experience Column */}
                    {experience.length > 0 && (
                        <div>
                            <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-12 flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                Professional History
                            </h3>
                            <div className="border-l border-black/10 dark:border-white/10 ml-3">
                                {experience.map((exp, idx) => (
                                    <M.div 
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="relative pl-8 pb-12 last:pb-0 group"
                                    >
                                        <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-white dark:bg-[#050505] border-2 border-gray-400 dark:border-gray-600 group-hover:border-blue-500 group-hover:scale-125 transition-all" />
                                        
                                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                                            {exp.period}
                                        </span>
                                        <h4 className="text-xl font-bold text-black dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {exp.position}
                                        </h4>
                                        <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                                            {exp.company}
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-500 leading-relaxed font-light">
                                            {exp.description}
                                        </p>
                                    </M.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education Column */}
                    {education.length > 0 && (
                        <div>
                            <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-12 flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-500 rounded-full" />
                                Academic Background
                            </h3>
                            <div className="space-y-8">
                                {education.map((edu, idx) => (
                                    <M.div 
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="p-6 bg-gray-50 dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 rounded-xl hover:border-purple-500/30 transition-colors"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-lg font-bold text-black dark:text-white">
                                                {edu.degree}
                                            </h4>
                                            <span className="text-[10px] font-mono text-gray-400 bg-white dark:bg-white/5 px-2 py-1 rounded">
                                                {edu.period}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                            {edu.institution}
                                        </div>
                                    </M.div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </section>
    );
};

export default EliteExperience;
