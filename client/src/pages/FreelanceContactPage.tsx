
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ChevronDown, Check, Send, Loader2 } from 'lucide-react';
import { FreelanceNavigation } from '../components/templates/freelance/FreelanceNavigation';
import FreelanceCursor from '../components/templates/freelance/FreelanceCursor';
import { SplitText } from '../components/SplitText';
import { Service } from '../types';

// Custom Elite Select Component
const EliteSelect = ({ options, value, onChange, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`clickable w-full bg-transparent border-b py-4 text-white font-light flex justify-between items-center cursor-none transition-colors ${isOpen ? 'border-elite-accent' : 'border-white/10 hover:border-white/30'}`}
      >
        <span className={!value ? "text-white/40" : "text-white"}>
           {value ? options.find((o: any) => o.value === value)?.label : placeholder}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={16} className="text-white/60" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 w-full z-50 bg-[#111] border border-white/10 rounded-b-lg overflow-hidden mt-1 shadow-2xl"
          >
            {options.map((option: any) => (
              <div
                key={option.value}
                onClick={() => { onChange(option.value); setIsOpen(false); }}
                className="clickable px-4 py-3 hover:bg-white/5 flex items-center justify-between text-sm text-white/80 hover:text-white transition-colors cursor-none"
              >
                {option.label}
                {value === option.value && <Check size={14} className="text-elite-accent" />}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ContactPage = () => {
  const location = useLocation();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [serviceOptions, setServiceOptions] = useState<{value: string, label: string}[]>([]);

  useEffect(() => {
    window.scrollTo(0,0);
    // Fetch dynamic services
    fetch('/api/data')
        .then(res => res.json())
        .then(data => {
            if(data && data.services) {
                const options = data.services.map((s: Service) => ({ value: s.title, label: s.title }));
                options.push({ value: 'Other', label: 'Other / Consultation' });
                setServiceOptions(options);
            }
        });

    // Check for pre-selected service from navigation state
    if (location.state && location.state.service) {
      setFormState(prev => ({ ...prev, service: location.state.service }));
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('SENDING');

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });
      
      if (res.ok) {
        setStatus('SUCCESS');
        setFormState({ name: '', email: '', phone: '', service: '', message: '' });
      } else {
        setStatus('ERROR');
      }
    } catch (err) {
      console.error(err);
      setStatus('ERROR');
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.5 + (i * 0.1), duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    })
  };

  return (
    <div className="min-h-screen bg-elite-bg text-white font-sans cursor-none relative">
      <FreelanceCursor />
      <FreelanceNavigation />
      
      <div className="pt-32 pb-20 relative overflow-hidden">
        {/* Background Ambience */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-elite-accent/5 rounded-full blur-[150px] pointer-events-none" 
        />

        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="mb-20">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="font-mono text-xs text-elite-accent tracking-widest uppercase mb-4 block"
            >
              Get In Touch
            </motion.span>
            
            <h1 className="text-5xl md:text-7xl font-display font-medium text-white mb-6">
              <SplitText delay={0.3}>Start a Project</SplitText>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-xl text-elite-sub font-light max-w-2xl"
            >
              I accept limited engagements to ensure maximum impact. Tell me about your operational bottlenecks.
            </motion.p>
          </div>

          <AnimatePresence mode="wait">
            {status === 'SUCCESS' ? (
                <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-12 border border-elite-accent/30 bg-elite-accent/5 rounded-2xl text-center flex flex-col items-center"
                >
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-16 h-16 bg-elite-accent rounded-full flex items-center justify-center mb-6"
                >
                    <Check size={32} className="text-white" />
                </motion.div>
                <h3 className="text-3xl font-display text-white mb-4">Message Sent</h3>
                <p className="text-elite-sub mb-8 max-w-md">
                    Thank you. I have received your message and will review your project details shortly.
                </p>
                <button 
                    onClick={() => setStatus('IDLE')} 
                    className="text-elite-accent underline underline-offset-4 clickable hover:text-white transition-colors"
                >
                    Send another message
                </button>
                </motion.div>
            ) : (
                <motion.form 
                key="form"
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12"
                >
                <motion.div custom={0} variants={fieldVariants} className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-elite-sub mb-2 font-mono">Name / Company</label>
                    <input 
                    value={formState.name}
                    onChange={e => setFormState({...formState, name: e.target.value})}
                    required 
                    type="text" 
                    placeholder="Enter Name"
                    className="clickable w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-elite-accent transition-colors font-light placeholder:text-white/20" 
                    />
                </motion.div>
                
                <motion.div custom={1} variants={fieldVariants} className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-elite-sub mb-2 font-mono">Email Address</label>
                    <input 
                    value={formState.email}
                    onChange={e => setFormState({...formState, email: e.target.value})}
                    required 
                    type="email" 
                    placeholder="name@company.com"
                    className="clickable w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-elite-accent transition-colors font-light placeholder:text-white/20" 
                    />
                </motion.div>

                <motion.div custom={2} variants={fieldVariants} className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-elite-sub mb-2 font-mono">Interest</label>
                    <EliteSelect 
                        options={serviceOptions}
                        value={formState.service}
                        onChange={(val: string) => setFormState({...formState, service: val})}
                        placeholder="Select Service"
                    />
                </motion.div>

                <motion.div custom={3} variants={fieldVariants} className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-elite-sub mb-2 font-mono">Phone (Optional)</label>
                    <input 
                    value={formState.phone}
                    onChange={e => setFormState({...formState, phone: e.target.value})}
                    type="tel" 
                    placeholder="+1 (555) 000-0000"
                    className="clickable w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-elite-accent transition-colors font-light placeholder:text-white/20" 
                    />
                </motion.div>

                <motion.div custom={4} variants={fieldVariants} className="col-span-1 md:col-span-2 group">
                    <label className="block text-[10px] uppercase tracking-widest text-elite-sub mb-2 font-mono">Project Details</label>
                    <textarea 
                    value={formState.message}
                    onChange={e => setFormState({...formState, message: e.target.value})}
                    required 
                    rows={4} 
                    placeholder="Tell me about your goals and timeline..."
                    className="clickable w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-elite-accent transition-colors font-light resize-none placeholder:text-white/20" 
                    />
                </motion.div>

                <motion.div custom={5} variants={fieldVariants} className="col-span-1 md:col-span-2 pt-8">
                    <button 
                    disabled={status === 'SENDING'}
                    type="submit" 
                    className="clickable w-full md:w-auto px-12 py-5 bg-white text-black font-medium tracking-widest uppercase text-xs hover:bg-elite-accent hover:text-white transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                    {status === 'SENDING' ? 'Sending...' : 'Send Message'}
                    {status === 'SENDING' ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                </motion.div>
                </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
