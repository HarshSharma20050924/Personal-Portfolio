
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SocialLink } from '../../../types';
import { getSocialIcon } from '../../../utils/socialIcons';

export const FreelanceFooter = ({ socialLinks, name }: { socialLinks: SocialLink[], name: string }) => {
  const navigate = useNavigate();
  // Filter for freelance only
  const visibleLinks = socialLinks.filter(s => s.showInFreelance);

  return (
    <footer className="bg-[#0D0D0D] border-t border-white/[0.04] overflow-hidden relative">
      
      {/* Large CTA Section */}
      <div 
        onClick={() => navigate('/contact')} 
        className="clickable group relative border-b border-white/[0.04] py-32 cursor-none"
      >
        <div className="absolute inset-0 bg-white/[0.02] scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-bottom ease-[0.22,1,0.36,1]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <span className="block text-elite-accent font-mono text-xs tracking-widest uppercase mb-4 text-blue-500">
                Capacity Available
              </span>
              <h2 className="text-5xl md:text-8xl font-display font-medium text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/50 transition-all duration-500">
                Scale your Business
              </h2>
            </div>
            
            <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:border-transparent transition-all duration-500">
               <ArrowRight size={32} className="text-white group-hover:text-black -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Links & Copy */}
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row justify-between items-center text-neutral-500 text-sm">
        <p className="font-mono tracking-wide uppercase">&copy; {new Date().getFullYear()} {name}. ENGINEERED IN INDIA.</p>
        
        <div className="flex gap-8 mt-6 md:mt-0">
          {visibleLinks.length > 0 ? (
              visibleLinks.map(link => {
                  const Icon = getSocialIcon(link.icon);
                  return (
                    <a 
                        key={link.id || link.name}
                        href={link.url} 
                        target="_blank"
                        rel="noreferrer"
                        className="clickable flex items-center gap-2 hover:text-white transition-colors duration-300 group"
                    >
                        <span className="group-hover:-translate-y-1 transition-transform duration-300">
                            <Icon size={18} />
                        </span>
                        <span className="hidden md:inline">{link.name}</span>
                    </a>
                  )
              })
          ) : (
              <span className="text-xs text-gray-700 italic">Add social links in Admin (check "Show in Freelance")</span>
          )}
        </div>
      </div>
    </footer>
  );
};
