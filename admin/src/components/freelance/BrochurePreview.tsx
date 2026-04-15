
import React from 'react';
import { MessageSquare } from 'lucide-react';
import type { Project, HeroData, SocialLink } from '../../types';

interface BrochurePreviewProps {
    printRef: React.RefObject<HTMLDivElement>;
    adminConfig: any;
    heroData: HeroData;
    projects: Project[];
    testimonials: any[];
    activeTab: string;
    socialLinks: SocialLink[];
}

const BrochurePreview: React.FC<BrochurePreviewProps> = ({ 
    printRef, 
    adminConfig, 
    heroData, 
    projects, 
    testimonials,
    activeTab,
    socialLinks
}) => {
    const parseJSON = (val: any) => {
        try {
            return typeof val === 'string' ? JSON.parse(val || '[]') : (val || []);
        } catch(e) { return []; }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden brochure-container">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                
                @media print {
                    @page { 
                        size: A4; 
                        margin: 0; 
                    }
                    html, body {
                        width: 210mm;
                        height: 297mm;
                        background: white !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .brochure-viewer {
                        padding: 0 !important;
                        margin: 0 !important;
                        background: white !important;
                    }
                    .no-print { display: none !important; }
                    .no-break { break-inside: avoid !important; page-break-inside: avoid !important; }
                    
                    .bg-black { background-color: #000000 !important; -webkit-print-color-adjust: exact !important; }
                    .text-white { color: white !important; }
                    .border-blue-600 { border-color: #2563eb !important; }
                }

                .brochure-font {
                    font-family: 'Inter', sans-serif;
                    letter-spacing: -0.01em;
                }
            `}</style>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b flex justify-between items-center no-print">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Minimalist Professional Document</span>
            </div>

            <div ref={printRef} className="brochure-viewer flex-1 overflow-y-auto p-4 bg-slate-100 dark:bg-slate-950 brochure-font">
                <div id="brochure-content" className="max-w-[210mm] mx-auto bg-white text-slate-900 shadow-xl min-h-[297mm] flex flex-col relative">
                    
                    {/* Header: Clean, Structured Identity */}
                    <div className="bg-black text-white p-12 sm:p-16 flex flex-col sm:flex-row justify-between items-center sm:items-start border-b-[12px] border-blue-600">
                        <div className="flex items-center gap-8 z-10">
                            <div className="w-28 h-28 rounded-full border-2 border-white/20 overflow-hidden">
                                <img src={adminConfig.brochurePhoto || 'https://1juvu95fflkay0z2.public.blob.vercel-storage.com/output-fA2itO6uP0asksZbDZ9uVBik0qno64.webp'} className="w-full h-full object-cover" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold tracking-tight">{heroData.name}</h2>
                                <p className="text-blue-400 font-medium text-xs tracking-wide">{adminConfig.brochureSubtitle || 'Software builder'}</p>
                                <div className="h-[1px] w-full bg-blue-600 mt-2"></div>
                            </div>
                        </div>

                        <div className="mt-8 sm:mt-0 text-center sm:text-right z-10 flex flex-col items-center sm:items-end gap-4">
                            <div className="w-12 h-12 flex items-center justify-center border border-white/10 rounded">
                                <img src={adminConfig.brochureLogo || '/logo.svg'} className="w-10 h-10 object-contain" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-extrabold tracking-tighter whitespace-nowrap">{adminConfig.brochureName || 'System Labs'}</h1>
                                <p className="text-blue-500 font-bold text-[10px] tracking-[0.3em] uppercase mt-1 mb-3">{adminConfig.brochureTitle || 'Documentation'}</p>
                                <div className="text-[10px] font-medium text-white/60 space-y-2 flex flex-col items-end">
                                    <a href={`mailto:${adminConfig.contactEmail || heroData.email}`} className="hover:text-white transition-colors">{adminConfig.contactEmail || heroData.email}</a>
                                    <a href={`tel:${(adminConfig.contactPhone || heroData.phone || '').replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">{adminConfig.contactPhone || heroData.phone}</a>
                                    <a href={(adminConfig.brochureWebsite || 'www.systemlabs.tech').startsWith('http') ? (adminConfig.brochureWebsite || 'www.systemlabs.tech') : `https://${adminConfig.brochureWebsite || 'www.systemlabs.tech'}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                                        <span className="font-bold tracking-wide">{adminConfig.brochureWebsiteTitle || adminConfig.brochureName || 'System Labs'}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-12 sm:p-16 flex-1 space-y-16">
                        {/* Services Section */}
                        <div className="space-y-8 no-break">
                            <div className="border-l-4 border-blue-600 pl-4">
                                <h3 className="text-lg font-bold tracking-tight">{adminConfig.brochureServicesTitle || 'Services'}</h3>
                                <p className="text-xs text-slate-400 font-medium">Standard pricing and range</p>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                                {parseJSON(adminConfig.brochurePricing).map((p:any, idx:number) => (
                                    <div key={idx} className="p-6 bg-slate-50 border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-break hover:bg-slate-100/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            {p.image && (
                                                <div className="w-10 h-10 bg-white border border-slate-200 p-2 flex-shrink-0 rounded">
                                                    <img src={p.image} className="w-full h-full object-contain" />
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-bold text-base text-slate-800">{p.service}</h4>
                                                <p className="text-xs text-slate-500 mt-1">{p.note || 'Starting range'}</p>
                                            </div>
                                        </div>
                                        <div className="sm:text-right flex-shrink-0 border-l sm:border-l-0 sm:border-r border-slate-200 pl-4 sm:pl-0 sm:pr-4">
                                            <p className="text-xl font-semibold text-blue-500 tracking-tight">{p.range}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Est. range</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Projects Section */}
                        {((parseJSON(adminConfig.brochureProjects).length > 0) || (parseJSON(adminConfig.brochureManualProjects).length > 0)) && (
                            <div className="space-y-8 no-break">
                                <div className="border-l-4 border-blue-600 pl-4">
                                    <h3 className="text-lg font-bold tracking-tight">Recent work</h3>
                                    <p className="text-xs text-slate-400 font-medium">Selection of production projects</p>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    {projects.filter(p => parseJSON(adminConfig.brochureProjects).includes(p.id)).map((p) => {
                                        const customData = parseJSON(adminConfig.brochureProjectCustomizations)[p.id || 0] || {};
                                        const displayLink = customData.link !== undefined && customData.link !== '' ? customData.link : (p.liveUrl || p.repoUrl || p.docUrl);
                                        const displayDesc = customData.description !== undefined && customData.description !== '' ? customData.description : p.description;

                                        return (
                                            <div key={p.id} className="no-break space-y-3">
                                                <div className="aspect-video bg-slate-100 border border-slate-200 overflow-hidden rounded">
                                                    <img src={p.imageUrl} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-base text-slate-800">{p.title}</h4>
                                                    {displayLink && (
                                                        <a href={displayLink} target="_blank" rel="noopener noreferrer" className="inline-block mt-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline break-all">
                                                            {displayLink}
                                                        </a>
                                                    )}
                                                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mt-1.5">{displayDesc}</p>
                                                    {p.tags && p.tags[0] && (
                                                        <span className="inline-block mt-2 px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase tracking-tighter">{p.tags[0]}</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {parseJSON(adminConfig.brochureManualProjects).map((p: any, idx: number) => (
                                        <div key={`m-${idx}`} className="no-break space-y-3">
                                            <div className="aspect-video bg-slate-100 border border-slate-200 overflow-hidden rounded">
                                                <img src={p.image} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-base text-slate-800">{p.title}</h4>
                                                {p.link && (
                                                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline break-all">
                                                        {p.link}
                                                    </a>
                                                )}
                                                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mt-1.5">{p.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Custom Sections (Trust etc) */}
                        {parseJSON(adminConfig.brochureSections).map((sec: any, idx: number) => (
                            <div key={idx} className="space-y-8 no-break">
                                <div className="border-l-4 border-blue-600 pl-4">
                                    <h3 className="text-lg font-bold tracking-tight">{sec.title}</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    {sec.items.map((item: any, iIdx: number) => (
                                        <div key={iIdx} className="flex gap-4 items-start no-break">
                                            {item.image && (
                                                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center flex-shrink-0 p-1.5 border border-blue-100">
                                                    <img src={item.image} className="w-full h-full object-contain" />
                                                </div>
                                            )}
                                            <div className="space-y-1">
                                                <h4 className="font-bold text-base text-slate-800">{item.title}</h4>
                                                <p className="text-sm text-slate-500 leading-relaxed font-medium mt-1.5">{item.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer: Action focused, extremely clean */}
                    <div className="mt-auto border-t border-slate-100">
                        <div
                            className="bg-black text-white p-12 sm:p-14 flex flex-col sm:flex-row justify-between items-center gap-6"
                        >
                            <a 
                                href={`https://wa.me/${(adminConfig.contactPhone || heroData.phone).replace(/\D/g, '')}?text=${encodeURIComponent("Hi, I saw your brochure and I'm interested in starting a project.")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-center sm:text-left no-underline text-white"
                            >
                                <h3 className="text-2xl font-bold tracking-tight mb-1">Start project</h3>
                                <p className="text-xs text-white/50 font-medium">WhatsApp: {adminConfig.contactPhone || heroData.phone}</p>
                            </a>
                            <div className="flex gap-3">
                                {parseJSON(adminConfig.brochureSocials).filter((s:any) => s.url && s.url.trim() !== '' && s.url !== '#').map((s:any, idx:number) => {
                                    const name = (s.platform || '').toLowerCase();
                                    const iconMap: Record<string, JSX.Element> = {
                                        linkedin: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
                                        instagram: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
                                        facebook: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
                                        youtube: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
                                        twitter: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                                        x: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                                        github: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>,
                                        mail: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
                                    };
                                    return (
                                        <a href={s.url} target="_blank" rel="noopener noreferrer" key={idx} className="w-10 h-10 border border-white/10 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-colors" title={s.platform}>
                                            {iconMap[name] || <span className="text-xs font-bold">{(s.platform || '?').charAt(0).toUpperCase()}</span>}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrochurePreview;
