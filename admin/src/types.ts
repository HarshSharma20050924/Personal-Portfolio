export interface HeroData {
  name: string;
  title: string;
  description: string;
  profileImageUrl: string;
  email?: string;
  phone?: string;
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
