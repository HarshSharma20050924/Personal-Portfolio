import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FreelanceNavigation } from '../components/FreelanceNavigation';
import FreelanceCursor from '../components/FreelanceCursor';
import { FreelanceFooter } from '../components/FreelanceFooter';
import { SocialLink } from '../types';

const sections = [
  {
    title: "Landing Page",
    price: "₹11,999",
    features: [
      "Custom modern design",
      "Fully responsive (Mobile, Tablet & Desktop)",
      "Up to 5–10 sections",
      "Contact & inquiry form",
      "WhatsApp integration",
      "Google Maps integration",
      "Call-to-action sections",
      "Image gallery",
      "Basic SEO setup",
      "Fast loading performance",
      "Cross-browser compatibility",
      "Deployment support"
    ]
  },
  {
    title: "Website",
    price: "₹24,999",
    features: [
      "Custom multi-page website (4–8 pages)",
      "Responsive design",
      "Service pages",
      "About & Contact pages",
      "Gallery/Portfolio",
      "Blog integration (Optional)",
      "Contact forms",
      "Google Maps",
      "WhatsApp integration",
      "Basic SEO",
      "Performance optimization",
      "Deployment & launch support"
    ]
  },
  {
    title: "Business System / Web App",
    price: "₹49,999",
    features: [
      "Custom dashboard",
      "User authentication",
      "Admin panel",
      "Role-based access",
      "Database integration",
      "Business workflow automation",
      "Reports & analytics",
      "File/document management",
      "API integrations",
      "Email notifications",
      "Secure Application Architecture",
      "Scalable development"
    ]
  },
  {
    title: "AI Integration",
    price: "₹39,999",
    features: [
      "AI chatbot",
      "AI customer support",
      "Smart search",
      "AI content generation",
      "AI message drafting",
      "Document summarization",
      "Workflow automation",
      "AI recommendations",
      "LLM integration",
      "Custom AI solutions",
      "API integration",
      "Ongoing optimization"
    ]
  },
  {
    title: "Website Maintenance",
    price: "₹1,499/month",
    features: [
      "Monthly Security Updates",
      "Bug Fixes",
      "Content & Image Updates",
      "Performance Monitoring",
      "Regular Website Backups",
      "Uptime Monitoring",
      "Plugin & Dependency Updates",
      "Minor Feature Enhancements",
      "Technical Support",
      "Monthly Maintenance Plans Available"
    ]
  },
  {
    title: "Whats Include With Every Project",
    price: "Free of Cost",
    features: [
      "30 Days Free Technical Support",
      "Deployment Assistance",
      "Source Code Handover",
      "Two Revision Rounds",
      "Basic SEO Setup",
      "Mobile Responsive Design",
      "Performance Optimization"
    ]
  },
  {
    title: "Additional Services",
    price: "Pricing on Request",
    features: [
      "Domain & Hosting Setup",
      "Business Email Configuration",
      "Payment Gateway Integration",
      "Google Analytics & Search Console",
      "Google Business Profile Setup",
      "Google Ads Management",
      "Social Media Management",
      "Booking & Reservation System",
      "Third-party API Integration",
      "Website Migration",
      "CMS Integration",
      "Content Writing",
      "Video Editing",
      "Ongoing SEO Services",
      "Technical Consultation"
    ]
  }
];



const PricingPage = ({ name, socialLinks }: { name?: string, socialLinks?: SocialLink[] }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-elite-bg pt-32 pb-0 text-white cursor-none font-sans">
      <FreelanceCursor />
      <FreelanceNavigation name={name} />

      <div className="container mx-auto px-4 lg:px-8 max-w-6xl mb-20">
        
        {/* Header Section */}
        <div className="mb-20 text-center border-b border-white/10 pb-12">
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-5xl md:text-7xl font-display text-white mb-6"
           >
             Service Solutions
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-elite-sub max-w-2xl mx-auto text-lg uppercase tracking-widest font-mono text-xs"
           >
             Standard pricing and scope of work
           </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-24">
          {sections.map((sec, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={idx} 
              className="bg-[#111] border border-white/10 p-8 rounded-2xl flex flex-col hover:border-elite-accent transition-colors"
            >
              <h3 className="text-2xl font-display mb-2">{sec.title}</h3>
              <div className="mb-8">
                <span className="text-[10px] text-elite-sub uppercase tracking-widest font-mono">Starting At</span>
                <p className="text-3xl text-elite-accent font-light mt-1">{sec.price}</p>
              </div>
              <div className="flex-1">
                <p className="text-xs text-white/40 uppercase tracking-widest font-mono border-b border-white/10 pb-2 mb-4">What's Included</p>
                <ul className="space-y-3">
                  {sec.features.map((feat, fIdx) => (
                    <li key={fIdx} className="text-sm text-elite-sub flex items-start gap-3">
                      <span className="text-elite-accent mt-0.5">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pricing Notes */}
        <div className="mb-24 flex justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl bg-[#111] border border-white/10 p-8 rounded-2xl w-full">
            <h4 className="text-xl font-display mb-6 pb-2 border-b border-white/10">Pricing Notes</h4>
            <ul className="space-y-4">
              <li className="text-sm text-elite-sub flex items-start gap-3"><span className="text-elite-accent mt-0.5">■</span> Prices shown are starting estimates for standard projects.</li>
              <li className="text-sm text-elite-sub flex items-start gap-3"><span className="text-elite-accent mt-0.5">■</span> Final quotation depends on project scope, features, integrations, and complexity.</li>
              <li className="text-sm text-elite-sub flex items-start gap-3"><span className="text-elite-accent mt-0.5">■</span> Domain, hosting, premium APIs, third-party services, and paid software licenses are charged separately unless explicitly included.</li>
            </ul>
          </motion.div>
        </div>
      </div>
      
      <FreelanceFooter socialLinks={socialLinks || []} name={name} />
    </div>
  );
};

export default PricingPage;
