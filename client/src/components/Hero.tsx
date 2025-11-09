import React from 'react';
import type { HeroData } from '../types';

interface HeroProps {
  data: HeroData;
}

const Hero: React.FC<HeroProps> = ({ data }) => {
  return (
    <section id="about" className="py-24 md:py-32 flex flex-col md:flex-row items-center justify-between">
      <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-800 dark:text-slate-100 mb-4 leading-tight">
          {data.name}
        </h1>
        <p className="text-xl text-sky-600 dark:text-sky-400 mb-6">{data.title}</p>
        <p className="max-w-xl text-lg text-slate-600 dark:text-slate-400 mb-8">
          {data.description}
        </p>
        <div className="flex justify-center md:justify-start space-x-4">
          <a
            href="#contact"
            className="bg-sky-500 text-white font-medium py-3 px-6 rounded-lg hover:bg-sky-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Hire Me
          </a>
          <a
            href="#"
            className="bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 font-medium py-3 px-6 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300"
          >
            Download Resume
          </a>
        </div>
      </div>
      <div className="md:w-1/3">
        <div className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden shadow-2xl ring-4 ring-sky-500/30 dark:ring-sky-400/30">
          <img
            src="https://picsum.photos/seed/portfolio-avatar/400/400"
            alt={data.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
