import React from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import type { HeroData, Skill, Project, Article, SocialLink } from '../../types';

interface AdminProps {
  isAuthenticated: boolean;
  onLogin: (apiKey: string) => void;
  onLogout: () => void;
  onSave: () => Promise<void>;
  heroData: HeroData;
  setHeroData: React.Dispatch<React.SetStateAction<HeroData>>;
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  socialLinks: SocialLink[];
  setSocialLinks: React.Dispatch<React.SetStateAction<SocialLink[]>>;
}

const Admin: React.FC<AdminProps> = (props) => {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {props.isAuthenticated ? (
        <Dashboard {...props} />
      ) : (
        <Login onLogin={props.onLogin} />
      )}
    </div>
  );
};

export default Admin;
