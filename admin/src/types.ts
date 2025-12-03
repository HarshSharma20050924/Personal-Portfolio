export interface HeroData {
  name: string;
  title: string;
  description: string;
  profileImageUrl: string;
  email?: string;
  phone?: string;
  quote?: string;
  resumeUrl?: string;
  template?: string;
}

export interface Skill {
  id?: number;
  name: string;
  level: number;
}

export interface Project {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
}

export interface SocialLink {
  id?: number;
  name: string;
  url: string;
  icon: string;
}

export interface Article {
  id?: number;
  title: string;
  excerpt: string;
  date: string;
  url: string;
}

export interface PlaygroundConfig {
  heroTitle: string;
  heroSubtitle: string;
  bgType: string; // 'solid' | 'gradient' | 'mesh' | 'stars' | 'particles' | 'floatingLines'
  bgColor1: string;
  bgColor2: string;
  textColor: string;
  primaryColor: string;
  cardStyle: string; // 'glass' | 'solid' | 'outline' | 'neobrutalism'
  borderRadius: string;
  showHero: boolean;
  showSkills: boolean;
  showProjects: boolean;
  showContact: boolean;
  animationSpeed: string; // 'slow' | 'normal' | 'fast'
  
  // Particles
  particleCount?: number;
  particleSpread?: number;
  particleBaseSize?: number;
  moveParticlesOnHover?: boolean;
  disableRotation?: boolean;
  particleSpeed?: number;

  // Floating Lines
  flLineCount?: number;
  flLineDistance?: number;
  flBendRadius?: number;
  flBendStrength?: number;
  flParallax?: boolean;
}
