import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import type { Skill } from '../types';
import { Atom, Server, Database, Wind, FileCode2, Container, Cuboid, Code2 } from 'lucide-react';

interface SkillsProps {
  skills: Skill[];
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


const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  return (
    <section id="skills" className="py-20" ref={ref}>
      <div className="text-center mb-16">
        <h2 className="font-heading text-4xl font-bold">Technology Stack</h2>
        <div className="w-20 h-1 bg-primary dark:bg-dark-primary mx-auto mt-4"></div>
      </div>
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {skills.map((skill) => {
          const Icon = skillIcons[skill.name.toLowerCase()] || Cuboid;
          return (
            <motion.div 
              key={skill.name} 
              className="p-6 text-center bg-white/30 dark:bg-dark-off-black/30 rounded-lg shadow-soft dark:shadow-soft-dark border border-black/10 dark:border-white/10 flex flex-col items-center justify-center gap-3 relative overflow-hidden"
              style={{
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
              }}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02, boxShadow: '0 15px 30px -10px rgba(0, 119, 255, 0.2)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {Icon && <Icon className="w-8 h-8 text-primary dark:text-dark-primary" />}
              <h3 className="font-semibold text-lg">{skill.name}</h3>
              <div className="w-full bg-primary/20 dark:bg-dark-primary/20 rounded-full h-1.5 absolute bottom-0 left-0">
                <motion.div
                  className="bg-primary dark:bg-dark-primary h-1.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                  transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  );
};

export default Skills;
