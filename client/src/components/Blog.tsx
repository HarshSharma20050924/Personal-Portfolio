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
    <section id="blog" className="py-10 scroll-mt-24">
      <div className="text-center mb-16">
        <h2 className="font-heading text-4xl font-bold text-text dark:text-dark-text">Articles & Insights</h2>
        <p className="mt-4 text-lg text-secondary dark:text-dark-secondary max-w-2xl mx-auto">
            Thoughts on technology, development, and design.
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
            className="group flex flex-col p-8 bg-white dark:bg-dark-off-black rounded-2xl shadow-soft dark:shadow-none border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-primary/30 dark:hover:border-dark-primary/30 transition-all duration-300 hover:-translate-y-1"
            variants={itemVariants}
          >
            <div className="mb-4">
                <span className="text-xs font-semibold tracking-wider text-primary dark:text-dark-primary uppercase bg-primary/5 dark:bg-dark-primary/10 px-3 py-1 rounded-full">
                    {article.date}
                </span>
            </div>
            <h3 className="text-2xl font-bold font-heading text-text dark:text-dark-text mb-3 group-hover:text-primary dark:group-hover:text-dark-primary transition-colors">
              {article.title}
            </h3>
            <p className="text-secondary dark:text-dark-secondary mb-6 leading-relaxed flex-grow">
              {article.excerpt}
            </p>
            <div className="flex items-center text-sm font-bold text-text dark:text-dark-text mt-auto">
                Read Article
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform text-primary dark:text-dark-primary" />
            </div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
};

export default Blog;