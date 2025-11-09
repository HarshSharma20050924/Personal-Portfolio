import React from 'react';
import type { Article } from '../types';

interface BlogProps {
  articles: Article[];
}

const Blog: React.FC<BlogProps> = ({ articles }) => {
  return (
    <section id="blog" className="py-20">
      <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">Articles & Insights</h2>
      <p className="text-lg text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
        I enjoy writing about technology, design, and development.
      </p>
      <div className="grid md:grid-cols-3 gap-8">
        {articles.map((article) => (
          <a
            href={article.url}
            key={article.title}
            className="group block p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{article.date}</p>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">
              {article.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {article.excerpt}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Blog;
