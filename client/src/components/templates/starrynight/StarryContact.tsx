
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Phone, Mail } from 'lucide-react';
import Magnet from '../../Magnet';
import type { SocialLink, HeroData } from '../../../types';
import { getSocialIcon } from '../../../utils/socialIcons';

const M = motion as any;

interface StarryContactProps {
  socialLinks: SocialLink[];
  heroData: HeroData;
}

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

const StarryContact: React.FC<StarryContactProps> = ({ socialLinks, heroData }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <M.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="text-center"
    >
      <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-lg rounded-3xl p-10 md:p-16 border border-white/10">
        <M.div variants={itemVariants}>
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white">
            Let’s build something <br /> <span className="text-[#8400ff]">incredible</span> together.
            </h2>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
                Whether you have a project in mind or just want to say hi, I'm always open to discussing new ideas and opportunities.
            </p>
        </M.div>

        <M.div
          className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-12"
          variants={itemVariants}
        >
          {heroData.email && (
            <a href={`mailto:${heroData.email}`} className="group flex items-center gap-3 text-xl font-medium text-white hover:text-[#8400ff] transition-colors">
              <div className="p-3 bg-white/5 rounded-full shadow-sm group-hover:shadow-[0_0_20px_rgba(132,0,255,0.3)] transition-all">
                <Mail className="w-6 h-6 text-[#8400ff]" />
              </div>
              {heroData.email}
            </a>
          )}
          {heroData.phone && (
            <div className="flex items-center gap-3 text-xl font-medium text-white">
               <div className="p-3 bg-white/5 rounded-full shadow-sm">
                 <Phone className="w-6 h-6 text-[#8400ff]" />
               </div>
              {heroData.phone}
            </div>
          )}
        </M.div>

        <M.div
          className="flex justify-center gap-6 flex-wrap"
          variants={itemVariants}
        >
          {socialLinks.map(({ name, url, icon }) => {
            const IconComponent = getSocialIcon(icon);
            return (
              <Magnet key={name} padding={20} magnetStrength={5} wrapperClassName="block">
                <M.a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="block p-4 bg-white/5 rounded-full text-gray-300 hover:text-white hover:bg-[#8400ff] shadow-lg hover:shadow-[0_0_25px_rgba(132,0,255,0.5)] transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconComponent className="w-6 h-6" />
                </M.a>
              </Magnet>
            )
          })}
        </M.div>
      </div>
    </M.div>
  );
};

export default StarryContact;
