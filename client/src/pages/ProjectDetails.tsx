
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { Article } from '../types';

const M = motion as any;

interface BlogDetailsProps {
    articles: Article[];
    template?: string;
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
        const found = articles.find(a => String(a.id) === id) || articles[Number(id)];
        if (found) {
            setArticle(found);
        }
    }, [id, articles]);

    if (!article) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono">LOADING TRANSMISSION...</div>;

    // Advanced Content Parser
    const renderContent = (content: string) => {
        if (!content) return null;
        
        // Helper to parse links [text](url) inside a string
        const parseLineWithLinks = (text: string) => {
            const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
            return parts.map((part, i) => {
                const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                if (linkMatch) {
                    return <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{linkMatch[1]}</a>;
                }
                return part;
            });
        };

        return content.split('\n').map((line, index) => {
            // Headers
            if (line.startsWith('### ')) return <h3 key={index} className={`text-xl font-bold mt-6 mb-3 ${isDark ? 'text-white' : 'text-black'}`}>{line.replace('### ', '')}</h3>;
            if (line.startsWith('## ')) return <h2 key={index} className={`text-2xl font-bold mt-8 mb-4 ${isDark ? 'text-white border-white/10' : 'text-black border-black/10'} border-b pb-2`}>{line.replace('## ', '')}</h2>;
            if (line.startsWith('# ')) return <h1 key={index} className={`text-3xl font-black mt-10 mb-6 ${isDark ? 'text-white' : 'text-black'}`}>{line.replace('# ', '')}</h1>;
            
            // Images: ![alt](url)
            if (line.startsWith('![')) {
                const match = line.match(/!\[(.*?)\]\((.*?)\)/);
                if (match) return <img key={index} src={match[2]} alt={match[1]} className={`w-full rounded-lg my-6 border ${isDark ? 'border-white/10' : 'border-black/10'}`} />;
            }

            // YouTube / Video Support
            // Detect lines that are just URLs to YouTube
            const youtubeMatch = line.match(/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})$/);
            if (youtubeMatch) {
                const videoId = youtubeMatch[4];
                return (
                    <div key={index} className={`w-full aspect-video rounded-xl overflow-hidden my-8 border ${isDark ? 'border-white/10' : 'border-black/10'} shadow-lg`}>
                        <iframe 
                            src={`https://www.youtube.com/embed/${videoId}`} 
                            title="Video player"
                            className="w-full h-full"
                            allowFullScreen
                            frameBorder="0"
                        />
                    </div>
                );
            }

            // Empty Lines
            if (line.trim() === '') return <div key={index} className="h-4" />;
            
            // Standard Paragraphs with Link parsing
            return <p key={index} className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-4 text-lg font-light`}>
                {parseLineWithLinks(line)}
            </p>;
        });
    };

    // Theme Classes
    const bgClass = isDark ? 'bg-[#050505]' : 'bg-white';
    const textClass = isDark ? 'text-white' : 'text-black';
    const subTextClass = isDark ? 'text-gray-500' : 'text-gray-500';
    const borderClass = isDark ? 'border-white/10' : 'border-black/10';
    const navTextClass = isDark ? 'text-white mix-blend-difference' : 'text-black';

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

            <article className="max-w-4xl mx-auto px-6 pt-32 pb-24 relative z-10">
                <M.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className={`flex items-center gap-4 text-xs font-mono ${subTextClass} mb-6 uppercase tracking-widest`}>
                        <span className="flex items-center gap-2"><Calendar size={12} /> {article.date}</span>
                        <span className="flex items-center gap-2"><Clock size={12} /> Read Time: 5 min</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight">
                        {article.title}
                    </h1>

                    {article.imageUrl && (
                        <div className={`w-full aspect-video rounded-2xl overflow-hidden mb-12 border ${borderClass} shadow-2xl`}>
                            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                        </div>
                    )}

                    <div className="prose prose-lg max-w-none">
                        {article.content ? renderContent(article.content) : <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>{article.excerpt}</p>}
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
