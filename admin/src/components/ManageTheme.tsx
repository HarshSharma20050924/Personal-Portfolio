
import React from 'react';
import type { HeroData } from '../types';

interface ManageThemeProps {
  data: HeroData;
  setData: React.Dispatch<React.SetStateAction<HeroData>>;
}

const templates = [
  {
    id: 'default',
    name: 'Default Modern',
    description: 'The original sleek and modern layout with smooth animations and a professional feel.',
  },
  {
    id: 'minimalist',
    name: 'Centered Minimalist',
    description: 'A clean, focused layout with a centered content column, ideal for a minimalist aesthetic.',
  },
  {
    id: 'dotgrid',
    name: 'Interactive Dot Grid',
    description: 'A dynamic template featuring an interactive dot grid background that reacts to mouse movement.',
  },
  {
    id: 'magicbento',
    name: 'Magic Bento Grid',
    description: 'A modern, stylish layout showcasing content in an interactive bento grid.',
  },
  {
    id: 'starrynight',
    name: 'Starry Night',
    description: 'An elegant dark theme with an animated starry sky background and glowing interactive elements.',
  },
  {
    id: 'elite',
    name: 'Elite (System Architect)',
    description: 'A high-end, cinematic, and interaction-heavy dark theme. Features a terminal-style chat and sleek typography.',
  },
  {
    id: 'fantasy',
    name: 'Iron & Gold (Dark Fantasy)',
    description: 'A cinematic 3D experience inspired by dark fantasy epics. Features atmospheric fog, metallic textures, and grand typography.',
  },
  {
    id: 'profilecard',
    name: '3D Profile Card',
    description: 'A unique, single-screen layout featuring a 3D tiltable profile card with holographic effects.',
  },
  {
    id: 'playground',
    name: 'Playground / Experimental',
    description: 'A customizable container where you can control background types, colors, and component styles via the "Playground" tab.',
  },
];

const ManageTheme: React.FC<ManageThemeProps> = ({ data, setData }) => {
  const selectedTemplate = data.template || 'default';

  const handleSelect = (templateId: string) => {
    setData({ ...data, template: templateId });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Manage Template</h2>
      <div className="p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md max-w-3xl">
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Choose a template to change the overall look and feel of your portfolio. Your content will remain the same.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleSelect(template.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all h-full flex flex-col ${
                selectedTemplate === template.id
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20'
                  : 'border-slate-300 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold">{template.name}</h3>
                {selectedTemplate === template.id && (
                   <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0">
                     <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                     </svg>
                   </div>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex-grow">{template.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageTheme;
