import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FreelanceNavigation } from '../components/FreelanceNavigation';
import FreelanceCursor from '../components/FreelanceCursor';
import { FreelanceFooter } from '../components/FreelanceFooter';
import { SocialLink } from '../types';

const processes = [
  "Requirement Discussion",
  "Planning",
  "Design & Development",
  "Review & Revisions",
  "Final Delivery"
];

const reasons = [
  { title: "Transparent Pricing", desc: "No hidden charges. Clear scope and pricing defined before starting." },
  { title: "On-Time Delivery", desc: "Projects delivered within agreed timelines, with regular progress updates." },
  { title: "24/7 Support", desc: "Quick response on critical issues and post-delivery assistance." },
  { title: "Revision Support", desc: "Includes revisions to ensure the final output meets your expectations." },
  { title: "Secure & Confidential", desc: "Your data, ideas, and business information remain fully protected." },
  { title: "Performance-Focused Approach", desc: "Every project is built with usability, speed, and real-world results in mind." },
  { title: "Post-Delivery Support", desc: "Basic guidance and support after project completion." },
  { title: "Client-Centric Process", desc: "Clear communication, structured workflow, and feedback at every stage." }
];

const timeline = [
  { service: "Landing Page", time: "5–7 Business Day" },
  { service: "Business Website", time: "1–3 Week" },
  { service: "Business System", time: "Based on Scope" },
  { service: "AI Integration", time: "Based on Scope" }
];

const ProcessPage = ({ name, socialLinks }: { name?: string, socialLinks?: SocialLink[] }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-elite-bg pt-32 pb-0 text-white cursor-none font-sans">
      <FreelanceCursor />
      <FreelanceNavigation name={name} />

      <div className="container mx-auto px-4 lg:px-8 max-w-6xl mb-24">
        
        <div className="mb-20 text-center border-b border-white/10 pb-12">
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-5xl md:text-7xl font-display text-white mb-6"
           >
             Our Process
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-elite-sub max-w-2xl mx-auto text-lg uppercase tracking-widest font-mono text-xs"
           >
             Workflow, Timelines, & Philosophy
           </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h4 className="text-2xl font-display mb-8 pb-4 border-b border-white/10 text-elite-accent">Development Stages</h4>
            <div className="space-y-8">
              {processes.map((proc, idx) => (
                <div key={idx} className="flex gap-6 items-center">
                  <div className="w-12 h-12 rounded-full bg-elite-accent/10 flex items-center justify-center text-elite-accent font-mono text-lg border border-elite-accent/20 shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    {idx + 1}
                  </div>
                  <p className="text-xl font-light text-white/90">{proc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h4 className="text-2xl font-display mb-8 pb-4 border-b border-white/10 text-elite-accent">Project Timelines</h4>
            <div className="space-y-6">
              {timeline.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-elite-accent/30 transition-colors">
                  <span className="text-lg font-light text-white/90">{item.service}</span>
                  <span className="text-sm font-mono text-elite-accent uppercase tracking-widest bg-elite-accent/10 px-4 py-2 rounded-full">{item.time}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mb-12">
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-4xl font-display text-center mb-16"
           >
             Why Choose System Labs?
           </motion.h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {reasons.map((r, i) => (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 key={i}
                 className="p-8 border border-white/5 rounded-2xl bg-[#0a0a0a] hover:bg-[#111] hover:border-elite-accent/30 transition-all group"
               >
                 <div className="w-8 h-8 rounded-full bg-elite-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <div className="w-2 h-2 bg-elite-accent rounded-full" />
                 </div>
                 <h4 className="text-xl text-white mb-4 font-display group-hover:text-elite-accent transition-colors">{r.title}</h4>
                 <p className="text-sm text-elite-sub font-light leading-relaxed">{r.desc}</p>
               </motion.div>
             ))}
           </div>
        </div>

      </div>
      
      <FreelanceFooter socialLinks={socialLinks || []} name={name} />
    </div>
  );
};

export default ProcessPage;
