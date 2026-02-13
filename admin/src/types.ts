
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

export interface Service {
  id?: number;
  title: string;
  tagline?: string;
  description: string;
  icon: string;
  projects?: Project[];
}

export interface Project {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  docUrl?: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  huggingFaceUrl?: string;
  featured?: boolean;
  showInFreelance?: boolean;
  challenge?: string;
  challengeImage?: string;
  outcome?: string;
  outcomeImage?: string;
  serviceId?: number;
}

export interface SocialLink {
  id?: number;
  name: string;
  url: string;
  icon: string;
  showInFreelance?: boolean;
}

export interface Article {
  id?: number;
  title: string;
  excerpt: string;
  content?: string;
  imageUrl?: string;
  date: string;
  url: string;
  featured?: boolean;
  showInFreelance?: boolean;
}

export interface Experience {
  id?: number;
  position: string;
  company: string;
  period: string;
  description: string;
  showInFreelance?: boolean;
}

export interface Education {
  id?: number;
  degree: string;
  institution: string;
  period: string;
  showInFreelance?: boolean;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface PlaygroundConfig {
  heroTitle: string;
  heroSubtitle: string;
  bgType: string;
  bgColor1: string;
  bgColor2: string;
  textColor: string;
  primaryColor: string;
  cardStyle: string;
  borderRadius: string;
  showHero: boolean;
  showSkills: boolean;
  showProjects: boolean;
  showContact: boolean;
  animationSpeed: string;
  
  particleCount?: number;
  particleSpread?: number;
  particleBaseSize?: number;
  moveParticlesOnHover?: boolean;
  disableRotation?: boolean;
  particleSpeed?: number;

  flLineCount?: number;
  flLineDistance?: number;
  flBendRadius?: number;
  flBendStrength?: number;
  flParallax?: boolean;
}
