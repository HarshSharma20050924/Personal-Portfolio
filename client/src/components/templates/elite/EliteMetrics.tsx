
import React from 'react';
import { motion } from 'framer-motion';
import { SocialLink } from '../../../types';
import { Terminal, Code, GitCommit } from 'lucide-react';

interface EliteMetricsProps {
    socialLinks: SocialLink[];
    isDark: boolean;
}

const EliteMetrics: React.FC<EliteMetricsProps> = ({ socialLinks, isDark }) => {
    // Extract usernames
    const githubLink = socialLinks.find(s => s.icon.toLowerCase() === 'github');
    const githubUsername = githubLink ? githubLink.url.split('/').pop() : null;

    const leetcodeLink = socialLinks.find(s => s.icon.toLowerCase() === 'leetcode' || s.url.includes('leetcode.com'));
    const leetcodeUsername = leetcodeLink ? leetcodeLink.url.split('leetcode.com/').pop()?.replace(/\/$/, '') : null;

    if (!githubUsername && !leetcodeUsername) return null;

    return (
        <section className="relative w-full py-20 bg-white dark:bg-[#050505] border-b border-black/5 dark:border-white/5 transition-colors duration-500 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Section Header */}
                <div className="flex items-end gap-4 mb-12">
                    <div className="p-3 bg-orange-500/10 rounded-lg">
                        <GitCommit className="text-orange-500" size={24} />
                    </div>
                    <div>
                        <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-1">System Activity</h2>
                        <p className="text-xl font-bold text-black dark:text-white tracking-tight">Code Frequency & Problem Solving</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    
                    {/* GitHub Contribution Graph */}
                    {githubUsername && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="xl:col-span-2 group relative rounded-2xl bg-gray-50 dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 p-6 md:p-8 overflow-hidden hover:border-orange-500/30 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-2">
                                    <Terminal size={16} className="text-gray-400" />
                                    <span className="text-xs font-mono uppercase tracking-widest text-gray-500">Contribution Map</span>
                                </div>
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-sm bg-[#fd8c00]/20" />
                                    <div className="w-2 h-2 rounded-sm bg-[#fd8c00]/40" />
                                    <div className="w-2 h-2 rounded-sm bg-[#fd8c00]/60" />
                                    <div className="w-2 h-2 rounded-sm bg-[#fd8c00]/80" />
                                    <div className="w-2 h-2 rounded-sm bg-[#fd8c00]" />
                                </div>
                            </div>

                            <div className="relative w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10">
                                {/* Using the requested orange palette (fd8c00) */}
                                <img 
                                    src={`https://ghchart.rshah.org/fd8c00/${githubUsername}`} 
                                    alt="GitHub Contribution" 
                                    className="min-w-[700px] w-full h-auto object-contain filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700 ease-in-out"
                                />
                            </div>
                            
                            <div className="mt-6 flex items-center justify-between text-[10px] text-gray-400 font-mono uppercase tracking-widest">
                                <span>Data Source: GitHub</span>
                                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live</span>
                            </div>
                        </motion.div>
                    )}

                    {/* LeetCode Stats */}
                    {leetcodeUsername && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="xl:col-span-1 rounded-2xl bg-gray-50 dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 p-6 md:p-8 flex flex-col justify-between hover:border-yellow-500/30 transition-colors"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <Code size={16} className="text-gray-400" />
                                <span className="text-xs font-mono uppercase tracking-widest text-gray-500">Algorithm Proficiency</span>
                            </div>

                            <div className="flex-1 flex items-center justify-center">
                                <img 
                                    src={`https://leetcard.jacoblin.cool/${leetcodeUsername}?theme=${isDark ? 'dark' : 'light'}&font=Inter&ext=heatmap`} 
                                    alt="LeetCode Stats" 
                                    className="w-full h-auto max-h-[200px] object-contain"
                                />
                            </div>

                            <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/5">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">Platform</span>
                                    <span className="font-bold text-black dark:text-white">LeetCode</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default EliteMetrics;
