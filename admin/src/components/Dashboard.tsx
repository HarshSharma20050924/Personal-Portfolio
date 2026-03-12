
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
import FreelanceAdmin from './FreelanceAdmin';
import { 
  LayoutDashboard, Palette, FlaskConical, BriefcaseBusiness, Cpu, GraduationCap, FolderKanban, 
  Share2, FileText, MessageSquare, Bot, ShieldCheck, Menu, X, Save, Loader2, AlertTriangle, 
  ChevronRight, ExternalLink, Trash2, Edit3 
} from 'lucide-react';

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

type AdminView = 'hero' | 'theme' | 'skills' | 'projects' | 'socials' | 'blog' | 'experience' | 'messages' | 'playground' | 'security' | 'ai' | 'services' | 'freelance';

const Dashboard: React.FC<DashboardProps> = (props) => {
  const [view, setView] = useState<AdminView>('hero');
  const [freelanceMode, setFreelanceMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [showUpdateReminder, setShowUpdateReminder] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  const lastMessageCount = useRef<number | null>(null);
  const [messageUpdateTrigger, setMessageUpdateTrigger] = useState(0);

  const navItems: { id: AdminView; label: string; icon: any }[] = [
    { id: 'hero', label: 'Hero / Bio', icon: LayoutDashboard },
    { id: 'theme', label: 'Theme / Colors', icon: Palette },
    { id: 'playground', label: 'Interactive Lab', icon: FlaskConical },
    { id: 'services', label: 'Expertise / Services', icon: BriefcaseBusiness },
    { id: 'skills', label: 'Skills', icon: Cpu },
    { id: 'experience', label: 'Experience & Edu', icon: GraduationCap },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'socials', label: 'Social Links', icon: Share2 },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'messages', label: 'Inbox', icon: MessageSquare },
    { id: 'ai', label: 'AI Knowledge Base', icon: Bot },
    { id: 'security', label: 'Security', icon: ShieldCheck },
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
    if (freelanceMode) {
      return <FreelanceAdmin heroData={props.heroData} services={props.services} projects={props.projects} />;
    }

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
        fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-800 p-6 shadow-2xl z-40 transition-transform duration-300 ease-in-out overflow-y-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:sticky md:shadow-lg
      `}>
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">P</span>
            </div>
            <h1 className="text-xl font-bold tracking-tighter">PORTFOLIO<span className="text-sky-500">.OS</span></h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 hover:bg-slate-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {!freelanceMode ? (
          <nav className="mb-auto">
            <ul className="space-y-1.5">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-5 py-3 rounded-2xl transition-all flex justify-between items-center group ${view === item.id
                        ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 font-bold'
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span className="text-sm tracking-tight">{item.label}</span>
                    </div>
                    {item.id === 'messages' && lastMessageCount.current !== null && lastMessageCount.current > 0 && (
                      <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{lastMessageCount.current}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        ) : (
          <div className="space-y-6">
            <div className="p-5 bg-blue-500/5 rounded-3xl border border-blue-500/10">
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                 Freelance Mode
              </p>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Manage professional clients, prepare invoices, and track leads centrally.</p>
            </div>
          </div>
        )}

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
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-900 h-screen overflow-hidden">
        <header className="h-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl bg-white border shadow-sm">
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setFreelanceMode(false)}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${!freelanceMode ? 'bg-white dark:bg-slate-700 shadow-sm text-sky-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <LayoutDashboard size={14} /> Main
              </button>
              <button
                onClick={() => setFreelanceMode(true)}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${freelanceMode ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <BriefcaseBusiness size={14} /> Freelance
              </button>
            </div>
            
            {/* Mobile Mode Switcher (Icons Only) */}
            <div className="sm:hidden flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => setFreelanceMode(false)}
                className={`p-2 rounded-lg transition-all ${!freelanceMode ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-400'}`}
              >
                <LayoutDashboard size={18} />
              </button>
              <button 
                onClick={() => setFreelanceMode(true)}
                className={`p-2 rounded-lg transition-all ${freelanceMode ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
              >
                <BriefcaseBusiness size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {saveStatus === 'success' && <span className="text-emerald-500 text-[10px] font-bold uppercase hidden lg:inline bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Synced</span>}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="group relative flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all disabled:bg-slate-300 shadow-lg shadow-blue-500/25 active:scale-95 overflow-hidden"
            >
              {isSaving && <Loader2 size={14} className="animate-spin" />}
              <span>{isSaving ? 'Saving' : 'Sync Cloud'}</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 pb-24 scroll-smooth">
          {showUpdateReminder && !freelanceMode && view !== 'ai' && (
            <div className="mb-8 p-5 bg-purple-600 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-purple-500/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Sync AI Knowledge Base</h4>
                  <p className="text-sm opacity-80">Sync your latest portfolio changes with the RAG engine.</p>
                </div>
              </div>
              <button
                onClick={() => { setView('ai'); setShowUpdateReminder(false); }}
                className="w-full md:w-auto px-8 py-3 bg-white text-purple-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-50 transition-colors shadow-lg"
              >
                Sync Now
              </button>
            </div>
          )}

          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

