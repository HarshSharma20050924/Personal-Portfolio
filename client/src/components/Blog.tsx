import React from 'react';
import type { Article } from '../types';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';

interface BlogProps {
  articles: Article[];
}

const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};


const Blog: React.FC<BlogProps> = ({ articles }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

  return (
    <section id="blog" className="py-20">
      <div className="text-center mb-16">
        <h2 className="font-heading text-4xl font-bold">Articles & Insights</h2>
        <p className="mt-4 text-lg text-secondary dark:text-dark-secondary max-w-2xl mx-auto">
            I enjoy writing about technology, AI, and development.
        </p>
      </div>
      <motion.div 
        ref={ref}
        className="grid md:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {articles.map((article) => (
          <motion.a
            href={article.url}
            key={article.title}
            className="group block p-8 bg-white dark:bg-dark-off-black rounded-lg shadow-soft dark:shadow-soft-dark hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-black/10 dark:border-white/10"
            variants={itemVariants}
          >
            <p className="text-sm text-secondary dark:text-dark-secondary mb-2">{article.date}</p>
            <h3 className="text-xl font-bold font-heading text-text dark:text-dark-text mb-3">
              {article.title}
            </h3>
            <p className="text-secondary dark:text-dark-secondary mb-4">
              {article.excerpt}
            </p>
            <span className="font-semibold text-primary dark:text-dark-primary flex items-center gap-2">
                Read More
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
};

export default Blog;