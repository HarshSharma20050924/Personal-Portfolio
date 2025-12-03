import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import type { Skill } from '../types';
import { Atom, Server, Database, Wind, FileCode2, Container, Cuboid, Code2 } from 'lucide-react';

interface SkillsProps {
  skills: Skill[];
  template?: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const skillIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  'react': Atom,
  'node.js': Server,
  'prisma': Database,
  'tailwind css': Wind,
  'typescript': FileCode2,
  'postgresql': Database,
  'docker': Container,
  'express.js': Cuboid,
  'python': Code2,
};

const Skills: React.FC<SkillsProps> = ({ skills, template = 'default' }) => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const isMinimalist = template === 'minimalist';
  
  return (
    <section id="skills" className="py-10 scroll-mt-24" ref={ref}>
      <div className="text-center mb-16">
        <h2 className="font-heading text-4xl font-bold text-text dark:text-dark-text">Technology Stack</h2>
        <p className="text-secondary dark:text-dark-secondary mt-4 max-w-2xl mx-auto">
           The tools and technologies I use to bring ideas to life.
        </p>
      </div>

      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {skills.map((skill) => {
          const Icon = skillIcons[skill.name.toLowerCase()] || Cuboid;

          if (isMinimalist) {
            return (
              <motion.div
                key={skill.name}
                variants={itemVariants}
                className="p-6 text-center border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col items-center justify-center gap-3 bg-white dark:bg-dark-off-black"
              >
                <Icon className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                <h3 className="font-medium text-text dark:text-dark-text">{skill.name}</h3>
              </motion.div>
            )
          }
          
          // Default Modern Card
           return (
            <motion.div
              key={skill.name}
              variants={itemVariants}
              className="group p-6 bg-white dark:bg-dark-off-black rounded-2xl shadow-soft dark:shadow-none border border-gray-100 dark:border-gray-800 hover:border-primary/50 dark:hover:border-dark-primary/50 transition-colors duration-300"
            >
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-primary/10 dark:bg-dark-primary/10 rounded-lg text-primary dark:text-dark-primary group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-secondary dark:text-dark-secondary">{skill.level}%</span>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg text-text dark:text-dark-text mb-3">{skill.name}</h3>
                  {/* Progress Bar Container */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden relative">
                    <motion.div
                      className="bg-primary dark:bg-dark-primary h-full rounded-full absolute top-0 left-0"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  );
};

export default Skills;