
import React, { useState, useEffect, useRef } from 'react';
import type { HeroData, Skill, Project, SocialLink, Article, Experience, Education, PlaygroundConfig, Message, Service } from '../types';
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
import ManageServices from './ManageServices';
import { AlertTriangle, Loader2, Menu, X, Bell, BellOff, MonitorDown } from 'lucide-react';

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
  services: Service[]; // Added prop
  setServices: React.Dispatch<React.SetStateAction<Service[]>>; // Added prop
}

type AdminView = 'hero' | 'theme' | 'skills' | 'projects' | 'socials' | 'blog' | 'experience' | 'messages' | 'playground' | 'security' | 'ai' | 'services';

const Dashboard: React.FC<DashboardProps> = (props) => {
  const [view, setView] = useState<AdminView>('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [showUpdateReminder, setShowUpdateReminder] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  
  const lastMessageCount = useRef<number | null>(null);
  const [messageUpdateTrigger, setMessageUpdateTrigger] = useState(0);

  // ... (Keep existing notification and PWA logic) ...

  const navItems: { id: AdminView; label: string }[] = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'theme', label: 'Template' },
    { id: 'playground', label: 'Playground' },
    { id: 'services', label: 'Expertise / Services' }, // New Item
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
      setShowUpdateReminder(true);
    } catch (error) {
      console.error("Save failed:", error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleNavClick = (id: AdminView) => {
      setView(id);
      setSidebarOpen(false);
  };

  const renderView = () => {
    switch (view) {
      case 'hero':
        return <ManageHero data={props.heroData} setData={props.setHeroData} />;
      case 'theme':
        return <ManageTheme data={props.heroData} setData={props.setHeroData} />;
      case 'playground':
        return <ManagePlayground config={props.playgroundConfig} setConfig={props.setPlaygroundConfig} />;
      case 'services':
        return <ManageServices services={props.services} setServices={props.setServices} />;
      case 'skills':
        return <ManageSkills skills={props.skills} setSkills={props.setSkills} />;
      case 'experience':
        return <ManageExperience experience={props.experience} setExperience={props.setExperience} education={props.education} setEducation={props.setEducation} />;
      case 'projects':
        return <ManageProjects projects={props.projects} setProjects={props.setProjects} services={props.services} />;
      case 'socials':
        return <ManageSocials socialLinks={props.socialLinks} setSocialLinks={props.setSocialLinks} />;
      case 'blog':
        return <ManageBlog articles={props.articles} setArticles={props.setArticles} />;
      case 'messages':
        return <ManageMessages refreshTrigger={messageUpdateTrigger} />;
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
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-800 p-6 shadow-lg z-40 transition-transform duration-300 ease-in-out overflow-y-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-500">
                <X size={24} />
            </button>
        </div>
        
        <nav>
          <ul>
            {navItems.map((item) => (
               <li key={item.id} className="mb-2">
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex justify-between items-center ${
                    view === item.id
                      ? 'bg-sky-500 text-white'
                      : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {item.label}
                  {item.id === 'messages' && lastMessageCount.current !== null && lastMessageCount.current > 0 && (
                      <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{lastMessageCount.current}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* ... (Keep existing sidebar footer) ... */}
        
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 pb-6">
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

      {/* Main Content */}
      <main className="flex-1 w-full md:ml-64 flex flex-col h-screen overflow-hidden">
        
        {/* Mobile Header */}
        <header className="flex-shrink-0 bg-white dark:bg-slate-800 md:bg-transparent md:dark:bg-transparent p-4 flex justify-between items-center shadow-sm md:shadow-none z-20">
            <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                    <Menu size={24} />
                </button>
                <h2 className="text-lg font-bold md:hidden">{navItems.find(i => i.id === view)?.label}</h2>
            </div>

            <div className="flex items-center space-x-4">
                {saveStatus === 'success' && <span className="text-green-500 text-sm hidden sm:inline">Saved!</span>}
                {saveStatus === 'error' && <span className="text-red-500 text-sm hidden sm:inline">Error!</span>}
                
                <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-colors disabled:bg-sky-400 disabled:cursor-not-allowed shadow-md"
                >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                {isSaving ? 'Saving...' : 'Save'}
                </button>
            </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-20">
            {showUpdateReminder && view !== 'ai' && (
                <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn">
                    <div className="flex items-start gap-3 text-purple-800 dark:text-purple-200">
                        <AlertTriangle size={20} className="shrink-0 mt-1 md:mt-0" />
                        <span className="text-sm"><strong>Content Updated.</strong> Remember to update the AI Knowledge Base so the chatbot knows about these changes.</span>
                    </div>
                    <button 
                        onClick={() => { setView('ai'); setShowUpdateReminder(false); }}
                        className="text-sm px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors w-full md:w-auto"
                    >
                        Go to AI Settings
                    </button>
                </div>
            )}

            {renderView()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
