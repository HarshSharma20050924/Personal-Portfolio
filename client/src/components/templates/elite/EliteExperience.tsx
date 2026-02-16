
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Experience, Education } from '../../../types';

const M = motion as any;

interface EliteExperienceProps {
    experience: Experience[];
    education: Education[];
}

const Chapter = ({ exp, index, total }: { exp: Experience, index: number, total: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start center", "end center"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0.2, 1, 1, 0.2]);
    const x = useTransform(scrollYProgress, [0, 0.2], [-20, 0]);

    return (
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-24 border-t border-black/5 dark:border-white/5 first:border-t-0 relative">
            {/* Subtle glow behind active chapter */}
            <M.div 
                style={{ opacity }}
                className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" 
            />

            {/* Left: Sticky Context (Year & Company) */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                <div className="flex flex-col gap-2">
                    <M.span 
                        style={{ opacity }}
                        className="text-6xl md:text-8xl font-display font-bold text-black/10 dark:text-white/10"
                    >
                        {String(total - index).padStart(2, '0')}
                    </M.span>
                    <M.div style={{ x, opacity }}>
                        <h4 className="text-2xl font-bold text-black dark:text-white mt-4">{exp.company}</h4>
                        <span className="text-xs font-mono uppercase tracking-widest text-blue-500">{exp.period}</span>
                    </M.div>
                </div>
            </div>

            {/* Right: Narrative Content */}
            <div className="lg:col-span-8 space-y-8 relative z-10">
                <M.h3 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-5xl font-light text-black dark:text-white leading-tight"
                >
                    {exp.position}
                </M.h3>
                
                <M.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-light max-w-2xl"
                >
                    {exp.description}
                </M.p>

                {/* Tech Tags modeled as 'Artifacts' */}
                <div className="flex flex-wrap gap-3 pt-4">
                    {['Architecture', 'Leadership', 'System Design'].map((tag, i) => (
                        <span key={i} className="text-[10px] font-mono border border-black/10 dark:border-white/10 px-3 py-1 rounded-full text-gray-500 uppercase tracking-wider bg-black/5 dark:bg-white/5">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const EducationBlock = ({ edu }: { edu: Education }) => (
    <div className="group relative overflow-hidden border border-black/5 dark:border-white/5 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-500 cursor-default bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm">
        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex flex-col h-full justify-between gap-8 relative z-10">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-500 opacity-80">{edu.period}</span>
            <div>
                <h4 className="text-2xl font-display font-medium mb-2 text-black dark:text-white">{edu.degree}</h4>
                <p className="text-sm font-light text-gray-600 dark:text-gray-400">{edu.institution}</p>
            </div>
        </div>
    </div>
);

const EliteExperience: React.FC<EliteExperienceProps> = ({ experience, education }) => {
    if (!experience?.length && !education?.length) return null;

    return (
        <section id="experience" className="bg-transparent text-black dark:text-white py-32 px-6 transition-colors duration-500 relative z-10">
            <div className="max-w-7xl mx-auto">
                
                {/* Section Header */}
                <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span className="text-blue-500 font-mono text-xs uppercase tracking-[0.3em] block mb-4">Professional Experience</span>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Engineering Timeline</h2>
                    </div>
                    <p className="text-sm font-mono text-gray-500 max-w-xs text-right hidden md:block">
                        A record of systems engineered, platforms architected, and infrastructure delivered.
                    </p>
                </div>

                {/* Experience Feed */}
                <div className="mb-32">
                    {experience.map((exp, idx) => (
                        <Chapter key={idx} exp={exp} index={idx} total={experience.length} />
                    ))}
                </div>

                {/* Education Grid */}
                <div className="border-t border-black/5 dark:border-white/5 pt-24">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-px w-12 bg-blue-500" />
                        <h3 className="text-xl font-mono uppercase tracking-widest text-gray-500">Acedemic Background</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {education.map((edu, idx) => (
                            <EducationBlock key={idx} edu={edu} />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default EliteExperience;
