
import React, { useState } from 'react';
import type { HeroData, Skill, Project, SocialLink, Article, Experience, Education, PlaygroundConfig } from '../types';
import ManageHero from './ManageHero';
import ManageSkills from './ManageSkills';
import ManageProjects from './ManageProjects';
import ManageSocials from './ManageSocials';
import ManageBlog from './ManageBlog';
import ManageTheme from './ManageTheme';
import ManagePlayground from './ManagePlayground';
import ManageSecurity from './ManageSecurity';
import ManageExperience from './ManageExperience';
import ManageMessages from './ManageMessages';
import ManageAI from './ManageAI';
import { AlertTriangle } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
  onSave: () => Promise<void>;
  heroData: HeroData;
  setHeroData: React.Dispatch<React.SetStateAction<HeroData>>;
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  socialLinks: SocialLink[];
  setSocialLinks: React.Dispatch<React.SetStateAction<SocialLink[]>>;
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  experience: Experience[];
  setExperience: React.Dispatch<React.SetStateAction<Experience[]>>;
  education: Education[];
  setEducation: React.Dispatch<React.SetStateAction<Education[]>>;
  playgroundConfig: PlaygroundConfig;
  setPlaygroundConfig: React.Dispatch<React.SetStateAction<PlaygroundConfig>>;
}

type AdminView = 'hero' | 'theme' | 'skills' | 'projects' | 'socials' | 'blog' | 'experience' | 'messages' | 'playground' | 'security' | 'ai';

const Dashboard: React.FC<DashboardProps> = (props) => {
  const [view, setView] = useState<AdminView>('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [showUpdateReminder, setShowUpdateReminder] = useState(false);

  const navItems: { id: AdminView; label: string }[] = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'theme', label: 'Template' },
    { id: 'playground', label: 'Playground' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience & Edu' },
    { id: 'projects', label: 'Projects' },
    { id: 'socials', label: 'Social Links' },
    { id: 'blog', label: 'Blog' },
    { id: 'messages', label: 'Inbox' },
    { id: 'ai', label: 'AI Knowledge Base' },
    { id: 'security', label: 'Security' },
  ];
  
  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await props.onSave();
      setSaveStatus('success');
      setShowUpdateReminder(true); // Trigger the reminder
    } catch (error) {
      console.error("Save failed:", error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const renderView = () => {
    switch (view) {
      case 'hero':
        return <ManageHero data={props.heroData} setData={props.setHeroData} />;
      case 'theme':
        return <ManageTheme data={props.heroData} setData={props.setHeroData} />;
      case 'playground':
        return <ManagePlayground config={props.playgroundConfig} setConfig={props.setPlaygroundConfig} />;
      case 'skills':
        return <ManageSkills skills={props.skills} setSkills={props.setSkills} />;
      case 'experience':
        return <ManageExperience experience={props.experience} setExperience={props.setExperience} education={props.education} setEducation={props.setEducation} />;
      case 'projects':
        return <ManageProjects projects={props.projects} setProjects={props.setProjects} />;
      case 'socials':
        return <ManageSocials socialLinks={props.socialLinks} setSocialLinks={props.setSocialLinks} />;
      case 'blog':
        return <ManageBlog articles={props.articles} setArticles={props.setArticles} />;
      case 'messages':
        return <ManageMessages />;
      case 'ai':
        return <ManageAI />;
      case 'security':
        return <ManageSecurity />;
      default:
        return <p>Select a section to manage.</p>;
    }
  };
  
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <aside className="w-64 bg-white dark:bg-slate-800/50 p-6 shadow-lg flex flex-col fixed h-full overflow-y-auto">
        <div>
          <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
          <nav>
            <ul>
              {navItems.map((item) => (
                 <li key={item.id} className="mb-2">
                  <button
                    onClick={() => setView(item.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      view === item.id
                        ? 'bg-sky-500 text-white'
                        : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-auto pt-8 pb-6">
           <a href="/" target="_blank" rel="noopener noreferrer" className="block w-full text-center text-sm mb-4 px-4 py-2 rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-slate-700">
            View Live Site
          </a>
          <button
            onClick={props.onLogout}
            className="w-full px-4 py-2 rounded-lg transition-colors bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 ml-64 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <div/>
          <div className="flex items-center space-x-4">
            {saveStatus === 'success' && <p className="text-green-500">Changes saved successfully!</p>}
            {saveStatus === 'error' && <p className="text-red-500">Failed to save changes.</p>}
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-colors disabled:bg-sky-400 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </header>

        {showUpdateReminder && view !== 'ai' && (
            <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-3 text-purple-800 dark:text-purple-200">
                    <AlertTriangle size={20} />
                    <span><strong>Content Updated.</strong> Remember to update the AI Knowledge Base so the chatbot knows about these changes.</span>
                </div>
                <button 
                    onClick={() => { setView('ai'); setShowUpdateReminder(false); }}
                    className="text-sm px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                >
                    Go to AI Settings
                </button>
            </div>
        )}

        {renderView()}
      </main>
    </div>
  );
};

export default Dashboard;
