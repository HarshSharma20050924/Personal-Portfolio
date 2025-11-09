import React from 'react';
import type { Skill } from '../types';

interface SkillsProps {
  skills: Skill[];
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  return (
    <section id="skills" className="py-20">
      <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">My Skills</h2>
      <p className="text-lg text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
        Here are some of the technologies and tools I'm proficient in.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {skills.map((skill) => (
          <div key={skill.name} className="group p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">{skill.name}</h3>
            <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-sky-500 dark:bg-sky-400 h-3 rounded-full transition-all duration-500 ease-out group-hover:w-full"
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
            <p className="text-right text-sm text-slate-500 dark:text-slate-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{skill.level}% Proficiency</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
