import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, ExternalLink } from 'lucide-react';
import { Testimonial } from '../types';
import { API_BASE } from '../config';

export const FreelanceTestimonials: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

    useEffect(() => {
        fetch(`${API_BASE}/api/data`)
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data.testimonials)) {
                    setTestimonials(data.testimonials.filter((t: any) => t.showInFreelance));
                }
            })
            .catch(console.error);
    }, []);

    if (testimonials.length === 0) return null;

    return (
        <section className="py-32 bg-[#0D0D0D] text-white relative overflow-hidden border-t border-white/10">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-24 uppercase">
                    <div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-7xl font-display text-white tracking-wider"
                        >
                            <span className="text-blue-500">CLIENT</span> FEEDBACK
                        </motion.h2>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-left md:text-right mt-6 md:mt-0"
                    >
                        <span className="text-[10px] font-mono text-white/50 tracking-[0.2em] block mb-1">VERIFIED DEPLOYMENTS</span>
                        <span className="text-[10px] font-mono text-white/30 tracking-[0.2em]">0{testimonials.length} ACTIVE RECORDS</span>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id || index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-5%" }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="group border border-white/10 p-6 md:p-10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors relative rounded-2xl md:rounded-none"
                        >
                            <Quote className="text-blue-500/20 absolute top-6 right-6 w-8 h-8 md:w-12 md:h-12 -z-10 group-hover:text-blue-500/40 transition-colors" />
                            
                            <p className="text-lg md:text-2xl font-light text-white/80 leading-relaxed mb-8 md:mb-10">
                                "{testimonial.text}"
                            </p>
                            
                            <div className="flex justify-between items-center border-t border-white/10 pt-6">
                                <div>
                                    <h4 className="text-sm font-mono tracking-widest text-white uppercase mb-1">{testimonial.clientName}</h4>
                                    {testimonial.company && (
                                        <span className="text-xs font-mono text-white/50 tracking-widest uppercase">{testimonial.company}</span>
                                    )}
                                </div>
                                {testimonial.projectUrl && (
                                    <a 
                                        href={testimonial.projectUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="clickable p-3 border border-white/20 rounded-full text-white/50 hover:text-white hover:border-blue-500 hover:bg-blue-500/10 transition-all transition-colors"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
