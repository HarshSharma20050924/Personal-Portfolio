import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Github, Linkedin, Twitter, Instagram, Phone, Mail } from 'lucide-react';
import type { SocialLink, HeroData } from '../types';
import Magnet from './Magnet';

interface ContactProps {
  socialLinks: SocialLink[];
  heroData: HeroData;
}

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};


const Contact: React.FC<ContactProps> = ({ socialLinks, heroData }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.section
      id="contact"
      className="py-24 text-center"
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      <div className="max-w-4xl mx-auto bg-white dark:bg-dark-off-black/50 rounded-3xl p-10 md:p-16 border border-gray-100 dark:border-gray-800 shadow-sm dark:shadow-none">
        <motion.div variants={itemVariants}>
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-text dark:text-dark-text">
            Let’s build something <br /> <span className="text-primary dark:text-dark-primary">incredible</span> together.
            </h2>
            <p className="text-lg text-secondary dark:text-dark-secondary mb-10 max-w-2xl mx-auto">
                Whether you have a project in mind or just want to say hi, I'm always open to discussing new ideas and opportunities.
            </p>
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-12"
          variants={itemVariants}
        >
          {heroData.email && (
            <a 
              href={`mailto:${heroData.email}`} 
              className="group flex items-center gap-3 text-xl font-medium text-text dark:text-dark-text hover:text-primary dark:hover:text-dark-primary transition-colors relative"
            >
              <div className="p-3 bg-gray-100 dark:bg-white/5 rounded-full shadow-sm group-hover:bg-primary/10 transition-colors">
                <Mail className="w-6 h-6 text-primary dark:text-dark-primary" />
              </div>
              <span className="border-b-2 border-transparent group-hover:border-primary dark:group-hover:border-dark-primary transition-all duration-300">
                {heroData.email}
              </span>
            </a>
          )}
          {heroData.phone && (
            <div className="flex items-center gap-3 text-xl font-medium text-text dark:text-dark-text">
               <div className="p-3 bg-gray-100 dark:bg-white/5 rounded-full shadow-sm">
                 <Phone className="w-6 h-6 text-primary dark:text-dark-primary" />
               </div>
              {heroData.phone}
            </div>
          )}
        </motion.div>

        <motion.div
          className="flex justify-center gap-6"
          variants={itemVariants}
        >
          {socialLinks.map(({ name, url, icon }) => {
            const IconComponent = iconMap[icon.toLowerCase()];
            if (!IconComponent) return null;
            return (
              <Magnet key={name} padding={20} magnetStrength={5} wrapperClassName="block">
                <motion.a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="block p-4 bg-gray-100 dark:bg-white/5 rounded-full text-secondary dark:text-dark-secondary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/30"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconComponent className="w-6 h-6" />
                </motion.a>
              </Magnet>
            )
          })}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Contact;