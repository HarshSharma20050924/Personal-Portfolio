// FIX: Removed unnecessary Vite client type reference that was causing an error.
import React from 'react';
// FIX: Import Variants to correctly type framer-motion variants.
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

  // FIX: Explicitly type variants with Variants type from framer-motion to fix easing type error.
  const variants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <section id="about" className="py-24 md:py-32" ref={ref}>
      <motion.div 
        className="grid md:grid-cols-5 gap-12 items-center"
        variants={variants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <div className="md:col-span-2">
          <div className="w-full aspect-square rounded-lg overflow-hidden shadow-soft dark:shadow-soft-dark">
            <img
              src={profileImage}
              alt={data.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="md:col-span-3">
          <h2 className="font-heading text-4xl font-bold mb-6">About Me</h2>
          <p className="text-secondary dark:text-dark-secondary text-lg mb-6 leading-relaxed">
            {data.description}
          </p>
          {data.quote && (
            <p className="text-primary dark:text-dark-primary italic text-lg mb-8">
              “{data.quote}”
            </p>
          )}
          <div className="flex space-x-4">
            {resumeLink && (
               <a href={resumeLink} download target="_blank" rel="noopener noreferrer" className="border border-primary text-primary dark:border-dark-primary dark:text-dark-primary font-medium py-3 px-8 rounded-full hover:bg-primary hover:text-background dark:hover:bg-dark-primary dark:hover:text-dark-background transition-all duration-300">
                Download Resume
              </a>
            )}
            <a href="#contact" className="bg-primary text-background dark:bg-dark-primary dark:text-dark-background font-medium py-3 px-8 rounded-full hover:bg-opacity-80 transition-all duration-300">
              Contact
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
