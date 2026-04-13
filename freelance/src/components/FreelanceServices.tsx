
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Service } from '../types';
import { getSocialIcon } from '../utils/socialIcons';

interface FreelanceServicesProps {
  services: Service[];
}

const ServiceRow = ({ service, index }: { service: Service, index: number }) => {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [30, 0, 0, -30]);

  // Ensure icon component exists, fallback to Globe if not found
  const Icon = getSocialIcon(service.icon || 'globe');

  return (
    <Link to={`/service/${service.id}`} className="block group clickable">
      <motion.div
        ref={ref}
        style={{ opacity: isMobile ? 1 : opacity, y: isMobile ? 0 : y }}
        className="flex flex-col md:flex-row items-center md:items-center justify-between py-6 md:py-12 border-b border-white/[0.08] relative overflow-hidden active:bg-white/[0.05]"
      >
        <div className="absolute inset-0 bg-white/[0.02] translate-x-[-100%] md:group-hover:translate-x-0 transition-transform duration-700 ease-out will-change-transform" />

        <div className="flex items-center gap-4 md:gap-8 relative z-10 w-full px-2">
          <span className="font-mono text-[10px] text-elite-sub/30 shrink-0">0{index + 1}</span>
          <div className="text-white/40 group-hover:text-elite-accent transition-colors duration-500 shrink-0">
            <Icon size={isMobile ? 20 : 28} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg md:text-3xl font-display text-white group-hover:translate-x-2 transition-transform duration-500 tracking-tight">
              {service.title}
            </h3>
            <p className="text-[10px] text-elite-sub/50 font-mono hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-w-lg mt-1">
              {service.tagline || service.description.substring(0, 60) + '...'}
            </p>
          </div>

          <div className="relative z-10 md:pr-4 shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-elite-accent group-hover:text-elite-accent transition-colors duration-500">
              <ChevronRight size={isMobile ? 14 : 16} />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export const FreelanceServices: React.FC<FreelanceServicesProps> = ({ services }) => {
  return (
    <section id="services" className="py-20 md:py-40 bg-elite-bg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-white/[0.08] pb-8">
          <div>
            <span className="text-elite-accent font-mono text-xs tracking-widest uppercase mb-4 block">
              Core Capabilities
            </span>
            <h2 className="text-4xl md:text-6xl font-display text-white">
              Systematic Engineering
            </h2>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-elite-sub text-sm max-w-xs">
              Moving beyond aesthetics to build operational leverage.
            </p>
          </div>
        </div>

        <div className="border-t border-white/[0.08]">
          {services.length > 0 ? (
            services.map((service, index) => (
              <ServiceRow key={service.id} service={service} index={index} />
            ))
          ) : (
            <div className="py-20 text-center text-gray-500 border border-dashed border-white/10 rounded-xl">
              Add capabilities in the Admin Panel to display them here.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
