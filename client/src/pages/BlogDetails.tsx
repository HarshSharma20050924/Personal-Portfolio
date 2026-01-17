
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Article, Project, HeroData } from '../types';

const M = motion as any;

interface BlogDetailsProps {
    articles: Article[];
    template?: string;
    // Optional props added to be permissive of parent component passing them, fixing the reported TS error.
    projects?: Project[];
    heroData?: HeroData;
}

const BlogDetails: React.FC<BlogDetailsProps> = ({ articles, template }) => {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const storedTheme = localStorage.getItem('elite-theme');
        setIsDark(storedTheme === 'dark' || !storedTheme);

        // Fallback: try to find by ID (if numeric) or index
        const safeArticles = articles || [];
        const found = safeArticles.find(a => String(a.id) === id) || safeArticles[Number(id)];
        if (found) {
            setArticle(found);
        }
    }, [id, articles]);

    if (!article) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono">LOADING TRANSMISSION...</div>;

    // Theme Classes
    const bgClass = isDark ? 'bg-[#050505]' : 'bg-white';
    const textClass = isDark ? 'text-white' : 'text-black';
    const subTextClass = isDark ? 'text-gray-500' : 'text-gray-500';
    const borderClass = isDark ? 'border-white/10' : 'border-black/10';
    const navTextClass = isDark ? 'text-white mix-blend-difference' : 'text-black';
    const proseClass = isDark ? 'prose-invert' : '';

    return (
        <div className={`min-h-screen ${bgClass} ${textClass} selection:bg-gray-500 selection:text-white transition-colors duration-500`}>
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-gradient-to-b from-black/5 to-transparent pointer-events-none">
                <Link to="/blogs" className={`flex items-center gap-2 text-xs md:text-sm font-medium hover:opacity-70 transition-opacity group pointer-events-auto elite-interactive ${navTextClass}`}>
                    <ArrowLeft size={18} />
                    Back to Log
                </Link>
                <span className={`text-[10px] font-mono opacity-50 uppercase tracking-widest hidden sm:block ${navTextClass}`}>
                    Encrypted Transmission
                </span>
            </nav>

            <article className="max-w-3xl mx-auto px-6 pt-32 pb-24 relative z-10">
                <M.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className={`flex items-center gap-4 text-xs font-mono ${subTextClass} mb-6 uppercase tracking-widest`}>
                        <span className="flex items-center gap-2"><Calendar size={12} /> {article.date}</span>
                        {/* Estimate read time: 200 words per minute */}
                        <span className="flex items-center gap-2">
                            <Clock size={12} /> 
                            {Math.ceil((article.content?.length || 0) / 1000)} min read
                        </span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight">
                        {article.title}
                    </h1>

                    {article.imageUrl && (
                        <div className={`w-full aspect-video rounded-2xl overflow-hidden mb-12 border ${borderClass} shadow-2xl`}>
                            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                        </div>
                    )}

                    <div className={`prose prose-lg ${proseClass} max-w-none font-light leading-relaxed`}>
                        {article.content ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {article.content}
                            </ReactMarkdown>
                        ) : (
                            <p className="text-xl leading-relaxed">{article.excerpt}</p>
                        )}
                    </div>
                </M.div>
                
                <div className={`mt-20 pt-10 border-t ${borderClass} flex justify-center`}>
                    <Link to="/blogs" className={`px-8 py-3 border ${isDark ? 'border-white/20 hover:bg-white hover:text-black' : 'border-black/20 hover:bg-black hover:text-white'} rounded-full transition-all text-xs font-mono uppercase tracking-widest`}>
                        Close Log
                    </Link>
                </div>
            </article>
        </div>
    );
};

export default BlogDetails;
