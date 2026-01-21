
import { 
  Github, Linkedin, Twitter, Instagram, Facebook, Youtube, Twitch, 
  Dribbble, Globe, Link as LinkIcon, Mail, MessageCircle, 
  Code, Codepen, Gitlab, Disc, Send, X, Terminal, Cpu, PenTool,
  Slack, Figma, Camera, Music, Video, Podcast
} from 'lucide-react';
import React from 'react';

export const getSocialIcon = (iconName: string): React.ElementType => {
  if (!iconName) return Globe;
  
  const normalized = iconName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  const map: Record<string, React.ElementType> = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    x: X,
    instagram: Instagram,
    facebook: Facebook,
    youtube: Youtube,
    twitch: Twitch,
    dribbble: Dribbble,
    codepen: Codepen,
    gitlab: Gitlab,
    discord: Disc,
    telegram: Send,
    email: Mail,
    mail: Mail,
    whatsapp: MessageCircle,
    leetcode: Code,
    devto: Terminal,
    hashnode: Cpu,
    medium: PenTool,
    slack: Slack,
    figma: Figma,
    unsplash: Camera,
    spotify: Music,
    tiktok: Video,
    podcast: Podcast
  };

  // 1. Direct match
  if (map[normalized]) return map[normalized];

  // 2. Partial match (e.g. "github-profile" -> github)
  const keys = Object.keys(map);
  const found = keys.find(key => normalized.includes(key));
  if (found) return map[found];

  // 3. Default
  return Globe;
};
