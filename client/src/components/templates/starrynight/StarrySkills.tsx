import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Atom, Server, Database, Wind, FileCode2, Container, Cuboid, Code2 } from 'lucide-react';
import { ParticleCard } from '../../MagicBento';
import type { Skill } from '../../../types';

interface StarrySkillsProps {
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

const StarrySkills: React.FC<StarrySkillsProps> = ({ skills }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <div ref={ref}>
      <div className="text-center mb-16">
        <h2 className="font-heading text-4xl font-bold text-white">Technology Stack</h2>
        <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
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
          return (
            <motion.div key={skill.name} variants={itemVariants}>
              <ParticleCard className="h-full rounded-lg" enableStars={true} glowColor="132, 0, 255">
                <div className="p-6 text-center bg-black/40 rounded-lg flex flex-col items-center justify-center gap-3 h-full backdrop-blur-md border border-white/10">
                  <Icon className="w-8 h-8 text-[#8400ff]" />
                  <h3 className="font-semibold text-lg text-white">{skill.name}</h3>
                  <div className="w-full bg-gray-700/50 rounded-full h-1.5 mt-2 overflow-hidden">
                      <motion.div
                        className="bg-[#8400ff] h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                      />
                  </div>
                </div>
              </ParticleCard>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  );
};

export default StarrySkills;