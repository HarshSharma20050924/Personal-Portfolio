
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

    useEffect(() => {
        // Fallback: try to find by ID (if numeric) or index
        const found = articles.find(a => String(a.id) === id) || articles[Number(id)];
        if (found) {
            setArticle(found);
        } else {
            // Optional: fetch specific article from API if not in initial list (for scalability)
        }
        window.scrollTo(0, 0);
    }, [id, articles]);

    if (!article) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono">LOADING TRANSMISSION...</div>;

    // Simple markdown-like parser for the content (replace newlines with <br>, etc.)
    // In a real app, use 'react-markdown'
    const renderContent = (content: string) => {
        if (!content) return null;
        return content.split('\n').map((line, index) => {
            if (line.startsWith('### ')) return <h3 key={index} className="text-xl font-bold mt-6 mb-3 text-white">{line.replace('### ', '')}</h3>;
            if (line.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-white border-b border-white/10 pb-2">{line.replace('## ', '')}</h2>;
            if (line.startsWith('# ')) return <h1 key={index} className="text-3xl font-black mt-10 mb-6 text-white">{line.replace('# ', '')}</h1>;
            if (line.startsWith('![')) {
                // Basic image parser: ![alt](url)
                const match = line.match(/!\[(.*?)\]\((.*?)\)/);
                if (match) return <img key={index} src={match[2]} alt={match[1]} className="w-full rounded-lg my-6 border border-white/10" />;
            }
            if (line.trim() === '') return <div key={index} className="h-4" />;
            return <p key={index} className="text-gray-300 leading-relaxed mb-4 text-lg font-light">{line}</p>;
        });
    };

    const isElite = template === 'elite';

    return (
        <div className={`min-h-screen ${isElite ? 'bg-[#050505] text-white selection:bg-white selection:text-black' : 'bg-white text-black dark:bg-gray-900 dark:text-white'}`}>
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <Link to="/" className="flex items-center gap-2 text-xs md:text-sm font-medium hover:opacity-70 transition-opacity group pointer-events-auto elite-interactive mix-blend-difference text-white">
                    <ArrowLeft size={18} />
                    Back to Base
                </Link>
                <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest hidden sm:block mix-blend-difference text-white">Encrypted Transmission</span>
            </nav>

            <article className="max-w-4xl mx-auto px-6 pt-32 pb-24 relative z-10">
                <M.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-center gap-4 text-xs font-mono text-gray-500 mb-6 uppercase tracking-widest">
                        <span className="flex items-center gap-2"><Calendar size={12} /> {article.date}</span>
                        <span className="flex items-center gap-2"><Clock size={12} /> Read Time: 5 min</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight">
                        {article.title}
                    </h1>

                    {article.imageUrl && (
                        <div className="w-full aspect-video rounded-2xl overflow-hidden mb-12 border border-white/10">
                            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                        </div>
                    )}

                    <div className="prose prose-invert prose-lg max-w-none">
                        {/* If no content field, fallback to excerpt */}
                        {article.content ? renderContent(article.content) : <p className="text-xl text-gray-300 leading-relaxed">{article.excerpt}</p>}
                    </div>
                </M.div>
                
                <div className="mt-20 pt-10 border-t border-white/10 flex justify-center">
                    <Link to="/" className="px-8 py-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all text-xs font-mono uppercase tracking-widest">
                        Close Log
                    </Link>
                </div>
            </article>
        </div>
    );
};

export default BlogDetails;
