
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Article, HeroData } from '../types';

interface BlogListProps {
    articles: Article[];
    heroData: HeroData;
}

const BlogList: React.FC<BlogListProps> = ({ articles, heroData }) => {
    // Scroll to top
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const isDark = true; // Elite theme default

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
            {/* Nav */}
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <Link to="/" className="flex items-center gap-2 text-xs md:text-sm font-medium hover:opacity-70 transition-opacity group pointer-events-auto elite-interactive mix-blend-difference">
                    <ArrowLeft size={18} />
                    Home
                </Link>
                <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest hidden sm:block mix-blend-difference">Transmission Log</span>
            </nav>

            <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-20 border-b border-white/10 pb-10"
                >
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4">THINKING</h1>
                    <p className="text-gray-400 max-w-xl text-lg">
                        Thoughts, tutorials, and insights on software engineering and design.
                    </p>
                </motion.div>

                <div className="grid gap-12">
                    {articles && articles.length > 0 ? (
                        articles.map((article, idx) => (
                            <motion.div
                                key={article.id || idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Link to={`/blog/${article.id || idx}`} className="group block elite-interactive">
                                    <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start">
                                        <div className="w-full md:w-1/3 aspect-video bg-[#111] border border-white/5 overflow-hidden rounded-lg">
                                            {article.imageUrl ? (
                                                <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/10 font-mono text-4xl font-bold">
                                                    LOG {String(idx + 1).padStart(2, '0')}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 py-2">
                                            <div className="flex items-center gap-3 text-xs font-mono text-gray-500 mb-3 uppercase tracking-widest">
                                                <span>{article.date || 'Unknown Date'}</span>
                                                <div className="w-8 h-px bg-gray-800" />
                                                <span>Article</span>
                                            </div>
                                            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                                                {article.title}
                                            </h2>
                                            <p className="text-gray-400 leading-relaxed mb-6 line-clamp-3">
                                                {article.excerpt}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white group-hover:gap-4 transition-all">
                                                Read Entry <ArrowUpRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-20 text-center border border-dashed border-white/10 rounded-xl">
                            <p className="text-gray-500 font-mono">No transmissions found in the archive.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default BlogList;
