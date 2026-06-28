import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FreelanceNavigation } from '../components/FreelanceNavigation';
import FreelanceCursor from '../components/FreelanceCursor';
import { FreelanceFooter } from '../components/FreelanceFooter';
import { SocialLink } from '../types';

const terms = [
  "Two revision rounds included",
  "New features are quoted separately",
  "Delivery timeline starts after receiving all content",
  "Domain and hosting are billed separately unless included",
  "Full ownership is transferred after final payment"
];

const paymentTerms = [
  "40% Advance to start the project",
  "40% After design approval",
  "20% Before final delivery",
  "Invoice provided for every payment"
];

const TermsPage = ({ name, socialLinks }: { name?: string, socialLinks?: SocialLink[] }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-elite-bg pt-32 pb-0 text-white cursor-none font-sans">
      <FreelanceCursor />
      <FreelanceNavigation name={name} />

      <div className="container mx-auto px-4 lg:px-8 max-w-4xl mb-24">
        
        <div className="mb-20 text-center border-b border-white/10 pb-12">
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-5xl md:text-7xl font-display text-white mb-6"
           >
             Terms & Conditions
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-elite-sub max-w-2xl mx-auto text-lg uppercase tracking-widest font-mono text-xs"
           >
             Legal & Payment Information
           </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h4 className="text-2xl font-display mb-8 pb-4 border-b border-white/10 text-elite-accent">Payment Terms</h4>
            <ul className="space-y-6">
              {paymentTerms.map((term, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-elite-accent mt-2 shrink-0" />
                  <span className="text-lg text-elite-sub font-light">{term}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h4 className="text-2xl font-display mb-8 pb-4 border-b border-white/10 text-elite-accent">General Terms</h4>
            <ul className="space-y-6">
              {terms.map((term, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-elite-accent mt-2 shrink-0" />
                  <span className="text-lg text-elite-sub font-light">{term}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
      
      <FreelanceFooter socialLinks={socialLinks || []} name={name} />
    </div>
  );
};

export default TermsPage;
