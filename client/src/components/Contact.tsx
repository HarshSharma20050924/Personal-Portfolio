import React from 'react';
import { Github, Linkedin, Twitter, Instagram, Phone, Mail } from 'lucide-react';
import type { SocialLink, HeroData } from '../types';

interface ContactProps {
  socialLinks: SocialLink[];
  heroData: HeroData;
}

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
};

const Contact: React.FC<ContactProps> = ({ socialLinks, heroData }) => {
  return (
    <section id="contact" className="py-20 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-heading text-4xl font-bold mb-4">Let’s build something incredible together.</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-12">
          {heroData.email && (
            <a href={`mailto:${heroData.email}`} className="flex items-center gap-2 text-lg text-primary hover:underline">
              <Mail className="w-5 h-5" />
              {heroData.email}
            </a>
          )}
          {heroData.phone && (
            <div className="flex items-center gap-2 text-lg text-secondary">
              <Phone className="w-5 h-5" />
              {heroData.phone}
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-8">
          {socialLinks.map(({ name, url, icon }) => {
            const IconComponent = iconMap[icon.toLowerCase()];
            if (!IconComponent) return null;
            return (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={name} className="text-secondary hover:text-primary transition-colors">
                <IconComponent className="w-8 h-8" />
              </a>
            )
          })}
        </div>
      </div>
    </section>
  );
};

export default Contact;