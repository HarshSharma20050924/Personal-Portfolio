import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import type { HeroData } from '../types';

interface AboutProps {
  data: HeroData;
}

const About: React.FC<AboutProps> = ({ data }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const profileImage = data.profileImageUrl || "https://picsum.photos/seed/portfolio-avatar/400/400";
  const resumeLink = data.resumeUrl && data.resumeUrl !== '#' ? data.resumeUrl : null;

  const variants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <section id="about" className="py-10 scroll-mt-24" ref={ref}>
      <motion.div 
        className="grid md:grid-cols-5 gap-12 items-center"
        variants={variants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <div className="md:col-span-2">
          <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/50">
            <img
              src={profileImage}
              alt={data.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
            About Me
          </div>
          <h2 className="font-heading text-4xl font-bold mb-6 text-text dark:text-dark-text">
            Turning complex problems into <span className="text-primary dark:text-dark-primary">simple solutions</span>.
          </h2>
          <p className="text-secondary dark:text-dark-secondary text-lg mb-6 leading-relaxed">
            {data.description}
          </p>
          {data.quote && (
            <div className="border-l-4 border-primary dark:border-dark-primary pl-4 mb-8">
              <p className="text-text dark:text-dark-text italic text-lg font-medium">
                “{data.quote}”
              </p>
            </div>
          )}
          <div className="flex flex-wrap gap-4">
            {resumeLink && (
               <a href={resumeLink} download target="_blank" rel="noopener noreferrer" className="px-8 py-3 font-medium text-primary bg-transparent border border-primary rounded-full hover:bg-primary hover:text-white transition-colors duration-300">
                Download Resume
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;