
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react';
import { Article, HeroData } from '../types';

interface BlogListProps {
    articles: Article[];
    heroData: HeroData;
}

const BlogList: React.FC<BlogListProps> = ({ articles, heroData }) => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        // Detect theme from storage to match the rest of the site
        const storedTheme = localStorage.getItem('elite-theme');
        // Default to dark if not set or if set to 'dark'
        setIsDark(storedTheme === 'dark' || !storedTheme);
    }, []);

    // Theme Classes
    const bgClass = isDark ? 'bg-[#050505]' : 'bg-white';
    const textClass = isDark ? 'text-white' : 'text-black';
    const subTextClass = isDark ? 'text-gray-400' : 'text-gray-600';
    const borderClass = isDark ? 'border-white/10' : 'border-black/10';
    const cardBgClass = isDark ? 'bg-[#111]' : 'bg-gray-50';
    const navTextClass = isDark ? 'text-white mix-blend-difference' : 'text-black';

    return (
        <div className={`min-h-screen ${bgClass} ${textClass} selection:bg-gray-500 selection:text-white transition-colors duration-500`}>
            {/* Nav */}
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-gradient-to-b from-black/5 to-transparent pointer-events-none">
                <Link to="/" className={`flex items-center gap-2 text-xs md:text-sm font-medium hover:opacity-70 transition-opacity group pointer-events-auto elite-interactive ${navTextClass}`}>
                    <ArrowLeft size={18} />
                    Home
                </Link>
                <span className={`text-[10px] font-mono opacity-50 uppercase tracking-widest hidden sm:block ${navTextClass}`}>Transmission Log</span>
            </nav>

            <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className={`mb-20 border-b ${borderClass} pb-10`}
                >
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4">THINKING</h1>
                    <p className={`${subTextClass} max-w-xl text-lg`}>
                        Thoughts, tutorials, and insights on software engineering and design.
                    </p>
                </motion.div>

                <div className="grid gap-12">
                    {articles && articles.length > 0 ? (
                        articles.map((article, idx) => {
                            // Check if the article has an external URL
                            const isExternal = article.url && (article.url.startsWith('http') || article.url.startsWith('https'));
                            
                            // Determine Link Component and Props
                            const LinkComponent = isExternal ? 'a' : Link;
                            const linkProps = isExternal 
                                ? { href: article.url, target: "_blank", rel: "noreferrer" } 
                                : { to: `/blog/${article.id || idx}` };

                            return (
                                <motion.div
                                    key={article.id || idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <LinkComponent {...linkProps as any} className="group block elite-interactive">
                                        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start">
                                            <div className={`w-full md:w-1/3 aspect-video ${cardBgClass} border ${borderClass} overflow-hidden rounded-lg`}>
                                                {article.imageUrl ? (
                                                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" />
                                                ) : (
                                                    <div className={`w-full h-full flex items-center justify-center font-mono text-4xl font-bold opacity-10`}>
                                                        LOG {String(idx + 1).padStart(2, '0')}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 py-2">
                                                <div className={`flex items-center gap-3 text-xs font-mono ${subTextClass} mb-3 uppercase tracking-widest`}>
                                                    <span>{article.date || 'Unknown Date'}</span>
                                                    <div className={`w-8 h-px ${isDark ? 'bg-gray-800' : 'bg-gray-300'}`} />
                                                    <span>{isExternal ? 'External Resource' : 'Article'}</span>
                                                </div>
                                                <h2 className={`text-2xl md:text-4xl font-bold ${textClass} mb-4 group-hover:text-blue-500 transition-colors`}>
                                                    {article.title}
                                                </h2>
                                                <p className={`${subTextClass} leading-relaxed mb-6 line-clamp-3`}>
                                                    {article.excerpt}
                                                </p>
                                                <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${textClass} group-hover:gap-4 transition-all`}>
                                                    {isExternal ? 'Open Link' : 'Read Entry'} 
                                                    {isExternal ? <ExternalLink size={14} /> : <ArrowUpRight size={14} />}
                                                </div>
                                            </div>
                                        </div>
                                    </LinkComponent>
                                </motion.div>
                            )
                        })
                    ) : (
                        <div className={`py-20 text-center border border-dashed ${borderClass} rounded-xl`}>
                            <p className={`${subTextClass} font-mono`}>No transmissions found in the archive.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default BlogList;
