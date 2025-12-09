import React, { useState } from 'react';
import type { HeroData, Skill, Project, SocialLink, Article, PlaygroundConfig } from '../types';
import ManageHero from './ManageHero';
import ManageSkills from './ManageSkills';
import ManageProjects from './ManageProjects';
import ManageSocials from './ManageSocials';
import ManageBlog from './ManageBlog';
import ManageTheme from './ManageTheme';
import ManagePlayground from './ManagePlayground';

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
  playgroundConfig: PlaygroundConfig;
  setPlaygroundConfig: React.Dispatch<React.SetStateAction<PlaygroundConfig>>;
}

type AdminView = 'hero' | 'theme' | 'skills' | 'projects' | 'socials' | 'blog' | 'playground';

const Dashboard: React.FC<DashboardProps> = (props) => {
  const [view, setView] = useState<AdminView>('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  const navItems: { id: AdminView; label: string }[] = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'theme', label: 'Template' },
    { id: 'playground', label: 'Playground' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'socials', label: 'Social Links' },
    { id: 'blog', label: 'Blog' },
  ];
  
  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await props.onSave();
      setSaveStatus('success');
    } catch (error) {
      console.error("Save failed:", error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleExport = async () => {
    const apiKey = sessionStorage.getItem('apiKey');
    if (!apiKey) {
        alert("Not authenticated.");
        return;
    }

    try {
        const response = await fetch('/api/data/export', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if (!response.ok) throw new Error('Failed to export data');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portfolio_data.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error("Export failed:", error);
        alert("Failed to export data. Please check console.");
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
      case 'projects':
        return <ManageProjects projects={props.projects} setProjects={props.setProjects} />;
      case 'socials':
        return <ManageSocials socialLinks={props.socialLinks} setSocialLinks={props.setSocialLinks} />;
      case 'blog':
        return <ManageBlog articles={props.articles} setArticles={props.setArticles} />;
      default:
        return <p>Select a section to manage.</p>;
    }
  };
  
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <aside className="w-64 bg-white dark:bg-slate-800/50 p-6 shadow-lg flex flex-col">
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
        <div className="mt-auto pt-8">
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
      <main className="flex-1 p-8 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <div/>
          <div className="flex items-center space-x-4">
            {saveStatus === 'success' && <p className="text-green-500">Changes saved successfully!</p>}
            {saveStatus === 'error' && <p className="text-red-500">Failed to save changes.</p>}
            
            <button
                onClick={handleExport}
                className="px-4 py-2 text-sm font-semibold text-sky-600 border border-sky-600 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors"
            >
                Export for AI
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-colors disabled:bg-sky-400 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </header>
        {renderView()}
      </main>
    </div>
  );
};

export default Dashboard;